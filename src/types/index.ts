export interface Order {
  id: string;
  customerName: string;
  customerId?: string;
  product: string;
  size: string;
  quantity: number;
  channel: 'shopee' | 'ministerio' | 'site';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  supplierCost: number;
  salePrice: number;
  createdAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  orders: number;
  totalSpent: number;
  createdAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  products: SupplierProduct[];
  contact: string;
  email?: string;
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
