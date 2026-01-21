import { useMemo } from 'react';
import { Order } from '@/types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area 
} from 'recharts';
import { TrendingUp, DollarSign, Package, Percent } from 'lucide-react';
import { StatsCard } from '../dashboard/StatsCard';
import { ReportExport } from './ReportExport';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReportsViewProps {
  orders: Order[];
}

const COLORS = ['hsl(75, 20%, 35%)', 'hsl(38, 92%, 50%)', 'hsl(199, 89%, 48%)'];
const CHANNEL_COLORS = {
  shopee: 'hsl(38, 92%, 50%)',
  ministerio: 'hsl(75, 20%, 35%)',
  site: 'hsl(199, 89%, 48%)',
};

export function ReportsView({ orders }: ReportsViewProps) {
  // Calculate statistics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.salePrice * o.quantity), 0);
  const totalCost = orders.reduce((acc, o) => acc + (o.supplierCost * o.quantity), 0);
  const totalProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Calculate month-over-month trends
  const trends = useMemo(() => {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // Current month orders
    const currentMonthOrders = orders.filter(o => 
      isWithinInterval(o.createdAt, { start: currentMonthStart, end: currentMonthEnd })
    );
    const currentRevenue = currentMonthOrders.reduce((acc, o) => acc + (o.salePrice * o.quantity), 0);
    const currentProfit = currentMonthOrders.reduce((acc, o) => acc + ((o.salePrice - o.supplierCost) * o.quantity), 0);

    // Last month orders
    const lastMonthOrders = orders.filter(o => 
      isWithinInterval(o.createdAt, { start: lastMonthStart, end: lastMonthEnd })
    );
    const lastRevenue = lastMonthOrders.reduce((acc, o) => acc + (o.salePrice * o.quantity), 0);
    const lastProfit = lastMonthOrders.reduce((acc, o) => acc + ((o.salePrice - o.supplierCost) * o.quantity), 0);

    // Calculate percentage changes
    const calcTrend = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? { value: 100, isPositive: true } : null;
      const change = ((current - previous) / previous) * 100;
      return { value: Math.abs(parseFloat(change.toFixed(1))), isPositive: change >= 0 };
    };

    return {
      revenue: calcTrend(currentRevenue, lastRevenue),
      profit: calcTrend(currentProfit, lastProfit),
    };
  }, [orders]);

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

  // Monthly evolution data (last 6 months)
  const monthlyData = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      const monthOrders = orders.filter(o => 
        isWithinInterval(o.createdAt, { start: monthStart, end: monthEnd })
      );
      
      const shopeeOrders = monthOrders.filter(o => o.channel === 'shopee');
      const ministerioOrders = monthOrders.filter(o => o.channel === 'ministerio');
      const siteOrders = monthOrders.filter(o => o.channel === 'site');
      
      months.push({
        month: format(monthDate, 'MMM', { locale: ptBR }),
        fullMonth: format(monthDate, 'MMMM yyyy', { locale: ptBR }),
        total: monthOrders.reduce((acc, o) => acc + o.salePrice * o.quantity, 0),
        lucro: monthOrders.reduce((acc, o) => acc + (o.salePrice - o.supplierCost) * o.quantity, 0),
        pedidos: monthOrders.length,
        shopee: shopeeOrders.reduce((acc, o) => acc + o.salePrice * o.quantity, 0),
        ministerio: ministerioOrders.reduce((acc, o) => acc + o.salePrice * o.quantity, 0),
        site: siteOrders.reduce((acc, o) => acc + o.salePrice * o.quantity, 0),
      });
    }
    
    return months;
  }, [orders]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Export Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-lg font-serif font-semibold text-foreground">Relatórios e Análises</h2>
        <ReportExport orders={orders} />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Faturamento Total"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          variant="primary"
          trend={trends.revenue || undefined}
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
          trend={trends.profit || undefined}
          delay={200}
        />
        <StatsCard
          title="Margem de Lucro"
          value={`${profitMargin.toFixed(1)}%`}
          icon={Percent}
          delay={300}
        />
      </div>

      {/* Monthly Evolution Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Evolution */}
        <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <h3 className="text-lg font-serif font-semibold text-foreground mb-6">Evolução de Vendas (6 meses)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(75, 20%, 35%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(75, 20%, 35%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 88%)" />
                <XAxis dataKey="month" stroke="hsl(30, 10%, 45%)" fontSize={12} />
                <YAxis stroke="hsl(30, 10%, 45%)" fontSize={12} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(0, 0%, 100%)', 
                    border: '1px solid hsl(40, 15%, 88%)',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value), 
                    name === 'total' ? 'Faturamento' : 'Lucro'
                  ]}
                  labelFormatter={(label) => {
                    const item = monthlyData.find(m => m.month === label);
                    return item?.fullMonth || label;
                  }}
                />
                <Legend formatter={(value) => value === 'total' ? 'Faturamento' : 'Lucro'} />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="hsl(75, 20%, 35%)" 
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="lucro" 
                  stroke="hsl(142, 71%, 45%)" 
                  fillOpacity={1} 
                  fill="url(#colorLucro)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Comparison */}
        <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
          <h3 className="text-lg font-serif font-semibold text-foreground mb-6">Comparativo por Canal (6 meses)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 88%)" />
                <XAxis dataKey="month" stroke="hsl(30, 10%, 45%)" fontSize={12} />
                <YAxis stroke="hsl(30, 10%, 45%)" fontSize={12} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(0, 0%, 100%)', 
                    border: '1px solid hsl(40, 15%, 88%)',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [formatCurrency(value)]}
                  labelFormatter={(label) => {
                    const item = monthlyData.find(m => m.month === label);
                    return item?.fullMonth || label;
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="shopee" 
                  name="Shopee" 
                  stroke={CHANNEL_COLORS.shopee} 
                  strokeWidth={2}
                  dot={{ fill: CHANNEL_COLORS.shopee }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ministerio" 
                  name="Ministério" 
                  stroke={CHANNEL_COLORS.ministerio} 
                  strokeWidth={2}
                  dot={{ fill: CHANNEL_COLORS.ministerio }}
                />
                <Line 
                  type="monotone" 
                  dataKey="site" 
                  name="Site" 
                  stroke={CHANNEL_COLORS.site} 
                  strokeWidth={2}
                  dot={{ fill: CHANNEL_COLORS.site }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Existing Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue by Channel */}
        <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <h3 className="text-lg font-serif font-semibold text-foreground mb-6">Faturamento por Canal</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 88%)" />
                <XAxis dataKey="name" stroke="hsl(30, 10%, 45%)" fontSize={12} />
                <YAxis stroke="hsl(30, 10%, 45%)" fontSize={12} tickFormatter={(v) => `R$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(0, 0%, 100%)', 
                    border: '1px solid hsl(40, 15%, 88%)',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Faturamento']}
                />
                <Bar dataKey="revenue" fill="hsl(75, 20%, 35%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders by Status */}
        <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: '700ms' }}>
          <h3 className="text-lg font-serif font-semibold text-foreground mb-6">Pedidos por Status</h3>
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
                    backgroundColor: 'hsl(0, 0%, 100%)', 
                    border: '1px solid hsl(40, 15%, 88%)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Orders count by month */}
      <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: '800ms' }}>
        <h3 className="text-lg font-serif font-semibold text-foreground mb-6">Quantidade de Pedidos por Mês</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 88%)" />
              <XAxis dataKey="month" stroke="hsl(30, 10%, 45%)" fontSize={12} />
              <YAxis stroke="hsl(30, 10%, 45%)" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(0, 0%, 100%)', 
                  border: '1px solid hsl(40, 15%, 88%)',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [value, 'Pedidos']}
                labelFormatter={(label) => {
                  const item = monthlyData.find(m => m.month === label);
                  return item?.fullMonth || label;
                }}
              />
              <Bar dataKey="pedidos" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Purchase Summary for Suppliers */}
      <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: '900ms' }}>
        <h3 className="text-lg font-serif font-semibold text-foreground mb-6">Resumo para Compra com Fornecedores</h3>
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
            .map((item) => (
              <div 
                key={item.key}
                className="p-4 rounded-lg bg-secondary/50 border border-border"
              >
                <p className="font-medium text-foreground">{item.product}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">Tamanho: {item.size}</span>
                  <span className="text-lg font-serif font-semibold text-primary">{item.quantity} un</span>
                </div>
              </div>
            ))}
            
          {orders.filter(o => o.status === 'pending' || o.status === 'processing').length === 0 && (
            <div className="col-span-3 text-center py-8 text-muted-foreground">
              Nenhum pedido pendente de compra
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
