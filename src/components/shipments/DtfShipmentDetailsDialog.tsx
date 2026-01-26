import { useState, useEffect } from 'react';
import { Package, Edit2, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DtfShipment } from '@/hooks/useDtfShipments';
import { usePricingConfig } from '@/hooks/usePricingConfig';

interface DtfShipmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipment: DtfShipment;
  onStatusChange: (shipment: DtfShipment, status: DtfShipment['status']) => Promise<void>;
  onUpdate: (shipment: DtfShipment) => Promise<void>;
}

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

export function DtfShipmentDetailsDialog({
  open,
  onOpenChange,
  shipment,
  onStatusChange,
  onUpdate,
}: DtfShipmentDetailsDialogProps) {
  const [editing, setEditing] = useState(false);
  const [meters, setMeters] = useState(shipment.meters.toString());
  const { getDTFPrice, freights } = usePricingConfig();

  useEffect(() => {
    setMeters(shipment.meters.toString());
    setEditing(false);
  }, [shipment.id, shipment.meters]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleSaveMeters = async () => {
    const parsedMeters = parseInt(meters, 10);
    if (isNaN(parsedMeters) || parsedMeters < 1) return;

    const newPricePerMeter = getDTFPrice(parsedMeters);
    await onUpdate({ 
      ...shipment, 
      meters: parsedMeters,
      pricePerMeter: newPricePerMeter,
    });
    setEditing(false);
  };

  const getNextStatus = (): DtfShipment['status'] | null => {
    switch (shipment.status) {
      case 'open': return 'ordered';
      case 'ordered': return 'received';
      case 'received': return 'closed';
      default: return null;
    }
  };

  const getNextStatusLabel = () => {
    const next = getNextStatus();
    if (!next) return null;
    return statusLabels[next];
  };

  const nextStatus = getNextStatus();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              {shipment.name}
            </DialogTitle>
            <Badge variant="outline" className={statusColors[shipment.status]}>
              {statusLabels[shipment.status]}
            </Badge>
          </div>
        </DialogHeader>

        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Detalhes do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground">Metros de DTF</Label>
              {editing ? (
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    value={meters}
                    onChange={(e) => setMeters(e.target.value)}
                    className="h-8 w-20 text-right"
                  />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveMeters}>
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => {
                    setMeters(shipment.meters.toString());
                    setEditing(false);
                  }}>
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{shipment.meters}m</span>
                  {shipment.status === 'open' && (
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setEditing(true)}>
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground">Preço por Metro</Label>
              <span className="font-semibold">{formatCurrency(shipment.pricePerMeter)}</span>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground">Frete</Label>
              <span className="font-semibold">{formatCurrency(shipment.freight)}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <Label className="font-medium">Custo Total</Label>
              <span className="text-lg font-bold text-primary">{formatCurrency(shipment.totalCost)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground">
          Criada em {formatDate(shipment.createdAt)}
        </div>

        {shipment.notes && (
          <div className="p-3 bg-muted/30 rounded-lg">
            <Label className="text-xs text-muted-foreground">Observações</Label>
            <p className="text-sm mt-1">{shipment.notes}</p>
          </div>
        )}

        {nextStatus && (
          <div className="flex justify-end pt-2">
            <Button onClick={() => onStatusChange(shipment, nextStatus)}>
              Marcar como {getNextStatusLabel()}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
