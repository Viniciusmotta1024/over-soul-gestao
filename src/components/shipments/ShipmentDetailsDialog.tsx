import { useState } from 'react';
import { Plus, Minus, DollarSign, Package } from 'lucide-react';
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
import { Shipment } from '@/hooks/useShipments';
import { Order } from '@/types';

interface ShipmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipment: Shipment;
  orders: Order[];
  onAddOrder: (orderId: string, shipmentId: string) => Promise<void>;
  onRemoveOrder: (orderId: string) => Promise<void>;
  onOrderUpdate: (order: Order) => void;
  onShipmentUpdate: (shipment: Shipment) => void;
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
}: ShipmentDetailsDialogProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Orders in this shipment
  const shipmentOrders = orders.filter(o => (o as any).shipmentId === shipment.id);
  
  // Available orders (not in any shipment, pending status)
  const availableOrders = orders.filter(
    o => !(o as any).shipmentId && o.status === 'pending'
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleAddSelected = async () => {
    setLoading(true);
    try {
      for (const orderId of selectedOrders) {
        await onAddOrder(orderId, shipment.id);
      }
      setSelectedOrders([]);
      // Update total cost
      const addedOrders = orders.filter(o => selectedOrders.includes(o.id));
      const addedCost = addedOrders.reduce((sum, o) => sum + o.supplierCost * o.quantity, 0);
      onShipmentUpdate({ ...shipment, totalCost: shipment.totalCost + addedCost });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveOrder = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    await onRemoveOrder(orderId);
    if (order) {
      onShipmentUpdate({ 
        ...shipment, 
        totalCost: Math.max(0, shipment.totalCost - order.supplierCost * order.quantity) 
      });
    }
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const totalShipmentCost = shipmentOrders.reduce((sum, o) => sum + o.supplierCost * o.quantity, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {shipment.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 mb-4">
          <Badge variant="outline" className="text-lg py-1 px-3">
            <DollarSign className="h-4 w-4 mr-1" />
            Custo Total: {formatCurrency(totalShipmentCost)}
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
                    <TableHead>Custo</TableHead>
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
                      <TableCell>{formatCurrency(order.supplierCost * order.quantity)}</TableCell>
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
                      <TableHead>Custo</TableHead>
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
                        <TableCell>{formatCurrency(order.supplierCost * order.quantity)}</TableCell>
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
