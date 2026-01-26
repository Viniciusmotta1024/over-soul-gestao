import { Order } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DollarSign, CheckCircle, FlaskConical } from 'lucide-react';

interface RecentOrdersProps {
  orders: Order[];
}

const channelConfig = {
  shopee: { label: 'Shopee', icon: '🛒' },
  ministerio: { label: 'Ministério', icon: '⛪' },
  site: { label: 'Site', icon: '🌐' },
};

export function RecentOrders({ orders }: RecentOrdersProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-serif font-semibold text-foreground">Pedidos Recentes</h3>
        <button className="text-sm text-primary hover:underline">Ver todos</button>
      </div>

      <div className="space-y-3">
        {orders.slice(0, 5).map((order, index) => {
          const channel = channelConfig[order.channel];
          const profit = order.isInternalTest ? 0 : (order.salePrice - order.supplierCost) * order.quantity;

          return (
            <div
              key={order.id}
              className={cn(
                "flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors animate-fade-in"
              )}
              style={{ animationDelay: `${400 + index * 50}ms` }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card border border-border text-lg">
                {channel.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate flex items-center gap-2">
                  {order.customerName}
                  {order.isInternalTest && (
                    <FlaskConical className="h-3 w-3 text-warning" />
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.product} • Tam. {order.size} • {order.quantity}un
                </p>
              </div>

              <div className="text-right">
                <p className="font-serif font-semibold text-foreground">{formatCurrency(order.salePrice * order.quantity)}</p>
                {!order.isInternalTest && (
                  <p className="text-xs text-success">+{formatCurrency(profit)} lucro</p>
                )}
                {order.isInternalTest && (
                  <p className="text-xs text-warning">Teste Interno</p>
                )}
              </div>

              <Badge 
                className={cn(
                  "ml-2",
                  order.isPaid 
                    ? "bg-success/10 text-success border-success/30" 
                    : "bg-warning/10 text-warning border-warning/30"
                )}
              >
                {order.isPaid ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Pago
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Não Pago
                  </span>
                )}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
