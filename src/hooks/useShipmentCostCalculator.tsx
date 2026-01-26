import { usePricingConfig } from './usePricingConfig';
import { Order } from '@/types';

export interface ShipmentCostBreakdown {
  totalShirts: number;
  shirtsCost: number;
  shirtsFreight: number;
  totalCost: number;
  costPerShirt: number;
}

/**
 * Hook para calcular o custo de uma remessa de camisas
 * DTF agora é gerenciado separadamente
 */
export function useShipmentCostCalculator() {
  const { freights } = usePricingConfig();

  const calculateShipmentCost = (orders: Order[]): ShipmentCostBreakdown => {
    // Total de camisas na remessa
    const totalShirts = orders.reduce((sum, order) => sum + order.quantity, 0);
    
    // Se não houver pedidos, retorna zeros
    if (totalShirts === 0) {
      return {
        totalShirts: 0,
        shirtsCost: 0,
        shirtsFreight: 0,
        totalCost: 0,
        costPerShirt: 0,
      };
    }
    
    // Buscar preço de frete de camisas
    const shirtFreight = freights.find(f => f.name.toLowerCase().includes('camisa'))?.price || 19.90;
    
    // Custo das camisas (usando custo de fornecedor dos pedidos)
    const shirtsCost = orders.reduce((sum, order) => sum + order.supplierCost * order.quantity, 0);
    
    // Custo total (apenas camisas + frete, DTF é separado)
    const totalCost = shirtsCost + shirtFreight;
    
    // Custo por camisa
    const costPerShirt = totalCost / totalShirts;

    return {
      totalShirts,
      shirtsCost,
      shirtsFreight: shirtFreight,
      totalCost,
      costPerShirt,
    };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return {
    calculateShipmentCost,
    formatCurrency,
  };
}
