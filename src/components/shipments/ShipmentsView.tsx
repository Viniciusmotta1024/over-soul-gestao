import { useState, useMemo } from 'react';
import { Package, Plus, Truck, CheckCircle, Clock, Archive, Trash2, Eye, AlertTriangle, TrendingUp, Shirt, Layers, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shipment, useShipments } from '@/hooks/useShipments';
import { Order } from '@/types';
import { AddShipmentDialog } from './AddShipmentDialog';
import { ShipmentDetailsDialog } from './ShipmentDetailsDialog';
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog';
import { DtfShipmentsView } from './DtfShipmentsView';
import { useShipmentCostCalculator } from '@/hooks/useShipmentCostCalculator';
import { differenceInDays } from 'date-fns';

interface ShipmentsViewProps {
  orders: Order[];
  onOrderUpdate: (order: Order) => void;
  onRefreshOrders: () => void;
  hasUnpaidOrders?: (shipmentId: string) => boolean;
  getUnpaidCount?: (shipmentId: string) => number;
}

const statusConfig: Record<Shipment['status'], { label: string; icon: typeof Clock; color: string }> = {
  open: { label: 'Aberta', icon: Clock, color: 'bg-blue-500/10 text-blue-500' },
  ordered: { label: 'Pedida', icon: Truck, color: 'bg-yellow-500/10 text-yellow-500' },
  received: { label: 'Recebida', icon: CheckCircle, color: 'bg-green-500/10 text-green-500' },
  closed: { label: 'Fechada', icon: Archive, color: 'bg-muted text-muted-foreground' },
};

export function ShipmentsView({ orders, onOrderUpdate, onRefreshOrders, hasUnpaidOrders, getUnpaidCount }: ShipmentsViewProps) {
  const { shipments, addShipment, updateShipment, deleteShipment, addOrderToShipment, removeOrderFromShipment, refetch } = useShipments();
  const { calculateShipmentCost, formatCurrency } = useShipmentCostCalculator();
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

  // Calculate shipment financial summary
  const getShipmentFinancials = (shipmentOrders: Order[]) => {
    const cost = calculateShipmentCost(shipmentOrders);
    const revenue = shipmentOrders.reduce((sum, o) => sum + o.salePrice * o.quantity, 0);
    const profit = revenue - cost.totalCost;
    return { cost, revenue, profit };
  };

  // Check for old open shipments (more than 3 days)
  const ALERT_THRESHOLD_DAYS = 3;
  const oldOpenShipments = useMemo(() => {
    return shipments.filter(s => {
      if (s.status !== 'open') return false;
      const daysOpen = differenceInDays(new Date(), s.createdAt);
      return daysOpen >= ALERT_THRESHOLD_DAYS;
    });
  }, [shipments]);

  const getDaysOpen = (shipment: Shipment) => {
    return differenceInDays(new Date(), shipment.createdAt);
  };

  const isOldShipment = (shipment: Shipment) => {
    return shipment.status === 'open' && getDaysOpen(shipment) >= ALERT_THRESHOLD_DAYS;
  };

return (
    <div className="space-y-6">
      {/* Alert for old open shipments */}
      {oldOpenShipments.length > 0 && (
        <Alert variant="destructive" className="border-warning bg-warning/10">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertTitle className="text-warning">Remessas aguardando envio</AlertTitle>
          <AlertDescription className="text-warning/80">
            {oldOpenShipments.length === 1 
              ? `A remessa "${oldOpenShipments[0].name}" está aberta há ${getDaysOpen(oldOpenShipments[0])} dias. Considere enviá-la para reduzir custos.`
              : `${oldOpenShipments.length} remessas estão abertas há mais de ${ALERT_THRESHOLD_DAYS} dias: ${oldOpenShipments.map(s => `"${s.name}" (${getDaysOpen(s)} dias)`).join(', ')}`
            }
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Remessas</h2>
          <p className="text-muted-foreground">Gerencie remessas de camisas e DTF separadamente</p>
        </div>
      </div>

      <Tabs defaultValue="shirts" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="shirts" className="flex items-center gap-2">
            <Shirt className="h-4 w-4" />
            Camisas
          </TabsTrigger>
          <TabsTrigger value="dtf" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            DTF
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shirts" className="space-y-4">
          <div className="flex items-center justify-end">
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Remessa de Camisas
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shipments.map((shipment) => {
          const StatusIcon = statusConfig[shipment.status].icon;
          const shipmentOrders = getOrdersForShipment(shipment.id);
          const financials = getShipmentFinancials(shipmentOrders);
          const shipmentHasUnpaid = hasUnpaidOrders?.(shipment.id) || false;
          const unpaidCount = getUnpaidCount?.(shipment.id) || 0;
          
          return (
            <Card key={shipment.id} className={`relative ${shipmentHasUnpaid ? 'border-destructive border-2' : ''}`}>
              {/* Unpaid orders indicator badge */}
              {shipmentHasUnpaid && (
                <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 bg-destructive text-destructive-foreground rounded-full text-xs font-medium shadow-lg">
                  <DollarSign className="h-3 w-3" />
                  {unpaidCount} não pago{unpaidCount > 1 ? 's' : ''}
                </div>
              )}
              
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Package className={`h-5 w-5 ${shipmentHasUnpaid ? 'text-destructive' : 'text-primary'}`} />
                    <CardTitle className="text-lg">{shipment.name}</CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteClick(shipment)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Unpaid warning for ordered shipments */}
                {shipmentHasUnpaid && shipment.status === 'ordered' && (
                  <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-md px-2 py-1">
                    <DollarSign className="h-3 w-3" />
                    <span>{unpaidCount} pedido{unpaidCount > 1 ? 's' : ''} aguardando pagamento</span>
                  </div>
                )}
                
                {isOldShipment(shipment) && (
                  <div className="flex items-center gap-2 text-warning text-sm bg-warning/10 rounded-md px-2 py-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Aberta há {getDaysOpen(shipment)} dias</span>
                  </div>
                )}
                
                <Badge className={statusConfig[shipment.status].color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig[shipment.status].label}
                </Badge>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Pedidos:</span>
                    <span className="ml-1 font-medium">{shipmentOrders.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Custo Real:</span>
                    <span className="ml-1 font-medium">{formatCurrency(financials.cost.totalCost)}</span>
                  </div>
                </div>

                {/* Financial summary */}
                {shipmentOrders.length > 0 && (
                  <div className="p-2 rounded-md bg-muted/50 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Receita:</span>
                      <span>{formatCurrency(financials.revenue)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Lucro Estimado:
                      </span>
                      <span className={financials.profit >= 0 ? 'text-success' : 'text-destructive'}>
                        {formatCurrency(financials.profit)}
                      </span>
                    </div>
                  </div>
                )}

                {shipment.notes && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{shipment.notes}</p>
                )}

                {/* Action buttons based on status */}
                <div className="flex flex-col gap-2 pt-2">
                  {shipment.status === 'open' && (
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleStatusChange(shipment, 'ordered')}
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Marcar como Pedida
                    </Button>
                  )}
                  {shipment.status === 'ordered' && (
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full bg-success hover:bg-success/90"
                      onClick={() => handleStatusChange(shipment, 'received')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como Recebida
                    </Button>
                  )}
                  {shipment.status === 'received' && (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleStatusChange(shipment, 'closed')}
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Fechar Remessa
                    </Button>
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
                </div>
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
        </TabsContent>

        <TabsContent value="dtf">
          <DtfShipmentsView />
        </TabsContent>
      </Tabs>

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
          onRefreshOrders={onRefreshOrders}
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
