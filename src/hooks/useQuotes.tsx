import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Quote {
  id: string;
  customerName?: string;
  shirtType: string;
  shirtPrice: number;
  quantity: number;
  dtfMeters: number;
  dtfPricePerMeter: number;
  shirtFreight: number;
  dtfFreight: number;
  profitMargin: number;
  totalCost: number;
  suggestedPrice: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface QuoteInsert {
  customerName?: string;
  shirtType: string;
  shirtPrice: number;
  quantity: number;
  dtfMeters: number;
  dtfPricePerMeter: number;
  shirtFreight: number;
  dtfFreight: number;
  profitMargin: number;
  totalCost: number;
  suggestedPrice: number;
  notes?: string;
}

export function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped: Quote[] = (data || []).map(q => ({
        id: q.id,
        customerName: q.customer_name || undefined,
        shirtType: q.shirt_type,
        shirtPrice: Number(q.shirt_price),
        quantity: q.quantity,
        dtfMeters: Number(q.dtf_meters),
        dtfPricePerMeter: Number(q.dtf_price_per_meter),
        shirtFreight: Number(q.shirt_freight),
        dtfFreight: Number(q.dtf_freight),
        profitMargin: Number(q.profit_margin),
        totalCost: Number(q.total_cost),
        suggestedPrice: Number(q.suggested_price),
        notes: q.notes || undefined,
        createdAt: new Date(q.created_at),
        updatedAt: new Date(q.updated_at),
      }));

      setQuotes(mapped);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar orçamentos',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addQuote = async (quoteData: QuoteInsert) => {
    try {
      const { error } = await supabase.from('quotes').insert({
        customer_name: quoteData.customerName,
        shirt_type: quoteData.shirtType,
        shirt_price: quoteData.shirtPrice,
        quantity: quoteData.quantity,
        dtf_meters: quoteData.dtfMeters,
        dtf_price_per_meter: quoteData.dtfPricePerMeter,
        shirt_freight: quoteData.shirtFreight,
        dtf_freight: quoteData.dtfFreight,
        profit_margin: quoteData.profitMargin,
        total_cost: quoteData.totalCost,
        suggested_price: quoteData.suggestedPrice,
        notes: quoteData.notes,
      });

      if (error) throw error;

      toast({
        title: 'Orçamento salvo',
        description: 'O orçamento foi salvo com sucesso.',
      });

      await fetchQuotes();
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar orçamento',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteQuote = async (id: string) => {
    try {
      const { error } = await supabase.from('quotes').delete().eq('id', id);

      if (error) throw error;

      toast({
        title: 'Orçamento excluído',
        description: 'O orçamento foi removido.',
      });

      await fetchQuotes();
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir orçamento',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  return {
    quotes,
    loading,
    addQuote,
    deleteQuote,
    refetch: fetchQuotes,
  };
}
