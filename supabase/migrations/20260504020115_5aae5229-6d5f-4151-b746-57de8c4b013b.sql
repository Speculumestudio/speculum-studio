
ALTER FUNCTION public.touch_updated_at() SET search_path = public;
ALTER FUNCTION public.bump_likes() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_premium(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_premium(uuid) TO authenticated;

-- Replace public bucket select policy with one that doesn't allow listing
DROP POLICY "media bucket public read" ON storage.objects;
-- Users can read individual objects via public URL (no listing required since bucket is public via CDN).
-- Allow listing/select only by authenticated users for their own files
CREATE POLICY "media bucket auth list own" ON storage.objects FOR SELECT USING (bucket_id = 'media' AND owner = auth.uid());
