import { useState } from 'react';
import { Product } from '@/types';
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
import { Switch } from '@/components/ui/switch';

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export function AddProductDialog({ open, onOpenChange, onAdd }: AddProductDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    collection: '',
    price: '79.90',
    originalPrice: '89.90',
    supplierCost: '35.00',
    imageUrl: '',
    stock: '50',
    sizes: 'P, M, G, GG',
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name) return;
    
    setIsSubmitting(true);
    try {
      await onAdd({
        name: formData.name,
        description: formData.description || undefined,
        collection: formData.collection || undefined,
        price: parseFloat(formData.price) || 0,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        supplierCost: parseFloat(formData.supplierCost) || 0,
        imageUrl: formData.imageUrl || undefined,
        stock: parseInt(formData.stock) || 0,
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
        isActive: formData.isActive,
        sortOrder: 0,
      });
      
      setFormData({
        name: '',
        description: '',
        collection: '',
        price: '79.90',
        originalPrice: '89.90',
        supplierCost: '35.00',
        imageUrl: '',
        stock: '50',
        sizes: 'P, M, G, GG',
        isActive: true,
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif">Adicionar Produto</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Camisa OVERSOUL..."
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição do produto..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="collection">Coleção</Label>
              <Input
                id="collection"
                value={formData.collection}
                onChange={(e) => setFormData(prev => ({ ...prev, collection: e.target.value }))}
                placeholder="Carta Viva, Cristo..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sizes">Tamanhos</Label>
              <Input
                id="sizes"
                value={formData.sizes}
                onChange={(e) => setFormData(prev => ({ ...prev, sizes: e.target.value }))}
                placeholder="P, M, G, GG"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço de Venda (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalPrice">Preço Original (R$)</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplierCost">Custo do Fornecedor (R$)</Label>
              <Input
                id="supplierCost"
                type="number"
                step="0.01"
                value={formData.supplierCost}
                onChange={(e) => setFormData(prev => ({ ...prev, supplierCost: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Estoque</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="imageUrl">URL da Imagem</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="col-span-2 flex items-center justify-between">
              <Label htmlFor="isActive">Produto Ativo</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !formData.name}>
            {isSubmitting ? 'Adicionando...' : 'Adicionar Produto'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
