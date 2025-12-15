-- Fix overly permissive locations table policy
-- Drop the current "Everyone can view locations" policy that exposes all locations to all users
DROP POLICY IF EXISTS "Everyone can view locations" ON public.locations;

-- Add granular policies for proper access control

-- 1. Global locations (no client_id) accessible to all authenticated users
CREATE POLICY "Users can view global locations"
ON public.locations FOR SELECT TO authenticated
USING (client_id IS NULL);

-- 2. Client-specific locations only visible to the owning client
CREATE POLICY "Clients can view own locations"
ON public.locations FOR SELECT TO authenticated
USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

-- 3. Admins can view all locations (already exists via "Admins can manage locations" but adding explicit SELECT)
CREATE POLICY "Admins can view all locations"
ON public.locations FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));