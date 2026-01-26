import { useState } from 'react';
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
import { Eye, Edit, Trash2, DollarSign, Package } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface OrdersTableProps {
  orders: Order[];
  filterChannel?: string;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
  onPaymentToggle?: (order: Order) => void;
}

const channelConfig = {
  shopee: { label: 'Shopee', icon: '🛒' },
  ministerio: { label: 'Ministério', icon: '⛪' },
  site: { label: 'Site', icon: '🌐' },
};

export function OrdersTable({ orders, filterChannel, onEdit, onDelete, onPaymentToggle }: OrdersTableProps) {
  const [orderToUnpay, setOrderToUnpay] = useState<Order | null>(null);
  const [orderToPay, setOrderToPay] = useState<Order | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const filteredOrders = filterChannel 
    ? orders.filter(o => o.channel === filterChannel)
    : orders;

  const handlePaymentClick = (order: Order) => {
    if (order.isPaid) {
      // If currently paid, show confirmation before unmarking
      setOrderToUnpay(order);
    } else {
      // If not paid, show confirmation before marking as paid
      setOrderToPay(order);
    }
  };

  const confirmUnpay = () => {
    if (orderToUnpay) {
      onPaymentToggle?.(orderToUnpay);
      setOrderToUnpay(null);
    }
  };

  const confirmPay = () => {
    if (orderToPay) {
      onPaymentToggle?.(orderToPay);
      setOrderToPay(null);
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
            <TableHead className="text-muted-foreground text-center">Pago</TableHead>
            <TableHead className="text-muted-foreground">Remessa</TableHead>
            <TableHead className="text-muted-foreground text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order, index) => {
            const channel = channelConfig[order.channel];
            const totalCost = order.supplierCost * order.quantity;
            const totalSale = order.salePrice * order.quantity;
            const profit = totalSale - totalCost;

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
                <TableCell className="text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-7 w-7",
                            order.isPaid 
                              ? "text-success hover:text-success hover:bg-success/10" 
                              : "text-muted-foreground hover:text-warning hover:bg-warning/10"
                          )}
                          onClick={() => handlePaymentClick(order)}
                        >
                          <DollarSign className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {order.isPaid ? 'Pago - Clique para desmarcar' : 'Não pago - Clique para marcar como pago'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  {order.shipmentId ? (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      <Package className="h-3 w-3 mr-1" />
                      Em remessa
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
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

      <AlertDialog open={!!orderToUnpay} onOpenChange={(open) => !open && setOrderToUnpay(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">Desmarcar pagamento?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desmarcar o pedido de <strong>{orderToUnpay?.customerName}</strong> ({orderToUnpay?.product} - {orderToUnpay?.size}) como não pago?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmUnpay}
              className="bg-warning hover:bg-warning/90 text-warning-foreground"
            >
              Desmarcar pagamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!orderToPay} onOpenChange={(open) => !open && setOrderToPay(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">Confirmar pagamento?</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja marcar o pedido de <strong>{orderToPay?.customerName}</strong> ({orderToPay?.product} - {orderToPay?.size}) como pago?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmPay}
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              Confirmar pagamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}