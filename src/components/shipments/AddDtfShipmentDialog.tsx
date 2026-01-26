import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePricingConfig } from '@/hooks/usePricingConfig';

interface AddDtfShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: { name: string; meters: number; notes?: string }) => Promise<void>;
}

export function AddDtfShipmentDialog({ open, onOpenChange, onAdd }: AddDtfShipmentDialogProps) {
  const [name, setName] = useState('');
  const [meters, setMeters] = useState('1');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { freights, getDTFPrice } = usePricingConfig();

  const metersNum = parseInt(meters, 10) || 1;
  const pricePerMeter = getDTFPrice(metersNum);
  const dtfFreight = freights.find(f => f.name.toLowerCase().includes('dtf'))?.price || 12.59;
  const totalCost = (metersNum * pricePerMeter) + dtfFreight;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || metersNum < 1) return;
    
    setLoading(true);
    try {
      await onAdd({ name: name.trim(), meters: metersNum, notes: notes.trim() || undefined });
      setName('');
      setMeters('1');
      setNotes('');
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Remessa de DTF</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Remessa *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: DTF Janeiro 2026"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meters">Metros de DTF *</Label>
            <Input
              id="meters"
              type="number"
              min="1"
              step="1"
              value={meters}
              onChange={(e) => setMeters(e.target.value)}
              required
            />
          </div>

          <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">DTF ({metersNum}m × {formatCurrency(pricePerMeter)})</span>
              <span>{formatCurrency(metersNum * pricePerMeter)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Frete DTF</span>
              <span>{formatCurrency(dtfFreight)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-border pt-2 mt-2">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(totalCost)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações opcionais..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !name.trim() || metersNum < 1}>
              {loading ? 'Criando...' : 'Criar Remessa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
