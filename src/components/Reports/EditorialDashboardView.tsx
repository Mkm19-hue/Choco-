import React, { useState } from 'react';
import { SaleTransaction, formatAriary } from '../../types/pos';
import { ArrowRight, ShoppingBag, Truck, Users, Download, CheckCircle2, Eye, Calendar, Clock } from 'lucide-react';
import { AppView } from '../HeaderNav';

interface EditorialDashboardViewProps {
  transactions: SaleTransaction[];
  onNavigate: (view: AppView) => void;
  onViewReceipt: (transaction: SaleTransaction) => void;
  cashierName?: string;
}

export const EditorialDashboardView: React.FC<EditorialDashboardViewProps> = ({
  transactions,
  onNavigate,
  onViewReceipt,
  cashierName = 'Mathieu',
}) => {
  const [isZClosed, setIsZClosed] = useState(false);

  // Computed metrics
  const totalSalesTTC = transactions.reduce((acc, t) => acc + t.total, 0);
  const totalTaxAmount = transactions.reduce((acc, t) => acc + t.taxAmount, 0);
  const totalOrdersCount = transactions.length;
  const averageBasket = totalOrdersCount > 0 ? Math.round(totalSalesTTC / totalOrdersCount) : 0;

  // Payment breakdown
  const mobileMoneySales = transactions
    .filter((t) => ['mvola', 'orange_money', 'airtel_money'].includes(t.paymentMethod))
    .reduce((acc, t) => acc + t.total, 0);
  const cashSales = transactions
    .filter((t) => t.paymentMethod === 'cash')
    .reduce((acc, t) => acc + t.total, 0);
  const cardSales = transactions
    .filter((t) => t.paymentMethod === 'card')
    .reduce((acc, t) => acc + t.total, 0);

  // Percentages for subtle visual distribution bar
  const safeTotal = totalSalesTTC > 0 ? totalSalesTTC : 1;
  const mmPercent = Math.round((mobileMoneySales / safeTotal) * 100);
  const cashPercent = Math.round((cashSales / safeTotal) * 100);
  const cardPercent = Math.round((cardSales / safeTotal) * 100);

  // Recent 5 orders
  const recentOrders = transactions.slice(0, 5);

  // Export CSV for Accounting in Madagascar
  const handleExportCSV = () => {
    const headers = ['Commande', 'Date', 'Heure', 'Moyen Paiement', 'Total TTC (Ar)', 'Total HT (Ar)', 'TVA 20% (Ar)', 'Client', 'Articles'];
    const rows = transactions.map((t) => [
      t.receiptNumber,
      new Date(t.timestamp).toLocaleDateString('fr-FR'),
      new Date(t.timestamp).toLocaleTimeString('fr-FR'),
      t.paymentMethod === 'mvola' ? 'MVola' : t.paymentMethod === 'orange_money' ? 'Orange Money' : t.paymentMethod === 'airtel_money' ? 'Airtel Money' : t.paymentMethod === 'cash' ? 'Espèces' : 'Carte Bancaire',
      Math.round(t.total),
      Math.round(t.total - t.taxAmount),
      Math.round(t.taxAmount),
      t.customerName || 'Client de passage',
      t.items.map((i) => `${i.quantity}x ${i.product.name}`).join('; '),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((e) => e.map((val) => `"${val}"`).join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `journal_ventes_gourmandise_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FBF7EF] text-[#241811] p-4 sm:p-8 lg:p-12 pb-28 lg:pb-12">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* ============================================================ */}
        {/* EDITORIAL GREETING */}
        {/* ============================================================ */}
        <div className="space-y-2 border-b border-[#EFE7DE] pb-6">
          <span className="text-xs uppercase tracking-widest text-[#8C572F] font-semibold block">
            Tableau de Bord & Activité
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1F100A] tracking-tight">
            Bonjour {cashierName}
          </h1>
          <p className="text-sm sm:text-base text-[#75685F] font-sans">
            Voici l'activité de <strong className="text-[#1F100A] font-semibold">Gourmandise Chocolat</strong> aujourd'hui à Madagascar.
          </p>
        </div>

        {/* ============================================================ */}
        {/* SECTION VENTES: VISUALISATION PURE ET CLAIRE */}
        {/* ============================================================ */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#A69486] font-semibold block">
                Chiffre d'Affaires du Jour
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-[#1F100A]">
                  {formatAriary(totalSalesTTC)}
                </span>
                <span className="text-xs text-[#75685F]">
                  ({totalOrdersCount} commande{totalOrdersCount > 1 ? 's' : ''})
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-[#75685F] space-y-0.5">
              <div>Panier moyen : <strong className="text-[#1F100A] font-mono">{formatAriary(averageBasket)}</strong></div>
              <div>TVA 20% incluse : <span className="font-mono">{formatAriary(totalTaxAmount)}</span></div>
            </div>
          </div>

          {/* Clean Segmented Distribution Bar (Mobile Money / Espèces / Carte) */}
          <div className="space-y-2 pt-2">
            <div className="h-3 w-full rounded-full bg-[#EAE1D6] overflow-hidden flex">
              <div
                style={{ width: `${mmPercent}%` }}
                className="bg-[#8C572F] transition-all duration-500"
                title={`Mobile Money: ${formatAriary(mobileMoneySales)} (${mmPercent}%)`}
              />
              <div
                style={{ width: `${cashPercent}%` }}
                className="bg-[#2F8F61] transition-all duration-500"
                title={`Espèces: ${formatAriary(cashSales)} (${cashPercent}%)`}
              />
              <div
                style={{ width: `${cardPercent}%` }}
                className="bg-[#1F100A] transition-all duration-500"
                title={`Carte bancaire: ${formatAriary(cardSales)} (${cardPercent}%)`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#75685F]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8C572F]" />
                <span>Mobile Money : <strong className="text-[#1F100A] font-mono">{formatAriary(mobileMoneySales)}</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2F8F61]" />
                <span>Espèces : <strong className="text-[#1F100A] font-mono">{formatAriary(cashSales)}</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1F100A]" />
                <span>Carte bancaire : <strong className="text-[#1F100A] font-mono">{formatAriary(cardSales)}</strong></span>
              </span>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION COMMANDES RÉCENTES */}
        {/* ============================================================ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#EFE7DE] pb-2">
            <h2 className="font-serif font-bold text-lg text-[#1F100A]">
              Commandes Récentes
            </h2>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs text-[#8C572F] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Voir tout l'historique</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#EAE1D6] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#D9CCBE] transition"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#1F100A]">
                      {order.receiptNumber}
                    </span>
                    <span className="text-xs text-[#75685F]">·</span>
                    <span className="text-xs text-[#75685F]">
                      {order.customerName || 'Client de passage'}
                    </span>
                    <span className="text-[10px] text-[#8C572F] bg-[#FBF4E8] px-2 py-0.5 rounded-full">
                      {order.orderType === 'delivery' ? `Livraison (${order.deliveryZone?.name || 'Mada'})` : 'Retrait boutique'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#75685F] truncate">
                    {order.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F5EFE7]">
                  <span className="font-mono font-bold text-sm sm:text-base text-[#1F100A]">
                    {formatAriary(order.total)}
                  </span>
                  <button
                    onClick={() => onViewReceipt(order)}
                    className="p-1.5 rounded-full text-[#75685F] hover:text-[#1F100A] hover:bg-[#FBF7EF] transition"
                    title="Voir le reçu"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {recentOrders.length === 0 && (
              <p className="text-xs text-[#75685F] py-4">Aucune commande enregistrée pour l'instant.</p>
            )}
          </div>
        </section>

        {/* ============================================================ */}
        {/* ACTIONS RAPIDES */}
        {/* ============================================================ */}
        <section className="space-y-4">
          <h2 className="font-serif font-bold text-lg text-[#1F100A] border-b border-[#EFE7DE] pb-2">
            Actions Rapides
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => onNavigate('pos')}
              className="p-4 rounded-3xl bg-white border border-[#EAE1D6] text-left hover:border-[#1F100A] transition shadow-xs group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <ShoppingBag className="w-5 h-5 text-[#8C572F]" />
                <ArrowRight className="w-4 h-4 text-[#A69486] group-hover:text-[#1F100A] group-hover:translate-x-0.5 transition" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-[#1F100A]">
                  Nouvelle Vente Caisse
                </h3>
                <p className="text-[11px] text-[#75685F] mt-0.5">
                  Prendre une commande immédiate en Ariary.
                </p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('deliveries')}
              className="p-4 rounded-3xl bg-white border border-[#EAE1D6] text-left hover:border-[#1F100A] transition shadow-xs group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <Truck className="w-5 h-5 text-[#8C572F]" />
                <ArrowRight className="w-4 h-4 text-[#A69486] group-hover:text-[#1F100A] group-hover:translate-x-0.5 transition" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-[#1F100A]">
                  Zones de Livraison
                </h3>
                <p className="text-[11px] text-[#75685F] mt-0.5">
                  Ajuster tarifs et délais des quartiers.
                </p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('customers')}
              className="p-4 rounded-3xl bg-white border border-[#EAE1D6] text-left hover:border-[#1F100A] transition shadow-xs group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <Users className="w-5 h-5 text-[#8C572F]" />
                <ArrowRight className="w-4 h-4 text-[#A69486] group-hover:text-[#1F100A] group-hover:translate-x-0.5 transition" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-[#1F100A]">
                  Fidélité & Clients
                </h3>
                <p className="text-[11px] text-[#75685F] mt-0.5">
                  Rechercher ou ajouter un client +261.
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* ============================================================ */}
        {/* CLÔTURE DE JOURNÉE & EXPORT CSV */}
        {/* ============================================================ */}
        <section className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#EFE7DE]">
          <div className="text-xs text-[#75685F]">
            Date du rapport : {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-full bg-white border border-[#E0D5C7] text-xs font-medium text-[#1F100A] hover:bg-[#FBF7EF] transition flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#8C572F]" />
              <span>Exporter CSV</span>
            </button>

            <button
              onClick={() => setIsZClosed(true)}
              className="px-4 py-2 rounded-full bg-[#1F100A] text-white text-xs font-semibold hover:bg-[#40200F] transition flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#E6B352]" />
              <span>{isZClosed ? 'Journée clôturée' : 'Clôture Journalière (Rapport Z)'}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
