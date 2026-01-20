import { cn } from '@/lib/utils';

interface ChannelCardProps {
  name: string;
  icon: string;
  orders: number;
  revenue: number;
  onClick?: () => void;
  delay?: number;
}

export function ChannelCard({ name, icon, orders, revenue, onClick, delay = 0 }: ChannelCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <button 
      onClick={onClick}
      className={cn(
        "glass glass-hover rounded-xl p-6 text-left w-full animate-fade-in",
        "group cursor-pointer"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-2xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {orders} pedidos
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary">{formatCurrency(revenue)}</p>
          <p className="text-xs text-muted-foreground">faturamento</p>
        </div>
      </div>
    </button>
  );
}
