import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Activity, Package, Users, Truck, ShoppingCart, Shield, LogIn, LogOut, Plus, Pencil, Trash2, RefreshCw, Loader2, Filter, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useActivityLogs, ActivityLog, ActivityLogFilters } from '@/hooks/useActivityLogs';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface ActivityLogsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const entityIcons: Record<string, React.ElementType> = {
  order: Package,
  client: Users,
  supplier: Truck,
  product: ShoppingCart,
  team: Shield,
  auth: LogIn,
};

const actionIcons: Record<string, React.ElementType> = {
  create: Plus,
  update: Pencil,
  delete: Trash2,
  login: LogIn,
  logout: LogOut,
  status_change: RefreshCw,
};

const actionLabels: Record<string, string> = {
  create: 'Criou',
  update: 'Atualizou',
  delete: 'Excluiu',
  login: 'Entrou',
  logout: 'Saiu',
  status_change: 'Alterou status',
};

const entityLabels: Record<string, string> = {
  order: 'pedido',
  client: 'cliente',
  supplier: 'fornecedor',
  product: 'produto',
  team: 'membro',
  auth: 'sistema',
};

const actionColors: Record<string, string> = {
  create: 'bg-success/10 text-success',
  update: 'bg-primary/10 text-primary',
  delete: 'bg-destructive/10 text-destructive',
  login: 'bg-blue-500/10 text-blue-600',
  logout: 'bg-muted text-muted-foreground',
  status_change: 'bg-warning/10 text-warning',
};

function LogItem({ log }: { log: ActivityLog }) {
  const EntityIcon = entityIcons[log.entityType] || Activity;
  const ActionIcon = actionIcons[log.action] || Activity;
  const actionLabel = actionLabels[log.action] || log.action;
  const entityLabel = entityLabels[log.entityType] || log.entityType;
  const colorClass = actionColors[log.action] || 'bg-muted text-muted-foreground';

  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${colorClass}`}>
        <ActionIcon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">
          <span className="font-medium">{log.userName || 'Usuário'}</span>
          {' '}{actionLabel.toLowerCase()}{' '}
          {log.entityName ? (
            <>
              {entityLabel} <span className="font-medium">"{log.entityName}"</span>
            </>
          ) : (
            entityLabel
          )}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <Badge variant="outline" className="text-xs gap-1">
            <EntityIcon className="h-3 w-3" />
            {entityLabel}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {format(log.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ActivityLogsDialog({ open, onOpenChange }: ActivityLogsDialogProps) {
  const { logs, loading, filters, setFilters, refetch } = useActivityLogs();
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = filters.entityType || filters.action || filters.dateFrom || filters.dateTo;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Log de Atividades
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={showFilters ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          <DialogDescription>
            Histórico de ações realizadas no sistema
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        {showFilters && (
          <div className="border border-border rounded-lg p-4 space-y-4 bg-secondary/30">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Filtros</h4>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-7 text-xs">
                  <X className="h-3 w-3 mr-1" />
                  Limpar
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Entidade</Label>
                <Select 
                  value={filters.entityType || 'all'} 
                  onValueChange={(v) => setFilters(prev => ({ ...prev, entityType: v === 'all' ? undefined : v }))}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="order">Pedidos</SelectItem>
                    <SelectItem value="client">Clientes</SelectItem>
                    <SelectItem value="supplier">Fornecedores</SelectItem>
                    <SelectItem value="product">Produtos</SelectItem>
                    <SelectItem value="team">Equipe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Ação</Label>
                <Select 
                  value={filters.action || 'all'} 
                  onValueChange={(v) => setFilters(prev => ({ ...prev, action: v === 'all' ? undefined : v }))}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="create">Criação</SelectItem>
                    <SelectItem value="update">Atualização</SelectItem>
                    <SelectItem value="delete">Exclusão</SelectItem>
                    <SelectItem value="status_change">Mudança de Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Data início</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-8 w-full justify-start text-left font-normal text-xs",
                        !filters.dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {filters.dateFrom ? format(filters.dateFrom, "dd/MM/yy") : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => setFilters(prev => ({ ...prev, dateFrom: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Data fim</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-8 w-full justify-start text-left font-normal text-xs",
                        !filters.dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {filters.dateTo ? format(filters.dateTo, "dd/MM/yy") : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => setFilters(prev => ({ ...prev, dateTo: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        )}

        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Activity className="h-8 w-8 mb-2" />
              <p>{hasActiveFilters ? 'Nenhuma atividade encontrada com os filtros aplicados' : 'Nenhuma atividade registrada'}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {logs.map(log => (
                <LogItem key={log.id} log={log} />
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
