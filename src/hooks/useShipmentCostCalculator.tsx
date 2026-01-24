import { usePricingConfig } from './usePricingConfig';
import { Order } from '@/types';

interface ShipmentCostBreakdown {
  totalShirts: number;
  shirtsCost: number;
  shirtsFreight: number;
  dtfMeters: number;
  dtfCost: number;
  dtfFreight: number;
  totalCost: number;
  costPerShirt: number;
  shirtsPerMeter: number;
}

/**
 * Hook para calcular o custo real de fabricação de uma remessa
 * Considera que 1 metro de DTF produz 3-4 camisas em média
 */
export function useShipmentCostCalculator() {
  const { shirts, dtfTiers, freights, getDTFPrice } = usePricingConfig();

  // Média de camisas por metro de DTF
  const SHIRTS_PER_METER = 3.5; // Média entre 3 e 4

  const calculateShipmentCost = (orders: Order[]): ShipmentCostBreakdown => {
    // Total de camisas na remessa
    const totalShirts = orders.reduce((sum, order) => sum + order.quantity, 0);
    
    // Metros de DTF necessários (1 metro = 3-4 camisas)
    const dtfMeters = Math.ceil(totalShirts / SHIRTS_PER_METER * 10) / 10; // Arredonda para 0.1
    
    // Buscar preços de frete
    const shirtFreight = freights.find(f => f.name.toLowerCase().includes('camisa'))?.price || 19.90;
    const dtfFreight = freights.find(f => f.name.toLowerCase().includes('dtf'))?.price || 12.59;
    
    // Custo das camisas (usando custo médio ou do produto)
    // Aqui usamos o custo de fornecedor dos pedidos
    const shirtsCost = orders.reduce((sum, order) => sum + order.supplierCost * order.quantity, 0);
    
    // Custo do DTF baseado na metragem
    const dtfPricePerMeter = getDTFPrice(dtfMeters);
    const dtfCost = dtfMeters * dtfPricePerMeter;
    
    // Custos de frete (proporcional à quantidade)
    // Frete de camisas: geralmente por lote
    // Frete de DTF: por envio
    const shirtsFreight = shirtFreight;
    const dtfFreightCost = dtfFreight;
    
    // Custo total
    const totalCost = shirtsCost + shirtsFreight + dtfCost + dtfFreightCost;
    
    // Custo por camisa
    const costPerShirt = totalShirts > 0 ? totalCost / totalShirts : 0;

    return {
      totalShirts,
      shirtsCost,
      shirtsFreight,
      dtfMeters,
      dtfCost,
      dtfFreight: dtfFreightCost,
      totalCost,
      costPerShirt,
      shirtsPerMeter: SHIRTS_PER_METER,
    };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return {
    calculateShipmentCost,
    formatCurrency,
    SHIRTS_PER_METER,
  };
}
