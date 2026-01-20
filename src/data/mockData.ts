import { Order, Supplier, SalesChannel, Client } from '@/types';

export const mockClients: Client[] = [];

export const mockOrders: Order[] = [];

// Fornecedores com produtos da vitrine OverSoul
export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Confecção OverSoul',
    contact: '(11) 99999-1234',
    email: 'producao@oversoul.com.br',
    products: [
      // Coleção Carta Viva
      { name: 'Camisa OVERSOUL Frutos do Espírito', sizes: ['P', 'M', 'G', 'GG'], unitCost: 35.00 },
      { name: 'Camisa OVERSOUL Evangelho', sizes: ['P', 'M', 'G', 'GG'], unitCost: 35.00 },
      { name: 'Camisa OVERSOUL Faith', sizes: ['P', 'M', 'G', 'GG'], unitCost: 35.00 },
      { name: 'Camisa OVERSOUL Jesus está voltando', sizes: ['P', 'M', 'G', 'GG'], unitCost: 35.00 },
      // Coleção Cristo
      { name: 'Camisa OVERSOUL CRISTO em mim', sizes: ['P', 'M', 'G', 'GG'], unitCost: 35.00 },
      { name: 'Camisa OVERSOUL CRISTO Vive', sizes: ['P', 'M', 'G', 'GG'], unitCost: 35.00 },
      { name: 'Camisa OVERSOUL CRISTO Rei', sizes: ['P', 'M', 'G', 'GG'], unitCost: 35.00 },
      // Coleção Fé
      { name: 'Camisa OVERSOUL Fé', sizes: ['P', 'M', 'G', 'GG'], unitCost: 35.00 },
      { name: 'Camisa OVERSOUL Hope', sizes: ['P', 'M', 'G', 'GG'], unitCost: 35.00 },
      { name: 'Camisa OVERSOUL Love', sizes: ['P', 'M', 'G', 'GG'], unitCost: 35.00 },
    ],
  },
  {
    id: '2',
    name: 'Malhas Brasil',
    contact: '(11) 98888-5678',
    email: 'vendas@malhasbrasil.com.br',
    products: [
      { name: 'Camiseta Básica', sizes: ['P', 'M', 'G', 'GG'], unitCost: 25.00 },
      { name: 'Camiseta Premium', sizes: ['P', 'M', 'G', 'GG'], unitCost: 35.00 },
      { name: 'Regata', sizes: ['P', 'M', 'G'], unitCost: 20.00 },
    ],
  },
  {
    id: '3',
    name: 'Confecções Unity',
    contact: '(21) 97777-9012',
    email: 'unity@confeccoes.com',
    products: [
      { name: 'Camiseta Personalizada', sizes: ['P', 'M', 'G', 'GG'], unitCost: 22.00 },
      { name: 'Kit Evento 100un', sizes: ['Variados'], unitCost: 20.00 },
    ],
  },
];

export const salesChannels: SalesChannel[] = [
  {
    id: 'shopee',
    name: 'Shopee',
    icon: '🛒',
    totalOrders: 0,
    totalRevenue: 0,
  },
  {
    id: 'ministerio',
    name: 'Vista o seu Ministério',
    icon: '⛪',
    totalOrders: 0,
    totalRevenue: 0,
  },
  {
    id: 'site',
    name: 'Site Próprio',
    icon: '🌐',
    totalOrders: 0,
    totalRevenue: 0,
  },
];

// Products for the store (from lojaoversoul.com.br)
export const storeProducts = [
  // Coleção Carta Viva
  { name: 'Camisa OVERSOUL Frutos do Espírito', collection: 'Carta Viva', price: 79.90, originalPrice: 89.90 },
  { name: 'Camisa OVERSOUL Evangelho', collection: 'Carta Viva', price: 79.90, originalPrice: 89.90 },
  { name: 'Camisa OVERSOUL Faith', collection: 'Carta Viva', price: 79.90, originalPrice: 89.90 },
  { name: 'Camisa OVERSOUL Jesus está voltando', collection: 'Carta Viva', price: 79.90, originalPrice: 89.90 },
  // Coleção Cristo
  { name: 'Camisa OVERSOUL CRISTO em mim', collection: 'Cristo', price: 79.90, originalPrice: 89.90 },
  { name: 'Camisa OVERSOUL CRISTO Vive', collection: 'Cristo', price: 79.90, originalPrice: 89.90 },
  { name: 'Camisa OVERSOUL CRISTO Rei', collection: 'Cristo', price: 79.90, originalPrice: 89.90 },
  // Coleção Fé
  { name: 'Camisa OVERSOUL Fé', collection: 'Fé', price: 79.90, originalPrice: 89.90 },
  { name: 'Camisa OVERSOUL Hope', collection: 'Fé', price: 79.90, originalPrice: 89.90 },
  { name: 'Camisa OVERSOUL Love', collection: 'Fé', price: 79.90, originalPrice: 89.90 },
];
