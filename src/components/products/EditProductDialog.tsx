import { useState, useEffect } from 'react';
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

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSave: (product: Product) => Promise<void>;
}

export function EditProductDialog({ open, onOpenChange, product, onSave }: EditProductDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    collection: '',
    price: '',
    originalPrice: '',
    supplierCost: '',
    imageUrl: '',
    stock: '',
    sizes: '',
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        collection: product.collection || '',
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || '',
        supplierCost: product.supplierCost.toString(),
        imageUrl: product.imageUrl || '',
        stock: product.stock.toString(),
        sizes: product.sizes.join(', '),
        isActive: product.isActive,
      });
    }
  }, [product]);

  const handleSubmit = async () => {
    if (!product || !formData.name) return;
    
    setIsSubmitting(true);
    try {
      await onSave({
        ...product,
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
          <DialogTitle className="font-serif">Editar Produto</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-name">Nome do Produto *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Camisa OVERSOUL..."
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição do produto..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-collection">Coleção</Label>
              <Input
                id="edit-collection"
                value={formData.collection}
                onChange={(e) => setFormData(prev => ({ ...prev, collection: e.target.value }))}
                placeholder="Carta Viva, Cristo..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-sizes">Tamanhos</Label>
              <Input
                id="edit-sizes"
                value={formData.sizes}
                onChange={(e) => setFormData(prev => ({ ...prev, sizes: e.target.value }))}
                placeholder="P, M, G, GG"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-price">Preço de Venda (R$)</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-originalPrice">Preço Original (R$)</Label>
              <Input
                id="edit-originalPrice"
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-supplierCost">Custo do Fornecedor (R$)</Label>
              <Input
                id="edit-supplierCost"
                type="number"
                step="0.01"
                value={formData.supplierCost}
                onChange={(e) => setFormData(prev => ({ ...prev, supplierCost: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-stock">Estoque</Label>
              <Input
                id="edit-stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-imageUrl">URL da Imagem</Label>
              <Input
                id="edit-imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="col-span-2 flex items-center justify-between">
              <Label htmlFor="edit-isActive">Produto Ativo</Label>
              <Switch
                id="edit-isActive"
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
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
