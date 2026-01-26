import { useState } from 'react';
import { Plus, Package, Calendar, ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDtfShipments, DtfShipment } from '@/hooks/useDtfShipments';
import { usePricingConfig } from '@/hooks/usePricingConfig';
import { AddDtfShipmentDialog } from './AddDtfShipmentDialog';
import { DtfShipmentDetailsDialog } from './DtfShipmentDetailsDialog';
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog';

const statusLabels = {
  open: 'Aberta',
  ordered: 'Pedida',
  received: 'Recebida',
  closed: 'Fechada',
};

const statusColors = {
  open: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  ordered: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  received: 'bg-green-500/10 text-green-500 border-green-500/20',
  closed: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

export function DtfShipmentsView() {
  const { dtfShipments, loading, addDtfShipment, updateDtfShipment, deleteDtfShipment } = useDtfShipments();
  const { freights, getDTFPrice } = usePricingConfig();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<DtfShipment | null>(null);
  const [deleteShipment, setDeleteShipment] = useState<DtfShipment | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const handleAddShipment = async (data: { name: string; meters: number; notes?: string }) => {
    const dtfFreight = freights.find(f => f.name.toLowerCase().includes('dtf'))?.price || 12.59;
    const pricePerMeter = getDTFPrice(data.meters);
    
    await addDtfShipment({
      name: data.name,
      meters: data.meters,
      pricePerMeter,
      freight: dtfFreight,
      notes: data.notes,
    });
  };

  const handleStatusChange = async (shipment: DtfShipment, newStatus: DtfShipment['status']) => {
    await updateDtfShipment({ ...shipment, status: newStatus });
  };

  const handleDelete = async () => {
    if (deleteShipment) {
      await deleteDtfShipment(deleteShipment.id);
      setDeleteShipment(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Remessas de DTF</h3>
        <Button onClick={() => setAddDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nova Remessa DTF
        </Button>
      </div>

      {dtfShipments.length === 0 ? (
        <Card className="bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma remessa de DTF criada</p>
            <Button variant="outline" className="mt-4" onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Remessa
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {dtfShipments.map((shipment) => (
            <Card 
              key={shipment.id} 
              className="hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => setSelectedShipment(shipment)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    {shipment.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={statusColors[shipment.status]}>
                      {statusLabels[shipment.status]}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(shipment.createdAt)}
                    </span>
                    <span className="font-medium">
                      {shipment.meters}m × {formatCurrency(shipment.pricePerMeter)}/m
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-primary">
                      {formatCurrency(shipment.totalCost)}
                    </span>
                    {shipment.status === 'open' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteShipment(shipment);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddDtfShipmentDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddShipment}
      />

      {selectedShipment && (
        <DtfShipmentDetailsDialog
          open={!!selectedShipment}
          onOpenChange={(open) => !open && setSelectedShipment(null)}
          shipment={selectedShipment}
          onStatusChange={handleStatusChange}
          onUpdate={updateDtfShipment}
        />
      )}

      <DeleteConfirmDialog
        open={!!deleteShipment}
        onOpenChange={(open) => !open && setDeleteShipment(null)}
        onConfirm={handleDelete}
        title="Excluir Remessa DTF"
        description={`Tem certeza que deseja excluir a remessa "${deleteShipment?.name}"?`}
      />
    </div>
  );
}
