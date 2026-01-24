import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  ShoppingBag, 
  Church, 
  BarChart3,
  Users,
  ShoppingCart,
  Calculator,
  Menu,
  X,
  PackageCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SettingsMenu } from '@/components/settings/SettingsMenu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  newOrdersCount?: number;
  onActivityLogsClick: () => void;
  onPasswordRecoveryClick: () => void;
  onTeamClick: () => void;
  isAdmin?: boolean;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Pedidos', icon: Package },
  { id: 'shipments', label: 'Remessas', icon: PackageCheck },
  { id: 'products', label: 'Produtos', icon: ShoppingCart },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'suppliers', label: 'Fornecedores', icon: Truck },
  { id: 'pricing', label: 'Precificação', icon: Calculator },
  { id: 'shopee', label: 'Shopee', icon: ShoppingBag },
  { id: 'ministerio', label: 'Vista o seu Ministério', icon: Church },
  { id: 'reports', label: 'Relatórios', icon: BarChart3 },
];

function SidebarContent({ 
  activeTab, 
  onTabChange, 
  newOrdersCount = 0, 
  onActivityLogsClick, 
  onPasswordRecoveryClick, 
  onTeamClick, 
  isAdmin = false,
  onItemClick
}: SidebarProps & { onItemClick?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-border px-6">
        <h1 className="text-2xl font-serif font-semibold tracking-wide text-foreground">
          OVERSOUL
        </h1>
      </div>
      
      <p className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Gestão de Pedidos
      </p>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const showBadge = item.id === 'orders' && newOrdersCount > 0;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                onItemClick?.();
              }}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon className="h-5 w-5" />
              {item.label}
              {showBadge && (
                <Badge 
                  variant="destructive" 
                  className="ml-auto h-5 min-w-5 px-1.5 text-[10px]"
                >
                  {newOrdersCount}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="border-t border-border p-3">
        <SettingsMenu 
          onActivityLogsClick={() => {
            onActivityLogsClick();
            onItemClick?.();
          }}
          onPasswordRecoveryClick={() => {
            onPasswordRecoveryClick();
            onItemClick?.();
          }}
          onTeamClick={() => {
            onTeamClick();
            onItemClick?.();
          }}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}

export function Sidebar(props: SidebarProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="fixed left-4 top-5 z-50 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-card">
          <SidebarContent {...props} onItemClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border hidden md:block">
      <SidebarContent {...props} />
    </aside>
  );
}
