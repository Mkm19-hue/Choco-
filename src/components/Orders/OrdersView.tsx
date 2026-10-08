import React, { useState, useEffect } from 'react';
import { SaleTransaction, formatAriary } from '../../types/pos';
import { Search, Eye, Download, Calendar, Truck, ShoppingBag, Clock, CheckCircle2, AlertTriangle, Phone, MapPin, RotateCw } from 'lucide-react';
import { OrderListSkeleton, SkeletonBone } from '../common/SkeletonLoader';

interface OrdersViewProps {
  transactions: SaleTransaction[];
  onViewReceipt: (transaction: SaleTransaction) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  transactions,
  onViewReceipt,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pickup' | 'delivery'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Ivory/Cream skeleton loading state for native mobile app feel
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingOrders(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleRefreshOrders = () => {
    setIsLoadingOrders(true);
    setTimeout(() => {
      setIsLoadingOrders(false);
    }, 550);
  };

  const filteredOrders = transactions.filter((t) => {
    if (filterType !== 'all' && t.orderType !== filterType) return false;
    if (filterStatus !== 'all' && t.paymentStatus !== filterStatus) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNum = t.receiptNumber.toLowerCase().includes(q);
      const matchCust = t.customerName?.toLowerCase().includes(q) || t.customerPhone?.includes(q);
      const matchItem = t.items.some((i) => i.product.name.toLowerCase().includes(q));
      return matchNum || matchCust || matchItem;
    }
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[#FBF7EF] text-[#241811] p-4 sm:p-6 lg:p-8 pb-28 lg:pb-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE7DE] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#8C572F] font-semibold">
                Journal des Ventes
              </span>
              <span className="text-xs text-[#75685F]">· Madagascar 🇲🇬</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F100A] tracking-tight mt-1">
              Commandes & Ventes Réalisées
            </h1>
            <p className="text-xs sm:text-sm text-[#75685F] mt-0.5">
              Historique complet des retraits en boutique et livraisons par zones à Madagascar.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="text-left sm:text-right">
              <span className="text-xs text-[#75685F] block">Total des commandes</span>
              {isLoadingOrders ? (
                <SkeletonBone className="h-6 w-28 rounded-md mt-1" />
              ) : (
                <span className="font-serif font-bold text-xl text-[#1F100A]">
                  {transactions.length} commande{transactions.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleRefreshOrders}
              disabled={isLoadingOrders}
              className="p-2.5 rounded-full bg-white hover:bg-[#F3ECE0] border border-[#E8DFD3] text-[#75685F] hover:text-[#1F100A] transition shadow-2xs active:scale-95 disabled:opacity-60"
              title="Actualiser le journal des commandes"
              aria-label="Actualiser les commandes"
            >
              <RotateCw className={`w-4 h-4 ${isLoadingOrders ? 'animate-spin text-[#8C572F]' : ''}`} />
            </button>
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
              placeholder="Rechercher par numéro, client, produit..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#E8DFD3] rounded-full text-xs sm:text-sm text-[#241811] placeholder-[#A69486] focus:outline-none focus:border-[#40200F] shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            <div className="flex bg-white p-0.5 rounded-full border border-[#EAE1D6]">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-full text-xs transition ${
                  filterType === 'all'
                    ? 'bg-[#1F100A] text-white font-semibold shadow-xs'
                    : 'text-[#75685F] hover:text-[#1F100A]'
                }`}
              >
                Toutes
              </button>
              <button
                onClick={() => setFilterType('pickup')}
                className={`px-3 py-1.5 rounded-full text-xs transition ${
                  filterType === 'pickup'
                    ? 'bg-[#1F100A] text-white font-semibold shadow-xs'
                    : 'text-[#75685F] hover:text-[#1F100A]'
                }`}
              >
                Boutique
              </button>
              <button
                onClick={() => setFilterType('delivery')}
                className={`px-3 py-1.5 rounded-full text-xs transition ${
                  filterType === 'delivery'
                    ? 'bg-[#1F100A] text-white font-semibold shadow-xs'
                    : 'text-[#75685F] hover:text-[#1F100A]'
                }`}
              >
                Livraisons
              </button>
            </div>
          </div>
        </div>

        {/* Orders Listing or Ivory Skeleton Loader */}
        {isLoadingOrders ? (
          <OrderListSkeleton count={5} />
        ) : (
          <div className="space-y-3 animate-fade-in-subtle">
            {filteredOrders.map((order) => {
              const isDelivery = order.orderType === 'delivery';

              return (
                <div
                  key={order.id}
                  className="p-4 sm:p-5 rounded-3xl bg-white border border-[#EAE1D6] shadow-xs hover:border-[#D9CCBE] transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left block: Reference, Date, Customer */}
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono font-bold text-sm text-[#1F100A]">
                        {order.receiptNumber}
                      </span>
                      <span className="text-xs text-[#75685F]">·</span>
                      <span className="text-xs text-[#75685F]">
                        {new Date(order.timestamp).toLocaleDateString('fr-FR')} {new Date(order.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 ${
                          isDelivery
                            ? 'bg-[#FBF4E8] text-[#8C572F] border border-[#E8D4BE]'
                            : 'bg-[#F5F2ED] text-[#6B5C52] border border-[#E2DDD5]'
                        }`}
                      >
                        {isDelivery ? <Truck className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
                        <span>{isDelivery ? `Livraison : ${order.deliveryZone?.name || 'Mada'}` : 'Retrait boutique'}</span>
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          order.paymentStatus === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {order.paymentStatus === 'confirmed' ? 'Confirmé' : 'En attente'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#75685F]">
                      <span className="font-medium text-[#1F100A]">
                        {order.customerName || 'Client de passage'}
                      </span>
                      {order.customerPhone && (
                        <span className="font-mono text-[#8C572F]">{order.customerPhone}</span>
                      )}
                      {isDelivery && order.deliveryAddress && (
                        <span className="text-[11px] text-[#A69486] truncate">
                          — {order.deliveryAddress}
                        </span>
                      )}
                    </div>

                    {/* Summary of Items */}
                    <p className="text-[11px] text-[#75685F] line-clamp-1 pt-0.5">
                      {order.items.map((i) => `${i.quantity}x ${i.product.name}`).join(' · ')}
                    </p>
                  </div>

                  {/* Right block: Subtotal, Delivery Fee, Total, Action */}
                  <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#F5EFE7]">
                    <div className="text-left md:text-right">
                      {order.deliveryFee > 0 && (
                        <span className="text-[10px] text-[#8C572F] block">
                          Dont livraison : {formatAriary(order.deliveryFee)}
                        </span>
                      )}
                      <span className="font-mono font-bold text-lg text-[#1F100A]">
                        {formatAriary(order.total)}
                      </span>
                      <span className="text-[10px] text-[#A69486] block uppercase">
                        {order.paymentMethod === 'mvola'
                          ? 'MVola'
                          : order.paymentMethod === 'orange_money'
                          ? 'Orange Money'
                          : order.paymentMethod === 'cash'
                          ? 'Espèces'
                          : 'Carte TPE'}
                      </span>
                    </div>

                    <button
                      onClick={() => onViewReceipt(order)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FBF7EF] hover:bg-[#F3ECE0] border border-[#E0D5C7] text-xs font-semibold text-[#1F100A] transition"
                      title="Voir le ticket"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#8C572F]" />
                      <span>Détail</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredOrders.length === 0 && (
              <div className="text-center py-16 text-[#75685F] space-y-2">
                <ShoppingBag className="w-10 h-10 mx-auto text-[#D4C5B5] stroke-[1.4]" />
                <p className="font-serif text-base text-[#1F100A]">Aucune commande trouvée.</p>
                <p className="text-xs">Aucune vente ne correspond à vos filtres actuels.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
