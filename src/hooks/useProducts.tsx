import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('collection', { ascending: true })
        .order('sort_order', { ascending: true });

      if (error) throw error;

      const mappedProducts: Product[] = (data || []).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || undefined,
        collection: p.collection || undefined,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        supplierCost: Number(p.supplier_cost),
        imageUrl: p.image_url || undefined,
        stock: p.stock,
        sizes: p.sizes || [],
        isActive: p.is_active,
        sortOrder: p.sort_order || 0,
        createdAt: new Date(p.created_at),
        updatedAt: new Date(p.updated_at),
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({ title: 'Erro', description: 'Erro ao carregar produtos', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          description: productData.description || null,
          collection: productData.collection || null,
          price: productData.price,
          original_price: productData.originalPrice || null,
          supplier_cost: productData.supplierCost,
          image_url: productData.imageUrl || null,
          stock: productData.stock,
          sizes: productData.sizes,
          is_active: productData.isActive,
        })
        .select()
        .single();

      if (error) throw error;

      const newProduct: Product = {
        id: data.id,
        name: data.name,
        description: data.description || undefined,
        collection: data.collection || undefined,
        price: Number(data.price),
        originalPrice: data.original_price ? Number(data.original_price) : undefined,
        supplierCost: Number(data.supplier_cost),
        imageUrl: data.image_url || undefined,
        stock: data.stock,
        sizes: data.sizes || [],
        isActive: data.is_active,
        sortOrder: data.sort_order || 0,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      setProducts(prev => [newProduct, ...prev]);
      toast({ title: 'Produto adicionado', description: `${newProduct.name} foi adicionado com sucesso.` });
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      toast({ title: 'Erro', description: 'Erro ao adicionar produto', variant: 'destructive' });
      throw error;
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: product.name,
          description: product.description || null,
          collection: product.collection || null,
          price: product.price,
          original_price: product.originalPrice || null,
          supplier_cost: product.supplierCost,
          image_url: product.imageUrl || null,
          stock: product.stock,
          sizes: product.sizes,
          is_active: product.isActive,
        })
        .eq('id', product.id);

      if (error) throw error;

      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
      toast({ title: 'Produto atualizado', description: `${product.name} foi atualizado com sucesso.` });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({ title: 'Erro', description: 'Erro ao atualizar produto', variant: 'destructive' });
      throw error;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== productId));
      toast({ title: 'Produto excluído', description: 'Produto removido com sucesso.' });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({ title: 'Erro', description: 'Erro ao excluir produto', variant: 'destructive' });
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateProductsOrder = async (reorderedProducts: Product[]) => {
    try {
      // Update sort_order for each product in the batch
      const updates = reorderedProducts.map((product, index) => ({
        id: product.id,
        sort_order: index + 1,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('products')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id);

        if (error) throw error;
      }

      // Update local state with new order
      setProducts(prev => {
        const updated = [...prev];
        reorderedProducts.forEach((product, index) => {
          const existingIndex = updated.findIndex(p => p.id === product.id);
          if (existingIndex !== -1) {
            updated[existingIndex] = { ...updated[existingIndex], sortOrder: index + 1 };
          }
        });
        return updated;
      });

      toast({ title: 'Ordem atualizada', description: 'A ordem dos produtos foi salva.' });
    } catch (error) {
      console.error('Error updating products order:', error);
      toast({ title: 'Erro', description: 'Erro ao salvar ordem dos produtos', variant: 'destructive' });
      // Refetch to restore correct order
      fetchProducts();
    }
  };

  return { products, loading, addProduct, updateProduct, deleteProduct, updateProductsOrder, refetch: fetchProducts };
}
