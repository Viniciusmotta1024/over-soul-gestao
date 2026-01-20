import { Supplier } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Phone, Package, Mail } from 'lucide-react';

interface SuppliersTableProps {
  suppliers: Supplier[];
}

export function SuppliersTable({ suppliers }: SuppliersTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-4">
      {suppliers.map((supplier, index) => (
        <div 
          key={supplier.id}
          className="glass rounded-xl overflow-hidden animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <Accordion type="single" collapsible>
            <AccordionItem value={supplier.id} className="border-none">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/30">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-foreground">{supplier.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {supplier.contact}
                      </span>
                      {supplier.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {supplier.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge className="ml-auto mr-4 bg-secondary text-muted-foreground border-border">
                    {supplier.products.length} produtos
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="rounded-lg bg-secondary/30 overflow-hidden border border-border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Produto
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Tamanhos
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                          Custo Unitário
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplier.products.map((product, pIndex) => (
                        <tr 
                          key={pIndex}
                          className={cn(
                            "border-b border-border/50 last:border-0",
                            "hover:bg-secondary/50 transition-colors"
                          )}
                        >
                          <td className="px-4 py-3 font-medium text-foreground">
                            {product.name}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {product.sizes.map((size) => (
                                <Badge 
                                  key={size} 
                                  variant="outline" 
                                  className="bg-card text-xs"
                                >
                                  {size}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-serif font-semibold text-primary">
                            {formatCurrency(product.unitCost)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  );
}
