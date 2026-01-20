import { useState, useEffect } from 'react';
import { Supplier, SupplierProduct } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, X } from 'lucide-react';

interface EditSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
  onSave: (supplier: Supplier) => void;
}

export function EditSupplierDialog({ open, onOpenChange, supplier, onSave }: EditSupplierDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
  });
  const [products, setProducts] = useState<SupplierProduct[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    sizes: '',
    unitCost: '',
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        contact: supplier.contact,
        email: supplier.email || '',
      });
      setProducts(supplier.products);
    }
  }, [supplier]);

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.unitCost) {
      setProducts([
        ...products,
        {
          name: newProduct.name,
          sizes: newProduct.sizes.split(',').map(s => s.trim()).filter(Boolean),
          unitCost: parseFloat(newProduct.unitCost),
        },
      ]);
      setNewProduct({ name: '', sizes: '', unitCost: '' });
    }
  };

  const handleRemoveProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (supplier) {
      onSave({
        ...supplier,
        ...formData,
        products,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">Editar Fornecedor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Fornecedor *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome da empresa"
              required
              className="bg-secondary/50"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact">Telefone *</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="(00) 00000-0000"
                required
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@fornecedor.com"
                className="bg-secondary/50"
              />
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h4 className="font-medium text-foreground mb-3">Produtos</h4>
            
            {products.length > 0 && (
              <div className="space-y-2 mb-4">
                {products.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">Tamanhos:</span>
                        {product.sizes.map((size) => (
                          <Badge key={size} variant="outline" className="text-xs">{size}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-serif font-semibold text-primary">
                        R$ {product.unitCost.toFixed(2)}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleRemoveProduct(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-4 border border-dashed border-border rounded-lg space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Produto</Label>
                  <Input
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Nome do produto"
                    className="bg-secondary/50 h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Tamanhos</Label>
                  <Input
                    value={newProduct.sizes}
                    onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                    placeholder="P, M, G, GG"
                    className="bg-secondary/50 h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Custo (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newProduct.unitCost}
                    onChange={(e) => setNewProduct({ ...newProduct, unitCost: e.target.value })}
                    placeholder="0.00"
                    className="bg-secondary/50 h-9"
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddProduct}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Produto
              </Button>
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
