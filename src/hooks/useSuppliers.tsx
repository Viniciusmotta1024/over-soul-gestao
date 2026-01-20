import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Supplier, SupplierProduct } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSuppliers = async () => {
    try {
      const { data: suppliersData, error: suppliersError } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

      if (suppliersError) throw suppliersError;

      const { data: productsData, error: productsError } = await supabase
        .from('supplier_products')
        .select('*');

      if (productsError) throw productsError;

      const mappedSuppliers: Supplier[] = (suppliersData || []).map(s => ({
        id: s.id,
        name: s.name,
        contact: s.contact,
        email: s.email || undefined,
        products: (productsData || [])
          .filter(p => p.supplier_id === s.id)
          .map(p => ({
            name: p.name,
            sizes: p.sizes || [],
            unitCost: Number(p.unit_cost),
          })),
      }));

      setSuppliers(mappedSuppliers);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast({ title: 'Erro', description: 'Erro ao carregar fornecedores', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const addSupplier = async (supplierData: Omit<Supplier, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert({
          name: supplierData.name,
          contact: supplierData.contact,
          email: supplierData.email || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Insert products
      if (supplierData.products.length > 0) {
        const { error: productsError } = await supabase
          .from('supplier_products')
          .insert(
            supplierData.products.map(p => ({
              supplier_id: data.id,
              name: p.name,
              sizes: p.sizes,
              unit_cost: p.unitCost,
            }))
          );

        if (productsError) throw productsError;
      }

      const newSupplier: Supplier = {
        id: data.id,
        name: data.name,
        contact: data.contact,
        email: data.email || undefined,
        products: supplierData.products,
      };

      setSuppliers(prev => [newSupplier, ...prev]);
      toast({ title: 'Fornecedor adicionado', description: `${newSupplier.name} foi adicionado com sucesso.` });
      return newSupplier;
    } catch (error) {
      console.error('Error adding supplier:', error);
      toast({ title: 'Erro', description: 'Erro ao adicionar fornecedor', variant: 'destructive' });
      throw error;
    }
  };

  const updateSupplier = async (supplier: Supplier) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .update({
          name: supplier.name,
          contact: supplier.contact,
          email: supplier.email || null,
        })
        .eq('id', supplier.id);

      if (error) throw error;

      // Delete existing products and re-insert
      await supabase
        .from('supplier_products')
        .delete()
        .eq('supplier_id', supplier.id);

      if (supplier.products.length > 0) {
        await supabase
          .from('supplier_products')
          .insert(
            supplier.products.map(p => ({
              supplier_id: supplier.id,
              name: p.name,
              sizes: p.sizes,
              unit_cost: p.unitCost,
            }))
          );
      }

      setSuppliers(prev => prev.map(s => s.id === supplier.id ? supplier : s));
      toast({ title: 'Fornecedor atualizado', description: `${supplier.name} foi atualizado com sucesso.` });
    } catch (error) {
      console.error('Error updating supplier:', error);
      toast({ title: 'Erro', description: 'Erro ao atualizar fornecedor', variant: 'destructive' });
      throw error;
    }
  };

  const deleteSupplier = async (supplierId: string) => {
    try {
      // First delete supplier products
      const { error: productsError } = await supabase
        .from('supplier_products')
        .delete()
        .eq('supplier_id', supplierId);

      if (productsError) throw productsError;

      // Then delete the supplier
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', supplierId);

      if (error) throw error;

      setSuppliers(prev => prev.filter(s => s.id !== supplierId));
      toast({ title: 'Fornecedor excluído', description: 'Fornecedor removido com sucesso.' });
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast({ title: 'Erro', description: 'Erro ao excluir fornecedor', variant: 'destructive' });
      throw error;
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return { suppliers, loading, addSupplier, updateSupplier, deleteSupplier, refetch: fetchSuppliers };
}
