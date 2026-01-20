import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  ShoppingBag, 
  Church, 
  BarChart3,
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Pedidos', icon: Package },
  { id: 'suppliers', label: 'Fornecedores', icon: Truck },
  { id: 'shopee', label: 'Shopee', icon: ShoppingBag },
  { id: 'ministerio', label: 'Vista o seu Ministério', icon: Church },
  { id: 'reports', label: 'Relatórios', icon: BarChart3 },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 glass border-r border-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b border-border px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary glow">
            <span className="text-xl font-bold text-primary-foreground">O</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">OverSoul</h1>
            <p className="text-xs text-muted-foreground">Gestão de Pedidos</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                  "hover:bg-secondary/80",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:text-foreground",
                  "animate-fade-in"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="border-t border-border p-4">
          <button className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary/80 hover:text-foreground">
            <Settings className="h-5 w-5" />
            Configurações
          </button>
        </div>
      </div>
    </aside>
  );
}
