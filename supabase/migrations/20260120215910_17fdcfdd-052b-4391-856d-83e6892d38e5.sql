-- Fix 1: Ensure profiles table only allows users to view their own profile
-- The current policy is RESTRICTIVE which is correct, but let's add an explicit admin view policy
-- so admins can view team profiles for the team management feature

-- First, let's add a policy for admins to view all profiles (needed for team management)
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- Fix 2: Restrict clients table to admin-only access
-- This protects customer PII (phone, email, address) from unauthorized access
-- Regular users should not have direct access to customer data

-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view clients" ON public.clients;

-- Create admin-only SELECT policy
CREATE POLICY "Admins can view clients"
ON public.profiles
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- Also need to update the clients table with proper admin-only SELECT
CREATE POLICY "Only admins can view clients"
ON public.clients
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));