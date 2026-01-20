import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useOrderNotifications() {
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const { toast } = useToast();

  const clearNotifications = useCallback(() => {
    setNewOrdersCount(0);
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          setNewOrdersCount(prev => prev + 1);
          toast({
            title: '🛒 Novo Pedido!',
            description: `Pedido de ${payload.new.customer_name} recebido.`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return { newOrdersCount, clearNotifications };
}
