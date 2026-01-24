import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { activityLogger } from '@/services/activityLogger';

export interface Shipment {
  id: string;
  name: string;
  status: 'open' | 'ordered' | 'received' | 'closed';
  notes: string | null;
  totalCost: number;
  createdAt: Date;
  updatedAt: Date;
  orderCount?: number;
}

// Initial state loaded synchronously to prevent flash
let initialShipmentsCache: Shipment[] | null = null;

export function useShipments() {
  const [shipments, setShipments] = useState<Shipment[]>(initialShipmentsCache || []);
  const [loading, setLoading] = useState(initialShipmentsCache === null);
  const { toast } = useToast();

  const fetchShipments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get order counts for each shipment
      const { data: orderCounts } = await supabase
        .from('orders')
        .select('shipment_id')
        .not('shipment_id', 'is', null);

      const countMap = new Map<string, number>();
      orderCounts?.forEach(o => {
        if (o.shipment_id) {
          countMap.set(o.shipment_id, (countMap.get(o.shipment_id) || 0) + 1);
        }
      });

      const mappedShipments: Shipment[] = (data || []).map(s => ({
        id: s.id,
        name: s.name,
        status: s.status as Shipment['status'],
        notes: s.notes,
        totalCost: Number(s.total_cost),
        createdAt: new Date(s.created_at),
        updatedAt: new Date(s.updated_at),
        orderCount: countMap.get(s.id) || 0,
      }));

      // Update cache
      initialShipmentsCache = mappedShipments;
      setShipments(mappedShipments);
    } catch (error) {
      console.error('Error fetching shipments:', error);
      toast({ title: 'Erro', description: 'Erro ao carregar remessas', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addShipment = async (shipmentData: { name: string; notes?: string }) => {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .insert({
          name: shipmentData.name,
          notes: shipmentData.notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newShipment: Shipment = {
        id: data.id,
        name: data.name,
        status: data.status as Shipment['status'],
        notes: data.notes,
        totalCost: Number(data.total_cost),
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        orderCount: 0,
      };

      setShipments(prev => [newShipment, ...prev]);
      initialShipmentsCache = [newShipment, ...(initialShipmentsCache || [])];
      toast({ title: 'Remessa criada', description: `Remessa "${newShipment.name}" foi criada com sucesso.` });
      
      activityLogger.log('create', 'shipment', newShipment.id, newShipment.name);
      
      return newShipment;
    } catch (error) {
      console.error('Error adding shipment:', error);
      toast({ title: 'Erro', description: 'Erro ao criar remessa', variant: 'destructive' });
      throw error;
    }
  };

  const updateShipment = async (shipment: Shipment) => {
    try {
      const { error } = await supabase
        .from('shipments')
        .update({
          name: shipment.name,
          status: shipment.status,
          notes: shipment.notes,
          total_cost: shipment.totalCost,
        })
        .eq('id', shipment.id);

      if (error) throw error;

      setShipments(prev => prev.map(s => s.id === shipment.id ? shipment : s));
      if (initialShipmentsCache) {
        initialShipmentsCache = initialShipmentsCache.map(s => s.id === shipment.id ? shipment : s);
      }
      toast({ title: 'Remessa atualizada', description: 'Remessa atualizada com sucesso.' });
      
      activityLogger.log('update', 'shipment', shipment.id, shipment.name);
    } catch (error) {
      console.error('Error updating shipment:', error);
      toast({ title: 'Erro', description: 'Erro ao atualizar remessa', variant: 'destructive' });
      throw error;
    }
  };

  const deleteShipment = async (shipmentId: string) => {
    const shipment = shipments.find(s => s.id === shipmentId);
    try {
      const { error } = await supabase
        .from('shipments')
        .delete()
        .eq('id', shipmentId);

      if (error) throw error;

      setShipments(prev => prev.filter(s => s.id !== shipmentId));
      if (initialShipmentsCache) {
        initialShipmentsCache = initialShipmentsCache.filter(s => s.id !== shipmentId);
      }
      toast({ title: 'Remessa excluída', description: 'Remessa removida com sucesso.' });
      
      activityLogger.log('delete', 'shipment', shipmentId, shipment?.name);
    } catch (error) {
      console.error('Error deleting shipment:', error);
      toast({ title: 'Erro', description: 'Erro ao excluir remessa', variant: 'destructive' });
      throw error;
    }
  };

  const addOrderToShipment = async (orderId: string, shipmentId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ shipment_id: shipmentId })
        .eq('id', orderId);

      if (error) throw error;

      // Update local shipment order count
      setShipments(prev => prev.map(s => 
        s.id === shipmentId 
          ? { ...s, orderCount: (s.orderCount || 0) + 1 }
          : s
      ));

      toast({ title: 'Pedido adicionado', description: 'Pedido adicionado à remessa.' });
    } catch (error) {
      console.error('Error adding order to shipment:', error);
      toast({ title: 'Erro', description: 'Erro ao adicionar pedido à remessa', variant: 'destructive' });
      throw error;
    }
  };

  const removeOrderFromShipment = async (orderId: string, shipmentId?: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ shipment_id: null })
        .eq('id', orderId);

      if (error) throw error;

      // Update local shipment order count
      if (shipmentId) {
        setShipments(prev => prev.map(s => 
          s.id === shipmentId 
            ? { ...s, orderCount: Math.max(0, (s.orderCount || 1) - 1) }
            : s
        ));
      }

      toast({ title: 'Pedido removido', description: 'Pedido removido da remessa.' });
    } catch (error) {
      console.error('Error removing order from shipment:', error);
      toast({ title: 'Erro', description: 'Erro ao remover pedido da remessa', variant: 'destructive' });
      throw error;
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  return { 
    shipments, 
    loading, 
    addShipment, 
    updateShipment, 
    deleteShipment, 
    addOrderToShipment,
    removeOrderFromShipment,
    refetch: fetchShipments 
  };
}
