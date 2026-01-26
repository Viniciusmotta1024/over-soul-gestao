-- Add is_internal_test column to orders table
ALTER TABLE public.orders ADD COLUMN is_internal_test boolean NOT NULL DEFAULT false;