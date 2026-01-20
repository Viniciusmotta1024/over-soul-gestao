-- =====================================================
-- SECURITY FIX: Restrict CRUD operations to admins only
-- Keep SELECT for all authenticated users (team members)
-- Restrict INSERT, UPDATE, DELETE to admins
-- =====================================================

-- ==================== SUPPLIERS ====================
DROP POLICY IF EXISTS "Authenticated users can create suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Authenticated users can update suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Authenticated users can delete suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Authenticated users can view suppliers" ON public.suppliers;

-- All team members can view suppliers
CREATE POLICY "Authenticated users can view suppliers"
ON public.suppliers FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage suppliers
CREATE POLICY "Admins can create suppliers"
ON public.suppliers FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update suppliers"
ON public.suppliers FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete suppliers"
ON public.suppliers FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- ==================== SUPPLIER_PRODUCTS ====================
DROP POLICY IF EXISTS "Authenticated users can create supplier products" ON public.supplier_products;
DROP POLICY IF EXISTS "Authenticated users can update supplier products" ON public.supplier_products;
DROP POLICY IF EXISTS "Authenticated users can delete supplier products" ON public.supplier_products;
DROP POLICY IF EXISTS "Authenticated users can view supplier products" ON public.supplier_products;

-- All team members can view supplier products
CREATE POLICY "Authenticated users can view supplier products"
ON public.supplier_products FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage supplier products
CREATE POLICY "Admins can create supplier products"
ON public.supplier_products FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update supplier products"
ON public.supplier_products FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete supplier products"
ON public.supplier_products FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- ==================== PRODUCTS ====================
DROP POLICY IF EXISTS "Authenticated users can create products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can view products" ON public.products;

-- All team members can view products
CREATE POLICY "Authenticated users can view products"
ON public.products FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage products
CREATE POLICY "Admins can create products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update products"
ON public.products FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete products"
ON public.products FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- ==================== PRICING_SHIRTS ====================
DROP POLICY IF EXISTS "Authenticated users can create pricing_shirts" ON public.pricing_shirts;
DROP POLICY IF EXISTS "Authenticated users can update pricing_shirts" ON public.pricing_shirts;
DROP POLICY IF EXISTS "Authenticated users can delete pricing_shirts" ON public.pricing_shirts;
DROP POLICY IF EXISTS "Authenticated users can view pricing_shirts" ON public.pricing_shirts;

-- All team members can view pricing
CREATE POLICY "Authenticated users can view pricing_shirts"
ON public.pricing_shirts FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage pricing
CREATE POLICY "Admins can create pricing_shirts"
ON public.pricing_shirts FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update pricing_shirts"
ON public.pricing_shirts FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete pricing_shirts"
ON public.pricing_shirts FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- ==================== PRICING_DTF ====================
DROP POLICY IF EXISTS "Authenticated users can create pricing_dtf" ON public.pricing_dtf;
DROP POLICY IF EXISTS "Authenticated users can update pricing_dtf" ON public.pricing_dtf;
DROP POLICY IF EXISTS "Authenticated users can delete pricing_dtf" ON public.pricing_dtf;
DROP POLICY IF EXISTS "Authenticated users can view pricing_dtf" ON public.pricing_dtf;

-- All team members can view pricing
CREATE POLICY "Authenticated users can view pricing_dtf"
ON public.pricing_dtf FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage pricing
CREATE POLICY "Admins can create pricing_dtf"
ON public.pricing_dtf FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update pricing_dtf"
ON public.pricing_dtf FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete pricing_dtf"
ON public.pricing_dtf FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- ==================== PRICING_FREIGHT ====================
DROP POLICY IF EXISTS "Authenticated users can create pricing_freight" ON public.pricing_freight;
DROP POLICY IF EXISTS "Authenticated users can update pricing_freight" ON public.pricing_freight;
DROP POLICY IF EXISTS "Authenticated users can delete pricing_freight" ON public.pricing_freight;
DROP POLICY IF EXISTS "Authenticated users can view pricing_freight" ON public.pricing_freight;

-- All team members can view pricing
CREATE POLICY "Authenticated users can view pricing_freight"
ON public.pricing_freight FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage pricing
CREATE POLICY "Admins can create pricing_freight"
ON public.pricing_freight FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update pricing_freight"
ON public.pricing_freight FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete pricing_freight"
ON public.pricing_freight FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- ==================== QUOTES ====================
DROP POLICY IF EXISTS "Authenticated users can create quotes" ON public.quotes;
DROP POLICY IF EXISTS "Authenticated users can update quotes" ON public.quotes;
DROP POLICY IF EXISTS "Authenticated users can delete quotes" ON public.quotes;
DROP POLICY IF EXISTS "Authenticated users can view quotes" ON public.quotes;

-- All team members can view quotes
CREATE POLICY "Authenticated users can view quotes"
ON public.quotes FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage quotes
CREATE POLICY "Admins can create quotes"
ON public.quotes FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update quotes"
ON public.quotes FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete quotes"
ON public.quotes FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- ==================== CLIENTS ====================
DROP POLICY IF EXISTS "Authenticated users can create clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can update clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can delete clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can view clients" ON public.clients;

-- All team members can view clients
CREATE POLICY "Authenticated users can view clients"
ON public.clients FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage clients
CREATE POLICY "Admins can create clients"
ON public.clients FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update clients"
ON public.clients FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete clients"
ON public.clients FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- ==================== ORDERS ====================
DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can delete orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can view orders" ON public.orders;

-- All team members can view orders
CREATE POLICY "Authenticated users can view orders"
ON public.orders FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage orders
CREATE POLICY "Admins can create orders"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update orders"
ON public.orders FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete orders"
ON public.orders FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));