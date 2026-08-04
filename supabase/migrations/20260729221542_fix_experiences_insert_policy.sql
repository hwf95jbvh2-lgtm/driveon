/*
# Fix experiences insert RLS policy

The WITH CHECK on the public insert policy compared the enum column to a
string literal without an explicit cast, which caused the check to fail
for anon inserts even when the value was 'pending'. Recreate the policy
with an explicit cast to the moderation_status enum type.

## 1. Security changes
- Drop and recreate `public_insert_experiences` with proper enum cast.
*/

DROP POLICY IF EXISTS "public_insert_experiences" ON experiences;
CREATE POLICY "public_insert_experiences" ON experiences FOR INSERT
  TO anon, authenticated WITH CHECK (moderation_status = 'pending'::moderation_status);
