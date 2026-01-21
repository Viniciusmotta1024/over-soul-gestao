-- Fix: Restrict activity_logs viewing to admins only
-- Remove the policy that allows users to view their own logs (potential monitoring circumvention)

DROP POLICY IF EXISTS "Admins can view all activity logs" ON public.activity_logs;

-- Create new policy: Only admins can view activity logs
CREATE POLICY "Only admins can view activity logs"
ON public.activity_logs
FOR SELECT
USING (is_admin(auth.uid()));