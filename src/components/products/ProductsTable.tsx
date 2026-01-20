import { Product } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Package, ChevronDown, GripVertical, LayoutGrid, List } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState, useMemo, useEffect } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ProductCard } from './ProductCard';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';


interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onReorder?: (products: Product[]) => void;
  groupByCollection?: boolean;
}

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4',
      },
    },
  }),
};

function SortableTableRow({ 
  product, 
  onEdit, 
  onDelete,
  formatCurrency,
  getStockStatus,
  isDragging,
}: { 
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  formatCurrency: (value: number) => string;
  getStockStatus: (stock: number) => { label: string; variant: 'destructive' | 'secondary' | 'default' };
  isDragging?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.3 : 1,
    backgroundColor: isSortableDragging ? 'hsl(var(--secondary))' : undefined,
  };

  const stockStatus = getStockStatus(product.stock);
  const profit = product.price - product.supplierCost;

  return (
    <TableRow 
      ref={setNodeRef} 
      style={style} 
      className={`group transition-colors ${isSortableDragging ? 'shadow-lg z-10 relative' : ''}`}
    >
      <TableCell className="w-10">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1.5 rounded-md hover:bg-secondary/80 transition-colors"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="h-10 w-10 rounded-md object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.sizes.join(', ')}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium">{formatCurrency(product.price)}</p>
          {product.originalPrice && (
            <p className="text-xs text-muted-foreground line-through">
              {formatCurrency(product.originalPrice)}
            </p>
          )}
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatCurrency(product.supplierCost)}
      </TableCell>
      <TableCell className="text-green-600 font-medium">
        {formatCurrency(profit)}
      </TableCell>
      <TableCell>
        <span className={product.stock === 0 ? 'text-destructive font-medium' : ''}>
          {product.stock} un
        </span>
      </TableCell>
      <TableCell>
        <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="ghost" onClick={() => onEdit(product)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Overlay component for drag preview
function DragOverlayCard({ product, formatCurrency }: { product: Product; formatCurrency: (value: number) => string }) {
  return (
    <div className="bg-card border border-primary shadow-2xl rounded-lg p-4 w-64 opacity-95">
      <div className="flex items-center gap-3">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="h-12 w-12 rounded-md object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-md bg-secondary flex items-center justify-center">
            <Package className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <div>
          <p className="font-semibold text-foreground">{product.name}</p>
          <p className="text-sm text-primary font-medium">{formatCurrency(product.price)}</p>
        </div>
      </div>
    </div>
  );
}

export function ProductsTable({ products, onEdit, onDelete, onReorder, groupByCollection = true }: ProductsTableProps) {
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set(['all']));
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Update local products when props change
  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Sem Estoque', variant: 'destructive' as const };
    if (stock < 10) return { label: 'Baixo', variant: 'secondary' as const };
    return { label: 'Normal', variant: 'default' as const };
  };

  const groupedProducts = useMemo(() => {
    if (!groupByCollection) return { 'Todos os Produtos': localProducts };
    
    const groups: Record<string, Product[]> = {};
    localProducts.forEach(product => {
      const collection = product.collection || 'Sem Coleção';
      if (!groups[collection]) groups[collection] = [];
      groups[collection].push(product);
    });
    
    const sortedEntries = Object.entries(groups).sort(([a], [b]) => {
      if (a === 'Sem Coleção') return 1;
      if (b === 'Sem Coleção') return -1;
      return a.localeCompare(b);
    });
    
    return Object.fromEntries(sortedEntries);
  }, [localProducts, groupByCollection]);

  const toggleCollection = (collection: string) => {
    setExpandedCollections(prev => {
      const next = new Set(prev);
      if (next.has(collection)) {
        next.delete(collection);
      } else {
        next.add(collection);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedCollections(new Set([...Object.keys(groupedProducts), 'all']));
  };

  const collapseAll = () => {
    setExpandedCollections(new Set());
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent, collectionProducts: Product[], collection: string) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (over && active.id !== over.id) {
      const oldIndex = collectionProducts.findIndex(p => p.id === active.id);
      const newIndex = collectionProducts.findIndex(p => p.id === over.id);
      
      const newCollectionProducts = arrayMove(collectionProducts, oldIndex, newIndex);
      
      // Update local state immediately for responsive UI
      setLocalProducts(prev => {
        const otherProducts = prev.filter(p => 
          (p.collection || 'Sem Coleção') !== collection
        );
        return [...otherProducts, ...newCollectionProducts];
      });
      
      // Persist to database
      onReorder?.(newCollectionProducts);
    }
  };

  const activeProduct = activeId ? localProducts.find(p => p.id === activeId) : null;

  if (localProducts.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Package className="h-12 w-12 opacity-50" />
          <span className="text-lg">Nenhum produto encontrado</span>
          <span className="text-sm">Tente ajustar os filtros ou adicione um novo produto</span>
        </div>
      </div>
    );
  }

  const renderGridView = (collectionProducts: Product[], collection: string) => (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={(event) => handleDragEnd(event, collectionProducts, collection)}
    >
      <SortableContext items={collectionProducts.map(p => p.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
          {collectionProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
              isDraggable
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay dropAnimation={dropAnimationConfig}>
        {activeProduct ? (
          <DragOverlayCard product={activeProduct} formatCurrency={formatCurrency} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );

  const renderTableView = (collectionProducts: Product[], collection: string) => (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={(event) => handleDragEnd(event, collectionProducts, collection)}
    >
      <SortableContext items={collectionProducts.map(p => p.id)} strategy={verticalListSortingStrategy}>
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/20 hover:bg-secondary/20">
              <TableHead className="w-10"></TableHead>
              <TableHead className="font-semibold">Produto</TableHead>
              <TableHead className="font-semibold">Preço</TableHead>
              <TableHead className="font-semibold">Custo</TableHead>
              <TableHead className="font-semibold">Lucro</TableHead>
              <TableHead className="font-semibold">Estoque</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collectionProducts.map((product) => (
              <SortableTableRow
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
                formatCurrency={formatCurrency}
                getStockStatus={getStockStatus}
              />
            ))}
          </TableBody>
        </Table>
      </SortableContext>
      <DragOverlay dropAnimation={dropAnimationConfig}>
        {activeProduct ? (
          <DragOverlayCard product={activeProduct} formatCurrency={formatCurrency} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );

  if (!groupByCollection) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as 'table' | 'grid')}>
            <ToggleGroupItem value="table" aria-label="Ver como tabela">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Ver como grade">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {viewMode === 'grid' 
            ? renderGridView(localProducts, 'all')
            : renderTableView(localProducts, 'all')
          }
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={expandAll}>
            Expandir Todos
          </Button>
          <Button variant="ghost" size="sm" onClick={collapseAll}>
            Recolher Todos
          </Button>
        </div>
        
        <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as 'table' | 'grid')}>
          <ToggleGroupItem value="table" aria-label="Ver como tabela">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label="Ver como grade">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {Object.entries(groupedProducts).map(([collection, collectionProducts]) => {
        const isExpanded = expandedCollections.has(collection);
        const totalStock = collectionProducts.reduce((sum, p) => sum + p.stock, 0);
        const avgPrice = collectionProducts.reduce((sum, p) => sum + p.price, 0) / collectionProducts.length;
        
        return (
          <Collapsible key={collection} open={isExpanded} onOpenChange={() => toggleCollection(collection)}>
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`transform transition-transform duration-300 ease-out ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{collection}</h3>
                      <p className="text-sm text-muted-foreground">
                        {collectionProducts.length} produto{collectionProducts.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">{totalStock}</span> un em estoque
                    </div>
                    <div>
                      Média: <span className="font-medium">{formatCurrency(avgPrice)}</span>
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                {viewMode === 'grid' 
                  ? renderGridView(collectionProducts, collection)
                  : renderTableView(collectionProducts, collection)
                }
              </CollapsibleContent>
            </div>
          </Collapsible>
        );
      })}
    </div>
  );
}
