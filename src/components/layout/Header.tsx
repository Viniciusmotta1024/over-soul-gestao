import { Bell, Search, User, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UnpaidShipmentAlert } from '@/hooks/useUnpaidShipmentAlerts';

interface HeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  newOrdersCount?: number;
  onNotificationsClick?: () => void;
  unpaidShipmentAlerts?: UnpaidShipmentAlert[];
  onAlertClick?: (shipmentId: string) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export function Header({ 
  title, 
  subtitle, 
  children, 
  newOrdersCount = 0, 
  onNotificationsClick,
  unpaidShipmentAlerts = [],
  onAlertClick 
}: HeaderProps) {
  const totalNotifications = newOrdersCount + unpaidShipmentAlerts.length;
  
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-4 md:px-8">
      <div className="pl-12 md:pl-0">
        <h1 className="text-xl md:text-2xl font-serif font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-xs md:text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Search - hidden on mobile */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar pedidos..."
            className="w-64 bg-secondary/50 border-border pl-10 focus:border-primary focus:ring-primary"
          />
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-5 w-5" />
              {totalNotifications > 0 && (
                <span className={`absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-primary-foreground ${unpaidShipmentAlerts.length > 0 ? 'bg-destructive' : 'bg-primary'}`}>
                  {totalNotifications > 9 ? '9+' : totalNotifications}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            {/* Unpaid shipment alerts - these are persistent */}
            {unpaidShipmentAlerts.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-xs font-semibold text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Alertas de Pagamento
                </div>
                {unpaidShipmentAlerts.map((alert) => (
                  <DropdownMenuItem 
                    key={alert.shipmentId}
                    onClick={() => onAlertClick?.(alert.shipmentId)}
                    className="flex flex-col items-start gap-0.5 cursor-pointer"
                  >
                    <span className="text-sm font-medium text-destructive">
                      ⚠️ Remessa "{alert.shipmentName}"
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {alert.unpaidOrdersCount} pedido(s) não pago(s) • {formatCurrency(alert.totalUnpaidValue)}
                    </span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}

            {/* New orders notification */}
            {newOrdersCount > 0 && (
              <DropdownMenuItem onClick={onNotificationsClick}>
                <span className="text-sm">
                  🛒 {newOrdersCount} novo(s) pedido(s)
                </span>
              </DropdownMenuItem>
            )}
            
            {totalNotifications === 0 && (
              <DropdownMenuItem disabled>
                <span className="text-sm text-muted-foreground">
                  Nenhuma notificação
                </span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User - hidden on mobile */}
        <Button variant="ghost" size="icon" className="rounded-full hidden md:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
            <User className="h-5 w-5 text-primary" />
          </div>
        </Button>

        {children}
      </div>
    </header>
  );
}
