import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { X, Search, SlidersHorizontal } from 'lucide-react';

export interface ProductFiltersState {
  collection?: string;
  status?: 'active' | 'inactive';
  stockStatus?: 'all' | 'low' | 'out';
  search?: string;
  sortBy?: 'name' | 'price' | 'stock' | 'collection' | 'created';
  sortOrder?: 'asc' | 'desc';
}

interface ProductFiltersProps {
  collections: string[];
  filters: ProductFiltersState;
  onFiltersChange: (filters: ProductFiltersState) => void;
  onClear: () => void;
}

export function ProductFilters({ collections, filters, onFiltersChange, onClear }: ProductFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '' && v !== 'all');

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produto..."
          value={filters.search || ''}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-9 w-48"
        />
      </div>

      <Select
        value={filters.collection || 'all'}
        onValueChange={(value) => onFiltersChange({ ...filters, collection: value === 'all' ? undefined : value })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Coleção" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as Coleções</SelectItem>
          {collections.map((collection) => (
            <SelectItem key={collection} value={collection}>
              {collection}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status || 'all'}
        onValueChange={(value) => onFiltersChange({ ...filters, status: value === 'all' ? undefined : value as 'active' | 'inactive' })}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="active">Ativo</SelectItem>
          <SelectItem value="inactive">Inativo</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.stockStatus || 'all'}
        onValueChange={(value) => onFiltersChange({ ...filters, stockStatus: value as 'all' | 'low' | 'out' })}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Estoque" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todo Estoque</SelectItem>
          <SelectItem value="low">Estoque Baixo</SelectItem>
          <SelectItem value="out">Sem Estoque</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2 border-l pl-3 border-border">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        <Select
          value={filters.sortBy || 'collection'}
          onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value as ProductFiltersState['sortBy'] })}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="collection">Coleção</SelectItem>
            <SelectItem value="name">Nome</SelectItem>
            <SelectItem value="price">Preço</SelectItem>
            <SelectItem value="stock">Estoque</SelectItem>
            <SelectItem value="created">Data</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.sortOrder || 'asc'}
          onValueChange={(value) => onFiltersChange({ ...filters, sortOrder: value as 'asc' | 'desc' })}
        >
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">A → Z</SelectItem>
            <SelectItem value="desc">Z → A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} className="gap-1 text-muted-foreground">
          <X className="h-4 w-4" />
          Limpar
        </Button>
      )}
    </div>
  );
}
