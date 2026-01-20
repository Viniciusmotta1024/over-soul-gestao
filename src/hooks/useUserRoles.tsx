import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export function useUserRoles() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if current user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        setIsAdmin(data?.role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Fetch all team members (only for admins)
  const fetchTeamMembers = async () => {
    if (!isAdmin) return;

    try {
      // Fetch profiles with their roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      const members: TeamMember[] = (profiles || []).map(profile => {
        const userRole = roles?.find(r => r.user_id === profile.user_id);
        return {
          id: profile.id,
          userId: profile.user_id,
          name: profile.name,
          email: profile.email || '',
          role: (userRole?.role as 'admin' | 'user') || 'user',
          createdAt: new Date(profile.created_at),
        };
      });

      setTeamMembers(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar a equipe.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchTeamMembers();
    }
  }, [isAdmin]);

  // Create new user (admin only)
  const createUser = async (email: string, password: string, name: string, role: 'admin' | 'user') => {
    if (!isAdmin) {
      toast({
        title: 'Acesso negado',
        description: 'Apenas administradores podem criar usuários.',
        variant: 'destructive',
      });
      return { error: new Error('Unauthorized') };
    }

    try {
      // Use signUp to create the user (this will trigger the profile creation and role assignment)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { name }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create profile manually since we're creating for another user
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ user_id: data.user.id, name, email });

        if (profileError) throw profileError;

        // Update role if needed (trigger sets 'user' by default for non-first users)
        if (role === 'admin') {
          const { error: roleError } = await supabase
            .from('user_roles')
            .update({ role: 'admin' })
            .eq('user_id', data.user.id);

          if (roleError) throw roleError;
        }

        toast({
          title: 'Usuário criado!',
          description: `${name} foi adicionado à equipe.`,
        });

        await fetchTeamMembers();
      }

      return { error: null };
    } catch (error: any) {
      console.error('Error creating user:', error);
      let message = 'Erro ao criar usuário.';
      if (error.message?.includes('User already registered')) {
        message = 'Este email já está cadastrado.';
      }
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return { error };
    }
  };

  // Update user role (admin only)
  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    if (!isAdmin) return { error: new Error('Unauthorized') };

    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: 'Papel atualizado!',
        description: `O usuário agora é ${newRole === 'admin' ? 'Administrador' : 'Funcionário'}.`,
      });

      await fetchTeamMembers();
      return { error: null };
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o papel.',
        variant: 'destructive',
      });
      return { error };
    }
  };

  // Delete user (admin only) - Note: this only removes from our system, not from auth
  const removeUser = async (userId: string) => {
    if (!isAdmin) return { error: new Error('Unauthorized') };

    // Prevent self-deletion
    if (userId === user?.id) {
      toast({
        title: 'Erro',
        description: 'Você não pode remover sua própria conta.',
        variant: 'destructive',
      });
      return { error: new Error('Cannot remove self') };
    }

    try {
      // Delete from profiles (role will cascade delete)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: 'Usuário removido!',
        description: 'O usuário foi removido da equipe.',
      });

      await fetchTeamMembers();
      return { error: null };
    } catch (error: any) {
      console.error('Error removing user:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o usuário.',
        variant: 'destructive',
      });
      return { error };
    }
  };

  return {
    isAdmin,
    loading,
    teamMembers,
    createUser,
    updateUserRole,
    removeUser,
    refetch: fetchTeamMembers,
  };
}
