import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { activityLogger } from '@/services/activityLogger';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

const mappedOrders: Order[] = (data || []).map(o => ({
        id: o.id,
        customerName: o.customer_name,
        customerId: o.client_id || undefined,
        product: o.product,
        size: o.size,
        quantity: o.quantity,
        channel: o.channel as 'shopee' | 'ministerio' | 'site',
        status: o.status as 'pending' | 'processing' | 'completed' | 'cancelled',
        supplierCost: Number(o.supplier_cost),
        salePrice: Number(o.sale_price),
        createdAt: new Date(o.created_at),
        isPaid: o.is_paid,
        paidAt: o.paid_at ? new Date(o.paid_at) : undefined,
        shipmentId: o.shipment_id || undefined,
        isInternalTest: o.is_internal_test || false,
      }));

      setOrders(mappedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({ title: 'Erro', description: 'Erro ao carregar pedidos', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          customer_name: orderData.customerName,
          client_id: orderData.customerId || null,
          product: orderData.product,
          size: orderData.size,
          quantity: orderData.quantity,
          channel: orderData.channel,
          status: orderData.status,
          supplier_cost: orderData.supplierCost,
          sale_price: orderData.salePrice,
          shipment_id: orderData.shipmentId || null,
          is_internal_test: orderData.isInternalTest || false,
        })
        .select()
        .single();

      if (error) throw error;

      // Update client stats if client exists
      if (orderData.customerId) {
        const { data: clientData } = await supabase
          .from('clients')
          .select('orders_count, total_spent')
          .eq('id', orderData.customerId)
          .single();

        if (clientData) {
          await supabase
            .from('clients')
            .update({
              orders_count: clientData.orders_count + 1,
              total_spent: Number(clientData.total_spent) + (orderData.salePrice * orderData.quantity),
            })
            .eq('id', orderData.customerId);
        }
      }

const newOrder: Order = {
        id: data.id,
        customerName: data.customer_name,
        customerId: data.client_id || undefined,
        product: data.product,
        size: data.size,
        quantity: data.quantity,
        channel: data.channel as 'shopee' | 'ministerio' | 'site',
        status: data.status as 'pending' | 'processing' | 'completed' | 'cancelled',
        supplierCost: Number(data.supplier_cost),
        salePrice: Number(data.sale_price),
        createdAt: new Date(data.created_at),
        isPaid: data.is_paid,
        paidAt: data.paid_at ? new Date(data.paid_at) : undefined,
        shipmentId: data.shipment_id || undefined,
        isInternalTest: data.is_internal_test || false,
      };

      setOrders(prev => [newOrder, ...prev]);
      toast({ title: 'Pedido criado', description: `Pedido para ${newOrder.customerName} foi criado com sucesso.` });
      
      // Log activity
      activityLogger.log('create', 'order', newOrder.id, `${newOrder.product} - ${newOrder.customerName}`, {
        product: newOrder.product,
        customer: newOrder.customerName,
        channel: newOrder.channel,
      });
      
      return newOrder;
    } catch (error) {
      console.error('Error adding order:', error);
      toast({ title: 'Erro', description: 'Erro ao criar pedido', variant: 'destructive' });
      throw error;
    }
  };

  const updateOrder = async (order: Order) => {
    const previousOrder = orders.find(o => o.id === order.id);
    const statusChanged = previousOrder && previousOrder.status !== order.status;
    
    try {
const { error } = await supabase
        .from('orders')
        .update({
          customer_name: order.customerName,
          client_id: order.customerId || null,
          product: order.product,
          size: order.size,
          quantity: order.quantity,
          channel: order.channel,
          status: order.status,
          supplier_cost: order.supplierCost,
          sale_price: order.salePrice,
          is_paid: order.isPaid,
          paid_at: order.paidAt?.toISOString() || null,
          shipment_id: order.shipmentId || null,
          is_internal_test: order.isInternalTest || false,
        })
        .eq('id', order.id);

      if (error) throw error;

      setOrders(prev => prev.map(o => o.id === order.id ? order : o));
      toast({ title: 'Pedido atualizado', description: 'Pedido atualizado com sucesso.' });
      
      // Log activity
      if (statusChanged) {
        activityLogger.log('status_change', 'order', order.id, `${order.product} - ${order.customerName}`, {
          previousStatus: previousOrder?.status,
          newStatus: order.status,
        });
      } else {
        activityLogger.log('update', 'order', order.id, `${order.product} - ${order.customerName}`);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast({ title: 'Erro', description: 'Erro ao atualizar pedido', variant: 'destructive' });
      throw error;
    }
  };

  const deleteOrder = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => prev.filter(o => o.id !== orderId));
      toast({ title: 'Pedido excluído', description: 'Pedido removido com sucesso.' });
      
      // Log activity
      activityLogger.log('delete', 'order', orderId, order ? `${order.product} - ${order.customerName}` : undefined);
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({ title: 'Erro', description: 'Erro ao excluir pedido', variant: 'destructive' });
      throw error;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, addOrder, updateOrder, deleteOrder, refetch: fetchOrders };
}
