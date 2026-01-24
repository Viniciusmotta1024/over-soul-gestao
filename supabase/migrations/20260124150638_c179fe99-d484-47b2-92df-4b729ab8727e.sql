-- Add payment tracking to orders
ALTER TABLE public.orders ADD COLUMN is_paid boolean NOT NULL DEFAULT false;
ALTER TABLE public.orders ADD COLUMN paid_at timestamp with time zone;

-- Create shipments table for batch ordering
CREATE TABLE public.shipments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  notes text,
  total_cost numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

-- RLS policies for shipments
CREATE POLICY "Authenticated users can view shipments" 
ON public.shipments FOR SELECT USING (true);

CREATE POLICY "Admins can create shipments" 
ON public.shipments FOR INSERT WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update shipments" 
ON public.shipments FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete shipments" 
ON public.shipments FOR DELETE USING (is_admin(auth.uid()));

-- Add shipment reference to orders
ALTER TABLE public.orders ADD COLUMN shipment_id uuid REFERENCES public.shipments(id) ON DELETE SET NULL;

-- Create trigger for updated_at
CREATE TRIGGER update_shipments_updated_at
BEFORE UPDATE ON public.shipments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();