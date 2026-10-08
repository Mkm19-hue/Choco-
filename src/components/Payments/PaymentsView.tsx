import React, { useState } from 'react';
import { SaleTransaction, PaymentMethod, PaymentStatus, formatAriary } from '../../types/pos';
import { Search, CreditCard, Smartphone, Banknote, CheckCircle2, Clock, AlertTriangle, Eye, ArrowUpRight, Check, X } from 'lucide-react';

interface PaymentsViewProps {
  transactions: SaleTransaction[];
  onUpdatePaymentStatus: (transactionId: string, status: PaymentStatus, ref?: string) => void;
  onViewReceipt: (transaction: SaleTransaction) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  transactions,
  onUpdatePaymentStatus,
  onViewReceipt,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedTxForDetail, setSelectedTxForDetail] = useState<SaleTransaction | null>(null);
  const [manualRefInput, setManualRefInput] = useState('');

  // Computations
  const totalAll = transactions.reduce((acc, t) => acc + t.total, 0);

  const mobileMoneyTotal = transactions
    .filter((t) => ['mvola', 'orange_money', 'airtel_money'].includes(t.paymentMethod))
    .reduce((acc, t) => acc + t.total, 0);

  const cashTotal = transactions
    .filter((t) => t.paymentMethod === 'cash')
    .reduce((acc, t) => acc + t.total, 0);

  const cardTotal = transactions
    .filter((t) => t.paymentMethod === 'card')
    .reduce((acc, t) => acc + t.total, 0);

  const pendingCount = transactions.filter((t) => t.paymentStatus === 'pending').length;

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === 'mobile_money') {
      if (!['mvola', 'orange_money', 'airtel_money'].includes(t.paymentMethod)) return false;
    } else if (filterType === 'cash') {
      if (t.paymentMethod !== 'cash') return false;
    } else if (filterType === 'card') {
      if (t.paymentMethod !== 'card') return false;
    }

    if (filterStatus !== 'all' && t.paymentStatus !== filterStatus) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchRef = t.mobileMoneyRef?.toLowerCase().includes(q);
      const matchNum = t.receiptNumber.toLowerCase().includes(q);
      const matchCust = t.customerName?.toLowerCase().includes(q) || t.customerPhone?.includes(q);
      return matchRef || matchNum || matchCust;
    }

    return true;
  });

  const getMethodBadge = (method: PaymentMethod) => {
    switch (method) {
      case 'mvola':
        return { label: 'MVola', icon: Smartphone, color: 'text-amber-800 bg-amber-50 border-amber-200' };
      case 'orange_money':
        return { label: 'Orange Money', icon: Smartphone, color: 'text-orange-800 bg-orange-50 border-orange-200' };
      case 'airtel_money':
        return { label: 'Airtel Money', icon: Smartphone, color: 'text-red-800 bg-red-50 border-red-200' };
      case 'cash':
        return { label: 'Espèces (Billets Ar)', icon: Banknote, color: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
      case 'card':
        return { label: 'Carte Bancaire TPE', icon: CreditCard, color: 'text-stone-800 bg-stone-100 border-stone-200' };
      default:
        return { label: method, icon: CreditCard, color: 'text-stone-800 bg-stone-100 border-stone-200' };
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Paiement confirmé', icon: CheckCircle2, color: 'text-[#2F8F61] bg-emerald-50 border-emerald-200' };
      case 'pending':
        return { label: 'Paiement en attente', icon: Clock, color: 'text-[#D7952E] bg-amber-50 border-amber-200' };
      case 'failed':
        return { label: 'Paiement échoué', icon: AlertTriangle, color: 'text-[#C94A4A] bg-red-50 border-red-200' };
    }
  };

  const handleConfirmPending = (txId: string) => {
    onUpdatePaymentStatus(txId, 'confirmed');
    if (selectedTxForDetail && selectedTxForDetail.id === txId) {
      setSelectedTxForDetail((prev) => prev ? { ...prev, paymentStatus: 'confirmed' } : null);
    }
  };

  const handleFailPending = (txId: string) => {
    onUpdatePaymentStatus(txId, 'failed');
    if (selectedTxForDetail && selectedTxForDetail.id === txId) {
      setSelectedTxForDetail((prev) => prev ? { ...prev, paymentStatus: 'failed' } : null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FBF7EF] text-[#241811] p-4 sm:p-6 lg:p-8 pb-28 lg:pb-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE7DE] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#8C572F] font-semibold">
                Trésorerie & Encaissements
              </span>
              <span className="text-xs text-[#75685F]">· Madagascar 🇲🇬</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F100A] tracking-tight mt-1">
              Gestion des Paiements & Mobile Money
            </h1>
            <p className="text-xs sm:text-sm text-[#75685F] mt-0.5">
              Suivi des règlements en Ariary : MVola, Orange Money, Airtel Money, Espèces et Cartes bancaires.
            </p>
          </div>

          {pendingCount > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 animate-pulse text-[#D7952E]" />
              <span>{pendingCount} paiement(s) Mobile Money en attente</span>
            </div>
          )}
        </div>

        {/* 3 Summary Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#EAE1D6] shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-[#8C572F] font-semibold">
                Mobile Money (MVola / Orange)
              </span>
              <Smartphone className="w-4 h-4 text-[#8C572F]" />
            </div>
            <span className="font-mono font-bold text-xl sm:text-2xl text-[#1F100A] block">
              {formatAriary(mobileMoneyTotal)}
            </span>
            <span className="text-[11px] text-[#75685F]">Validation manuelle opérateur</span>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#EAE1D6] shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-[#8C572F] font-semibold">
                Espèces (Billets Ar)
              </span>
              <Banknote className="w-4 h-4 text-[#2F8F61]" />
            </div>
            <span className="font-mono font-bold text-xl sm:text-2xl text-[#1F100A] block">
              {formatAriary(cashTotal)}
            </span>
            <span className="text-[11px] text-[#75685F]">Encaissé en boutique</span>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#EAE1D6] shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-[#8C572F] font-semibold">
                Cartes Bancaires TPE
              </span>
              <CreditCard className="w-4 h-4 text-[#75685F]" />
            </div>
            <span className="font-mono font-bold text-xl sm:text-2xl text-[#1F100A] block">
              {formatAriary(cardTotal)}
            </span>
            <span className="text-[11px] text-[#75685F]">Transactions terminal</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#75685F]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par référence, commande, client..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#E8DFD3] rounded-full text-xs sm:text-sm text-[#241811] placeholder-[#A69486] focus:outline-none focus:border-[#40200F] shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {[
              { id: 'all', label: 'Tous' },
              { id: 'mobile_money', label: 'Mobile Money' },
              { id: 'cash', label: 'Espèces' },
              { id: 'card', label: 'Cartes' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  filterType === f.id
                    ? 'bg-[#1F100A] text-white shadow-xs font-semibold'
                    : 'bg-white text-[#75685F] border border-[#EAE1D6] hover:bg-[#F3ECE0]'
                }`}
              >
                {f.label}
              </button>
            ))}

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-full text-xs bg-white border border-[#EAE1D6] text-[#75685F] focus:outline-none"
            >
              <option value="all">Tous statuts</option>
              <option value="confirmed">Confirmés</option>
              <option value="pending">En attente</option>
              <option value="failed">Échoués</option>
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.map((tx) => {
            const methodBadge = getMethodBadge(tx.paymentMethod);
            const statusBadge = getStatusBadge(tx.paymentStatus);
            const isPending = tx.paymentStatus === 'pending';

            return (
              <div
                key={tx.id}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-[#EAE1D6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-[#D9CCBE]"
              >
                {/* Left Info */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-sm text-[#1F100A]">
                      {tx.receiptNumber}
                    </span>
                    <span className="text-xs text-[#75685F]">·</span>
                    <span className="text-xs text-[#75685F]">
                      {new Date(tx.timestamp).toLocaleDateString('fr-FR')} {new Date(tx.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${statusBadge.color}`}
                    >
                      <statusBadge.icon className="w-3 h-3" />
                      <span>{statusBadge.label}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#75685F] flex-wrap">
                    <span className="font-medium text-[#1F100A]">
                      {tx.customerName || 'Client de passage'}
                      {tx.customerPhone ? ` (${tx.customerPhone})` : ''}
                    </span>
                    {tx.mobileMoneyRef && (
                      <>
                        <span>·</span>
                        <span className="font-mono text-[#8C572F] font-semibold">
                          Réf : {tx.mobileMoneyRef}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Info: Amount & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F5EFE7]">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-[#A69486] block">MONTANT RÉGLÉ</span>
                    <span className="font-mono font-bold text-lg text-[#1F100A]">
                      {formatAriary(tx.total)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Manual Confirmation for Mobile Money */}
                    {isPending && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleConfirmPending(tx.id)}
                          className="px-3 py-1.5 rounded-full bg-[#2F8F61] text-white text-xs font-semibold hover:bg-emerald-700 transition flex items-center gap-1"
                          title="Confirmer la réception des fonds"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirmer</span>
                        </button>
                        <button
                          onClick={() => handleFailPending(tx.id)}
                          className="p-1.5 rounded-full text-[#C94A4A] hover:bg-red-50 transition"
                          title="Marquer comme échoué"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => onViewReceipt(tx)}
                      className="p-2 rounded-full text-[#75685F] hover:text-[#1F100A] hover:bg-[#FBF7EF] transition"
                      title="Voir le reçu de vente"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredTransactions.length === 0 && (
            <div className="text-center py-16 text-[#75685F] space-y-2">
              <CreditCard className="w-10 h-10 mx-auto text-[#D4C5B5] stroke-[1.4]" />
              <p className="font-serif text-base text-[#1F100A]">Aucun paiement trouvé.</p>
              <p className="text-xs">Modifiez les filtres pour afficher l'historique complet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
