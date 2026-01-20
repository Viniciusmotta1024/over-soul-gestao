-- Create pricing_shirts table for customizable shirt types
CREATE TABLE public.pricing_shirts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pricing_dtf table for DTF price tiers
CREATE TABLE public.pricing_dtf (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  min_meters INTEGER NOT NULL,
  max_meters INTEGER,
  price_per_meter NUMERIC NOT NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pricing_freight table for freight costs
CREATE TABLE public.pricing_freight (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pricing_shirts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_dtf ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_freight ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can view pricing_shirts" ON public.pricing_shirts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create pricing_shirts" ON public.pricing_shirts FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update pricing_shirts" ON public.pricing_shirts FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete pricing_shirts" ON public.pricing_shirts FOR DELETE USING (true);

CREATE POLICY "Authenticated users can view pricing_dtf" ON public.pricing_dtf FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create pricing_dtf" ON public.pricing_dtf FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update pricing_dtf" ON public.pricing_dtf FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete pricing_dtf" ON public.pricing_dtf FOR DELETE USING (true);

CREATE POLICY "Authenticated users can view pricing_freight" ON public.pricing_freight FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create pricing_freight" ON public.pricing_freight FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update pricing_freight" ON public.pricing_freight FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete pricing_freight" ON public.pricing_freight FOR DELETE USING (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_pricing_shirts_updated_at BEFORE UPDATE ON public.pricing_shirts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pricing_dtf_updated_at BEFORE UPDATE ON public.pricing_dtf FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pricing_freight_updated_at BEFORE UPDATE ON public.pricing_freight FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data
INSERT INTO public.pricing_shirts (name, price) VALUES
  ('Oversized Gola Alta Ribana', 22.90),
  ('Oversized 100% Algodão Fio 30/1 - Lisa, Gola Redonda', 19.90);

INSERT INTO public.pricing_dtf (min_meters, max_meters, price_per_meter, label) VALUES
  (1, 1, 32.90, '1 metro'),
  (2, 19, 25.90, '2-19 metros'),
  (20, 49, 24.90, '20-49 metros'),
  (50, 99, 23.90, '50-99 metros'),
  (100, NULL, 22.90, '100+ metros');

INSERT INTO public.pricing_freight (name, price) VALUES
  ('Frete Camisas', 19.90),
  ('Frete DTF', 12.59);