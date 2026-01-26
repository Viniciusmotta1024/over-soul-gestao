import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

type EntityType = 'order' | 'client' | 'supplier' | 'product' | 'team' | 'auth' | 'shipment' | 'dtf_shipment';
type ActionType = 'create' | 'update' | 'delete' | 'login' | 'logout' | 'status_change';

class ActivityLoggerService {
  private userId: string | null = null;
  private userName: string | null = null;

  setUser(userId: string | null, userName: string | null) {
    this.userId = userId;
    this.userName = userName;
  }

  async log(
    action: ActionType,
    entityType: EntityType,
    entityId?: string,
    entityName?: string,
    details?: Record<string, unknown>
  ) {
    if (!this.userId) return;

    try {
      await supabase
        .from('activity_logs')
        .insert([{
          user_id: this.userId,
          user_name: this.userName,
          action,
          entity_type: entityType,
          entity_id: entityId || null,
          entity_name: entityName || null,
          details: (details as Json) || null,
        }]);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }
}

export const activityLogger = new ActivityLoggerService();
