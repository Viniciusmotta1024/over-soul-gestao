import { DollarSign, Package, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UnpaidShipmentAlert } from '@/hooks/useUnpaidShipmentAlerts';
import { Order } from '@/types';
import { Shipment } from '@/hooks/useShipments';

interface UnpaidShipmentsSummaryProps {
  alerts: UnpaidShipmentAlert[];
  orders: Order[];
  shipments: Shipment[];
  onNavigateToOrders: (shipmentId: string) => void;
  onNavigateToShipments: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export function UnpaidShipmentsSummary({ 
  alerts, 
  orders, 
  shipments,
  onNavigateToOrders,
  onNavigateToShipments 
}: UnpaidShipmentsSummaryProps) {
  // Calculate totals
  const totalUnpaidOrders = alerts.reduce((sum, a) => sum + a.unpaidOrdersCount, 0);
  const totalUnpaidValue = alerts.reduce((sum, a) => sum + a.totalUnpaidValue, 0);
  
  // Get shipment details for each alert
  const alertsWithDetails = alerts.map(alert => {
    const shipment = shipments.find(s => s.id === alert.shipmentId);
    const shipmentOrders = orders.filter(o => o.shipmentId === alert.shipmentId);
    const paidOrders = shipmentOrders.filter(o => o.isPaid);
    const paidValue = paidOrders.reduce((sum, o) => sum + (o.salePrice * o.quantity), 0);
    const totalValue = shipmentOrders.reduce((sum, o) => sum + (o.salePrice * o.quantity), 0);
    const paymentProgress = totalValue > 0 ? (paidValue / totalValue) * 100 : 0;
    
    return {
      ...alert,
      shipment,
      totalOrders: shipmentOrders.length,
      paidOrders: paidOrders.length,
      paidValue,
      totalValue,
      paymentProgress,
    };
  });

  if (alerts.length === 0) {
    return (
      <Card className="border-success/30 bg-success/5">
        <CardContent className="flex items-center gap-4 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/20">
            <CheckCircle className="h-6 w-6 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-success">Todos os pagamentos em dia!</h3>
            <p className="text-sm text-muted-foreground">
              Não há remessas pedidas com pagamentos pendentes.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-lg text-destructive">Pagamentos Pendentes</CardTitle>
              <p className="text-sm text-muted-foreground">
                {alerts.length} remessa{alerts.length > 1 ? 's' : ''} aguardando pagamento
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onNavigateToShipments}>
            Ver Remessas
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-background/80 p-3 border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Package className="h-4 w-4" />
              Pedidos Não Pagos
            </div>
            <div className="text-2xl font-bold text-destructive">{totalUnpaidOrders}</div>
          </div>
          <div className="rounded-lg bg-background/80 p-3 border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" />
              Valor Pendente
            </div>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(totalUnpaidValue)}</div>
          </div>
        </div>

        {/* Individual Shipments */}
        <div className="space-y-3">
          {alertsWithDetails.map((alert) => (
            <div 
              key={alert.shipmentId} 
              className="rounded-lg bg-background/80 p-3 border hover:border-destructive/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-destructive" />
                  <span className="font-medium">{alert.shipmentName}</span>
                  <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                    Pedida
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onNavigateToOrders(alert.shipmentId)}
                >
                  Ver pedidos
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
              
              {/* Payment Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {alert.paidOrders}/{alert.totalOrders} pedidos pagos
                  </span>
                  <span className="font-medium">
                    {formatCurrency(alert.paidValue)} / {formatCurrency(alert.totalValue)}
                  </span>
                </div>
                <Progress 
                  value={alert.paymentProgress} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="text-destructive font-medium">
                    {alert.unpaidOrdersCount} não pago{alert.unpaidOrdersCount > 1 ? 's' : ''}
                  </span>
                  <span className="text-destructive font-medium">
                    - {formatCurrency(alert.totalUnpaidValue)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
