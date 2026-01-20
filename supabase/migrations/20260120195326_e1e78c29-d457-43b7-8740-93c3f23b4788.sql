-- Create products table for catalog management
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  collection TEXT,
  price NUMERIC NOT NULL DEFAULT 79.90,
  original_price NUMERIC,
  supplier_cost NUMERIC NOT NULL DEFAULT 35.00,
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  sizes TEXT[] NOT NULL DEFAULT ARRAY['P', 'M', 'G', 'GG']::TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products
CREATE POLICY "Authenticated users can view products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create products"
  ON public.products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON public.products FOR UPDATE
  USING (true);

CREATE POLICY "Authenticated users can delete products"
  ON public.products FOR DELETE
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Insert default products from OverSoul catalog
INSERT INTO public.products (name, collection, price, original_price, supplier_cost, stock) VALUES
  ('Camisa OVERSOUL Frutos do Espírito', 'Carta Viva', 79.90, 89.90, 35.00, 50),
  ('Camisa OVERSOUL Evangelho', 'Carta Viva', 79.90, 89.90, 35.00, 50),
  ('Camisa OVERSOUL Faith', 'Carta Viva', 79.90, 89.90, 35.00, 50),
  ('Camisa OVERSOUL Jesus está voltando', 'Carta Viva', 79.90, 89.90, 35.00, 50),
  ('Camisa OVERSOUL CRISTO em mim', 'Cristo', 79.90, 89.90, 35.00, 50),
  ('Camisa OVERSOUL CRISTO Vive', 'Cristo', 79.90, 89.90, 35.00, 50),
  ('Camisa OVERSOUL CRISTO Rei', 'Cristo', 79.90, 89.90, 35.00, 50),
  ('Camisa OVERSOUL Fé', 'Fé', 79.90, 89.90, 35.00, 50),
  ('Camisa OVERSOUL Hope', 'Fé', 79.90, 89.90, 35.00, 50),
  ('Camisa OVERSOUL Love', 'Fé', 79.90, 89.90, 35.00, 50);