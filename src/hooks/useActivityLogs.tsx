import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Json } from '@/integrations/supabase/types';

export interface ActivityLog {
  id: string;
  userId: string | null;
  userName: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  entityName: string | null;
  details: Record<string, unknown> | null;
  createdAt: Date;
}

type EntityType = 'order' | 'client' | 'supplier' | 'product' | 'team' | 'auth';
type ActionType = 'create' | 'update' | 'delete' | 'login' | 'logout' | 'status_change';

export function useActivityLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async (limit = 100) => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      setLogs((data || []).map(log => ({
        id: log.id,
        userId: log.user_id,
        userName: log.user_name,
        action: log.action,
        entityType: log.entity_type,
        entityId: log.entity_id,
        entityName: log.entity_name,
        details: log.details as Record<string, unknown> | null,
        createdAt: new Date(log.created_at),
      })));
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const logActivity = useCallback(async (
    action: ActionType,
    entityType: EntityType,
    entityId?: string,
    entityName?: string,
    details?: Record<string, unknown>
  ) => {
    if (!user) return;

    try {
      // Get user name from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('user_id', user.id)
        .maybeSingle();

      const { error } = await supabase
        .from('activity_logs')
        .insert([{
          user_id: user.id,
          user_name: profile?.name || user.email,
          action,
          entity_type: entityType,
          entity_id: entityId || null,
          entity_name: entityName || null,
          details: (details as Json) || null,
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }, [user]);

  return {
    logs,
    loading,
    logActivity,
    refetch: fetchLogs,
  };
}
