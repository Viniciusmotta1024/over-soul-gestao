import { useState } from 'react';
import { Package, Plus, Truck, CheckCircle, Clock, Archive, MoreHorizontal, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shipment, useShipments } from '@/hooks/useShipments';
import { Order } from '@/types';
import { AddShipmentDialog } from './AddShipmentDialog';
import { ShipmentDetailsDialog } from './ShipmentDetailsDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog';

interface ShipmentsViewProps {
  orders: Order[];
  onOrderUpdate: (order: Order) => void;
}

const statusConfig: Record<Shipment['status'], { label: string; icon: typeof Clock; color: string }> = {
  open: { label: 'Aberta', icon: Clock, color: 'bg-blue-500/10 text-blue-500' },
  ordered: { label: 'Pedida', icon: Truck, color: 'bg-yellow-500/10 text-yellow-500' },
  received: { label: 'Recebida', icon: CheckCircle, color: 'bg-green-500/10 text-green-500' },
  closed: { label: 'Fechada', icon: Archive, color: 'bg-muted text-muted-foreground' },
};

export function ShipmentsView({ orders, onOrderUpdate }: ShipmentsViewProps) {
  const { shipments, addShipment, updateShipment, deleteShipment, addOrderToShipment, removeOrderFromShipment, refetch } = useShipments();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shipmentToDelete, setShipmentToDelete] = useState<Shipment | null>(null);

  const handleAddShipment = async (data: { name: string; notes?: string }) => {
    await addShipment(data);
    setAddDialogOpen(false);
  };

  const handleViewDetails = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setDetailsDialogOpen(true);
  };

  const handleDeleteClick = (shipment: Shipment) => {
    setShipmentToDelete(shipment);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (shipmentToDelete) {
      await deleteShipment(shipmentToDelete.id);
      setDeleteDialogOpen(false);
      setShipmentToDelete(null);
    }
  };

  const handleStatusChange = async (shipment: Shipment, newStatus: Shipment['status']) => {
    await updateShipment({ ...shipment, status: newStatus });
    refetch();
  };

  const getOrdersForShipment = (shipmentId: string) => {
    return orders.filter(o => (o as any).shipmentId === shipmentId);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Remessas</h2>
          <p className="text-muted-foreground">Agrupe pedidos em remessas para reduzir custos</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Remessa
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shipments.map((shipment) => {
          const StatusIcon = statusConfig[shipment.status].icon;
          const shipmentOrders = getOrdersForShipment(shipment.id);
          
          return (
            <Card key={shipment.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{shipment.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(shipment)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </DropdownMenuItem>
                      {shipment.status === 'open' && (
                        <DropdownMenuItem onClick={() => handleStatusChange(shipment, 'ordered')}>
                          <Truck className="h-4 w-4 mr-2" />
                          Marcar como Pedida
                        </DropdownMenuItem>
                      )}
                      {shipment.status === 'ordered' && (
                        <DropdownMenuItem onClick={() => handleStatusChange(shipment, 'received')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marcar como Recebida
                        </DropdownMenuItem>
                      )}
                      {shipment.status === 'received' && (
                        <DropdownMenuItem onClick={() => handleStatusChange(shipment, 'closed')}>
                          <Archive className="h-4 w-4 mr-2" />
                          Fechar Remessa
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(shipment)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge className={statusConfig[shipment.status].color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig[shipment.status].label}
                </Badge>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Pedidos:</span>
                    <span className="ml-1 font-medium">{shipment.orderCount || 0}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Custo:</span>
                    <span className="ml-1 font-medium">{formatCurrency(shipment.totalCost)}</span>
                  </div>
                </div>

                {shipment.notes && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{shipment.notes}</p>
                )}

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleViewDetails(shipment)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Pedidos
                </Button>
              </CardContent>
            </Card>
          );
        })}

        {shipments.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma remessa</h3>
              <p className="text-muted-foreground text-center mb-4">
                Crie uma remessa para agrupar pedidos e reduzir custos de envio
              </p>
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Remessa
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <AddShipmentDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddShipment}
      />

      {selectedShipment && (
        <ShipmentDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          shipment={selectedShipment}
          orders={orders}
          onAddOrder={addOrderToShipment}
          onRemoveOrder={removeOrderFromShipment}
          onOrderUpdate={onOrderUpdate}
          onShipmentUpdate={(s) => { updateShipment(s); refetch(); }}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Excluir remessa"
        description={`Tem certeza que deseja excluir a remessa "${shipmentToDelete?.name}"? Os pedidos não serão excluídos, apenas desvinculados.`}
      />
    </div>
  );
}
