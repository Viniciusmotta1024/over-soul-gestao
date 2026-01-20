import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChannelCard } from '@/components/dashboard/ChannelCard';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { OrderFilters, OrderFiltersState } from '@/components/orders/OrderFilters';
import { SuppliersTable } from '@/components/suppliers/SuppliersTable';
import { ClientsTable } from '@/components/clients/ClientsTable';
import { ReportsView } from '@/components/reports/ReportsView';
import { AddClientDialog } from '@/components/clients/AddClientDialog';
import { EditClientDialog } from '@/components/clients/EditClientDialog';
import { AddSupplierDialog } from '@/components/suppliers/AddSupplierDialog';
import { EditSupplierDialog } from '@/components/suppliers/EditSupplierDialog';
import { AddOrderDialog } from '@/components/orders/AddOrderDialog';
import { EditOrderDialog } from '@/components/orders/EditOrderDialog';
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog';
import { salesChannels, mockSuppliers } from '@/data/mockData';
import { Package, DollarSign, TrendingUp, Users, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import { Order, Client, Supplier } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useClients } from '@/hooks/useClients';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useOrders } from '@/hooks/useOrders';
import { Skeleton } from '@/components/ui/skeleton';
import { isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';

const pageConfig: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Visão geral dos seus pedidos e vendas' },
  orders: { title: 'Pedidos', subtitle: 'Gerenciar todos os pedidos' },
  clients: { title: 'Clientes', subtitle: 'Gerenciar clientes e empresas' },
  suppliers: { title: 'Fornecedores', subtitle: 'Valores e produtos dos fornecedores' },
  shopee: { title: 'Shopee', subtitle: 'Pedidos do marketplace Shopee' },
  ministerio: { title: 'Vista o seu Ministério', subtitle: 'Encomendas para igrejas e eventos' },
  reports: { title: 'Relatórios', subtitle: 'Análise de vendas e lucros' },
};

