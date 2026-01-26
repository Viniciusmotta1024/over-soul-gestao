import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types';
import { Shipment } from '@/hooks/useShipments';

export interface UnpaidShipmentAlert {
  shipmentId: string;
  shipmentName: string;
  unpaidOrdersCount: number;
  totalUnpaidValue: number;
}

export function useUnpaidShipmentAlerts(orders: Order[], shipments: Shipment[]) {
  const [alerts, setAlerts] = useState<UnpaidShipmentAlert[]>([]);

  // Calculate alerts: shipments marked as "ordered" with unpaid orders
  const calculateAlerts = useCallback(() => {
    const orderedShipments = shipments.filter(s => s.status === 'ordered');
    
    const newAlerts: UnpaidShipmentAlert[] = [];
    
    for (const shipment of orderedShipments) {
      const shipmentOrders = orders.filter(o => o.shipmentId === shipment.id);
      const unpaidOrders = shipmentOrders.filter(o => !o.isPaid);
      
      if (unpaidOrders.length > 0) {
        newAlerts.push({
          shipmentId: shipment.id,
          shipmentName: shipment.name,
          unpaidOrdersCount: unpaidOrders.length,
          totalUnpaidValue: unpaidOrders.reduce((sum, o) => sum + (o.salePrice * o.quantity), 0),
        });
      }
    }
    
    setAlerts(newAlerts);
  }, [orders, shipments]);

  // Recalculate alerts when orders or shipments change
  useEffect(() => {
    calculateAlerts();
  }, [calculateAlerts]);

  // Listen for real-time updates on orders (payment status changes)
  useEffect(() => {
    const channel = supabase
      .channel('orders-payment-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        () => {
          // Recalculate alerts when any order is updated
          calculateAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [calculateAlerts]);

  // Listen for real-time updates on shipments (status changes)
  useEffect(() => {
    const channel = supabase
      .channel('shipments-status-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'shipments',
        },
        () => {
          // Recalculate alerts when any shipment is updated
          calculateAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [calculateAlerts]);

  const alertsCount = alerts.length;
  const hasAlerts = alertsCount > 0;

  return { 
    alerts, 
    alertsCount, 
    hasAlerts,
    refreshAlerts: calculateAlerts 
  };
}
