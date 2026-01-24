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
  isPaid: boolean;
  paidAt?: Date;
  shipmentId?: string;
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

export interface Product {
  id: string;
  name: string;
  description?: string;
  collection?: string;
  price: number;
  originalPrice?: number;
  supplierCost: number;
  imageUrl?: string;
  stock: number;
  sizes: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
