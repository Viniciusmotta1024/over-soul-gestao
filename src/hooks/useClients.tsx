import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { activityLogger } from '@/services/activityLogger';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedClients: Client[] = (data || []).map(c => ({
        id: c.id,
        name: c.name,
        email: c.email || '',
        phone: c.phone,
        address: c.address || undefined,
        city: c.city || undefined,
        state: c.state || undefined,
        orders: c.orders_count,
        totalSpent: Number(c.total_spent),
        createdAt: new Date(c.created_at),
      }));

      setClients(mappedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({ title: 'Erro', description: 'Erro ao carregar clientes', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (clientData: Omit<Client, 'id' | 'orders' | 'totalSpent' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: clientData.name || 'Cliente sem nome',
          email: clientData.email || null,
          phone: clientData.phone || '',
          address: clientData.address || null,
          city: clientData.city || null,
          state: clientData.state || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newClient: Client = {
        id: data.id,
        name: data.name,
        email: data.email || '',
        phone: data.phone,
        address: data.address || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        orders: data.orders_count,
        totalSpent: Number(data.total_spent),
        createdAt: new Date(data.created_at),
      };

      setClients(prev => [newClient, ...prev]);
      toast({ title: 'Cliente adicionado', description: `${newClient.name} foi adicionado com sucesso.` });
      
      // Log activity
      activityLogger.log('create', 'client', newClient.id, newClient.name);
      
      return newClient;
    } catch (error) {
      console.error('Error adding client:', error);
      toast({ title: 'Erro', description: 'Erro ao adicionar cliente', variant: 'destructive' });
      throw error;
    }
  };

  const updateClient = async (client: Client) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          name: client.name || 'Cliente sem nome',
          email: client.email || null,
          phone: client.phone || '',
          address: client.address || null,
          city: client.city || null,
          state: client.state || null,
        })
        .eq('id', client.id);

      if (error) throw error;

      setClients(prev => prev.map(c => c.id === client.id ? client : c));
      toast({ title: 'Cliente atualizado', description: `${client.name} foi atualizado com sucesso.` });
      
      // Log activity
      activityLogger.log('update', 'client', client.id, client.name);
    } catch (error) {
      console.error('Error updating client:', error);
      toast({ title: 'Erro', description: 'Erro ao atualizar cliente', variant: 'destructive' });
      throw error;
    }
  };

  const deleteClient = async (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      setClients(prev => prev.filter(c => c.id !== clientId));
      toast({ title: 'Cliente excluído', description: 'Cliente removido com sucesso.' });
      
      // Log activity
      activityLogger.log('delete', 'client', clientId, client?.name);
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({ title: 'Erro', description: 'Erro ao excluir cliente', variant: 'destructive' });
      throw error;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { clients, loading, addClient, updateClient, deleteClient, refetch: fetchClients };
}
