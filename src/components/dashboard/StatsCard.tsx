import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
  delay?: number;
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  variant = 'default',
  delay = 0 
}: StatsCardProps) {
  return (
    <div 
      className={cn(
        "glass glass-hover rounded-xl p-6 animate-fade-in",
        variant === 'primary' && "border-primary/30",
        variant === 'success' && "border-success/30",
        variant === 'warning' && "border-warning/30"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-serif font-semibold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% vs mês anterior
            </p>
          )}
        </div>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          variant === 'default' && "bg-secondary",
          variant === 'primary' && "bg-primary/10",
          variant === 'success' && "bg-success/10",
          variant === 'warning' && "bg-warning/10"
        )}>
          <Icon className={cn(
            "h-6 w-6",
            variant === 'default' && "text-muted-foreground",
            variant === 'primary' && "text-primary",
            variant === 'success' && "text-success",
            variant === 'warning' && "text-warning"
          )} />
        </div>
      </div>
    </div>
  );
}