const Index = () => {
  const { signOut, user } = useAuth();
  const { clients, loading: clientsLoading, addClient, updateClient, deleteClient } = useClients();
  const { suppliers, loading: suppliersLoading, addSupplier, updateSupplier, deleteSupplier } = useSuppliers();
  const { orders, loading: ordersLoading, addOrder, updateOrder, deleteOrder } = useOrders();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orderFilters, setOrderFilters] = useState<OrderFiltersState>({});

  // Use database suppliers or fallback to mock for initial setup
  const effectiveSuppliers = suppliers.length > 0 ? suppliers : mockSuppliers;

  // Dialog states
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [editClientOpen, setEditClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const [addSupplierOpen, setAddSupplierOpen] = useState(false);
  const [editSupplierOpen, setEditSupplierOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  
  const [addOrderOpen, setAddOrderOpen] = useState(false);
  const [editOrderOpen, setEditOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Delete dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'client' | 'supplier' | 'order'>('client');
  const [itemToDelete, setItemToDelete] = useState<Client | Supplier | Order | null>(null);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (orderFilters.status && order.status !== orderFilters.status) return false;
      if (orderFilters.channel && order.channel !== orderFilters.channel) return false;
      if (orderFilters.clientId && order.customerId !== orderFilters.clientId) return false;
      if (orderFilters.dateFrom && isBefore(order.createdAt, startOfDay(orderFilters.dateFrom))) return false;
      if (orderFilters.dateTo && isAfter(order.createdAt, endOfDay(orderFilters.dateTo))) return false;
      return true;
    });
  }, [orders, orderFilters]);

  // Calculate stats from actual data
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, o) => acc + (o.salePrice * o.quantity), 0);
  const totalProfit = orders.reduce((acc, o) => acc + ((o.salePrice - o.supplierCost) * o.quantity), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;

  // Calculate channel stats from actual orders
  const getChannelStats = () => {
    return salesChannels.map(channel => ({
      ...channel,
      totalOrders: orders.filter(o => o.channel === channel.id).length,
      totalRevenue: orders.filter(o => o.channel === channel.id).reduce((acc, o) => acc + o.salePrice * o.quantity, 0),
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Client handlers
  const handleAddClient = async (clientData: Omit<Client, 'id' | 'orders' | 'totalSpent' | 'createdAt'>) => {
    await addClient(clientData);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setEditClientOpen(true);
  };

  const handleSaveClient = async (updatedClient: Client) => {
    await updateClient(updatedClient);
  };

  const handleDeleteClient = (client: Client) => {
    setItemToDelete(client);
    setDeleteType('client');
    setDeleteDialogOpen(true);
  };

  // Supplier handlers
  const handleAddSupplier = async (supplierData: Omit<Supplier, 'id'>) => {
    await addSupplier(supplierData);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setEditSupplierOpen(true);
  };

  const handleSaveSupplier = async (updatedSupplier: Supplier) => {
    await updateSupplier(updatedSupplier);
  };

  const handleDeleteSupplier = (supplier: Supplier) => {
    setItemToDelete(supplier);
    setDeleteType('supplier');
    setDeleteDialogOpen(true);
  };

  // Order handlers
  const handleAddOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    await addOrder(orderData);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setEditOrderOpen(true);
  };

  const handleSaveOrder = async (updatedOrder: Order) => {
    await updateOrder(updatedOrder);
  };

  const handleDeleteOrder = (order: Order) => {
    setItemToDelete(order);
    setDeleteType('order');
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    switch (deleteType) {
      case 'client':
        await deleteClient((itemToDelete as Client).id);
        break;
      case 'supplier':
        await deleteSupplier((itemToDelete as Supplier).id);
        break;
      case 'order':
        await deleteOrder((itemToDelete as Order).id);
        break;
    }

    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const getDeleteDialogContent = () => {
    switch (deleteType) {
      case 'client':
        return {
          title: 'Excluir Cliente',
          description: `Tem certeza que deseja excluir "${(itemToDelete as Client)?.name}"? Esta ação não pode ser desfeita.`,
        };
      case 'supplier':
        return {
          title: 'Excluir Fornecedor',
          description: `Tem certeza que deseja excluir "${(itemToDelete as Supplier)?.name}"? Esta ação não pode ser desfeita.`,
        };
      case 'order':
        return {
          title: 'Excluir Pedido',
          description: `Tem certeza que deseja excluir o pedido de "${(itemToDelete as Order)?.customerName}"? Esta ação não pode ser desfeita.`,
        };
    }
  };

  const { title, subtitle } = pageConfig[activeTab] || pageConfig.dashboard;
  const channelStats = getChannelStats();
  const deleteContent = getDeleteDialogContent();

  const isLoading = clientsLoading || suppliersLoading || ordersLoading;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total de Pedidos"
                value={totalOrders}
                icon={Package}
                trend={{ value: 12, isPositive: true }}
                delay={0}
              />
              <StatsCard
                title="Faturamento"
                value={formatCurrency(totalRevenue)}
                icon={DollarSign}
                variant="primary"
                trend={{ value: 8.5, isPositive: true }}
                delay={100}
              />
              <StatsCard
                title="Lucro Total"
                value={formatCurrency(totalProfit)}
                icon={TrendingUp}
                variant="success"
                trend={{ value: 15.2, isPositive: true }}
                delay={200}
              />
              <StatsCard
                title="Pedidos Pendentes"
                value={pendingOrders}
                icon={Users}
                variant="warning"
                delay={300}
              />
            </div>

            {/* Channels */}
            <div>
              <h2 className="text-lg font-serif font-semibold text-foreground mb-4">Canais de Venda</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {channelStats.map((channel, index) => (
                  <ChannelCard
                    key={channel.id}
                    name={channel.name}
                    icon={channel.icon}
                    orders={channel.totalOrders}
                    revenue={channel.totalRevenue}
                    onClick={() => setActiveTab(channel.id)}
                    delay={400 + index * 100}
                  />
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <RecentOrders orders={orders} />
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <OrderFilters
                clients={clients}
                filters={orderFilters}
                onFiltersChange={setOrderFilters}
                onClear={() => setOrderFilters({})}
              />
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
                <Button 
                  className="gap-2 bg-primary hover:bg-primary/90"
                  onClick={() => setAddOrderOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Novo Pedido
                </Button>
              </div>
            </div>
            <OrdersTable 
              orders={filteredOrders} 
              onEdit={handleEditOrder}
              onDelete={handleDeleteOrder}
            />
          </div>
        );

      case 'clients':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-end">
              <Button 
                className="gap-2 bg-primary hover:bg-primary/90"
                onClick={() => setAddClientOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Novo Cliente
              </Button>
            </div>
            <ClientsTable 
              clients={clients} 
              onEdit={handleEditClient}
              onDelete={handleDeleteClient}
            />
          </div>
        );

      case 'suppliers':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-end">
              <Button 
                className="gap-2 bg-primary hover:bg-primary/90"
                onClick={() => setAddSupplierOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Novo Fornecedor
              </Button>
            </div>
            <SuppliersTable 
              suppliers={effectiveSuppliers} 
              onEdit={handleEditSupplier}
              onDelete={handleDeleteSupplier}
            />
          </div>
        );

      case 'shopee':
        return (
          <div className="space-y-6">
            <div className="glass rounded-xl p-6 animate-fade-in">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-3xl">
                  🛒
                </div>
                <div>
                  <h2 className="text-xl font-serif font-semibold text-foreground">Vendas Shopee</h2>
                  <p className="text-muted-foreground">Gerencie seus pedidos do marketplace</p>
                </div>
              </div>
            </div>
            <OrdersTable 
              orders={orders} 
              filterChannel="shopee" 
              onEdit={handleEditOrder}
              onDelete={handleDeleteOrder}
            />
          </div>
        );

      case 'ministerio':
        return (
          <div className="space-y-6">
            <div className="glass rounded-xl p-6 animate-fade-in">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-3xl">
                  ⛪
                </div>
                <div>
                  <h2 className="text-xl font-serif font-semibold text-foreground">Vista o seu Ministério</h2>
                  <p className="text-muted-foreground">Encomendas para igrejas e eventos religiosos</p>
                </div>
              </div>
            </div>
            <OrdersTable 
              orders={orders} 
              filterChannel="ministerio" 
              onEdit={handleEditOrder}
              onDelete={handleDeleteOrder}
            />
          </div>
        );

      case 'reports':
        return <ReportsView orders={orders} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="ml-64">
        <Header title={title} subtitle={subtitle}>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => signOut()}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </Header>
        
        <div className="p-8">
          {renderContent()}
        </div>
      </main>

      {/* Client Dialogs */}
      <AddClientDialog 
        open={addClientOpen} 
        onOpenChange={setAddClientOpen}
        onAdd={handleAddClient}
      />
      <EditClientDialog
        open={editClientOpen}
        onOpenChange={setEditClientOpen}
        client={selectedClient}
        onSave={handleSaveClient}
      />

      {/* Supplier Dialogs */}
      <AddSupplierDialog
        open={addSupplierOpen}
        onOpenChange={setAddSupplierOpen}
        onAdd={handleAddSupplier}
      />
      <EditSupplierDialog
        open={editSupplierOpen}
        onOpenChange={setEditSupplierOpen}
        supplier={selectedSupplier}
        onSave={handleSaveSupplier}
      />

      {/* Order Dialogs */}
      <AddOrderDialog
        open={addOrderOpen}
        onOpenChange={setAddOrderOpen}
        clients={clients}
        suppliers={effectiveSuppliers}
        onAdd={handleAddOrder}
      />
      <EditOrderDialog
        open={editOrderOpen}
        onOpenChange={setEditOrderOpen}
        order={selectedOrder}
        clients={clients}
        suppliers={effectiveSuppliers}
        onSave={handleSaveOrder}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={deleteContent.title}
        description={deleteContent.description}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Index;
