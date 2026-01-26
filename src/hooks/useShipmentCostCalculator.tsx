import { usePricingConfig } from './usePricingConfig';
import { Order } from '@/types';

export interface ShipmentCostBreakdown {
  totalShirts: number;
  shirtsCost: number;
  shirtsFreight: number;
  dtfMeters: number;
  dtfCost: number;
  dtfFreight: number;
  totalCost: number;
  costPerShirt: number;
  isManualDtf: boolean;
}

/**
 * Hook para calcular o custo real de fabricação de uma remessa
 * Usa metros de DTF manuais quando especificados, ou calcula automaticamente
 */
export function useShipmentCostCalculator() {
  const { freights, getDTFPrice } = usePricingConfig();

  /**
   * Calculate shipment cost
   * @param orders - Orders in the shipment
   * @param manualDtfMeters - Manual DTF meters (whole numbers only, null for auto-calculation)
   */
  const calculateShipmentCost = (orders: Order[], manualDtfMeters: number | null = null): ShipmentCostBreakdown => {
    // Total de camisas na remessa
    const totalShirts = orders.reduce((sum, order) => sum + order.quantity, 0);
    
    // Se não houver pedidos, retorna zeros
    if (totalShirts === 0) {
      return {
        totalShirts: 0,
        shirtsCost: 0,
        shirtsFreight: 0,
        dtfMeters: manualDtfMeters || 0,
        dtfCost: 0,
        dtfFreight: 0,
        totalCost: 0,
        costPerShirt: 0,
        isManualDtf: manualDtfMeters !== null,
      };
    }
    
    // Metros de DTF: usa o valor manual se definido, senão calcula automaticamente
    const dtfMeters = manualDtfMeters !== null 
      ? manualDtfMeters 
      : Math.ceil(totalShirts / 3.5); // Arredonda para cima (inteiro)
    
    // Buscar preços de frete
    const shirtFreight = freights.find(f => f.name.toLowerCase().includes('camisa'))?.price || 19.90;
    const dtfFreight = freights.find(f => f.name.toLowerCase().includes('dtf'))?.price || 12.59;
    
    // Custo das camisas (usando custo de fornecedor dos pedidos)
    const shirtsCost = orders.reduce((sum, order) => sum + order.supplierCost * order.quantity, 0);
    
    // Custo do DTF baseado na metragem
    const dtfPricePerMeter = getDTFPrice(dtfMeters);
    const dtfCost = dtfMeters * dtfPricePerMeter;
    
    // Custos de frete
    const shirtsFreight = shirtFreight;
    const dtfFreightCost = dtfFreight;
    
    // Custo total
    const totalCost = shirtsCost + shirtsFreight + dtfCost + dtfFreightCost;
    
    // Custo por camisa
    const costPerShirt = totalCost / totalShirts;

    return {
      totalShirts,
      shirtsCost,
      shirtsFreight,
      dtfMeters,
      dtfCost,
      dtfFreight: dtfFreightCost,
      totalCost,
      costPerShirt,
      isManualDtf: manualDtfMeters !== null,
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
