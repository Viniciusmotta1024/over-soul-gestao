import { Product } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2, Package, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  isDraggable?: boolean;
}

export function ProductCard({ product, onEdit, onDelete, isDraggable = false }: ProductCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id, disabled: !isDraggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Sem Estoque', variant: 'destructive' as const };
    if (stock < 10) return { label: 'Baixo', variant: 'secondary' as const };
    return { label: 'Normal', variant: 'default' as const };
  };

  const stockStatus = getStockStatus(product.stock);
  const profit = product.price - product.supplierCost;

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={`group overflow-hidden transition-all duration-200 hover:shadow-lg ${isDragging ? 'shadow-xl ring-2 ring-primary' : ''}`}
    >
      <div className="relative aspect-square bg-secondary/30">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        
        {/* Drag handle */}
        {isDraggable && (
          <div 
            {...attributes}
            {...listeners}
            className="absolute top-2 left-2 p-1.5 rounded-md bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        )}

        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm"
            onClick={() => onEdit(product)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm text-destructive hover:text-destructive"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Stock badge */}
        <div className="absolute bottom-2 left-2">
          <Badge variant={stockStatus.variant} className="text-xs">
            {stockStatus.label}
          </Badge>
        </div>

        {/* Original price badge */}
        {product.originalPrice && (
          <div className="absolute bottom-2 right-2">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-xs line-through">
              {formatCurrency(product.originalPrice)}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-2">
        <div>
          <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
          <p className="text-xs text-muted-foreground">{product.collection || 'Sem coleção'}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-primary">{formatCurrency(product.price)}</p>
            <p className="text-xs text-muted-foreground">Custo: {formatCurrency(product.supplierCost)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-green-600">+{formatCurrency(profit)}</p>
            <p className="text-xs text-muted-foreground">{product.stock} un</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {product.sizes.slice(0, 4).map((size) => (
            <Badge key={size} variant="outline" className="text-xs px-1.5 py-0">
              {size}
            </Badge>
          ))}
          {product.sizes.length > 4 && (
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              +{product.sizes.length - 4}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
