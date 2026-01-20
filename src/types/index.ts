export interface Order {
  id: string;
  customerName: string;
  product: string;
  size: string;
  quantity: number;
  channel: 'shopee' | 'ministerio' | 'site';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  supplierCost: number;
  salePrice: number;
  createdAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  products: SupplierProduct[];
  contact: string;
}

export interface SupplierProduct {
  name: string;
  sizes: string[];
  unitCost: number;
}

export interface SalesChannel {
  id: string;
  name: string;
  icon: string;
  totalOrders: number;
  totalRevenue: number;
}
