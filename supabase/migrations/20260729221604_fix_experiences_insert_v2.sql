/*
# Simplify experiences insert policy

The WITH CHECK on moderation_status was rejecting anon inserts even with
the correct value, likely due to enum type resolution in PostgREST.
Replace it with a permissive insert policy and enforce the pending-only
rule via a BEFORE INSERT trigger that overwrites moderation_status to
'pending' for non-authenticated sessions. This keeps the guarantee that
public submissions always start as pending while allowing the insert.

## 1. Security changes
- Drop `public_insert_experiences` and recreate with WITH CHECK (true).
- Add trigger `force_pending_experiences` to set moderation_status='pending'
  on every insert (defense in depth — the default already does this, but
  the trigger makes it impossible to override from the public form).
*/

DROP POLICY IF EXISTS "public_insert_experiences" ON experiences;
CREATE POLICY "public_insert_experiences" ON experiences FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE OR REPLACE FUNCTION force_pending_experience()
RETURNS trigger AS $$
BEGIN
  NEW.moderation_status := 'pending';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS force_pending_experiences ON experiences;
CREATE TRIGGER force_pending_experiences BEFORE INSERT ON experiences
  FOR EACH ROW EXECUTE FUNCTION force_pending_experience();
