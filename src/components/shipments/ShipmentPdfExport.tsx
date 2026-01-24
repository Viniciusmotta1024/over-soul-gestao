import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Shipment } from '@/hooks/useShipments';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface ShipmentPdfExportProps {
  shipment: Shipment;
  orders: Order[];
  costBreakdown: {
    totalShirts: number;
    dtfMeters: number;
    shirtsCost: number;
    shirtsFreight: number;
    dtfCost: number;
    dtfFreight: number;
    totalCost: number;
    costPerShirt: number;
  };
}

export function ShipmentPdfExport({ shipment, orders, costBreakdown }: ShipmentPdfExportProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const statusLabels = {
    open: 'Aberta',
    ordered: 'Pedida',
    received: 'Recebida',
    closed: 'Fechada',
  };

  const handleExport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório de Remessa', pageWidth / 2, 20, { align: 'center' });
    
    // Shipment info
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(shipment.name, 14, 35);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Status: ${statusLabels[shipment.status]}`, 14, 42);
    doc.text(`Data de criação: ${formatDate(shipment.createdAt)}`, 14, 48);
    if (shipment.notes) {
      doc.text(`Observações: ${shipment.notes}`, 14, 54);
    }
    
    // Cost breakdown
    const startY = shipment.notes ? 64 : 58;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo de Custos', 14, startY);
    
    autoTable(doc, {
      startY: startY + 5,
      head: [['Descrição', 'Quantidade', 'Valor']],
      body: [
        ['Camisas', `${costBreakdown.totalShirts} un`, formatCurrency(costBreakdown.shirtsCost)],
        ['Frete Camisas', '-', formatCurrency(costBreakdown.shirtsFreight)],
        ['DTF', `${costBreakdown.dtfMeters.toFixed(1)} m`, formatCurrency(costBreakdown.dtfCost)],
        ['Frete DTF', '-', formatCurrency(costBreakdown.dtfFreight)],
      ],
      foot: [['CUSTO TOTAL', '', formatCurrency(costBreakdown.totalCost)]],
      theme: 'striped',
      headStyles: { fillColor: [107, 114, 128] },
      footStyles: { fillColor: [34, 197, 94], textColor: [255, 255, 255], fontStyle: 'bold' },
    });
    
    // Get current Y position after table
    const tableEndY = (doc as any).lastAutoTable.finalY + 10;
    
    // Orders table
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Pedidos na Remessa', 14, tableEndY);
    
    if (orders.length > 0) {
      autoTable(doc, {
        startY: tableEndY + 5,
        head: [['Cliente', 'Produto', 'Tamanho', 'Qtd', 'Custo Un.', 'Venda Un.', 'Lucro']],
        body: orders.map(order => [
          order.customerName,
          order.product,
          order.size,
          order.quantity.toString(),
          formatCurrency(order.supplierCost),
          formatCurrency(order.salePrice),
          formatCurrency((order.salePrice - order.supplierCost) * order.quantity),
        ]),
        theme: 'striped',
        headStyles: { fillColor: [107, 114, 128] },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 40 },
          2: { cellWidth: 18 },
          3: { cellWidth: 15 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
          6: { cellWidth: 25 },
        },
      });
      
      // Summary
      const ordersTableEndY = (doc as any).lastAutoTable.finalY + 10;
      const totalRevenue = orders.reduce((sum, o) => sum + o.salePrice * o.quantity, 0);
      const totalProfit = totalRevenue - costBreakdown.totalCost;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`Receita Total: ${formatCurrency(totalRevenue)}`, 14, ordersTableEndY);
      doc.text(`Custo Total: ${formatCurrency(costBreakdown.totalCost)}`, 14, ordersTableEndY + 6);
      doc.setTextColor(34, 197, 94);
      doc.text(`Lucro Estimado: ${formatCurrency(totalProfit)}`, 14, ordersTableEndY + 12);
    } else {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Nenhum pedido nesta remessa.', 14, tableEndY + 10);
    }
    
    // Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(8);
    doc.text(`Gerado em ${formatDate(new Date())}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    // Save
    doc.save(`remessa-${shipment.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <FileText className="h-4 w-4 mr-2" />
      Exportar PDF
    </Button>
  );
}
