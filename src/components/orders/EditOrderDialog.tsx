import { useState, useEffect } from 'react';
import { Order, Client, Supplier } from '@/types';
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

interface EditOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  clients: Client[];
  suppliers: Supplier[];
  onSave: (order: Order) => void;
}

const channels = [
  { id: 'shopee', name: 'Shopee', icon: '🛒' },
  { id: 'ministerio', name: 'Vista o seu Ministério', icon: '⛪' },
  { id: 'site', name: 'Site Próprio', icon: '🌐' },
];

const statuses = [
  { id: 'pending', name: 'Pendente' },
  { id: 'processing', name: 'Processando' },
  { id: 'completed', name: 'Concluído' },
  { id: 'cancelled', name: 'Cancelado' },
];

export function EditOrderDialog({ open, onOpenChange, order, clients, suppliers, onSave }: EditOrderDialogProps) {
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    product: '',
    size: '',
    quantity: 1,
    channel: '' as Order['channel'],
    status: 'pending' as Order['status'],
    supplierCost: 0,
    salePrice: 0,
  });

  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  // Get all products from all suppliers
  const allProducts = suppliers.flatMap(s => 
    s.products.map(p => ({ ...p, supplierId: s.id, supplierName: s.name }))
  );

  useEffect(() => {
    if (order) {
      setFormData({
        customerId: order.customerId || '',
        customerName: order.customerName,
        product: order.product,
        size: order.size,
        quantity: order.quantity,
        channel: order.channel,
        status: order.status,
        supplierCost: order.supplierCost,
        salePrice: order.salePrice,
      });
      
      // Find sizes for the current product
      const product = allProducts.find(p => p.name === order.product);
      if (product) {
        setAvailableSizes(product.sizes);
      }
    }
  }, [order]);

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    setFormData({
      ...formData,
      customerId: clientId,
      customerName: client?.name || '',
    });
  };

  const handleProductChange = (productName: string) => {
    const product = allProducts.find(p => p.name === productName);
    if (product) {
      setAvailableSizes(product.sizes);
      setFormData({
        ...formData,
        product: productName,
        supplierCost: product.unitCost,
        size: '',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (order) {
      onSave({
        ...order,
        ...formData,
      });
      onOpenChange(false);
    }
  };

  const profit = (formData.salePrice - formData.supplierCost) * formData.quantity;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">Editar Pedido</DialogTitle>
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
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Channel and Status */}
          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label>Status *</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as Order['status'] })}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Selection */}
          <div className="space-y-2">
            <Label>Produto *</Label>
            <Select value={formData.product} onValueChange={handleProductChange}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {allProducts.map((product, index) => (
                  <SelectItem key={`${product.name}-${index}`} value={product.name}>
                    <span className="flex items-center justify-between w-full">
                      <span>{product.name}</span>
                      <span className="text-muted-foreground text-xs ml-2">
                        ({product.supplierName})
                      </span>
                    </span>
                  </SelectItem>
                ))}
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

          {/* Profit Preview */}
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Lucro estimado:</span>
              <span className={`text-lg font-serif font-semibold ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                {profit >= 0 ? '+' : ''} R$ {profit.toFixed(2)}
              </span>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
