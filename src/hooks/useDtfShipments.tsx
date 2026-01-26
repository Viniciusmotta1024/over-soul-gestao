import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { activityLogger } from '@/services/activityLogger';

export interface DtfShipment {
  id: string;
  name: string;
  status: 'open' | 'ordered' | 'received' | 'closed';
  meters: number;
  pricePerMeter: number;
  freight: number;
  notes: string | null;
  totalCost: number;
  createdAt: Date;
  updatedAt: Date;
}

// Initial state loaded synchronously to prevent flash
let initialDtfShipmentsCache: DtfShipment[] | null = null;

export function useDtfShipments() {
  const [dtfShipments, setDtfShipments] = useState<DtfShipment[]>(initialDtfShipmentsCache || []);
  const [loading, setLoading] = useState(initialDtfShipmentsCache === null);
  const { toast } = useToast();

  const fetchDtfShipments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('dtf_shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped: DtfShipment[] = (data || []).map(s => ({
        id: s.id,
        name: s.name,
        status: s.status as DtfShipment['status'],
        meters: s.meters,
        pricePerMeter: Number(s.price_per_meter),
        freight: Number(s.freight),
        notes: s.notes,
        totalCost: Number(s.total_cost),
        createdAt: new Date(s.created_at),
        updatedAt: new Date(s.updated_at),
      }));

      initialDtfShipmentsCache = mapped;
      setDtfShipments(mapped);
    } catch (error) {
      console.error('Error fetching DTF shipments:', error);
      toast({ title: 'Erro', description: 'Erro ao carregar remessas de DTF', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const calculateTotalCost = (meters: number, pricePerMeter: number, freight: number) => {
    return (meters * pricePerMeter) + freight;
  };

  const addDtfShipment = async (data: { name: string; meters: number; pricePerMeter: number; freight: number; notes?: string }) => {
    try {
      const totalCost = calculateTotalCost(data.meters, data.pricePerMeter, data.freight);
      
      const { data: created, error } = await supabase
        .from('dtf_shipments')
        .insert({
          name: data.name,
          meters: data.meters,
          price_per_meter: data.pricePerMeter,
          freight: data.freight,
          notes: data.notes || null,
          total_cost: totalCost,
        })
        .select()
        .single();

      if (error) throw error;

      const newShipment: DtfShipment = {
        id: created.id,
        name: created.name,
        status: created.status as DtfShipment['status'],
        meters: created.meters,
        pricePerMeter: Number(created.price_per_meter),
        freight: Number(created.freight),
        notes: created.notes,
        totalCost: Number(created.total_cost),
        createdAt: new Date(created.created_at),
        updatedAt: new Date(created.updated_at),
      };

      setDtfShipments(prev => [newShipment, ...prev]);
      initialDtfShipmentsCache = [newShipment, ...(initialDtfShipmentsCache || [])];
      toast({ title: 'Remessa DTF criada', description: `Remessa "${newShipment.name}" foi criada com sucesso.` });
      
      activityLogger.log('create', 'dtf_shipment', newShipment.id, newShipment.name);
      
      return newShipment;
    } catch (error) {
      console.error('Error adding DTF shipment:', error);
      toast({ title: 'Erro', description: 'Erro ao criar remessa de DTF', variant: 'destructive' });
      throw error;
    }
  };

  const updateDtfShipment = async (shipment: DtfShipment) => {
    try {
      const totalCost = calculateTotalCost(shipment.meters, shipment.pricePerMeter, shipment.freight);
      
      const { error } = await supabase
        .from('dtf_shipments')
        .update({
          name: shipment.name,
          status: shipment.status,
          meters: shipment.meters,
          price_per_meter: shipment.pricePerMeter,
          freight: shipment.freight,
          notes: shipment.notes,
          total_cost: totalCost,
        })
        .eq('id', shipment.id);

      if (error) throw error;

      const updated = { ...shipment, totalCost };
      setDtfShipments(prev => prev.map(s => s.id === shipment.id ? updated : s));
      if (initialDtfShipmentsCache) {
        initialDtfShipmentsCache = initialDtfShipmentsCache.map(s => s.id === shipment.id ? updated : s);
      }
      toast({ title: 'Remessa DTF atualizada', description: 'Remessa atualizada com sucesso.' });
      
      activityLogger.log('update', 'dtf_shipment', shipment.id, shipment.name);
    } catch (error) {
      console.error('Error updating DTF shipment:', error);
      toast({ title: 'Erro', description: 'Erro ao atualizar remessa de DTF', variant: 'destructive' });
      throw error;
    }
  };

  const deleteDtfShipment = async (shipmentId: string) => {
    const shipment = dtfShipments.find(s => s.id === shipmentId);
    try {
      const { error } = await supabase
        .from('dtf_shipments')
        .delete()
        .eq('id', shipmentId);

      if (error) throw error;

      setDtfShipments(prev => prev.filter(s => s.id !== shipmentId));
      if (initialDtfShipmentsCache) {
        initialDtfShipmentsCache = initialDtfShipmentsCache.filter(s => s.id !== shipmentId);
      }
      toast({ title: 'Remessa DTF excluída', description: 'Remessa removida com sucesso.' });
      
      activityLogger.log('delete', 'dtf_shipment', shipmentId, shipment?.name);
    } catch (error) {
      console.error('Error deleting DTF shipment:', error);
      toast({ title: 'Erro', description: 'Erro ao excluir remessa de DTF', variant: 'destructive' });
      throw error;
    }
  };

  useEffect(() => {
    fetchDtfShipments();
  }, [fetchDtfShipments]);

  return { 
    dtfShipments, 
    loading, 
    addDtfShipment, 
    updateDtfShipment, 
    deleteDtfShipment, 
    refetch: fetchDtfShipments 
  };
}
