import { useState } from 'react';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Download, FileText, Table, CalendarIcon } from 'lucide-react';
import { format, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';

interface ReportExportProps {
  orders: Order[];
}

export function ReportExport({ orders }: ReportExportProps) {
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const { toast } = useToast();

  const getFilteredOrders = () => {
    return orders.filter(order => {
      if (dateFrom && isBefore(order.createdAt, startOfDay(dateFrom))) return false;
      if (dateTo && isAfter(order.createdAt, endOfDay(dateTo))) return false;
      return true;
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const calculateStats = (filteredOrders: Order[]) => {
    const totalRevenue = filteredOrders.reduce((acc, o) => acc + (o.salePrice * o.quantity), 0);
    const totalCost = filteredOrders.reduce((acc, o) => acc + (o.supplierCost * o.quantity), 0);
    const totalProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    const channelStats = {
      shopee: filteredOrders.filter(o => o.channel === 'shopee'),
      ministerio: filteredOrders.filter(o => o.channel === 'ministerio'),
      site: filteredOrders.filter(o => o.channel === 'site'),
    };

    const statusStats = {
      pending: filteredOrders.filter(o => o.status === 'pending').length,
      processing: filteredOrders.filter(o => o.status === 'processing').length,
      completed: filteredOrders.filter(o => o.status === 'completed').length,
      cancelled: filteredOrders.filter(o => o.status === 'cancelled').length,
    };

    return { totalRevenue, totalCost, totalProfit, profitMargin, channelStats, statusStats };
  };

  const exportToPDF = () => {
    const filteredOrders = getFilteredOrders();
    const stats = calculateStats(filteredOrders);
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(90, 107, 71); // Primary color
    doc.text('OverSoul', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('Relatório de Vendas', pageWidth / 2, 30, { align: 'center' });
    
    // Date range
    let dateText = 'Período: Todos os pedidos';
    if (dateFrom || dateTo) {
      const fromStr = dateFrom ? format(dateFrom, 'dd/MM/yyyy', { locale: ptBR }) : 'Início';
      const toStr = dateTo ? format(dateTo, 'dd/MM/yyyy', { locale: ptBR }) : 'Hoje';
      dateText = `Período: ${fromStr} até ${toStr}`;
    }
    doc.setFontSize(10);
    doc.text(dateText, pageWidth / 2, 38, { align: 'center' });
    doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, pageWidth / 2, 44, { align: 'center' });

    // Summary
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Resumo Financeiro', 14, 58);
    
    autoTable(doc, {
      startY: 62,
      head: [['Métrica', 'Valor']],
      body: [
        ['Total de Pedidos', filteredOrders.length.toString()],
        ['Faturamento Total', formatCurrency(stats.totalRevenue)],
        ['Custo Total', formatCurrency(stats.totalCost)],
        ['Lucro Líquido', formatCurrency(stats.totalProfit)],
        ['Margem de Lucro', `${stats.profitMargin.toFixed(1)}%`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [90, 107, 71] },
    });

    // Channel breakdown
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.text('Vendas por Canal', 14, finalY + 14);
    
    autoTable(doc, {
      startY: finalY + 18,
      head: [['Canal', 'Pedidos', 'Faturamento', 'Lucro']],
      body: [
        [
          'Shopee',
          stats.channelStats.shopee.length.toString(),
          formatCurrency(stats.channelStats.shopee.reduce((acc, o) => acc + o.salePrice * o.quantity, 0)),
          formatCurrency(stats.channelStats.shopee.reduce((acc, o) => acc + (o.salePrice - o.supplierCost) * o.quantity, 0)),
        ],
        [
          'Vista o seu Ministério',
          stats.channelStats.ministerio.length.toString(),
          formatCurrency(stats.channelStats.ministerio.reduce((acc, o) => acc + o.salePrice * o.quantity, 0)),
          formatCurrency(stats.channelStats.ministerio.reduce((acc, o) => acc + (o.salePrice - o.supplierCost) * o.quantity, 0)),
        ],
        [
          'Site Próprio',
          stats.channelStats.site.length.toString(),
          formatCurrency(stats.channelStats.site.reduce((acc, o) => acc + o.salePrice * o.quantity, 0)),
          formatCurrency(stats.channelStats.site.reduce((acc, o) => acc + (o.salePrice - o.supplierCost) * o.quantity, 0)),
        ],
      ],
      theme: 'striped',
      headStyles: { fillColor: [90, 107, 71] },
    });

    // Status breakdown
    const finalY2 = (doc as any).lastAutoTable.finalY || 150;
    doc.text('Status dos Pedidos', 14, finalY2 + 14);
    
    autoTable(doc, {
      startY: finalY2 + 18,
      head: [['Status', 'Quantidade']],
      body: [
        ['Pendentes', stats.statusStats.pending.toString()],
        ['Processando', stats.statusStats.processing.toString()],
        ['Concluídos', stats.statusStats.completed.toString()],
        ['Cancelados', stats.statusStats.cancelled.toString()],
      ],
      theme: 'striped',
      headStyles: { fillColor: [90, 107, 71] },
    });

    // Orders list (new page)
    doc.addPage();
    doc.setFontSize(12);
    doc.text('Lista de Pedidos', 14, 20);
    
    autoTable(doc, {
      startY: 24,
      head: [['Data', 'Cliente', 'Produto', 'Qtd', 'Canal', 'Status', 'Venda', 'Lucro']],
      body: filteredOrders.map(o => [
        format(o.createdAt, 'dd/MM/yyyy', { locale: ptBR }),
        o.customerName.substring(0, 15),
        o.product.substring(0, 15),
        o.quantity.toString(),
        o.channel === 'shopee' ? 'Shopee' : o.channel === 'ministerio' ? 'Ministério' : 'Site',
        o.status === 'pending' ? 'Pendente' : o.status === 'processing' ? 'Processando' : o.status === 'completed' ? 'Concluído' : 'Cancelado',
        formatCurrency(o.salePrice * o.quantity),
        formatCurrency((o.salePrice - o.supplierCost) * o.quantity),
      ]),
      theme: 'striped',
      headStyles: { fillColor: [90, 107, 71] },
      styles: { fontSize: 8 },
    });

    doc.save(`relatorio-oversoul-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    toast({ title: 'PDF exportado', description: 'Relatório baixado com sucesso.' });
  };

  const exportToExcel = () => {
    const filteredOrders = getFilteredOrders();
    const stats = calculateStats(filteredOrders);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Summary sheet
    const summaryData = [
      ['RELATÓRIO OVERSOUL'],
      [''],
      ['Período:', dateFrom ? format(dateFrom, 'dd/MM/yyyy') : 'Início', 'até', dateTo ? format(dateTo, 'dd/MM/yyyy') : 'Hoje'],
      ['Gerado em:', format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })],
      [''],
      ['RESUMO FINANCEIRO'],
      ['Total de Pedidos', filteredOrders.length],
      ['Faturamento Total', stats.totalRevenue],
      ['Custo Total', stats.totalCost],
      ['Lucro Líquido', stats.totalProfit],
      ['Margem de Lucro', `${stats.profitMargin.toFixed(1)}%`],
      [''],
      ['VENDAS POR CANAL'],
      ['Canal', 'Pedidos', 'Faturamento', 'Lucro'],
      ['Shopee', stats.channelStats.shopee.length, 
        stats.channelStats.shopee.reduce((acc, o) => acc + o.salePrice * o.quantity, 0),
        stats.channelStats.shopee.reduce((acc, o) => acc + (o.salePrice - o.supplierCost) * o.quantity, 0)],
      ['Vista o seu Ministério', stats.channelStats.ministerio.length,
        stats.channelStats.ministerio.reduce((acc, o) => acc + o.salePrice * o.quantity, 0),
        stats.channelStats.ministerio.reduce((acc, o) => acc + (o.salePrice - o.supplierCost) * o.quantity, 0)],
      ['Site Próprio', stats.channelStats.site.length,
        stats.channelStats.site.reduce((acc, o) => acc + o.salePrice * o.quantity, 0),
        stats.channelStats.site.reduce((acc, o) => acc + (o.salePrice - o.supplierCost) * o.quantity, 0)],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Resumo');
    
    // Orders sheet
    const ordersData = [
      ['Data', 'Cliente', 'Produto', 'Tamanho', 'Quantidade', 'Canal', 'Status', 'Custo Un.', 'Venda Un.', 'Total Venda', 'Lucro'],
      ...filteredOrders.map(o => [
        format(o.createdAt, 'dd/MM/yyyy', { locale: ptBR }),
        o.customerName,
        o.product,
        o.size,
        o.quantity,
        o.channel === 'shopee' ? 'Shopee' : o.channel === 'ministerio' ? 'Vista o seu Ministério' : 'Site Próprio',
        o.status === 'pending' ? 'Pendente' : o.status === 'processing' ? 'Processando' : o.status === 'completed' ? 'Concluído' : 'Cancelado',
        o.supplierCost,
        o.salePrice,
        o.salePrice * o.quantity,
        (o.salePrice - o.supplierCost) * o.quantity,
      ]),
    ];
    const ordersSheet = XLSX.utils.aoa_to_sheet(ordersData);
    XLSX.utils.book_append_sheet(wb, ordersSheet, 'Pedidos');
    
    // Export
    XLSX.writeFile(wb, `relatorio-oversoul-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast({ title: 'Excel exportado', description: 'Relatório baixado com sucesso.' });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Date From */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[140px] justify-start text-left font-normal",
              !dateFrom && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateFrom ? format(dateFrom, "dd/MM/yy", { locale: ptBR }) : "De"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateFrom}
            onSelect={setDateFrom}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Date To */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[140px] justify-start text-left font-normal",
              !dateTo && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateTo ? format(dateTo, "dd/MM/yy", { locale: ptBR }) : "Até"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateTo}
            onSelect={setDateTo}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Export Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={exportToPDF} className="gap-2 cursor-pointer">
            <FileText className="h-4 w-4" />
            Exportar PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportToExcel} className="gap-2 cursor-pointer">
            <Table className="h-4 w-4" />
            Exportar Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
