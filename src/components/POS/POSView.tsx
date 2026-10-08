import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, CartItem, Customer, PaymentMethod, DeliveryZone, OrderType, formatAriary } from '../../types/pos';
import { Search, ShoppingBag, Plus, Minus, Trash2, Check, ArrowRight, User, Phone, MapPin, Truck, ChevronRight, X, Gift, Store, CreditCard, Banknote, Smartphone, RotateCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_CATEGORIES } from '../../data/initialChocolates';
import { ProductGridSkeleton } from '../common/SkeletonLoader';

interface POSViewProps {
  products: Product[];
  customers: Customer[];
  deliveryZones: DeliveryZone[];
  onCompleteSale: (
    items: CartItem[],
    total: number,
    subtotal: number,
    taxAmount: number,
    discountAmount: number,
    paymentMethod: PaymentMethod,
    deliveryZone?: DeliveryZone,
    deliveryFee?: number,
    orderType?: OrderType,
    deliveryAddress?: string,
    mobileMoneyRef?: string,
    amountReceived?: number,
    changeGiven?: number,
    customer?: Customer | null
  ) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (cust: Customer | null) => void;
  onAddNewCustomer?: (customer: Customer) => void;
  onOpenCustomBoxStudio?: () => void;
}

export const POSView: React.FC<POSViewProps> = ({
  products,
  customers,
  deliveryZones,
  onCompleteSale,
  cart,
  setCart,
  isCartDrawerOpen,
  setIsCartDrawerOpen,
  selectedCustomer,
  setSelectedCustomer,
  onAddNewCustomer,
  onOpenCustomBoxStudio,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('pickup');
  const [selectedZoneId, setSelectedZoneId] = useState<string>(() => {
    const firstActive = deliveryZones.find((z) => z.active);
    return firstActive?.id || deliveryZones[0]?.id || '';
  });
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Payment & checkout state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mvola');
  const [mobileMoneyRef, setMobileMoneyRef] = useState('');
  const [cashTendered, setCashTendered] = useState<string>('');

  // Customer quick add state
  const [isQuickCustomerOpen, setIsQuickCustomerOpen] = useState(false);
  const [quickCustName, setQuickCustName] = useState('');
  const [quickCustPhone, setQuickCustPhone] = useState('+261 ');
  const [quickCustAddress, setQuickCustAddress] = useState('');

  // Floating button real-time tactile pulse state
  const [cartBounce, setCartBounce] = useState(false);

  // Micro-interactions state: visual bounce on card
  const [animatingProductId, setAnimatingProductId] = useState<string | null>(null);
  const [animatingCartItemId, setAnimatingCartItemId] = useState<string | null>(null);
  const productAnimationTimers = React.useRef<{ [id: string]: ReturnType<typeof setTimeout> }>({});

  // Elegant Ivory/Cream Skeleton loading state for native mobile app feel
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingProducts(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  const handleRefreshProducts = () => {
    setIsLoadingProducts(true);
    setTimeout(() => {
      setIsLoadingProducts(false);
    }, 600);
  };

  // Active delivery zone
  const activeZone = useMemo(() => {
    return deliveryZones.find((z) => z.id === selectedZoneId && z.active);
  }, [deliveryZones, selectedZoneId]);

  const deliveryFee = orderType === 'delivery' && activeZone ? activeZone.fee : 0;

  // Filter products: search and category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.origin && p.origin.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Direct fast add to cart: 1 click = +1 immediately with tactile spring bounce on the card
  const handleAddToCart = (product: Product) => {
    if (product.stockQuantity <= 0) return;

    // Trigger instant tactile feedbacks: cart bounce & product card bounce
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 400);

    // Re-trigger scale-bounce reliably even on consecutive rapid clicks
    if (productAnimationTimers.current[product.id]) {
      clearTimeout(productAnimationTimers.current[product.id]);
    }
    setAnimatingProductId(null);
    requestAnimationFrame(() => {
      setAnimatingProductId(product.id);
      productAnimationTimers.current[product.id] = setTimeout(() => {
        setAnimatingProductId((current) => (current === product.id ? null : current));
      }, 400);
    });

    // Determine target item ID for micro-interaction outside the setCart pure updater
    const existingItem = cart.find((item) => item.product.id === product.id);
    const targetItemId = existingItem ? existingItem.id : `${product.id}-${Date.now()}`;
    setAnimatingCartItemId(targetItemId);
    setTimeout(() => setAnimatingCartItemId(null), 400);

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stockQuantity) return prevCart;
        return prevCart.map((item) =>
          item.id === existing.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                itemPrice: (item.quantity + 1) * item.product.price,
              }
            : item
        );
      }
      return [
        ...prevCart,
        {
          id: targetItemId,
          product,
          quantity: 1,
          itemPrice: product.price,
        },
      ];
    });
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCartBounce(true);
    setAnimatingCartItemId(cartItemId);
    setTimeout(() => setCartBounce(false), 400);
    setTimeout(() => setAnimatingCartItemId(null), 400);

    const targetItem = cart.find((i) => i.id === cartItemId);
    if (targetItem) {
      setAnimatingProductId(targetItem.product.id);
      setTimeout(() => setAnimatingProductId(null), 420);
    }

    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            if (nextQty > item.product.stockQuantity) return item;
            return {
              ...item,
              quantity: nextQty,
              itemPrice: nextQty * item.product.price,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Calculations
  const rawSubtotal = cart.reduce((acc, item) => acc + item.itemPrice, 0);
  const total = rawSubtotal + deliveryFee;
  const taxAmount = Math.round(total * (0.20 / 1.20)); // TVA 20% Madagascar incluse
  const totalCartCount = cart.reduce((acc, it) => acc + it.quantity, 0);

  // Cash change calculation
  const cashAmountNum = parseInt(cashTendered.replace(/\s/g, ''), 10) || total;
  const changeDue = Math.max(0, cashAmountNum - total);

  // Quick Customer phone auto-detection
  const handleCustomerPhoneSearch = (query: string) => {
    const clean = query.trim();
    if (!clean) {
      setSelectedCustomer(null);
      return;
    }
    const match = customers.find(
      (c) =>
        c.phone.replace(/\s/g, '').includes(clean.replace(/\s/g, '')) ||
        c.name.toLowerCase().includes(clean.toLowerCase())
    );
    if (match) {
      setSelectedCustomer(match);
      if (match.address && !deliveryAddress) {
        setDeliveryAddress(match.address);
      }
    }
  };

  const handleSaveQuickCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCustName.trim() || !quickCustPhone.trim()) return;

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: quickCustName.trim(),
      phone: quickCustPhone.trim(),
      email: `${quickCustName.toLowerCase().replace(/\s+/g, '.')}@client.mg`,
      address: quickCustAddress.trim() || undefined,
      loyaltyPoints: 20,
      totalSpent: 0,
    };

    if (onAddNewCustomer) {
      onAddNewCustomer(newCust);
    }
    setSelectedCustomer(newCust);
    if (quickCustAddress.trim()) {
      setDeliveryAddress(quickCustAddress.trim());
    }
    setIsQuickCustomerOpen(false);
    setQuickCustName('');
    setQuickCustPhone('+261 ');
    setQuickCustAddress('');
  };

  const handleConfirmOrder = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#E6B352', '#8C572F', '#1F100A', '#FFFFFF'],
    });

    onCompleteSale(
      cart,
      total,
      rawSubtotal,
      taxAmount,
      0,
      paymentMethod,
      orderType === 'delivery' ? activeZone : undefined,
      deliveryFee,
      orderType,
      deliveryAddress.trim() || undefined,
      mobileMoneyRef.trim() || undefined,
      paymentMethod === 'cash' ? cashAmountNum : undefined,
      paymentMethod === 'cash' ? changeDue : undefined,
      selectedCustomer
    );

    handleClearCart();
    setIsCartDrawerOpen(false);
    setMobileMoneyRef('');
    setCashTendered('');
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-[#FBF7EF] text-[#241811]">
      {/* ============================================================ */}
      {/* ZONE PRINCIPALE: CATALOGUE PRODUITS & PHOTOGRAPHIE DU TERROIR */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FBF7EF]">
        {/* Top Search & Filter Bar */}
        <div className="p-4 sm:p-6 pb-2 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#75685F]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par chocolat, praliné, fèves..."
                className="w-full pl-10 pr-8 py-2.5 bg-white border border-[#E8DFD3] rounded-full text-xs sm:text-sm text-[#241811] placeholder-[#A69486] focus:outline-none focus:border-[#40200F] shadow-xs transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#75685F] hover:text-[#1F100A]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Action Bar: Refresh & Custom Box Studio Shortcut */}
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleRefreshProducts}
                disabled={isLoadingProducts}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white hover:bg-[#F3ECE0] border border-[#E8DFD3] text-xs font-semibold text-[#75685F] hover:text-[#1F100A] transition shadow-2xs active:scale-95 disabled:opacity-60"
                title="Actualiser la liste des chocolats"
                aria-label="Actualiser les chocolats"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isLoadingProducts ? 'animate-spin text-[#8C572F]' : ''}`} />
                <span className="hidden sm:inline">Actualiser</span>
              </button>

              {onOpenCustomBoxStudio && (
                <button
                  onClick={onOpenCustomBoxStudio}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#FBF4E8] border border-[#E8D4BE] text-xs font-semibold text-[#8C572F] transition shadow-xs"
                >
                  <Gift className="w-3.5 h-3.5 text-[#E6B352]" />
                  <span>Composer un Écrin</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs: Tous, Chocolats, Coffrets, Tablettes, Pralinés, Truffes... */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 text-xs rounded-full whitespace-nowrap transition-all duration-150 ${
                selectedCategory === 'all'
                  ? 'bg-[#1F100A] text-white shadow-xs font-semibold'
                  : 'bg-white text-[#75685F] hover:text-[#1F100A] hover:bg-[#F3ECE0] border border-[#EAE1D6] font-medium'
              }`}
            >
              Tous
            </button>
            {INITIAL_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs rounded-full whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-[#1F100A] text-white shadow-xs font-semibold'
                      : 'bg-white text-[#75685F] hover:text-[#1F100A] hover:bg-[#F3ECE0] border border-[#EAE1D6] font-medium'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid: Real Photography & Instant Click Reaction or Ivory Skeleton Loader */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 pb-36 lg:pb-6">
          {isLoadingProducts ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <>
              <div
                key={selectedCategory}
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 animate-fade-in-subtle"
              >
                {filteredProducts.map((product) => {
                  const inCartItem = cart.find((item) => item.product.id === product.id);
                  const inCartQty = inCartItem?.quantity || 0;
                  const isOutOfStock = product.stockQuantity <= 0;
                  const isInteracting = animatingProductId === product.id;

                  return (
                    <div
                      key={product.id}
                      onClick={() => !isOutOfStock && handleAddToCart(product)}
                      role="button"
                      tabIndex={isOutOfStock ? -1 : 0}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && !isOutOfStock) {
                          e.preventDefault();
                          handleAddToCart(product);
                        }
                      }}
                      className={`group bg-white rounded-3xl p-3 sm:p-4 border border-[#ECE2D5] shadow-xs hover:border-[#8C572F]/40 hover:shadow-md flex flex-col justify-between select-none relative cursor-pointer active:scale-95 ${
                        isInteracting ? 'scale-bounce animate-scale-bounce ring-2 ring-[#8C572F]/50 shadow-lg' : 'transition-all duration-200'
                      } ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {/* Photo Première: Visuel gourmand & désirable */}
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F7F2EB] mb-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                            isInteracting ? 'scale-110' : ''
                          }`}
                          loading="lazy"
                        />

                        {/* Subtle cacao % badge if present */}
                        {product.cacaoPercentage ? (
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[#40200F] text-[10px] font-semibold font-mono shadow-2xs">
                            {product.cacaoPercentage}% Cacao
                          </span>
                        ) : null}

                        {/* Total dans le panier (indicateur discret) */}
                        {inCartQty > 0 && (
                          <div
                            key={inCartQty}
                            className={`absolute top-2 right-2 min-w-[24px] h-6 px-1.5 rounded-full bg-[#1F100A] text-white text-xs font-bold flex items-center justify-center shadow-xs transition-transform ${
                              isInteracting ? 'animate-badge-pop ring-2 ring-[#E6B352] bg-[#40200F]' : ''
                            }`}
                          >
                            {inCartQty}
                          </div>
                        )}
                      </div>

                      {/* Title & Terroir Origin */}
                      <div className="space-y-0.5 mb-2">
                        <h3 className="font-serif font-bold text-sm sm:text-base text-[#1F100A] line-clamp-1 leading-snug group-hover:text-[#633014] transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-[11px] text-[#75685F] line-clamp-1">
                          {product.origin || 'Madagascar'}
                        </p>
                      </div>

                      {/* Bottom Row: Prix en Ariary (MGA) + Bouton d'ajout */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#F5EFE7]">
                        <span className="font-mono font-bold text-sm sm:text-base text-[#1F100A]">
                          {formatAriary(product.price)}
                        </span>
                        {isOutOfStock ? (
                          <span className="text-[10px] font-medium text-[#C94A4A] bg-[#C94A4A]/10 px-2.5 py-1 rounded-full">
                            Épuisé
                          </span>
                        ) : (
                          <button
                            type="button"
                            aria-label={`Ajouter ${product.name}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1F100A] text-[#F5EFE7] hover:bg-[#8C572F] flex items-center justify-center transition-colors shadow-2xs active:scale-90"
                          >
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-20 text-[#75685F] space-y-2">
                  <p className="font-serif text-base text-[#1F100A]">Aucun chocolat trouvé.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="text-xs text-[#8C572F] underline"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* BOUTON FLOTTANT DU PANIER (MOBILE & TABLETTE TACTILE) */}
      {/* ============================================================ */}
      {!isCartDrawerOpen && totalCartCount > 0 && (
        <div className="lg:hidden fixed bottom-[72px] md:bottom-6 left-3 right-3 sm:left-6 sm:right-6 z-30 max-w-lg mx-auto pointer-events-none animate-slide-up">
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className={`pointer-events-auto w-full group py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-full bg-gradient-to-r from-[#1F100A] via-[#2D160E] to-[#1F100A] text-white shadow-[0_12px_36px_rgba(31,16,10,0.45)] border border-[#E6B352]/40 flex items-center justify-between active:scale-[0.97] transition-all duration-200 hover:shadow-[0_16px_40px_rgba(31,16,10,0.55)] ${
              cartBounce ? 'animate-cart-bounce ring-2 ring-[#E6B352] shadow-[0_16px_48px_rgba(230,179,82,0.35)]' : ''
            }`}
            aria-label={`Voir le panier : ${totalCartCount} articles, total ${formatAriary(total)}`}
          >
            {/* Gauche : Badge sac doré + Nombre d'articles */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex items-center justify-center shrink-0">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br from-[#F5C76D] to-[#E6B352] text-[#1F100A] flex items-center justify-center font-bold text-xs shadow-sm transition-transform group-active:scale-95 ${
                    cartBounce ? 'animate-scale-bounce' : ''
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span
                  key={totalCartCount}
                  className={`absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-white text-[#1F100A] text-[11px] font-mono font-bold flex items-center justify-center shadow-xs border border-[#EAE1D6] transition-transform ${
                    cartBounce ? 'animate-badge-pop ring-1 ring-[#E6B352]' : ''
                  }`}
                >
                  {totalCartCount}
                </span>
              </div>

              <div className="text-left min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-bold text-sm sm:text-base text-white tracking-tight leading-tight">
                    Mon Panier
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E6B352] animate-pulse hidden xs:inline-block" />
                </div>
                <span className="text-[11px] text-[#D8C7B5] block truncate font-sans">
                  {totalCartCount} {totalCartCount > 1 ? 'articles' : 'article'}
                </span>
              </div>
            </div>

            {/* Droite : Total en temps réel en Ariary + Flèche tactile */}
            <div className="flex items-center gap-2.5 sm:gap-3 pl-3 shrink-0">
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-[#C4B09E] block font-semibold leading-none mb-0.5">
                  TOTAL
                </span>
                <span
                  className={`font-mono font-bold text-sm sm:text-base text-white tabular-nums tracking-tight transition-all duration-200 ${
                    cartBounce ? 'text-[#F5C76D] scale-105' : ''
                  }`}
                >
                  {formatAriary(total)}
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center text-[#E6B352] transition-colors shrink-0">
                <ChevronRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Backdrop sombre mobile quand le panier est ouvert */}
      {isCartDrawerOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-xs z-40 animate-fade-in"
          onClick={() => setIsCartDrawerOpen(false)}
        />
      )}

      {/* ============================================================ */}
      {/* ZONE SECONDAIRE: PANIER / COMMANDE PERSISTANT (Shopping Bag de Luxe) */}
      {/* VUE VERTICALE OPTIMISÉE COMBINANT ARTICLES, LIVRAISON & RÈGLEMENT */}
      {/* ============================================================ */}
      <div
        className={`lg:w-96 xl:w-[430px] bg-white border-l border-[#EFE7DE] flex flex-col shrink-0 transition-transform duration-300 z-50 ${
          isCartDrawerOpen
            ? 'fixed inset-x-0 bottom-0 max-h-[94vh] rounded-t-[32px] sm:rounded-none sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[460px] shadow-2xl translate-y-0 sm:translate-x-0 animate-slide-up'
            : 'hidden lg:flex'
        }`}
      >
        {/* Poignée tactile de glissement pour mobile */}
        <div className="sm:hidden w-12 h-1 bg-[#D9CCBE] rounded-full mx-auto my-2.5 shrink-0" />

        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-[#F0E6DB] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#8C572F]" />
            <h2 className="font-serif font-bold text-base text-[#1F100A]">
              Votre Panier & Règlement
            </h2>
            {totalCartCount > 0 && (
              <span className="text-xs font-mono font-bold text-[#8C572F] bg-[#FBF4E8] px-2 py-0.5 rounded-full border border-[#E8DFD3]">
                {totalCartCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {cart.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-xs text-[#75685F] hover:text-[#C94A4A] px-2 py-1 rounded transition"
                title="Vider le panier"
              >
                Vider
              </button>
            )}
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="lg:hidden p-1.5 text-[#75685F] hover:text-[#1F100A] rounded-full hover:bg-[#F5ECE0] transition"
              aria-label="Fermer le tiroir"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vue Verticale Optimisée Unifiée (Défilement fluide de toutes les étapes) */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#F0E6DB] min-h-0 text-xs">
          {/* Étape 1 : Liste des articles */}
          <div className="p-3.5 sm:p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#75685F]">
                1. Chocolats sélectionnés {totalCartCount > 0 ? `(${totalCartCount})` : ''}
              </span>
            </div>

            {cart.map((item) => {
              const isItemInteracting = animatingCartItemId === item.id;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-[#FBF7EF] border border-[#EFE7DE] text-xs transition-all duration-200 ${
                    isItemInteracting ? 'animate-flash-warm ring-1 ring-[#E6B352]/60 shadow-xs' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0 bg-white border border-[#E8DFD3]"
                    />
                    <div className="truncate">
                      <h4 className="font-serif font-bold text-xs text-[#1F100A] truncate">
                        {item.product.name}
                      </h4>
                      <span className="text-[11px] font-mono text-[#75685F]">
                        {formatAriary(item.product.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 bg-white border border-[#E8DFD3] rounded-full p-0.5">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[#75685F] hover:text-[#1F100A] transition-transform duration-150 active:scale-75 hover:scale-110"
                        title="Diminuer"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span
                        key={item.quantity}
                        className={`w-4 text-center font-mono font-bold text-xs text-[#1F100A] transition-transform duration-150 ${
                          isItemInteracting ? 'scale-125 text-[#8C572F] font-extrabold' : ''
                        }`}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[#75685F] hover:text-[#1F100A] transition-transform duration-150 active:scale-75 hover:scale-110"
                        title="Augmenter"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 text-[#A69486] hover:text-[#C94A4A] transition-colors active:scale-75"
                      title="Retirer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {cart.length === 0 && (
              <div className="text-center py-10 text-[#A69486] space-y-2">
                <ShoppingBag className="w-8 h-8 mx-auto text-[#D4C5B5] stroke-[1.4]" />
                <p className="font-serif text-sm text-[#75685F]">Votre panier est vide.</p>
                <p className="text-[11px]">Touchez un chocolat du terroir pour démarrer une commande.</p>
              </div>
            )}
          </div>

          {/* Étape 2 : Client (Optionnel & Rapide) */}
          <div className="p-3.5 sm:p-4 bg-[#FCF8F2] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-[#75685F]">
                <User className="w-3.5 h-3.5 text-[#8C572F]" />
                <span>2. Client</span>
              </div>
              {selectedCustomer ? (
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-[11px] text-[#C94A4A] hover:underline"
                >
                  Changer
                </button>
              ) : (
                <button
                  onClick={() => setIsQuickCustomerOpen(true)}
                  className="text-[11px] text-[#8C572F] font-semibold hover:underline flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>Nouveau client</span>
                </button>
              )}
            </div>

            {selectedCustomer ? (
              <div className="p-2.5 bg-white rounded-2xl border border-[#E8DFD3] flex items-center justify-between shadow-2xs">
                <div>
                  <span className="font-semibold text-[#1F100A] block">{selectedCustomer.name}</span>
                  <span className="text-[11px] text-[#75685F] font-mono">{selectedCustomer.phone}</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#8C572F] bg-[#FBF4E8] px-2 py-0.5 rounded-full">
                  {selectedCustomer.loyaltyPoints} pts
                </span>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher par nom ou tél (+261)..."
                  onChange={(e) => handleCustomerPhoneSearch(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#E8DFD3] rounded-xl text-xs text-[#241811] placeholder-[#A69486] focus:outline-none focus:border-[#40200F]"
                />
              </div>
            )}
          </div>

          {/* Étape 3 : Mode de Réception & Livraison Madagascar */}
          <div className="p-3.5 sm:p-4 space-y-2.5 bg-white text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-[#75685F]">
                <Truck className="w-3.5 h-3.5 text-[#8C572F]" />
                <span>3. Réception & Livraison</span>
              </div>
              <div className="flex bg-[#F5F0E8] p-0.5 rounded-full border border-[#EAE1D6]">
                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`px-3 py-1 rounded-full text-xs transition flex items-center gap-1 ${
                    orderType === 'pickup'
                      ? 'bg-white text-[#1F100A] font-semibold shadow-xs'
                      : 'text-[#75685F] hover:text-[#1F100A]'
                  }`}
                >
                  <Store className="w-3 h-3 text-[#8C572F]" />
                  <span>Boutique</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`px-3 py-1 rounded-full text-xs transition flex items-center gap-1 ${
                    orderType === 'delivery'
                      ? 'bg-white text-[#1F100A] font-semibold shadow-xs'
                      : 'text-[#75685F] hover:text-[#1F100A]'
                  }`}
                >
                  <Truck className="w-3 h-3 text-[#8C572F]" />
                  <span>Livraison</span>
                </button>
              </div>
            </div>

            {orderType === 'delivery' ? (
              <div className="p-3 rounded-2xl bg-[#FBF7EF] border border-[#EAE1D6] space-y-2.5 animate-fade-in">
                <div>
                  <label className="text-[11px] text-[#75685F] block mb-1 font-medium">
                    Zone de livraison (Madagascar) :
                  </label>
                  <select
                    value={selectedZoneId}
                    onChange={(e) => setSelectedZoneId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E0D5C7] rounded-xl text-xs text-[#1F100A] focus:outline-none font-medium shadow-2xs"
                  >
                    {deliveryZones
                      .filter((z) => z.active)
                      .map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name} — {formatAriary(zone.fee)} ({zone.estimatedTime})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-[#75685F] block mb-1 font-medium">
                    Adresse précise de livraison :
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Quartier, repère, contact..."
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E0D5C7] rounded-xl text-xs text-[#241811] placeholder-[#A69486] focus:outline-none focus:border-[#40200F] shadow-2xs"
                  />
                </div>
              </div>
            ) : (
              <div className="px-3 py-2 rounded-xl bg-[#FBF7EF] border border-[#EAE1D6] text-[11px] text-[#75685F] flex items-center gap-2">
                <Store className="w-3.5 h-3.5 text-[#8C572F] shrink-0" />
                <span>Retrait sur place en boutique Gourmandise Chocolat (Gratuit).</span>
              </div>
            )}
          </div>

          {/* Étape 4 : Règlement Direct (Paiement) */}
          <div className="p-3.5 sm:p-4 space-y-3 bg-[#FCFAF5] text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-[#75685F]">
                <CreditCard className="w-3.5 h-3.5 text-[#8C572F]" />
                <span>4. Paiement</span>
              </div>
              <span className="text-[10px] text-[#8C572F] font-semibold bg-[#F5ECE0] px-2 py-0.5 rounded-full">
                {paymentMethod === 'mvola' ? 'Mobile Money' : paymentMethod === 'cash' ? 'Espèces' : 'Carte TPE'}
              </span>
            </div>

            {/* Sélecteur de méthode de paiement verticalement intégré */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('mvola')}
                className={`p-2 rounded-2xl border text-xs font-medium transition flex flex-col items-center gap-1 text-center ${
                  paymentMethod === 'mvola'
                    ? 'bg-[#1F100A] text-white border-[#1F100A] shadow-xs'
                    : 'bg-white text-[#75685F] border-[#E8DFD3] hover:bg-[#FBF7EF]'
                }`}
              >
                <Smartphone className={`w-4 h-4 ${paymentMethod === 'mvola' ? 'text-[#F5C76D]' : 'text-[#8C572F]'}`} />
                <span className="font-semibold text-[11px] leading-tight">MVola/Orange</span>
                <span className={`text-[9px] ${paymentMethod === 'mvola' ? 'text-white/80' : 'text-[#A69486]'}`}>Mobile</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-2 rounded-2xl border text-xs font-medium transition flex flex-col items-center gap-1 text-center ${
                  paymentMethod === 'cash'
                    ? 'bg-[#1F100A] text-white border-[#1F100A] shadow-xs'
                    : 'bg-white text-[#75685F] border-[#E8DFD3] hover:bg-[#FBF7EF]'
                }`}
              >
                <Banknote className={`w-4 h-4 ${paymentMethod === 'cash' ? 'text-[#F5C76D]' : 'text-[#8C572F]'}`} />
                <span className="font-semibold text-[11px] leading-tight">Espèces</span>
                <span className={`text-[9px] ${paymentMethod === 'cash' ? 'text-white/80' : 'text-[#A69486]'}`}>Billets Ar</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2 rounded-2xl border text-xs font-medium transition flex flex-col items-center gap-1 text-center ${
                  paymentMethod === 'card'
                    ? 'bg-[#1F100A] text-white border-[#1F100A] shadow-xs'
                    : 'bg-white text-[#75685F] border-[#E8DFD3] hover:bg-[#FBF7EF]'
                }`}
              >
                <CreditCard className={`w-4 h-4 ${paymentMethod === 'card' ? 'text-[#F5C76D]' : 'text-[#8C572F]'}`} />
                <span className="font-semibold text-[11px] leading-tight">Carte TPE</span>
                <span className={`text-[9px] ${paymentMethod === 'card' ? 'text-white/80' : 'text-[#A69486]'}`}>Bancaire</span>
              </button>
            </div>

            {/* Champs contextuels de paiement */}
            {paymentMethod === 'mvola' && (
              <div className="p-3 bg-white rounded-2xl border border-[#E8DFD3] text-xs space-y-1.5 animate-fade-in shadow-2xs">
                <label className="text-[11px] text-[#75685F] block font-medium">
                  Réf. transaction (MVola / Orange Money / Airtel Money) :
                </label>
                <input
                  type="text"
                  value={mobileMoneyRef}
                  onChange={(e) => setMobileMoneyRef(e.target.value)}
                  placeholder="ex : MVOLA-984210 (facultatif)"
                  className="w-full px-3 py-1.5 bg-[#FBF7EF] border border-[#E0D5C7] rounded-xl text-xs text-[#1F100A] focus:outline-none focus:border-[#40200F]"
                />
                <p className="text-[10px] text-[#8C572F]">
                  Validation enregistrée directement dans le journal de vente.
                </p>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="p-3 bg-white rounded-2xl border border-[#E8DFD3] text-xs space-y-2 animate-fade-in shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-[#75685F] font-medium">
                    Montant remis en espèces (Ariary) :
                  </label>
                  <button
                    type="button"
                    onClick={() => setCashTendered(total.toString())}
                    className="text-[10px] text-[#8C572F] hover:underline font-semibold"
                  >
                    Montant exact
                  </button>
                </div>

                <input
                  type="number"
                  step="500"
                  value={cashTendered}
                  onChange={(e) => setCashTendered(e.target.value)}
                  placeholder={total.toString()}
                  className="w-full px-3 py-1.5 bg-[#FBF7EF] border border-[#E0D5C7] rounded-xl text-sm font-mono font-bold text-[#1F100A] focus:outline-none focus:border-[#40200F]"
                />

                {/* Coupures rapides d'Ariary */}
                <div className="flex gap-1.5 flex-wrap">
                  {[10000, 20000, 50000, 100000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCashTendered(amt.toString())}
                      className={`px-2 py-1 rounded-lg text-[11px] font-mono transition border ${
                        cashTendered === amt.toString()
                          ? 'bg-[#1F100A] text-white border-[#1F100A]'
                          : 'bg-[#FBF7EF] hover:bg-[#F3ECE0] border-[#E0D5C7] text-[#1F100A]'
                      }`}
                    >
                      {formatAriary(amt)}
                    </button>
                  ))}
                </div>

                {cashAmountNum >= total ? (
                  <div className="flex justify-between items-center pt-1.5 border-t border-[#E8DFD3] text-xs font-semibold">
                    <span className="text-[#75685F]">Rendu de monnaie :</span>
                    <span className="font-mono text-[#2F8F61] text-sm font-bold">
                      {formatAriary(changeDue)}
                    </span>
                  </div>
                ) : (
                  <div className="pt-1 border-t border-[#E8DFD3] text-[11px] text-[#C94A4A] font-medium">
                    Montant insuffisant (manque {formatAriary(total - cashAmountNum)})
                  </div>
                )}
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="p-3 bg-white rounded-2xl border border-[#E8DFD3] text-xs text-[#75685F] space-y-1 animate-fade-in shadow-2xs">
                <div className="flex items-center gap-1.5 text-[#1F100A] font-semibold">
                  <CreditCard className="w-3.5 h-3.5 text-[#8C572F]" />
                  <span>Terminal TPE Bancaire Prêt</span>
                </div>
                <p className="text-[11px]">
                  Insérez ou présentez la carte sans contact sur le terminal de paiement.
                </p>
              </div>
            )}
          </div>

          {/* Étape 5 : Récapitulatif Financier */}
          <div className="p-3.5 sm:p-4 space-y-1.5 bg-white text-xs text-[#75685F]">
            <div className="flex justify-between">
              <span>Sous-total chocolats :</span>
              <span className="font-mono text-[#1F100A]">{formatAriary(rawSubtotal)}</span>
            </div>

            {orderType === 'delivery' && (
              <div className="flex justify-between text-[#8C572F]">
                <span>Frais livraison ({activeZone?.name}) :</span>
                <span className="font-mono">{formatAriary(deliveryFee)}</span>
              </div>
            )}

            <div className="flex justify-between items-baseline pt-2 border-t border-[#F0E6DB]">
              <div>
                <span className="font-serif font-bold text-sm text-[#1F100A] block">TOTAL NET :</span>
                <span className="text-[10px] text-[#A69486]">TVA 20% incluse ({formatAriary(taxAmount)})</span>
              </div>
              <span className="font-mono font-bold text-lg text-[#1F100A]">
                {formatAriary(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Bouton Unique de Confirmation Directe (Zéro transition / Zéro modale) */}
        {cart.length > 0 && (
          <div className="p-3.5 sm:p-4 bg-white border-t border-[#EFE7DE] shrink-0 shadow-lg">
            <button
              onClick={handleConfirmOrder}
              disabled={paymentMethod === 'cash' && cashTendered !== '' && cashAmountNum < total}
              className={`w-full py-3.5 px-4 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-98 flex items-center justify-between shadow-md ${
                paymentMethod === 'cash' && cashTendered !== '' && cashAmountNum < total
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                  : 'bg-[#1F100A] hover:bg-[#381B0E] text-white shadow-[#1F100A]/20 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#F5C76D] stroke-[2.5]" />
                <span>Confirmer la commande</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono font-bold text-xs sm:text-sm text-[#F5C76D]">
                <span>{formatAriary(total)}</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </div>
            </button>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* QUICK NEW CUSTOMER MODAL */}
      {/* ============================================================ */}
      {isQuickCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#EAE1D6] space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0E6DB] pb-2">
              <span className="font-serif font-bold text-base text-[#1F100A]">
                Nouveau Client en Caisse
              </span>
              <button
                onClick={() => setIsQuickCustomerOpen(false)}
                className="p-1 text-[#75685F] hover:text-[#1F100A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickCustomer} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Nom du client"
                value={quickCustName}
                onChange={(e) => setNewCustNameWrapper(e.target.value)}
                className="w-full px-3 py-2 bg-[#FBF7EF] border border-[#E0D5C7] rounded-xl text-xs text-[#1F100A] focus:outline-none"
              />
              <input
                type="tel"
                required
                placeholder="+261 34 ..."
                value={quickCustPhone}
                onChange={(e) => setQuickCustPhone(e.target.value)}
                className="w-full px-3 py-2 bg-[#FBF7EF] border border-[#E0D5C7] rounded-xl text-xs font-mono text-[#1F100A] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Adresse (facultatif)"
                value={quickCustAddress}
                onChange={(e) => setQuickCustAddress(e.target.value)}
                className="w-full px-3 py-2 bg-[#FBF7EF] border border-[#E0D5C7] rounded-xl text-xs text-[#1F100A] focus:outline-none"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuickCustomerOpen(false)}
                  className="px-3 py-1.5 rounded-full text-xs text-[#75685F]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-[#1F100A] text-white text-xs font-semibold"
                >
                  Associer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  function setNewCustNameWrapper(val: string) {
    setQuickCustName(val);
  }
};
