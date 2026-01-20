import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calculator, TrendingUp, Package, Scissors, DollarSign, FileDown, Save, History, Trash2, Truck } from 'lucide-react';
import { useQuotes, Quote } from '@/hooks/useQuotes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Tipos de camisas disponíveis
const shirtTypes = [
  { id: 'oversized-ribana', name: 'Oversized Gola Alta Ribana', price: 22.90 },
  { id: 'oversized-lisa', name: 'Oversized 100% Algodão Fio 30/1 - Lisa, Gola Redonda', price: 19.90 },
];

// Custos de frete
const SHIRT_FREIGHT = 19.90;
const DTF_FREIGHT = 12.59;

// Tabela de preços do DTF por metro
const getDTFPrice = (meters: number): number => {
  if (meters >= 100) return 22.90;
  if (meters >= 50) return 23.90;
  if (meters >= 20) return 24.90;
  if (meters >= 2) return 25.90;
  return 32.90;
};

// Faixas de preço DTF para exibição
const dtfPriceTiers = [
  { min: 1, max: 1, price: 32.90, label: '1 metro' },
  { min: 2, max: 19, price: 25.90, label: '2-19 metros' },
  { min: 20, max: 49, price: 24.90, label: '20-49 metros' },
  { min: 50, max: 99, price: 23.90, label: '50-99 metros' },
  { min: 100, max: Infinity, price: 22.90, label: '100+ metros' },
];

