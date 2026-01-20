import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChannelCard } from '@/components/dashboard/ChannelCard';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { SuppliersTable } from '@/components/suppliers/SuppliersTable';
import { ClientsTable } from '@/components/clients/ClientsTable';
import { ReportsView } from '@/components/reports/ReportsView';
import { AddClientDialog } from '@/components/clients/AddClientDialog';
import { AddSupplierDialog } from '@/components/suppliers/AddSupplierDialog';
import { mockOrders, mockSuppliers, mockClients, salesChannels } from '@/data/mockData';
import { Package, DollarSign, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Download } from 'lucide-react';
import { Order, Client, Supplier } from '@/types';

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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [addSupplierOpen, setAddSupplierOpen] = useState(false);

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

  const handleAddClient = (clientData: Omit<Client, 'id' | 'orders' | 'totalSpent' | 'createdAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: String(clients.length + 1),
      orders: 0,
      totalSpent: 0,
      createdAt: new Date(),
    };
    setClients([...clients, newClient]);
  };

  const handleAddSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: String(suppliers.length + 1),
    };
    setSuppliers([...suppliers, newSupplier]);
  };

  const { title, subtitle } = pageConfig[activeTab] || pageConfig.dashboard;
  const channelStats = getChannelStats();

  const renderContent = () => {
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filtrar
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Novo Pedido
              </Button>
            </div>
            <OrdersTable orders={orders} />
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
            <ClientsTable clients={clients} />
            <AddClientDialog 
              open={addClientOpen} 
              onOpenChange={setAddClientOpen}
              onAdd={handleAddClient}
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
            <SuppliersTable suppliers={suppliers} />
            <AddSupplierDialog
              open={addSupplierOpen}
              onOpenChange={setAddSupplierOpen}
              onAdd={handleAddSupplier}
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
            <OrdersTable orders={orders} filterChannel="shopee" />
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
            <OrdersTable orders={orders} filterChannel="ministerio" />
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
        <Header title={title} subtitle={subtitle} />
        
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
