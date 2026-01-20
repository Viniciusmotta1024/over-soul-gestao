import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  ShoppingBag, 
  Church, 
  BarChart3,
  Settings,
  Users
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Pedidos', icon: Package },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'suppliers', label: 'Fornecedores', icon: Truck },
  { id: 'shopee', label: 'Shopee', icon: ShoppingBag },
  { id: 'ministerio', label: 'Vista o seu Ministério', icon: Church },
  { id: 'reports', label: 'Relatórios', icon: BarChart3 },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border">
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
        <nav className="flex-1 space-y-1 px-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
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
              </button>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="border-t border-border p-3">
          <button className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground">
            <Settings className="h-5 w-5" />
            Configurações
          </button>
        </div>
      </div>
    </aside>
  );
}
