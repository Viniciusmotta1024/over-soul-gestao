import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PricingShirt {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
}

export interface PricingDTF {
  id: string;
  minMeters: number;
  maxMeters: number | null;
  pricePerMeter: number;
  label: string;
}

export interface PricingFreight {
  id: string;
  name: string;
  price: number;
}

export function usePricingConfig() {
  const [shirts, setShirts] = useState<PricingShirt[]>([]);
  const [dtfTiers, setDtfTiers] = useState<PricingDTF[]>([]);
  const [freights, setFreights] = useState<PricingFreight[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAll = async () => {
    try {
      const [shirtsRes, dtfRes, freightRes] = await Promise.all([
        supabase.from('pricing_shirts').select('*').order('name'),
        supabase.from('pricing_dtf').select('*').order('min_meters'),
        supabase.from('pricing_freight').select('*').order('name'),
      ]);

      if (shirtsRes.error) throw shirtsRes.error;
      if (dtfRes.error) throw dtfRes.error;
      if (freightRes.error) throw freightRes.error;

      setShirts((shirtsRes.data || []).map(s => ({
        id: s.id,
        name: s.name,
        price: Number(s.price),
        isActive: s.is_active,
      })));

      setDtfTiers((dtfRes.data || []).map(d => ({
        id: d.id,
        minMeters: d.min_meters,
        maxMeters: d.max_meters,
        pricePerMeter: Number(d.price_per_meter),
        label: d.label,
      })));

      setFreights((freightRes.data || []).map(f => ({
        id: f.id,
        name: f.name,
        price: Number(f.price),
      })));
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar configurações',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Shirt operations
  const addShirt = async (name: string, price: number) => {
    try {
      const { error } = await supabase.from('pricing_shirts').insert({ name, price });
      if (error) throw error;
      toast({ title: 'Camisa adicionada' });
      await fetchAll();
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    }
  };

  const updateShirt = async (id: string, data: Partial<{ name: string; price: number; isActive: boolean }>) => {
    try {
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.price !== undefined) updateData.price = data.price;
      if (data.isActive !== undefined) updateData.is_active = data.isActive;
      
      const { error } = await supabase.from('pricing_shirts').update(updateData).eq('id', id);
      if (error) throw error;
      toast({ title: 'Camisa atualizada' });
      await fetchAll();
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    }
  };

  const deleteShirt = async (id: string) => {
    try {
      const { error } = await supabase.from('pricing_shirts').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Camisa removida' });
      await fetchAll();
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    }
  };

  // DTF operations
  const updateDTF = async (id: string, data: Partial<{ pricePerMeter: number; label: string }>) => {
    try {
      const updateData: any = {};
      if (data.pricePerMeter !== undefined) updateData.price_per_meter = data.pricePerMeter;
      if (data.label !== undefined) updateData.label = data.label;
      
      const { error } = await supabase.from('pricing_dtf').update(updateData).eq('id', id);
      if (error) throw error;
      toast({ title: 'Preço DTF atualizado' });
      await fetchAll();
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    }
  };

  // Freight operations
  const updateFreight = async (id: string, price: number) => {
    try {
      const { error } = await supabase.from('pricing_freight').update({ price }).eq('id', id);
      if (error) throw error;
      toast({ title: 'Frete atualizado' });
      await fetchAll();
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    }
  };

  const getDTFPrice = (meters: number): number => {
    if (meters <= 0) return 0;
    const tier = dtfTiers.find(t => 
      meters >= t.minMeters && (t.maxMeters === null || meters <= t.maxMeters)
    );
    return tier?.pricePerMeter || dtfTiers[0]?.pricePerMeter || 32.90;
  };

  const getCurrentDTFTier = (meters: number): PricingDTF | undefined => {
    if (meters <= 0) return undefined;
    return dtfTiers.find(t => 
      meters >= t.minMeters && (t.maxMeters === null || meters <= t.maxMeters)
    );
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    shirts: shirts.filter(s => s.isActive),
    allShirts: shirts,
    dtfTiers,
    freights,
    loading,
    addShirt,
    updateShirt,
    deleteShirt,
    updateDTF,
    updateFreight,
    getDTFPrice,
    getCurrentDTFTier,
    refetch: fetchAll,
  };
}
