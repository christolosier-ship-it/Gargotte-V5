-- BEFORE INSERT also runs for an ON CONFLICT UPDATE. Audit only the final row operation.
BEGIN;
CREATE OR REPLACE FUNCTION gargottex_private.record_change() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog AS $$
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
  IF NEW.data IS NOT DISTINCT FROM OLD.data AND NEW.deleted_at IS NOT DISTINCT FROM OLD.deleted_at THEN RETURN OLD; END IF;
  NEW.created_at := OLD.created_at;
 ELSE NEW.created_at := clock_timestamp();
 END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(NEW.user_id, 621));
 NEW.updated_at := clock_timestamp();
 NEW.revision := nextval('gargottex_private.change_seq');
 RETURN NEW;
END $$;
CREATE FUNCTION gargottex_private.append_revision() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog AS $$
DECLARE prior jsonb;
BEGIN
 IF TG_TABLE_SCHEMA <> 'public' OR TG_TABLE_NAME NOT IN
 ('dungeons','creatures','heroes','npcs','quests','loot_items','interactables','brouhaha_effects','media_assets')
 OR auth.user_id() IS NULL OR NEW.user_id IS DISTINCT FROM auth.user_id()
 THEN RAISE EXCEPTION 'Owner required' USING ERRCODE='42501'; END IF;
 IF TG_OP='UPDATE' THEN
  IF NEW.data IS NOT DISTINCT FROM OLD.data AND NEW.deleted_at IS NOT DISTINCT FROM OLD.deleted_at THEN RETURN NULL; END IF;
  prior := to_jsonb(OLD);
 END IF;
 INSERT INTO public.entity_revisions(revision_id,user_id,entity_type,entity_id,operation,snapshot,previous_snapshot)
 VALUES(NEW.revision,NEW.user_id,TG_TABLE_NAME,NEW.id,
   CASE WHEN NEW.deleted_at IS NOT NULL THEN 'delete' WHEN TG_OP='INSERT' THEN 'insert' ELSE 'update' END,
   to_jsonb(NEW),prior);
 RETURN NULL;
END $$;
REVOKE ALL ON FUNCTION gargottex_private.append_revision() FROM PUBLIC;
DO $$
DECLARE t text;
BEGIN
 FOREACH t IN ARRAY ARRAY['dungeons','creatures','heroes','npcs','quests','loot_items','interactables','brouhaha_effects','media_assets'] LOOP
  EXECUTE format('CREATE TRIGGER append_revision AFTER INSERT OR UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION gargottex_private.append_revision()',t);
 END LOOP;
END $$;
COMMIT;
