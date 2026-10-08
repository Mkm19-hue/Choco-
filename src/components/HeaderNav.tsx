import React, { useState } from 'react';
import { ShoppingBag, Users, Package, FileText, Truck, CreditCard, BarChart3, Settings, Gift, Menu, X, Smartphone, Tablet, Monitor } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { DevicePreviewMode, UserRole } from '../types/pos';

export type AppView = 
  | 'pos' 
  | 'orders' 
  | 'catalog' 
  | 'customers' 
  | 'deliveries' 
  | 'payments' 
  | 'reports' 
  | 'settings' 
  | 'custom_box';

interface HeaderNavProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  cartCount: number;
  cartTotal?: number;
  onOpenCart?: () => void;
  deviceMode: DevicePreviewMode;
  onSetDeviceMode: (mode: DevicePreviewMode) => void;
  userRole: UserRole;
  onToggleUserRole: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeView,
  onNavigate,
  cartCount,
  onOpenCart,
  deviceMode,
  onSetDeviceMode,
  userRole,
}) => {
  const { isOnline } = usePWA();
  const [isMobileMoreSheetOpen, setIsMobileMoreSheetOpen] = useState(false);

  // Main Desktop Navigation Items
  const primaryNavItems: { id: AppView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'pos', label: 'Caisse', icon: ShoppingBag },
    { id: 'orders', label: 'Commandes', icon: FileText },
    { id: 'catalog', label: 'Catalogue', icon: Package },
    { id: 'customers', label: 'Clients', icon: Users },
    { id: 'deliveries', label: 'Livraisons', icon: Truck },
    { id: 'payments', label: 'Paiements', icon: CreditCard },
    { id: 'reports', label: 'Rapports', icon: BarChart3 },
  ];

  // Mobile Bottom Navigation Tabs: Caisse, Commandes, Clients, Plus
  const mobileTabs = [
    { id: 'pos' as const, label: 'Caisse', icon: ShoppingBag },
    { id: 'orders' as const, label: 'Commandes', icon: FileText },
    { id: 'customers' as const, label: 'Clients', icon: Users },
  ];

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    setIsMobileMoreSheetOpen(false);
  };

  return (
    <>
      {/* ============================================================ */}
      {/* DESKTOP & TABLET TOP HEADER BAR */}
      {/* ============================================================ */}
      <header className="h-16 px-4 sm:px-6 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#EFE7DE] flex items-center justify-between shrink-0 select-none z-30 transition-colors">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('pos')}
            className="text-left group flex items-baseline gap-2 transition active:scale-98"
          >
            <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#1F100A] group-hover:text-[#40200F] transition-colors">
              Gourmandise
            </span>
            <span className="text-xs uppercase tracking-widest text-[#8C572F] font-semibold hidden xs:inline">
              Chocolat
            </span>
            <span className="text-[11px] text-[#A69486] hidden lg:inline font-sans">
              · Madagascar 🇲🇬
            </span>
          </button>
        </div>

        {/* Center Desktop Navigation: Caisse, Commandes, Catalogue, Clients, Livraisons, Paiements, Rapports */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {primaryNavItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 text-[13px] rounded-full whitespace-nowrap transition-all duration-150 active:scale-95 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#1F100A] text-[#FFFFFF] shadow-xs font-semibold'
                    : 'text-[#615248] hover:text-[#1F100A] hover:bg-[#F7F2EB] font-medium'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'pos' && cartCount > 0 && (
                  <span
                    key={cartCount}
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold tabular-nums animate-badge-pop ${
                      isActive ? 'bg-[#E6B352] text-[#1F100A]' : 'bg-[#1F100A] text-white'
                    }`}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Settings, Device Simulator & Quick Bag */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Settings (Admin) */}
          <button
            onClick={() => handleNavClick('settings')}
            title="Paramètres de la boutique"
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
              activeView === 'settings'
                ? 'bg-[#1F100A] text-white shadow-xs font-semibold'
                : 'text-[#75685F] hover:text-[#1F100A] hover:bg-[#F7F2EB]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Paramètres</span>
          </button>

          {/* Device Preview Simulator Dropdown (PC / Tablet / Phone testing) */}
          <div className="hidden xl:flex items-center bg-[#F7F2EB] rounded-full p-0.5 border border-[#E8DFD3]">
            <button
              onClick={() => onSetDeviceMode('desktop')}
              title="Aperçu Bureau (PC)"
              className={`p-1.5 rounded-full transition ${
                deviceMode === 'desktop' || deviceMode === 'responsive'
                  ? 'bg-white text-[#1F100A] shadow-2xs'
                  : 'text-[#8C572F] hover:text-[#1F100A]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSetDeviceMode('tablet')}
              title="Aperçu Tablette iPad"
              className={`p-1.5 rounded-full transition ${
                deviceMode === 'tablet'
                  ? 'bg-white text-[#1F100A] shadow-2xs'
                  : 'text-[#8C572F] hover:text-[#1F100A]'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSetDeviceMode('mobile')}
              title="Aperçu Téléphone Smartphone"
              className={`p-1.5 rounded-full transition ${
                deviceMode === 'mobile'
                  ? 'bg-white text-[#1F100A] shadow-2xs'
                  : 'text-[#8C572F] hover:text-[#1F100A]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Bag Button on Mobile/Tablet */}
          {onOpenCart && cartCount > 0 && (
            <button
              onClick={onOpenCart}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1F100A] text-white text-xs font-medium shadow-xs active:scale-95 transition"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="font-bold text-[11px]">{cartCount}</span>
            </button>
          )}

          {!isOnline && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Hors-ligne</span>
            </div>
          )}
        </div>
      </header>

      {/* ============================================================ */}
      {/* MOBILE / PWA BOTTOM NAVIGATION BAR (Caisse · Commandes · Clients · Plus) */}
      {/* ============================================================ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FFFFFF]/98 backdrop-blur-lg border-t border-[#EFE7DE] px-3 py-2 flex items-center justify-around shadow-lg">
        {mobileTabs.map((tab) => {
          const isActive = activeView === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleNavClick(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl transition-all duration-150 active:scale-95 relative ${
                isActive ? 'text-[#1F100A] font-semibold' : 'text-[#8C7E74] hover:text-[#1F100A]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
                {tab.id === 'pos' && cartCount > 0 && (
                  <span
                    key={cartCount}
                    className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#E6B352] text-[#1F100A] text-[9px] font-bold flex items-center justify-center animate-badge-pop shadow-xs"
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F100A] mt-0.5 animate-badge-pop" />
              )}
            </button>
          );
        })}

        {/* "Plus" Button: Opens modern boutique drawer */}
        <button
          onClick={() => setIsMobileMoreSheetOpen(true)}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl transition-all duration-150 active:scale-95 ${
            isMobileMoreSheetOpen ||
            ['catalog', 'deliveries', 'payments', 'reports', 'settings', 'custom_box'].includes(activeView)
              ? 'text-[#1F100A] font-semibold'
              : 'text-[#8C7E74] hover:text-[#1F100A]'
          }`}
        >
          <Menu className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[11px] tracking-tight">Plus</span>
          {['catalog', 'deliveries', 'payments', 'reports', 'settings', 'custom_box'].includes(activeView) && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#8C572F] mt-0.5 animate-badge-pop" />
          )}
        </button>
      </div>

      {/* ============================================================ */}
      {/* MOBILE "PLUS" BOTTOM SHEET */}
      {/* ============================================================ */}
      {isMobileMoreSheetOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-xs animate-fade-in">
          <div
            className="w-full bg-white rounded-t-[32px] p-5 pb-8 shadow-2xl border-t border-[#EFE7DE] space-y-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle & Close */}
            <div className="flex items-center justify-between pb-2 border-b border-[#F2EAE0]">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-[#1F100A]">Menu Boutique</span>
                <span className="text-xs text-[#8C572F]">· Madagascar</span>
              </div>
              <button
                onClick={() => setIsMobileMoreSheetOpen(false)}
                className="p-1.5 text-[#75685F] hover:text-[#1F100A] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of extra views */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => handleNavClick('catalog')}
                className={`p-3.5 rounded-2xl text-left border transition flex flex-col gap-1.5 ${
                  activeView === 'catalog'
                    ? 'bg-[#1F100A] text-white border-[#1F100A]'
                    : 'bg-[#FBF7EF] text-[#241811] border-[#EAE1D6] hover:bg-[#F3ECE0]'
                }`}
              >
                <Package className="w-5 h-5 text-[#8C572F]" />
                <span className="font-serif font-bold text-sm">Catalogue</span>
                <span className="text-[10px] opacity-75">Créations & stocks</span>
              </button>

              <button
                onClick={() => handleNavClick('deliveries')}
                className={`p-3.5 rounded-2xl text-left border transition flex flex-col gap-1.5 ${
                  activeView === 'deliveries'
                    ? 'bg-[#1F100A] text-white border-[#1F100A]'
                    : 'bg-[#FBF7EF] text-[#241811] border-[#EAE1D6] hover:bg-[#F3ECE0]'
                }`}
              >
                <Truck className="w-5 h-5 text-[#8C572F]" />
                <span className="font-serif font-bold text-sm">Livraisons</span>
                <span className="text-[10px] opacity-75">Zones & tarifs Ar</span>
              </button>

              <button
                onClick={() => handleNavClick('payments')}
                className={`p-3.5 rounded-2xl text-left border transition flex flex-col gap-1.5 ${
                  activeView === 'payments'
                    ? 'bg-[#1F100A] text-white border-[#1F100A]'
                    : 'bg-[#FBF7EF] text-[#241811] border-[#EAE1D6] hover:bg-[#F3ECE0]'
                }`}
              >
                <CreditCard className="w-5 h-5 text-[#8C572F]" />
                <span className="font-serif font-bold text-sm">Paiements</span>
                <span className="text-[10px] opacity-75">MVola, Orange & Espèces</span>
              </button>

              <button
                onClick={() => handleNavClick('reports')}
                className={`p-3.5 rounded-2xl text-left border transition flex flex-col gap-1.5 ${
                  activeView === 'reports'
                    ? 'bg-[#1F100A] text-white border-[#1F100A]'
                    : 'bg-[#FBF7EF] text-[#241811] border-[#EAE1D6] hover:bg-[#F3ECE0]'
                }`}
              >
                <BarChart3 className="w-5 h-5 text-[#8C572F]" />
                <span className="font-serif font-bold text-sm">Rapports</span>
                <span className="text-[10px] opacity-75">Activité & clôture Z</span>
              </button>

              <button
                onClick={() => handleNavClick('custom_box')}
                className={`p-3.5 rounded-2xl text-left border transition flex flex-col gap-1.5 ${
                  activeView === 'custom_box'
                    ? 'bg-[#1F100A] text-white border-[#1F100A]'
                    : 'bg-[#FBF7EF] text-[#241811] border-[#EAE1D6] hover:bg-[#F3ECE0]'
                }`}
              >
                <Gift className="w-5 h-5 text-[#E6B352]" />
                <span className="font-serif font-bold text-sm">Écrin Sur-Mesure</span>
                <span className="text-[10px] opacity-75">Atelier coffret cadeau</span>
              </button>

              <button
                onClick={() => handleNavClick('settings')}
                className={`p-3.5 rounded-2xl text-left border transition flex flex-col gap-1.5 ${
                  activeView === 'settings'
                    ? 'bg-[#1F100A] text-white border-[#1F100A]'
                    : 'bg-[#FBF7EF] text-[#241811] border-[#EAE1D6] hover:bg-[#F3ECE0]'
                }`}
              >
                <Settings className="w-5 h-5 text-[#8C572F]" />
                <span className="font-serif font-bold text-sm">Paramètres</span>
                <span className="text-[10px] opacity-75">WhatsApp & boutique</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
