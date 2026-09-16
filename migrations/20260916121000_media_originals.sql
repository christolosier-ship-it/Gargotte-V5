-- Phase 1 media foundation. Apply only after the two structured-data migrations.
-- Originals are immutable per media id; replacement uses a new logical media id.
BEGIN;
CREATE TABLE public.media_originals (
 user_id text NOT NULL DEFAULT auth.user_id(),
 media_id text NOT NULL,
 byte_size bigint NOT NULL CHECK (byte_size BETWEEN 1 AND 67108864),
 sha256 text NOT NULL CHECK (sha256 ~ '^[0-9a-f]{64}$'),
 mime_type text NOT NULL CHECK (length(mime_type) BETWEEN 1 AND 255),
 chunk_size integer NOT NULL DEFAULT 262144 CHECK (chunk_size = 262144),
 chunk_count integer GENERATED ALWAYS AS (((byte_size + 262143) / 262144)::integer) STORED,
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 verified_at timestamptz,
 PRIMARY KEY (user_id,media_id),
 FOREIGN KEY (user_id,media_id) REFERENCES public.media_assets(user_id,id)
);
CREATE TABLE public.media_blob_chunks (
 user_id text NOT NULL DEFAULT auth.user_id(),
 media_id text NOT NULL,
 chunk_index integer NOT NULL CHECK (chunk_index >= 0),
 data bytea NOT NULL CHECK (octet_length(data) BETWEEN 1 AND 262144),
 PRIMARY KEY (user_id,media_id,chunk_index),
 FOREIGN KEY (user_id,media_id) REFERENCES public.media_originals(user_id,media_id)
);
ALTER TABLE public.media_originals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_blob_chunks ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.media_originals, public.media_blob_chunks FROM PUBLIC, anonymous, authenticated;
GRANT SELECT ON public.media_originals, public.media_blob_chunks TO authenticated;
GRANT INSERT (user_id,media_id,byte_size,sha256,mime_type,chunk_size) ON public.media_originals TO authenticated;
GRANT INSERT (user_id,media_id,chunk_index,data) ON public.media_blob_chunks TO authenticated;
CREATE POLICY media_original_owner ON public.media_originals TO authenticated
 USING (user_id=(SELECT auth.user_id()) AND EXISTS (
  SELECT 1 FROM public.media_assets m WHERE m.user_id=media_originals.user_id AND m.id=media_id AND m.deleted_at IS NULL))
 WITH CHECK (user_id=(SELECT auth.user_id()) AND EXISTS (
  SELECT 1 FROM public.media_assets m WHERE m.user_id=media_originals.user_id AND m.id=media_id AND m.deleted_at IS NULL));
CREATE POLICY media_chunk_owner ON public.media_blob_chunks TO authenticated
 USING (user_id=(SELECT auth.user_id()) AND EXISTS (
  SELECT 1 FROM public.media_assets m WHERE m.user_id=media_blob_chunks.user_id AND m.id=media_id AND m.deleted_at IS NULL))
 WITH CHECK (user_id=(SELECT auth.user_id()) AND EXISTS (
  SELECT 1 FROM public.media_assets m WHERE m.user_id=media_blob_chunks.user_id AND m.id=media_id AND m.deleted_at IS NULL));

-- Lock the manifest for both insertion and verification: no racing finalization.
CREATE FUNCTION gargottex_private.check_media_chunk() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE original public.media_originals; expected_size integer;
BEGIN
 IF NEW.user_id IS DISTINCT FROM auth.user_id() OR auth.user_id() IS NULL THEN
  RAISE EXCEPTION 'Owner required' USING ERRCODE='42501';
 END IF;
 SELECT * INTO STRICT original FROM public.media_originals
 WHERE user_id=NEW.user_id AND media_id=NEW.media_id FOR UPDATE;
 IF original.verified_at IS NOT NULL THEN RAISE EXCEPTION 'Original already verified'; END IF;
 IF NEW.chunk_index >= original.chunk_count THEN RAISE EXCEPTION 'Chunk index outside original'; END IF;
 expected_size := least(original.chunk_size,original.byte_size-NEW.chunk_index::bigint*original.chunk_size);
 IF octet_length(NEW.data) <> expected_size THEN RAISE EXCEPTION 'Invalid chunk size'; END IF;
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION gargottex_private.check_media_chunk() FROM PUBLIC;
CREATE TRIGGER check_media_chunk BEFORE INSERT ON public.media_blob_chunks
 FOR EACH ROW EXECUTE FUNCTION gargottex_private.check_media_chunk();

-- Only this authenticated operation can mark an original verified.
-- Bound at 64 MiB because verification aggregates bytes in server memory.
CREATE FUNCTION public.verify_media_original(p_media_id text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE owner_id text := auth.user_id(); original public.media_originals;
 actual_count integer; actual_size bigint; actual_hash text;
BEGIN
 IF owner_id IS NULL THEN RAISE EXCEPTION 'Owner required' USING ERRCODE='42501'; END IF;
 IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE user_id=owner_id AND id=p_media_id AND deleted_at IS NULL)
 THEN RAISE EXCEPTION 'Media unavailable' USING ERRCODE='42501'; END IF;
 SELECT * INTO STRICT original FROM public.media_originals WHERE user_id=owner_id AND media_id=p_media_id FOR UPDATE;
 SELECT count(*),coalesce(sum(octet_length(data)),0),encode(sha256(string_agg(data,''::bytea ORDER BY chunk_index)),'hex')
 INTO actual_count,actual_size,actual_hash FROM public.media_blob_chunks WHERE user_id=owner_id AND media_id=p_media_id;
 IF actual_count <> original.chunk_count OR actual_size <> original.byte_size OR actual_hash IS DISTINCT FROM original.sha256
 THEN RAISE EXCEPTION 'Original integrity check failed'; END IF;
 UPDATE public.media_originals SET verified_at=coalesce(verified_at,clock_timestamp()) WHERE user_id=owner_id AND media_id=p_media_id;
 RETURN jsonb_build_object('media_id',p_media_id,'sha256',actual_hash,'byte_size',actual_size,'verified',true);
END $$;
REVOKE ALL ON FUNCTION public.verify_media_original(text) FROM PUBLIC, anonymous;
GRANT EXECUTE ON FUNCTION public.verify_media_original(text) TO authenticated;
COMMIT;
