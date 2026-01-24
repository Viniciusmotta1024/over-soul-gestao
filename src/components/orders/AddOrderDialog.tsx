import { useState, useEffect } from 'react';
import { Order, Client, Product } from '@/types';
import { Shipment } from '@/hooks/useShipments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Package } from 'lucide-react';

interface AddOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Client[];
  products: Product[];
  shipments?: Shipment[];
  onAdd: (order: Omit<Order, 'id' | 'createdAt'>) => void;
}

const channels = [
  { id: 'shopee', name: 'Shopee', icon: '🛒' },
  { id: 'ministerio', name: 'Vista o seu Ministério', icon: '⛪' },
  { id: 'site', name: 'Site Próprio', icon: '🌐' },
];

export function AddOrderDialog({ open, onOpenChange, clients, products, shipments = [], onAdd }: AddOrderDialogProps) {
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    product: '',
    size: '',
    quantity: 1,
    channel: '' as Order['channel'] | '',
    supplierCost: 0,
    salePrice: 0,
    status: 'pending' as Order['status'],
    shipmentId: '',
  });

  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  // Filter only active products
  const activeProducts = products.filter(p => p.isActive);
  
  // Filter only open shipments
  const openShipments = shipments.filter(s => s.status === 'open');

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    setFormData({
      ...formData,
      customerId: clientId,
      customerName: client?.name || '',
    });
  };

  const handleProductChange = (productId: string) => {
    const product = activeProducts.find(p => p.id === productId);
    if (product) {
      setAvailableSizes(product.sizes);
      setFormData({
        ...formData,
        product: product.name,
        supplierCost: product.supplierCost,
        salePrice: product.price,
        size: '',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.channel) {
      onAdd({
        customerName: formData.customerName,
        customerId: formData.customerId,
        product: formData.product,
        size: formData.size,
        quantity: formData.quantity,
        channel: formData.channel as Order['channel'],
        status: formData.status,
        supplierCost: formData.supplierCost,
        salePrice: formData.salePrice,
        isPaid: false,
        shipmentId: formData.shipmentId || undefined,
      });
      setFormData({
        customerId: '',
        customerName: '',
        product: '',
        size: '',
        quantity: 1,
        channel: '',
        supplierCost: 0,
        salePrice: 0,
        status: 'pending',
        shipmentId: '',
      });
      setAvailableSizes([]);
      onOpenChange(false);
    }
  };

  const profit = (formData.salePrice - formData.supplierCost) * formData.quantity;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">Novo Pedido</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client Selection */}
          <div className="space-y-2">
            <Label>Cliente *</Label>
            <Select value={formData.customerId} onValueChange={handleClientChange}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name || client.phone || 'Cliente sem identificação'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Channel Selection */}
          <div className="space-y-2">
            <Label>Canal de Venda *</Label>
            <Select value={formData.channel} onValueChange={(v) => setFormData({ ...formData, channel: v as Order['channel'] })}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue placeholder="Selecione o canal" />
              </SelectTrigger>
              <SelectContent>
                {channels.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    <span className="flex items-center gap-2">
                      <span>{channel.icon}</span>
                      {channel.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Selection */}
          <div className="space-y-2">
            <Label>Produto *</Label>
            <Select onValueChange={handleProductChange}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue placeholder={activeProducts.length === 0 ? "Nenhum produto cadastrado" : "Selecione um produto"} />
              </SelectTrigger>
              <SelectContent>
                {activeProducts.length === 0 ? (
                  <div className="p-2 text-center text-muted-foreground text-sm">
                    Cadastre produtos primeiro na aba "Produtos"
                  </div>
                ) : (
                  activeProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      <span className="flex items-center justify-between w-full">
                        <span>{product.name}</span>
                        <span className="text-muted-foreground text-xs ml-2">
                          ({product.collection || 'Sem coleção'})
                        </span>
                      </span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Size and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tamanho *</Label>
              <Select 
                value={formData.size} 
                onValueChange={(v) => setFormData({ ...formData, size: v })}
                disabled={availableSizes.length === 0}
              >
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {availableSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className="bg-secondary/50"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplierCost">Custo do Fornecedor (R$)</Label>
              <Input
                id="supplierCost"
                type="number"
                step="0.01"
                value={formData.supplierCost}
                onChange={(e) => setFormData({ ...formData, supplierCost: parseFloat(e.target.value) || 0 })}
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salePrice">Preço de Venda (R$) *</Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })}
                className="bg-secondary/50"
                required
              />
            </div>
          </div>

          {/* Shipment Selection (Optional) */}
          {openShipments.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Adicionar à Remessa (Opcional)
              </Label>
              <Select 
                value={formData.shipmentId} 
                onValueChange={(v) => setFormData({ ...formData, shipmentId: v === 'none' ? '' : v })}
              >
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Selecione uma remessa aberta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="text-muted-foreground">Nenhuma remessa</span>
                  </SelectItem>
                  {openShipments.map((shipment) => (
                    <SelectItem key={shipment.id} value={shipment.id}>
                      <span className="flex items-center gap-2">
                        <Package className="h-3 w-3" />
                        {shipment.name}
                        <span className="text-muted-foreground text-xs">
                          ({shipment.orderCount || 0} pedidos)
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Vincule este pedido a uma remessa existente para otimizar custos de fabricação.
              </p>
            </div>
          )}

          {/* Profit Preview */}
          {formData.salePrice > 0 && (
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Lucro estimado:</span>
                <span className={`text-lg font-serif font-semibold ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {profit >= 0 ? '+' : ''} R$ {profit.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
              disabled={!formData.customerName || !formData.product || !formData.size || !formData.channel}
            >
              Criar Pedido
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
