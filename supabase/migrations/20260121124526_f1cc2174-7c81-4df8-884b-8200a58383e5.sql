-- Allow name and phone to be nullable in clients table
ALTER TABLE public.clients ALTER COLUMN name DROP NOT NULL;
ALTER TABLE public.clients ALTER COLUMN phone DROP NOT NULL;