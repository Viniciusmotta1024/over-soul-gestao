import { Bell, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  newOrdersCount?: number;
  onNotificationsClick?: () => void;
}

export function Header({ title, subtitle, children, newOrdersCount = 0, onNotificationsClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-8">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
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
              {newOrdersCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {newOrdersCount > 9 ? '9+' : newOrdersCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {newOrdersCount > 0 ? (
              <DropdownMenuItem onClick={onNotificationsClick}>
                <span className="text-sm">
                  🛒 {newOrdersCount} novo(s) pedido(s)
                </span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem disabled>
                <span className="text-sm text-muted-foreground">
                  Nenhuma notificação
                </span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
            <User className="h-5 w-5 text-primary" />
          </div>
        </Button>

        {children}
      </div>
    </header>
  );
}
