-- Requires Neon Data API provisioned WITHOUT default grants on the target branch.
-- No change to neon_auth. All business fields are preserved in data JSONB.
BEGIN;
CREATE SCHEMA gargottex_private;
REVOKE ALL ON SCHEMA gargottex_private FROM PUBLIC;
CREATE SEQUENCE gargottex_private.change_seq AS bigint;
CREATE TABLE public.entity_revisions (
  revision_id bigint PRIMARY KEY DEFAULT nextval('gargottex_private.change_seq'),
  user_id text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  operation text NOT NULL CHECK (operation IN ('insert','update','delete')),
  snapshot jsonb NOT NULL,
  previous_snapshot jsonb,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
ALTER TABLE public.entity_revisions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.entity_revisions FROM PUBLIC, anonymous, authenticated;
GRANT SELECT ON public.entity_revisions TO authenticated;
CREATE POLICY owner_read ON public.entity_revisions FOR SELECT TO authenticated
 USING (user_id = (SELECT auth.user_id()));
CREATE INDEX revisions_owner_entity ON public.entity_revisions(user_id,entity_type,entity_id,revision_id);

-- Reject binary fields recursively; metadata and arbitrary existing structured fields survive.
CREATE FUNCTION gargottex_private.structured_only(value jsonb) RETURNS boolean
LANGUAGE plpgsql IMMUTABLE SET search_path = pg_catalog AS $$
DECLARE k text; v jsonb;
BEGIN
 IF jsonb_typeof(value)='object' THEN
  FOR k,v IN SELECT * FROM jsonb_each(value) LOOP
   IF k IN ('blob','thumb_blob') OR NOT gargottex_private.structured_only(v) THEN RETURN false; END IF;
  END LOOP;
 ELSIF jsonb_typeof(value)='array' THEN
  FOR v IN SELECT * FROM jsonb_array_elements(value) LOOP
   IF NOT gargottex_private.structured_only(v) THEN RETURN false; END IF;
  END LOOP;
 END IF;
 RETURN true;
END $$;

-- Narrow trigger privilege: revisions are append-only for client roles.
CREATE FUNCTION gargottex_private.record_change() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog AS $$
DECLARE op text; prior jsonb;
BEGIN
 IF TG_TABLE_SCHEMA <> 'public' OR TG_TABLE_NAME NOT IN
 ('dungeons','creatures','heroes','npcs','quests','loot_items','interactables','brouhaha_effects','media_assets')
 THEN RAISE EXCEPTION 'Unsupported entity'; END IF;
 IF auth.user_id() IS NULL OR NEW.user_id IS DISTINCT FROM auth.user_id() THEN
  RAISE EXCEPTION 'Owner required' USING ERRCODE='42501';
 END IF;
 IF TG_OP='UPDATE' THEN
  IF NEW.user_id IS DISTINCT FROM OLD.user_id OR NEW.id IS DISTINCT FROM OLD.id THEN
   RAISE EXCEPTION 'Identity is immutable' USING ERRCODE='42501';
  END IF;
  IF NEW.data IS NOT DISTINCT FROM OLD.data AND NEW.deleted_at IS NOT DISTINCT FROM OLD.deleted_at THEN
   RETURN OLD;
  END IF;
  NEW.created_at := OLD.created_at;
  prior := to_jsonb(OLD);
 ELSE
  NEW.created_at := clock_timestamp();
 END IF;
 -- Serialize writes for one owner until commit, so change cursors cannot skip a late commit.
 PERFORM pg_advisory_xact_lock(hashtextextended(NEW.user_id, 621));
 NEW.updated_at := clock_timestamp();
 NEW.revision := nextval('gargottex_private.change_seq');
 op := CASE WHEN NEW.deleted_at IS NOT NULL THEN 'delete' WHEN TG_OP='INSERT' THEN 'insert' ELSE 'update' END;
 INSERT INTO public.entity_revisions(revision_id,user_id,entity_type,entity_id,operation,snapshot,previous_snapshot)
 VALUES(NEW.revision,NEW.user_id,TG_TABLE_NAME,NEW.id,op,to_jsonb(NEW),prior);
 RETURN NEW;
END $$;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA gargottex_private FROM PUBLIC;
GRANT USAGE ON SCHEMA public, gargottex_private TO authenticated;
GRANT EXECUTE ON FUNCTION gargottex_private.structured_only(jsonb) TO authenticated;

DO $$
DECLARE t text;
BEGIN
 FOREACH t IN ARRAY ARRAY['dungeons','creatures','heroes','npcs','quests','loot_items','interactables','brouhaha_effects','media_assets'] LOOP
  EXECUTE format('CREATE TABLE public.%I (
   user_id text NOT NULL DEFAULT auth.user_id(), id text NOT NULL,
   data jsonb NOT NULL,
   created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
   updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
   deleted_at timestamptz, revision bigint NOT NULL DEFAULT 0,
   PRIMARY KEY(user_id,id),
   CHECK (jsonb_typeof(data) = ''object'' AND data ? ''id'' AND data->>''id''=id),
   CHECK (gargottex_private.structured_only(data))
  )',t);
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
  EXECUTE format('REVOKE ALL ON public.%I FROM PUBLIC,anonymous,authenticated',t);
  EXECUTE format('GRANT SELECT,INSERT,UPDATE ON public.%I TO authenticated',t);
  EXECUTE format('CREATE POLICY owner_access ON public.%I TO authenticated
    USING(user_id=(SELECT auth.user_id())) WITH CHECK(user_id=(SELECT auth.user_id()))',t);
  EXECUTE format('CREATE INDEX ON public.%I(user_id,revision)',t);
  EXECUTE format('CREATE TRIGGER record_change BEFORE INSERT OR UPDATE ON public.%I
   FOR EACH ROW EXECUTE FUNCTION gargottex_private.record_change()',t);
 END LOOP;
END $$;
-- Relationship fields stay intact in JSON; indexed without imposing new constraints on legacy imports.
CREATE INDEX ON public.creatures(user_id,(data->>'dungeon_id'));
CREATE INDEX ON public.quests(user_id,(data->>'dungeon_id'));
CREATE INDEX ON public.quests(user_id,(data->>'npc_id'));
CREATE INDEX ON public.loot_items(user_id,(data->>'creature_id'));
CREATE INDEX ON public.interactables(user_id,(data->>'dungeon_id'));
CREATE INDEX ON public.brouhaha_effects(user_id,(data->>'dungeon_id'));
CREATE INDEX ON public.media_assets(user_id,(data->>'entity_type'),(data->>'entity_id'));
COMMIT;
