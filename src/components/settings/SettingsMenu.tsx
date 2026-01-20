import { useState, useRef, useEffect } from 'react';
import { Settings, Activity, KeyRound, UsersRound } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsMenuProps {
  onActivityLogsClick: () => void;
  onPasswordRecoveryClick: () => void;
  onTeamClick: () => void;
  isAdmin?: boolean;
}

export function SettingsMenu({ onActivityLogsClick, onPasswordRecoveryClick, onTeamClick, isAdmin }: SettingsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleItemClick = (callback: () => void) => {
    setOpen(false);
    callback();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
      >
        <Settings className="h-5 w-5" />
        Configurações
      </button>

      {open && (
        <div 
          className={cn(
            "absolute bottom-full left-0 mb-2 w-full",
            "bg-card border border-border rounded-lg shadow-lg",
            "animate-fade-in overflow-hidden z-50"
          )}
        >
          {isAdmin && (
            <>
              <button
                onClick={() => handleItemClick(onTeamClick)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <UsersRound className="h-4 w-4" />
                Equipe
              </button>
              <button
                onClick={() => handleItemClick(onActivityLogsClick)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <Activity className="h-4 w-4" />
                Log de Atividades
              </button>
            </>
          )}
          <button
            onClick={() => handleItemClick(onPasswordRecoveryClick)}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <KeyRound className="h-4 w-4" />
            Recuperar Senha
          </button>
        </div>
      )}
    </div>
  );
}
