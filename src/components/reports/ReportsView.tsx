import { Order } from '@/types';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Package, Percent } from 'lucide-react';
import { StatsCard } from '../dashboard/StatsCard';

interface ReportsViewProps {
  orders: Order[];
}

const COLORS = ['hsl(160, 84%, 39%)', 'hsl(38, 92%, 50%)', 'hsl(199, 89%, 48%)'];

export function ReportsView({ orders }: ReportsViewProps) {
  // Calculate statistics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.salePrice * o.quantity), 0);
  const totalCost = orders.reduce((acc, o) => acc + (o.supplierCost * o.quantity), 0);
  const totalProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Orders by channel
  const channelData = [
    { name: 'Shopee', value: orders.filter(o => o.channel === 'shopee').length, revenue: orders.filter(o => o.channel === 'shopee').reduce((acc, o) => acc + o.salePrice * o.quantity, 0) },
    { name: 'Ministério', value: orders.filter(o => o.channel === 'ministerio').length, revenue: orders.filter(o => o.channel === 'ministerio').reduce((acc, o) => acc + o.salePrice * o.quantity, 0) },
    { name: 'Site', value: orders.filter(o => o.channel === 'site').length, revenue: orders.filter(o => o.channel === 'site').reduce((acc, o) => acc + o.salePrice * o.quantity, 0) },
  ];

  // Orders by status
  const statusData = [
    { name: 'Pendentes', value: orders.filter(o => o.status === 'pending').length },
    { name: 'Processando', value: orders.filter(o => o.status === 'processing').length },
    { name: 'Concluídos', value: orders.filter(o => o.status === 'completed').length },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Faturamento Total"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          variant="primary"
          trend={{ value: 12.5, isPositive: true }}
          delay={0}
        />
        <StatsCard
          title="Custo Total"
          value={formatCurrency(totalCost)}
          icon={Package}
          variant="warning"
          delay={100}
        />
        <StatsCard
          title="Lucro Líquido"
          value={formatCurrency(totalProfit)}
          icon={TrendingUp}
          variant="success"
          trend={{ value: 8.2, isPositive: true }}
          delay={200}
        />
        <StatsCard
          title="Margem de Lucro"
          value={`${profitMargin.toFixed(1)}%`}
          icon={Percent}
          delay={300}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue by Channel */}
        <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <h3 className="text-lg font-semibold text-foreground mb-6">Faturamento por Canal</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} tickFormatter={(v) => `R$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(222, 47%, 8%)', 
                    border: '1px solid hsl(222, 30%, 18%)',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Faturamento']}
                />
                <Bar dataKey="revenue" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders by Status */}
        <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
          <h3 className="text-lg font-semibold text-foreground mb-6">Pedidos por Status</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(222, 47%, 8%)', 
                    border: '1px solid hsl(222, 30%, 18%)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Purchase Summary for Suppliers */}
      <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
        <h3 className="text-lg font-semibold text-foreground mb-6">Resumo para Compra com Fornecedores</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Quantidade total de produtos pendentes de compra baseado nos pedidos em processamento:
        </p>
        
        <div className="grid gap-4 md:grid-cols-3">
          {orders
            .filter(o => o.status === 'pending' || o.status === 'processing')
            .reduce((acc, order) => {
              const key = `${order.product}-${order.size}`;
              const existing = acc.find(i => i.key === key);
              if (existing) {
                existing.quantity += order.quantity;
              } else {
                acc.push({ key, product: order.product, size: order.size, quantity: order.quantity });
              }
              return acc;
            }, [] as { key: string; product: string; size: string; quantity: number }[])
            .map((item, index) => (
              <div 
                key={item.key}
                className="p-4 rounded-lg bg-secondary/30 border border-border/50"
              >
                <p className="font-medium text-foreground">{item.product}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">Tamanho: {item.size}</span>
                  <span className="text-lg font-bold text-primary">{item.quantity} un</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
