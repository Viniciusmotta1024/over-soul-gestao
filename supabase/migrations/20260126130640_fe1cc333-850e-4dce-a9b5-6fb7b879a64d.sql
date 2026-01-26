-- Add manual DTF meters field to shipments
ALTER TABLE public.shipments ADD COLUMN dtf_meters integer DEFAULT NULL;

-- Comment explaining the field
COMMENT ON COLUMN public.shipments.dtf_meters IS 'Manual DTF meters for the shipment. When set, overrides automatic calculation.';