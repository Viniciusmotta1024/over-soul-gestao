-- Create DTF shipments table
CREATE TABLE public.dtf_shipments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  meters integer NOT NULL DEFAULT 1,
  price_per_meter numeric NOT NULL DEFAULT 25.90,
  freight numeric NOT NULL DEFAULT 12.59,
  notes text,
  total_cost numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dtf_shipments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Authenticated users can view dtf_shipments" 
ON public.dtf_shipments FOR SELECT USING (true);

CREATE POLICY "Admins can create dtf_shipments" 
ON public.dtf_shipments FOR INSERT WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update dtf_shipments" 
ON public.dtf_shipments FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete dtf_shipments" 
ON public.dtf_shipments FOR DELETE USING (is_admin(auth.uid()));

-- Remove dtf_meters from shipments table (now separate)
ALTER TABLE public.shipments DROP COLUMN IF EXISTS dtf_meters;

-- Rename shipments to be clearer (shirt shipments)
COMMENT ON TABLE public.shipments IS 'Shirt shipments - orders for shirts from suppliers';