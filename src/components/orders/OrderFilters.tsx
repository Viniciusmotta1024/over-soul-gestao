import { useState } from 'react';
import { Client } from '@/types';
import { Shipment } from '@/hooks/useShipments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, X, Filter, DollarSign, Package } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export interface OrderFiltersState {
  dateFrom?: Date;
  dateTo?: Date;
  status?: string;
  channel?: string;
  clientId?: string;
  paymentStatus?: 'paid' | 'unpaid';
  shipmentId?: string;
}

interface OrderFiltersProps {
  clients: Client[];
  shipments: Shipment[];
  filters: OrderFiltersState;
  onFiltersChange: (filters: OrderFiltersState) => void;
  onClear: () => void;
}

export function OrderFilters({ clients, shipments, filters, onFiltersChange, onClear }: OrderFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  const updateFilter = (key: keyof OrderFiltersState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? undefined : value,
    });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("gap-2", hasActiveFilters && "border-primary text-primary")}>
            <Filter className="h-4 w-4" />
            Filtros
            {hasActiveFilters && (
              <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {Object.values(filters).filter(v => v !== undefined && v !== '').length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="font-medium text-foreground">Filtrar Pedidos</div>
            
            {/* Date From */}
            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? format(filters.dateFrom, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => updateFilter('dateFrom', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label>Data Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateTo ? format(filters.dateTo, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => updateFilter('dateTo', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status || 'all'} onValueChange={(v) => updateFilter('status', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="processing">Processando</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Channel */}
            <div className="space-y-2">
              <Label>Canal de Venda</Label>
              <Select value={filters.channel || 'all'} onValueChange={(v) => updateFilter('channel', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="shopee">🛒 Shopee</SelectItem>
                  <SelectItem value="ministerio">⛪ Vista o seu Ministério</SelectItem>
                  <SelectItem value="site">🌐 Site Próprio</SelectItem>
                </SelectContent>
              </Select>
            </div>

{/* Client */}
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select value={filters.clientId || 'all'} onValueChange={(v) => updateFilter('clientId', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Status */}
            <div className="space-y-2">
              <Label>Status de Pagamento</Label>
              <Select value={filters.paymentStatus || 'all'} onValueChange={(v) => updateFilter('paymentStatus', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="paid">💰 Pago</SelectItem>
                  <SelectItem value="unpaid">⏳ Não Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Shipment Filter */}
            <div className="space-y-2">
              <Label>Remessa</Label>
              <Select value={filters.shipmentId || 'all'} onValueChange={(v) => updateFilter('shipmentId', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {shipments.map((shipment) => (
                    <SelectItem key={shipment.id} value={shipment.id}>
                      📦 {shipment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button variant="ghost" className="w-full gap-2" onClick={onClear}>
                <X className="h-4 w-4" />
                Limpar Filtros
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Active filter badges */}
      {filters.status && (
        <div className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-md text-sm">
          <span>Status: {filters.status === 'pending' ? 'Pendente' : filters.status === 'processing' ? 'Processando' : filters.status === 'completed' ? 'Concluído' : 'Cancelado'}</span>
          <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => updateFilter('status', undefined)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {filters.channel && (
        <div className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-md text-sm">
          <span>Canal: {filters.channel === 'shopee' ? 'Shopee' : filters.channel === 'ministerio' ? 'Ministério' : 'Site'}</span>
          <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => updateFilter('channel', undefined)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {filters.dateFrom && (
        <div className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-md text-sm">
          <span>De: {format(filters.dateFrom, "dd/MM/yyyy", { locale: ptBR })}</span>
          <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => updateFilter('dateFrom', undefined)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

{filters.dateTo && (
        <div className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-md text-sm">
          <span>Até: {format(filters.dateTo, "dd/MM/yyyy", { locale: ptBR })}</span>
          <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => updateFilter('dateTo', undefined)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {filters.paymentStatus && (
        <div className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-md text-sm">
          <DollarSign className="h-3 w-3" />
          <span>{filters.paymentStatus === 'paid' ? 'Pago' : 'Não Pago'}</span>
          <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => updateFilter('paymentStatus', undefined)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {filters.shipmentId && (
        <div className="flex items-center gap-1 px-2 py-1 bg-destructive/10 text-destructive rounded-md text-sm">
          <Package className="h-3 w-3" />
          <span>Remessa: {shipments.find(s => s.id === filters.shipmentId)?.name || 'Desconhecida'}</span>
          <Button variant="ghost" size="icon" className="h-4 w-4 hover:bg-destructive/20" onClick={() => updateFilter('shipmentId', undefined)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
