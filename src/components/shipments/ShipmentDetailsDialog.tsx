import { useState } from 'react';
import { Plus, Minus, DollarSign, Package, Calculator, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Shipment } from '@/hooks/useShipments';
import { Order } from '@/types';
import { useShipmentCostCalculator } from '@/hooks/useShipmentCostCalculator';

interface ShipmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipment: Shipment;
  orders: Order[];
  onAddOrder: (orderId: string, shipmentId: string) => Promise<void>;
  onRemoveOrder: (orderId: string, shipmentId?: string) => Promise<void>;
  onOrderUpdate: (order: Order) => void;
  onShipmentUpdate: (shipment: Shipment) => void;
  onRefreshOrders: () => void;
}

export function ShipmentDetailsDialog({
  open,
  onOpenChange,
  shipment,
  orders,
  onAddOrder,
  onRemoveOrder,
  onOrderUpdate,
  onShipmentUpdate,
  onRefreshOrders,
}: ShipmentDetailsDialogProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { calculateShipmentCost, formatCurrency, SHIRTS_PER_METER } = useShipmentCostCalculator();

  // Orders in this shipment
  const shipmentOrders = orders.filter(o => (o as any).shipmentId === shipment.id);
  
  // Calculate real shipment cost
  const costBreakdown = calculateShipmentCost(shipmentOrders);
  
  // Available orders (not in any shipment, pending status)
  const availableOrders = orders.filter(
    o => !(o as any).shipmentId && o.status === 'pending'
  );

  const handleAddSelected = async () => {
    setLoading(true);
    try {
      for (const orderId of selectedOrders) {
        await onAddOrder(orderId, shipment.id);
      }
      setSelectedOrders([]);
      
      // Recalculate cost with new orders
      const updatedOrders = [...shipmentOrders, ...orders.filter(o => selectedOrders.includes(o.id))];
      const newCost = calculateShipmentCost(updatedOrders);
      
      // Update total cost
      onShipmentUpdate({ ...shipment, totalCost: newCost.totalCost });
      
      // Refresh orders to reflect changes
      onRefreshOrders();
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveOrder = async (orderId: string) => {
    await onRemoveOrder(orderId, shipment.id);
    
    // Recalculate cost without removed order
    const remainingOrders = shipmentOrders.filter(o => o.id !== orderId);
    const newCost = calculateShipmentCost(remainingOrders);
    
    onShipmentUpdate({ 
      ...shipment, 
      totalCost: newCost.totalCost
    });
    
    // Refresh orders to reflect changes
    onRefreshOrders();
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {shipment.name}
          </DialogTitle>
        </DialogHeader>

        {/* Cost Breakdown Card */}
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Custo Real de Fabricação
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Calcula o custo considerando que 1 metro de DTF produz {SHIRTS_PER_METER} camisas em média.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block">Total de Camisas</span>
                <span className="text-lg font-semibold">{costBreakdown.totalShirts}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Metros DTF</span>
                <span className="text-lg font-semibold">{costBreakdown.dtfMeters.toFixed(1)}m</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Custo por Camisa</span>
                <span className="text-lg font-semibold text-primary">{formatCurrency(costBreakdown.costPerShirt)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Custo Total</span>
                <span className="text-lg font-semibold text-primary">{formatCurrency(costBreakdown.totalCost)}</span>
              </div>
            </div>
            
            {/* Detailed breakdown */}
            {shipmentOrders.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Camisas ({costBreakdown.totalShirts}x)</span>
                  <span>{formatCurrency(costBreakdown.shirtsCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete Camisas</span>
                  <span>{formatCurrency(costBreakdown.shirtsFreight)}</span>
                </div>
                <div className="flex justify-between">
                  <span>DTF ({costBreakdown.dtfMeters.toFixed(1)}m)</span>
                  <span>{formatCurrency(costBreakdown.dtfCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete DTF</span>
                  <span>{formatCurrency(costBreakdown.dtfFreight)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4 mb-4">
          <Badge variant="outline" className="text-lg py-1 px-3">
            <DollarSign className="h-4 w-4 mr-1" />
            Custo: {formatCurrency(costBreakdown.totalCost)}
          </Badge>
          <Badge variant="secondary" className="text-lg py-1 px-3">
            {shipmentOrders.length} pedido(s)
          </Badge>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="current" className="flex-1">
              Pedidos na Remessa ({shipmentOrders.length})
            </TabsTrigger>
            <TabsTrigger value="add" className="flex-1">
              Adicionar Pedidos ({availableOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-4">
            {shipmentOrders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead>Custo Unit.</TableHead>
                    <TableHead>Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipmentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.customerName}</TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell>{order.size}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{formatCurrency(order.supplierCost)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveOrder(order.id)}
                          disabled={shipment.status !== 'open'}
                        >
                          <Minus className="h-4 w-4 mr-1" />
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum pedido nesta remessa. Adicione pedidos na aba "Adicionar Pedidos".
              </div>
            )}
          </TabsContent>

          <TabsContent value="add" className="mt-4">
            {shipment.status !== 'open' ? (
              <div className="text-center py-8 text-muted-foreground">
                Esta remessa não está aberta. Apenas remessas abertas podem receber novos pedidos.
              </div>
            ) : availableOrders.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedOrders.length === availableOrders.length && availableOrders.length > 0}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedOrders(availableOrders.map(o => o.id));
                            } else {
                              setSelectedOrders([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>Qtd</TableHead>
                      <TableHead>Custo Unit.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availableOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedOrders.includes(order.id)}
                            onCheckedChange={() => toggleOrderSelection(order.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{order.customerName}</TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell>{order.size}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{formatCurrency(order.supplierCost)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {selectedOrders.length > 0 && (
                  <div className="flex justify-end mt-4">
                    <Button onClick={handleAddSelected} disabled={loading}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar {selectedOrders.length} pedido(s)
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum pedido pendente disponível para adicionar.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
