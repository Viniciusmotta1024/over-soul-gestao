-- Add sort_order column to products table
ALTER TABLE public.products ADD COLUMN sort_order integer DEFAULT 0;

-- Initialize sort_order based on created_at
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY COALESCE(collection, 'none') ORDER BY created_at) as rn
  FROM public.products
)
UPDATE public.products p
SET sort_order = n.rn
FROM numbered n
WHERE p.id = n.id;