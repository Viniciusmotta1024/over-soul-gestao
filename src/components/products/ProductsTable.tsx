import { Product } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Package, ChevronDown, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState, useMemo } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  groupByCollection?: boolean;
}

export function ProductsTable({ products, onEdit, onDelete, groupByCollection = true }: ProductsTableProps) {
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set(['all']));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Sem Estoque', variant: 'destructive' as const };
    if (stock < 10) return { label: 'Baixo', variant: 'secondary' as const };
    return { label: 'Normal', variant: 'default' as const };
  };

  const groupedProducts = useMemo(() => {
    if (!groupByCollection) return { 'Todos os Produtos': products };
    
    const groups: Record<string, Product[]> = {};
    products.forEach(product => {
      const collection = product.collection || 'Sem Coleção';
      if (!groups[collection]) groups[collection] = [];
      groups[collection].push(product);
    });
    
    // Sort collections alphabetically, keeping "Sem Coleção" at the end
    const sortedEntries = Object.entries(groups).sort(([a], [b]) => {
      if (a === 'Sem Coleção') return 1;
      if (b === 'Sem Coleção') return -1;
      return a.localeCompare(b);
    });
    
    return Object.fromEntries(sortedEntries);
  }, [products, groupByCollection]);

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

  const renderProductRow = (product: Product) => {
    const stockStatus = getStockStatus(product.stock);
    const profit = product.price - product.supplierCost;
    
    return (
      <TableRow key={product.id} className="group">
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
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(product)}
            >
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
  };

  if (products.length === 0) {
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

  if (!groupByCollection) {
    return (
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
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
            {products.map(renderProductRow)}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={expandAll}>
          Expandir Todos
        </Button>
        <Button variant="ghost" size="sm" onClick={collapseAll}>
          Recolher Todos
        </Button>
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
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
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
              
              <CollapsibleContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/20 hover:bg-secondary/20">
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
                    {collectionProducts.map(renderProductRow)}
                  </TableBody>
                </Table>
              </CollapsibleContent>
            </div>
          </Collapsible>
        );
      })}
    </div>
  );
}
