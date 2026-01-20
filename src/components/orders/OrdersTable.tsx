import { Order, Client, Supplier } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface OrdersTableProps {
  orders: Order[];
  filterChannel?: string;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
  onStatusChange?: (order: Order, newStatus: Order['status']) => void;
}

const statusConfig = {
  pending: { label: 'Pendente', className: 'bg-warning/10 text-warning border-warning/30' },
  processing: { label: 'Processando', className: 'bg-info/10 text-info border-info/30' },
  completed: { label: 'Concluído', className: 'bg-success/10 text-success border-success/30' },
  cancelled: { label: 'Cancelado', className: 'bg-destructive/10 text-destructive border-destructive/30' },
};

const statusOrder: Order['status'][] = ['pending', 'processing', 'completed'];

const channelConfig = {
  shopee: { label: 'Shopee', icon: '🛒' },
  ministerio: { label: 'Ministério', icon: '⛪' },
  site: { label: 'Site', icon: '🌐' },
};

export function OrdersTable({ orders, filterChannel, onEdit, onDelete, onStatusChange }: OrdersTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const filteredOrders = filterChannel 
    ? orders.filter(o => o.channel === filterChannel)
    : orders;

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    if (currentStatus === 'cancelled') return 'pending';
    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex < statusOrder.length - 1) {
      return statusOrder[currentIndex + 1];
    }
    return null;
  };

  const getPreviousStatus = (currentStatus: Order['status']): Order['status'] | null => {
    if (currentStatus === 'cancelled') return null;
    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex > 0) {
      return statusOrder[currentIndex - 1];
    }
    return null;
  };

  const handleAdvanceStatus = (order: Order) => {
    const nextStatus = getNextStatus(order.status);
    if (nextStatus && onStatusChange) {
      onStatusChange(order, nextStatus);
    }
  };

  const handleRegressStatus = (order: Order) => {
    const prevStatus = getPreviousStatus(order.status);
    if (prevStatus && onStatusChange) {
      onStatusChange(order, prevStatus);
    }
  };

  const handleCancelOrder = (order: Order) => {
    if (onStatusChange && order.status !== 'cancelled') {
      onStatusChange(order, 'cancelled');
    }
  };

  const handleCompleteOrder = (order: Order) => {
    if (onStatusChange && order.status !== 'completed') {
      onStatusChange(order, 'completed');
    }
  };

  return (
    <div className="glass rounded-xl overflow-hidden animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">Canal</TableHead>
            <TableHead className="text-muted-foreground">Cliente</TableHead>
            <TableHead className="text-muted-foreground">Produto</TableHead>
            <TableHead className="text-muted-foreground">Tamanho</TableHead>
            <TableHead className="text-muted-foreground text-center">Qtd</TableHead>
            <TableHead className="text-muted-foreground text-right">Custo</TableHead>
            <TableHead className="text-muted-foreground text-right">Venda</TableHead>
            <TableHead className="text-muted-foreground text-right">Lucro</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order, index) => {
            const status = statusConfig[order.status];
            const channel = channelConfig[order.channel];
            const totalCost = order.supplierCost * order.quantity;
            const totalSale = order.salePrice * order.quantity;
            const profit = totalSale - totalCost;

            const canAdvance = getNextStatus(order.status) !== null;
            const canRegress = getPreviousStatus(order.status) !== null;

            return (
              <TableRow 
                key={order.id} 
                className={cn(
                  "border-border hover:bg-secondary/30 animate-fade-in"
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{channel.icon}</span>
                    <span className="text-sm text-muted-foreground">{channel.label}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">{order.customerName}</TableCell>
                <TableCell className="text-muted-foreground">{order.product}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-secondary/50">
                    {order.size}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-medium">{order.quantity}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatCurrency(totalCost)}
                </TableCell>
                <TableCell className="text-right font-medium text-foreground">
                  {formatCurrency(totalSale)}
                </TableCell>
                <TableCell className="text-right font-medium text-success">
                  +{formatCurrency(profit)}
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <div className="flex items-center gap-1">
                      {onStatusChange && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleRegressStatus(order)}
                              disabled={!canRegress}
                            >
                              <ChevronLeft className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {canRegress ? `Voltar para ${statusConfig[getPreviousStatus(order.status)!].label}` : 'Não é possível retroceder'}
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      <Badge className={cn(status.className, "min-w-[90px] justify-center")}>
                        {status.label}
                      </Badge>
                      
                      {onStatusChange && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleAdvanceStatus(order)}
                              disabled={!canAdvance}
                            >
                              <ChevronRight className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {canAdvance ? `Avançar para ${statusConfig[getNextStatus(order.status)!].label}` : 'Pedido já concluído'}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    {onStatusChange && order.status !== 'completed' && order.status !== 'cancelled' && (
                      <>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                                onClick={() => handleCompleteOrder(order)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Concluir pedido</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleCancelOrder(order)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Cancelar pedido</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(order)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(order)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
