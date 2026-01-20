import { Order } from '@/types';
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
import { Eye, Edit, Trash2 } from 'lucide-react';

interface OrdersTableProps {
  orders: Order[];
  filterChannel?: string;
}

const statusConfig = {
  pending: { label: 'Pendente', className: 'bg-warning/20 text-warning border-warning/30' },
  processing: { label: 'Processando', className: 'bg-info/20 text-info border-info/30' },
  completed: { label: 'Concluído', className: 'bg-success/20 text-success border-success/30' },
  cancelled: { label: 'Cancelado', className: 'bg-destructive/20 text-destructive border-destructive/30' },
};

const channelConfig = {
  shopee: { label: 'Shopee', icon: '🛒' },
  ministerio: { label: 'Ministério', icon: '⛪' },
  site: { label: 'Site', icon: '🌐' },
};

export function OrdersTable({ orders, filterChannel }: OrdersTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const filteredOrders = filterChannel 
    ? orders.filter(o => o.channel === filterChannel)
    : orders;

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
                  <Badge className={status.className}>{status.label}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-destructive" />
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