export function PricingCalculator() {
  const { quotes, loading, addQuote, deleteQuote } = useQuotes();
  
  const [shirtType, setShirtType] = useState(shirtTypes[0].id);
  const [quantity, setQuantity] = useState(1);
  const [dtfMeters, setDtfMeters] = useState(0);
  const [profitMargin, setProfitMargin] = useState(50);
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [includeShirtFreight, setIncludeShirtFreight] = useState(true);
  const [includeDtfFreight, setIncludeDtfFreight] = useState(true);

  const selectedShirt = shirtTypes.find(s => s.id === shirtType) || shirtTypes[0];
  const dtfPricePerMeter = useMemo(() => getDTFPrice(dtfMeters), [dtfMeters]);
  
  // Cálculos
  const shirtCost = selectedShirt.price * quantity;
  const dtfCost = dtfMeters > 0 ? dtfPricePerMeter * dtfMeters : 0;
  const shirtFreightCost = includeShirtFreight ? SHIRT_FREIGHT : 0;
  const dtfFreightCost = includeDtfFreight && dtfMeters > 0 ? DTF_FREIGHT : 0;
  const totalCost = shirtCost + dtfCost + shirtFreightCost + dtfFreightCost;
  const costPerUnit = quantity > 0 ? totalCost / quantity : 0;
  const profitAmount = totalCost * (profitMargin / 100);
  const suggestedTotal = totalCost + profitAmount;
  const suggestedUnitPrice = quantity > 0 ? suggestedTotal / quantity : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getCurrentDTFTier = () => {
    return dtfPriceTiers.find(tier => dtfMeters >= tier.min && dtfMeters <= tier.max);
  };

  const handleSaveQuote = async () => {
    await addQuote({
      customerName: customerName || undefined,
      shirtType: selectedShirt.name,
      shirtPrice: selectedShirt.price,
      quantity,
      dtfMeters,
      dtfPricePerMeter,
      shirtFreight: shirtFreightCost,
      dtfFreight: dtfFreightCost,
      profitMargin,
      totalCost,
      suggestedPrice: suggestedTotal,
      notes: notes || undefined,
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('OVERSOUL', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Orçamento Detalhado', pageWidth / 2, 30, { align: 'center' });
    
    // Data e cliente
    doc.setFontSize(10);
    doc.text(`Data: ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`, 14, 45);
    if (customerName) {
      doc.text(`Cliente: ${customerName}`, 14, 52);
    }
    
    // Tabela de itens
    const tableData: any[][] = [
      [selectedShirt.name, quantity.toString(), formatCurrency(selectedShirt.price), formatCurrency(shirtCost)],
    ];
    
    if (dtfMeters > 0) {
      tableData.push([
        `DTF (${getCurrentDTFTier()?.label || ''})`,
        `${dtfMeters}m`,
        formatCurrency(dtfPricePerMeter),
        formatCurrency(dtfCost),
      ]);
    }
    
    if (shirtFreightCost > 0) {
      tableData.push(['Frete Camisas', '1', formatCurrency(shirtFreightCost), formatCurrency(shirtFreightCost)]);
    }
    
    if (dtfFreightCost > 0) {
      tableData.push(['Frete DTF', '1', formatCurrency(dtfFreightCost), formatCurrency(dtfFreightCost)]);
    }
    
    autoTable(doc, {
      startY: customerName ? 60 : 52,
      head: [['Item', 'Qtd', 'Valor Unit.', 'Subtotal']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [41, 37, 36] },
      styles: { fontSize: 10 },
    });
    
    const finalY = (doc as any).lastAutoTable.finalY || 80;
    
    // Resumo
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo', 14, finalY + 15);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Custo Total: ${formatCurrency(totalCost)}`, 14, finalY + 25);
    doc.text(`Custo por Unidade: ${formatCurrency(costPerUnit)}`, 14, finalY + 32);
    doc.text(`Margem de Lucro: ${profitMargin}%`, 14, finalY + 39);
    doc.text(`Lucro Estimado: ${formatCurrency(profitAmount)}`, 14, finalY + 46);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`VALOR FINAL: ${formatCurrency(suggestedTotal)}`, 14, finalY + 58);
    doc.text(`Preço por Unidade: ${formatCurrency(suggestedUnitPrice)}`, 14, finalY + 66);
    
    // Observações
    if (notes) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Observações:', 14, finalY + 80);
      doc.text(notes, 14, finalY + 87, { maxWidth: pageWidth - 28 });
    }
    
    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text('OVERSOUL - Vista sua fé!', pageWidth / 2, footerY, { align: 'center' });
    
    doc.save(`orcamento-oversoul-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`);
  };

  const loadQuote = (quote: Quote) => {
    const shirt = shirtTypes.find(s => s.name === quote.shirtType);
    if (shirt) setShirtType(shirt.id);
    setQuantity(quote.quantity);
    setDtfMeters(quote.dtfMeters);
    setProfitMargin(quote.profitMargin);
    setCustomerName(quote.customerName || '');
    setNotes(quote.notes || '');
    setIncludeShirtFreight(quote.shirtFreight > 0);
    setIncludeDtfFreight(quote.dtfFreight > 0);
  };

  return (
    <div className="space-y-6">
      {/* Tabelas de Referência */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-4 w-4 text-primary" />
              Preços das Camisas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {shirtTypes.map(shirt => (
              <div key={shirt.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <span className="text-sm text-muted-foreground">{shirt.name}</span>
                <Badge variant="secondary" className="font-mono">
                  {formatCurrency(shirt.price)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Scissors className="h-4 w-4 text-primary" />
              Preços do DTF (por metro)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dtfPriceTiers.map((tier, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between py-2 border-b border-border/30 last:border-0 ${
                  getCurrentDTFTier()?.min === tier.min ? 'bg-primary/10 -mx-2 px-2 rounded' : ''
                }`}
              >
                <span className="text-sm text-muted-foreground">{tier.label}</span>
                <Badge variant={getCurrentDTFTier()?.min === tier.min ? "default" : "secondary"} className="font-mono">
                  {formatCurrency(tier.price)}/m
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Truck className="h-4 w-4 text-primary" />
              Custos de Frete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">Frete Camisas</span>
              <Badge variant="secondary" className="font-mono">
                {formatCurrency(SHIRT_FREIGHT)}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Frete DTF</span>
              <Badge variant="secondary" className="font-mono">
                {formatCurrency(DTF_FREIGHT)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calculadora Principal */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Calculadora de Precificação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nome do Cliente */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nome do Cliente (opcional)</Label>
              <Input
                placeholder="Ex: Igreja Batista Central"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Tipo de Camisa */}
            <div className="space-y-2">
              <Label>Tipo de Camisa</Label>
              <Select value={shirtType} onValueChange={setShirtType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {shirtTypes.map(shirt => (
                    <SelectItem key={shirt.id} value={shirt.id}>
                      {shirt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Custo unitário: {formatCurrency(selectedShirt.price)}
              </p>
            </div>

            {/* Quantidade */}
            <div className="space-y-2">
              <Label>Quantidade de Camisas</Label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <p className="text-xs text-muted-foreground">
                Total camisas: {formatCurrency(shirtCost)}
              </p>
            </div>

            {/* DTF */}
            <div className="space-y-2">
              <Label>Metros de DTF</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={dtfMeters}
                onChange={(e) => setDtfMeters(Math.max(0, parseFloat(e.target.value) || 0))}
              />
              <p className="text-xs text-muted-foreground">
                {dtfMeters > 0 ? (
                  <>Preço: {formatCurrency(dtfPricePerMeter)}/m = {formatCurrency(dtfCost)}</>
                ) : (
                  'Sem DTF'
                )}
              </p>
            </div>

            {/* Margem de Lucro */}
            <div className="space-y-2">
              <Label>Margem de Lucro (%)</Label>
              <Input
                type="number"
                min="0"
                max="500"
                value={profitMargin}
                onChange={(e) => setProfitMargin(Math.max(0, parseFloat(e.target.value) || 0))}
              />
              <p className="text-xs text-muted-foreground">
                Lucro desejado: {formatCurrency(profitAmount)}
              </p>
            </div>
          </div>

          {/* Opções de Frete */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeShirtFreight}
                onChange={(e) => setIncludeShirtFreight(e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm">Incluir frete camisas ({formatCurrency(SHIRT_FREIGHT)})</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeDtfFreight}
                onChange={(e) => setIncludeDtfFreight(e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm">Incluir frete DTF ({formatCurrency(DTF_FREIGHT)})</span>
            </label>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label>Observações (opcional)</Label>
            <Textarea
              placeholder="Informações adicionais sobre o orçamento..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Resumo de Custos */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pt-4 border-t border-border/50">
            <Card className="bg-muted/30 border-0">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Custo Total</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalCost)}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/30 border-0">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Custo por Unidade</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(costPerUnit)}</p>
              </CardContent>
            </Card>

            <Card className="bg-primary/10 border-0">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-primary uppercase tracking-wide mb-1 flex items-center justify-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Preço Sugerido (Total)
                </p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(suggestedTotal)}</p>
              </CardContent>
            </Card>

            <Card className="bg-green-500/10 border-0">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-green-600 dark:text-green-400 uppercase tracking-wide mb-1 flex items-center justify-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Preço por Unidade
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(suggestedUnitPrice)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border/50">
            <Button onClick={generatePDF} className="gap-2">
              <FileDown className="h-4 w-4" />
              Exportar PDF
            </Button>
            <Button onClick={handleSaveQuote} variant="secondary" className="gap-2">
              <Save className="h-4 w-4" />
              Salvar Orçamento
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detalhamento */}
      <Card className="glass border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">📋 Detalhamento do Orçamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 font-medium text-muted-foreground">Item</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Qtd</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Valor Unit.</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/30">
                  <td className="py-3">{selectedShirt.name}</td>
                  <td className="text-right py-3">{quantity}</td>
                  <td className="text-right py-3 font-mono">{formatCurrency(selectedShirt.price)}</td>
                  <td className="text-right py-3 font-mono font-medium">{formatCurrency(shirtCost)}</td>
                </tr>
                {dtfMeters > 0 && (
                  <tr className="border-b border-border/30">
                    <td className="py-3">DTF ({getCurrentDTFTier()?.label})</td>
                    <td className="text-right py-3">{dtfMeters}m</td>
                    <td className="text-right py-3 font-mono">{formatCurrency(dtfPricePerMeter)}</td>
                    <td className="text-right py-3 font-mono font-medium">{formatCurrency(dtfCost)}</td>
                  </tr>
                )}
                {shirtFreightCost > 0 && (
                  <tr className="border-b border-border/30">
                    <td className="py-3">Frete Camisas</td>
                    <td className="text-right py-3">1</td>
                    <td className="text-right py-3 font-mono">{formatCurrency(SHIRT_FREIGHT)}</td>
                    <td className="text-right py-3 font-mono font-medium">{formatCurrency(shirtFreightCost)}</td>
                  </tr>
                )}
                {dtfFreightCost > 0 && (
                  <tr className="border-b border-border/30">
                    <td className="py-3">Frete DTF</td>
                    <td className="text-right py-3">1</td>
                    <td className="text-right py-3 font-mono">{formatCurrency(DTF_FREIGHT)}</td>
                    <td className="text-right py-3 font-mono font-medium">{formatCurrency(dtfFreightCost)}</td>
                  </tr>
                )}
                <tr className="border-b border-border/50 bg-muted/20">
                  <td className="py-3 font-medium" colSpan={3}>Custo Total</td>
                  <td className="text-right py-3 font-mono font-bold">{formatCurrency(totalCost)}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 text-muted-foreground" colSpan={3}>+ Margem de Lucro ({profitMargin}%)</td>
                  <td className="text-right py-3 font-mono text-green-600 dark:text-green-400">+{formatCurrency(profitAmount)}</td>
                </tr>
                <tr className="bg-primary/5">
                  <td className="py-4 font-bold text-primary" colSpan={3}>Valor Final Sugerido</td>
                  <td className="text-right py-4 font-mono font-bold text-primary text-lg">{formatCurrency(suggestedTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Orçamentos */}
      <Card className="glass border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4 text-primary" />
            Histórico de Orçamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Carregando...</p>
          ) : quotes.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum orçamento salvo ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 font-medium text-muted-foreground">Data</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Cliente</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Produto</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Qtd</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Valor Final</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="border-b border-border/30 hover:bg-muted/20">
                      <td className="py-3 text-muted-foreground">
                        {format(quote.createdAt, "dd/MM/yyyy HH:mm")}
                      </td>
                      <td className="py-3">{quote.customerName || '-'}</td>
                      <td className="py-3">{quote.shirtType}</td>
                      <td className="text-right py-3">{quote.quantity}</td>
                      <td className="text-right py-3 font-mono font-medium text-primary">
                        {formatCurrency(quote.suggestedPrice)}
                      </td>
                      <td className="text-right py-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => loadQuote(quote)}
                            title="Carregar orçamento"
                          >
                            <Calculator className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteQuote(quote.id)}
                            className="text-destructive hover:text-destructive"
                            title="Excluir orçamento"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
