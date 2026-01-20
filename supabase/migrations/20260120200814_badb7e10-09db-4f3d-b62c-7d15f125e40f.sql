-- Create quotes table for saving pricing calculations
CREATE TABLE public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT,
  shirt_type TEXT NOT NULL,
  shirt_price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  dtf_meters NUMERIC NOT NULL DEFAULT 0,
  dtf_price_per_meter NUMERIC NOT NULL DEFAULT 0,
  shirt_freight NUMERIC NOT NULL DEFAULT 19.90,
  dtf_freight NUMERIC NOT NULL DEFAULT 12.59,
  profit_margin NUMERIC NOT NULL DEFAULT 50,
  total_cost NUMERIC NOT NULL,
  suggested_price NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can view quotes" 
ON public.quotes 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create quotes" 
ON public.quotes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update quotes" 
ON public.quotes 
FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated users can delete quotes" 
ON public.quotes 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_quotes_updated_at
BEFORE UPDATE ON public.quotes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();