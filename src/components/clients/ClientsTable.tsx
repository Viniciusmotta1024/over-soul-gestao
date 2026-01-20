import { Client } from '@/types';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Mail, Phone } from 'lucide-react';

interface ClientsTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export function ClientsTable({ clients, onEdit, onDelete }: ClientsTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="glass rounded-xl overflow-hidden animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">Cliente</TableHead>
            <TableHead className="text-muted-foreground">Contato</TableHead>
            <TableHead className="text-muted-foreground">Cidade/Estado</TableHead>
            <TableHead className="text-muted-foreground text-center">Pedidos</TableHead>
            <TableHead className="text-muted-foreground text-right">Total Gasto</TableHead>
            <TableHead className="text-muted-foreground text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client, index) => (
            <TableRow 
              key={client.id} 
              className={cn(
                "border-border hover:bg-secondary/30 animate-fade-in"
              )}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <TableCell>
                <div>
                  <p className="font-medium text-foreground">{client.name}</p>
                  {client.address && (
                    <p className="text-sm text-muted-foreground">{client.address}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {client.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {client.phone}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {client.city && client.state ? `${client.city}, ${client.state}` : '-'}
              </TableCell>
              <TableCell className="text-center">
                <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {client.orders}
                </span>
              </TableCell>
              <TableCell className="text-right font-serif font-semibold text-primary">
                {formatCurrency(client.totalSpent)}
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
                    onClick={() => onEdit(client)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(client)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
