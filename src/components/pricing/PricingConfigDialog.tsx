import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2, Check, X, Package, Scissors, Truck } from 'lucide-react';
import { PricingShirt, PricingDTF, PricingFreight } from '@/hooks/usePricingConfig';

interface PricingConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shirts: PricingShirt[];
  dtfTiers: PricingDTF[];
  freights: PricingFreight[];
  onAddShirt: (name: string, price: number) => Promise<void>;
  onUpdateShirt: (id: string, data: Partial<{ name: string; price: number; isActive: boolean }>) => Promise<void>;
  onDeleteShirt: (id: string) => Promise<void>;
  onUpdateDTF: (id: string, data: Partial<{ pricePerMeter: number; label: string }>) => Promise<void>;
  onUpdateFreight: (id: string, price: number) => Promise<void>;
}

export function PricingConfigDialog({
  open,
  onOpenChange,
  shirts,
  dtfTiers,
  freights,
  onAddShirt,
  onUpdateShirt,
  onDeleteShirt,
  onUpdateDTF,
  onUpdateFreight,
}: PricingConfigDialogProps) {
  const [newShirtName, setNewShirtName] = useState('');
  const [newShirtPrice, setNewShirtPrice] = useState('');
  const [editingShirt, setEditingShirt] = useState<string | null>(null);
  const [editShirtName, setEditShirtName] = useState('');
  const [editShirtPrice, setEditShirtPrice] = useState('');
  const [editingDTF, setEditingDTF] = useState<string | null>(null);
  const [editDTFPrice, setEditDTFPrice] = useState('');
  const [editingFreight, setEditingFreight] = useState<string | null>(null);
  const [editFreightPrice, setEditFreightPrice] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleAddShirt = async () => {
    if (!newShirtName.trim() || !newShirtPrice) return;
    await onAddShirt(newShirtName.trim(), parseFloat(newShirtPrice));
    setNewShirtName('');
    setNewShirtPrice('');
  };

  const handleSaveShirt = async (id: string) => {
    await onUpdateShirt(id, {
      name: editShirtName,
      price: parseFloat(editShirtPrice),
    });
    setEditingShirt(null);
  };

  const startEditShirt = (shirt: PricingShirt) => {
    setEditingShirt(shirt.id);
    setEditShirtName(shirt.name);
    setEditShirtPrice(shirt.price.toString());
  };

  const handleSaveDTF = async (id: string) => {
    await onUpdateDTF(id, { pricePerMeter: parseFloat(editDTFPrice) });
    setEditingDTF(null);
  };

  const startEditDTF = (dtf: PricingDTF) => {
    setEditingDTF(dtf.id);
    setEditDTFPrice(dtf.pricePerMeter.toString());
  };

  const handleSaveFreight = async (id: string) => {
    await onUpdateFreight(id, parseFloat(editFreightPrice));
    setEditingFreight(null);
  };

  const startEditFreight = (freight: PricingFreight) => {
    setEditingFreight(freight.id);
    setEditFreightPrice(freight.price.toString());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurar Preços</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="shirts" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="shirts" className="gap-2">
              <Package className="h-4 w-4" />
              Camisas
            </TabsTrigger>
            <TabsTrigger value="dtf" className="gap-2">
              <Scissors className="h-4 w-4" />
              DTF
            </TabsTrigger>
            <TabsTrigger value="freight" className="gap-2">
              <Truck className="h-4 w-4" />
              Fretes
            </TabsTrigger>
          </TabsList>

          {/* Camisas Tab */}
          <TabsContent value="shirts" className="space-y-4 mt-4">
            {/* Add new shirt */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Nome da Camisa</Label>
                    <Input
                      placeholder="Ex: Camiseta Baby Look"
                      value={newShirtName}
                      onChange={(e) => setNewShirtName(e.target.value)}
                    />
                  </div>
                  <div className="w-28 space-y-1">
                    <Label className="text-xs">Preço (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={newShirtPrice}
                      onChange={(e) => setNewShirtPrice(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddShirt} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* List shirts */}
            <div className="space-y-2">
              {shirts.map((shirt) => (
                <Card key={shirt.id}>
                  <CardContent className="p-3">
                    {editingShirt === shirt.id ? (
                      <div className="flex gap-2 items-center">
                        <Input
                          value={editShirtName}
                          onChange={(e) => setEditShirtName(e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          step="0.01"
                          value={editShirtPrice}
                          onChange={(e) => setEditShirtPrice(e.target.value)}
                          className="w-24"
                        />
                        <Button size="icon" variant="ghost" onClick={() => handleSaveShirt(shirt.id)}>
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setEditingShirt(null)}>
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{shirt.name}</span>
                          {!shirt.isActive && (
                            <Badge variant="secondary" className="text-xs">Inativo</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            {formatCurrency(shirt.price)}
                          </Badge>
                          <Button size="icon" variant="ghost" onClick={() => startEditShirt(shirt)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onUpdateShirt(shirt.id, { isActive: !shirt.isActive })}
                          >
                            {shirt.isActive ? (
                              <X className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Check className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onDeleteShirt(shirt.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* DTF Tab */}
          <TabsContent value="dtf" className="space-y-2 mt-4">
            {dtfTiers.map((dtf) => (
              <Card key={dtf.id}>
                <CardContent className="p-3">
                  {editingDTF === dtf.id ? (
                    <div className="flex gap-2 items-center">
                      <span className="flex-1 text-sm text-muted-foreground">{dtf.label}</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={editDTFPrice}
                        onChange={(e) => setEditDTFPrice(e.target.value)}
                        className="w-28"
                      />
                      <Button size="icon" variant="ghost" onClick={() => handleSaveDTF(dtf.id)}>
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditingDTF(null)}>
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{dtf.label}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          {formatCurrency(dtf.pricePerMeter)}/m
                        </Badge>
                        <Button size="icon" variant="ghost" onClick={() => startEditDTF(dtf)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Freight Tab */}
          <TabsContent value="freight" className="space-y-2 mt-4">
            {freights.map((freight) => (
              <Card key={freight.id}>
                <CardContent className="p-3">
                  {editingFreight === freight.id ? (
                    <div className="flex gap-2 items-center">
                      <span className="flex-1 text-sm">{freight.name}</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={editFreightPrice}
                        onChange={(e) => setEditFreightPrice(e.target.value)}
                        className="w-28"
                      />
                      <Button size="icon" variant="ghost" onClick={() => handleSaveFreight(freight.id)}>
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditingFreight(null)}>
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{freight.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          {formatCurrency(freight.price)}
                        </Badge>
                        <Button size="icon" variant="ghost" onClick={() => startEditFreight(freight)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
