import React, { useState } from 'react';
import { Product, CustomBoxItem, CartItem, formatAriary } from '../../types/pos';
import { Gift, Check, Plus, Minus, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CustomBoxStudioProps {
  products: Product[];
  onAddCustomBoxToCart: (customBoxItem: CartItem) => void;
  onNavigateToPOS?: () => void;
}

interface BoxOption {
  capacity: number;
  name: string;
  subtitle: string;
  price: number;
  gridCols: number;
}

export const CustomBoxStudio: React.FC<CustomBoxStudioProps> = ({
  products,
  onAddCustomBoxToCart,
  onNavigateToPOS,
}) => {
  const boxOptions: BoxOption[] = [
    { capacity: 4, name: 'Écrin Découverte (4 Pièces)', subtitle: 'Idéal pour une dégustation intime', price: 18000, gridCols: 2 },
    { capacity: 9, name: 'Écrin Passion (9 Pièces)', subtitle: 'Le format classique favori de l’atelier', price: 38000, gridCols: 3 },
    { capacity: 16, name: 'Grand Écrin Prestige (16 Pièces)', subtitle: 'Pour les grands amateurs de cacao de plantation', price: 65000, gridCols: 4 },
    { capacity: 25, name: 'Écrin Sommelier d’Or (25 Pièces)', subtitle: 'La collection intégrale des fèves de Madagascar', price: 98000, gridCols: 5 },
  ];

  const [selectedBoxOption, setSelectedBoxOption] = useState<BoxOption>(boxOptions[1]); // 9 pieces default
  const [counts, setCounts] = useState<{ [productId: string]: number }>({});
  const [ribbon, setRibbon] = useState<'gold' | 'cacao' | 'ruby' | 'none'>('gold');
  const [giftNote, setGiftNote] = useState<string>('');
  const [isAddedFeedback, setIsAddedFeedback] = useState<boolean>(false);

  // Available bonbons / pralines from products
  const bonbonProducts = products.filter(
    (p) =>
      p.category === 'pralines' ||
      p.category === 'truffes' ||
      p.category === 'bonbons_detail' ||
      p.category === 'truffes_gourmandises'
  );

  const totalSelected = Object.values(counts).reduce((acc, qty) => acc + qty, 0);
  const remaining = selectedBoxOption.capacity - totalSelected;
  const isComplete = totalSelected === selectedBoxOption.capacity;

  const handleIncrement = (productId: string) => {
    if (totalSelected >= selectedBoxOption.capacity) return;
    setCounts((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const handleDecrement = (productId: string) => {
    if (!counts[productId] || counts[productId] <= 0) return;
    setCounts((prev) => ({
      ...prev,
      [productId]: prev[productId] - 1,
    }));
  };

  const handleClear = () => {
    setCounts({});
  };

  const handleAutoAssortment = () => {
    const newCounts: { [productId: string]: number } = {};
    let left = selectedBoxOption.capacity;
    const available = bonbonProducts.filter((b) => b.stockQuantity > 0);
    if (available.length === 0) return;

    let idx = 0;
    while (left > 0) {
      const prod = available[idx % available.length];
      newCounts[prod.id] = (newCounts[prod.id] || 0) + 1;
      left--;
      idx++;
    }
    setCounts(newCounts);
  };

  const handleSelectBoxFormat = (option: BoxOption) => {
    setSelectedBoxOption(option);
    if (totalSelected > option.capacity) {
      handleClear();
    }
  };

  // Convert counts to a flattened list of items to display in the visual velvet tray
  const slotsList: (Product | null)[] = [];
  Object.entries(counts).forEach(([prodId, qty]) => {
    const prod = bonbonProducts.find((p) => p.id === prodId);
    if (prod) {
      for (let i = 0; i < qty; i++) {
        if (slotsList.length < selectedBoxOption.capacity) {
          slotsList.push(prod);
        }
      }
    }
  });
  while (slotsList.length < selectedBoxOption.capacity) {
    slotsList.push(null);
  }

  const handleAddToCart = () => {
    const chosenItems: CustomBoxItem[] = Object.entries(counts)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const prod = bonbonProducts.find((p) => p.id === id);
        return {
          productId: id,
          productName: prod ? prod.name : 'Chocolat au choix',
          quantity: qty,
          cacaoPercentage: prod?.cacaoPercentage,
        };
      });

    const boxProduct: Product = {
      id: `box-custom-${selectedBoxOption.capacity}-${Date.now()}`,
      name: `${selectedBoxOption.name} (Composition Personnalisée)`,
      category: 'coffrets',
      price: selectedBoxOption.price,
      unitType: 'box',
      stockQuantity: 50,
      minStockThreshold: 5,
      sku: `BOX-CUSTOM-${selectedBoxOption.capacity}`,
      image: '/src/assets/images/choc_assortiment_luxe_1791440776603.jpg',
      isCustomizableBox: true,
      boxCapacity: selectedBoxOption.capacity,
      tastingNotes: `Sélection sur-mesure de ${selectedBoxOption.capacity} chocolats fins de Madagascar`,
    };

    const cartItem: CartItem = {
      id: `cart-box-${Date.now()}`,
      product: boxProduct,
      quantity: 1,
      giftWrapping: ribbon !== 'none',
      ribbonColor: ribbon,
      customGiftNote: giftNote.trim() || undefined,
      customBoxSelection: chosenItems,
      itemPrice: selectedBoxOption.price,
    };

    onAddCustomBoxToCart(cartItem);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#E6B352', '#8C572F', '#1F100A', '#FFFFFF'],
    });

    setIsAddedFeedback(true);
    setTimeout(() => {
      setIsAddedFeedback(false);
      if (onNavigateToPOS) {
        onNavigateToPOS();
      }
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FBF7EF] text-[#241811] p-4 sm:p-6 pb-28 lg:pb-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFE7DE] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-[#F5EFE7] text-[#8C572F] text-[11px] font-semibold border border-[#EAE1D6]">
                Atelier de Composition
              </span>
              <span className="text-xs text-[#75685F]">Fait-main à la commande</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F100A] tracking-tight mt-1">
              Créateur d'Écrin Sur-Mesure
            </h1>
            <p className="text-xs sm:text-sm text-[#75685F] mt-0.5">
              Composez un coffret d'exception selon vos préférences parmi nos ganaches grands crus et pralinés de Madagascar.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoAssortment}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-[#F7F2EB] text-[#1F100A] text-xs font-semibold border border-[#E0D5C7] shadow-xs transition"
            >
              <Gift className="w-3.5 h-3.5 text-[#8C572F]" />
              <span>Assortiment Équilibré</span>
            </button>
            {totalSelected > 0 && (
              <button
                onClick={handleClear}
                className="p-2 rounded-full bg-white hover:bg-[#F7F2EB] text-[#75685F] hover:text-[#C94A4A] text-xs transition border border-[#E0D5C7]"
                title="Vider l'écrin"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 1. Format Selection */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#8C572F] block mb-2.5">
            1. Choisissez le format de votre coffret
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {boxOptions.map((opt) => {
              const isSelected = selectedBoxOption.capacity === opt.capacity;
              return (
                <button
                  key={opt.capacity}
                  onClick={() => handleSelectBoxFormat(opt)}
                  className={`p-4 rounded-3xl text-left border transition-all duration-200 relative overflow-hidden ${
                    isSelected
                      ? 'bg-white border-[#1F100A] shadow-md ring-1 ring-[#1F100A]'
                      : 'bg-white border-[#EAE1D6] hover:border-[#D4C5B5]'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#E6B352]" />
                  )}
                  <span className="text-sm font-serif font-bold text-[#1F100A] block">
                    {opt.name}
                  </span>
                  <span className="text-[11px] text-[#75685F] line-clamp-1 mt-0.5">
                    {opt.subtitle}
                  </span>
                  <span className="text-sm sm:text-base font-mono font-bold text-[#1F100A] block mt-2">
                    {formatAriary(opt.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Composition Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Visual Velvet Tray Preview */}
          <div className="lg:col-span-5 bg-white border border-[#EAE1D6] rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#8C572F] font-semibold block">
                    Plateau Dégustation
                  </span>
                  <span className="text-sm font-serif font-bold text-[#1F100A]">
                    Remplissage : {totalSelected} / {selectedBoxOption.capacity} chocolats
                  </span>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold tabular-nums ${
                  isComplete ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-[#FBF7EF] text-[#8C572F]'
                }`}>
                  {isComplete ? 'Écrin Complet ✓' : `Reste ${remaining}`}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-[#F0E6DB] rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-[#1F100A] transition-all duration-300"
                  style={{ width: `${(totalSelected / selectedBoxOption.capacity) * 100}%` }}
                />
              </div>

              {/* Velvet Tray Cavities Box */}
              <div
                className="grid gap-2.5 p-4 rounded-2xl bg-[#1F100A] shadow-inner max-w-sm mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${selectedBoxOption.gridCols}, minmax(0, 1fr))`,
                }}
              >
                {slotsList.map((prod, slotIdx) => (
                  <div
                    key={`${slotIdx}-${prod?.id || 'empty'}`}
                    onClick={() => prod && handleDecrement(prod.id)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1 text-center transition-all duration-200 cursor-pointer ${
                      prod
                        ? 'bg-[#382015] border border-[#E6B352]/70 shadow-sm hover:border-rose-400 group animate-scale-bounce'
                        : 'bg-[#150A06] border border-dashed border-[#472D1E] text-[#6E4F3E]'
                    }`}
                    title={prod ? `Cliquer pour retirer ${prod.name}` : 'Cavité vide'}
                  >
                    {prod ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-[#E6B352] mb-1 group-hover:bg-rose-400 transition" />
                        <span className="text-[10px] font-medium text-white line-clamp-2 leading-tight group-hover:text-rose-200">
                          {prod.name.replace('Palet d\'Or ', '').replace('Praliné ', '').replace('Ganache ', '')}
                        </span>
                      </>
                    ) : (
                      <span className="text-[10px] text-[#8C6D5B] font-mono">
                        #{slotIdx + 1}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Packaging Personalization */}
            <div className="mt-6 pt-4 border-t border-[#F0E6DB] space-y-3">
              <div>
                <label className="text-xs text-[#75685F] block mb-1.5 font-medium">
                  Ruban de Soie :
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  <button
                    onClick={() => setRibbon('gold')}
                    className={`py-1.5 px-2 rounded-xl border text-center transition ${
                      ribbon === 'gold' ? 'bg-[#1F100A] text-white font-semibold border-[#1F100A]' : 'bg-[#FBF7EF] text-[#75685F] border-[#EAE1D6]'
                    }`}
                  >
                    Or Royal
                  </button>
                  <button
                    onClick={() => setRibbon('cacao')}
                    className={`py-1.5 px-2 rounded-xl border text-center transition ${
                      ribbon === 'cacao' ? 'bg-[#5C3D2E] text-white font-semibold border-[#5C3D2E]' : 'bg-[#FBF7EF] text-[#75685F] border-[#EAE1D6]'
                    }`}
                  >
                    Cacao Noir
                  </button>
                  <button
                    onClick={() => setRibbon('ruby')}
                    className={`py-1.5 px-2 rounded-xl border text-center transition ${
                      ribbon === 'ruby' ? 'bg-[#852525] text-white font-semibold border-[#852525]' : 'bg-[#FBF7EF] text-[#75685F] border-[#EAE1D6]'
                    }`}
                  >
                    Grenat
                  </button>
                  <button
                    onClick={() => setRibbon('none')}
                    className={`py-1.5 px-2 rounded-xl border text-center transition ${
                      ribbon === 'none' ? 'bg-stone-200 text-[#1F100A] font-semibold border-stone-300' : 'bg-[#FBF7EF] text-[#75685F] border-[#EAE1D6]'
                    }`}
                  >
                    Sans
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#75685F] block mb-1 font-medium">
                  Message calligraphié :
                </label>
                <input
                  type="text"
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="Ex : Pour Mialy avec toute notre affection..."
                  className="w-full px-3 py-2 bg-[#FBF7EF] border border-[#E0D5C7] rounded-xl text-xs text-[#1F100A] focus:outline-none"
                />
              </div>

              <button
                disabled={!isComplete}
                onClick={handleAddToCart}
                className={`w-full py-3.5 px-4 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm active:scale-98 ${
                  isComplete
                    ? 'bg-[#1F100A] text-white hover:bg-[#40200F]'
                    : 'bg-[#F0E6DB] text-[#A69486] cursor-not-allowed'
                }`}
              >
                {isAddedFeedback ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Écrin Ajouté au Panier !</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4" />
                    <span>
                      {isComplete
                        ? `Ajouter cet Écrin (${formatAriary(selectedBoxOption.price)})`
                        : `Complétez encore ${remaining} chocolat${remaining > 1 ? 's' : ''}`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bonbons & Pralinés Selection List */}
          <div className="lg:col-span-7 bg-white border border-[#EAE1D6] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#8C572F] font-semibold block">
                  2. Garnissez votre coffret
                </span>
                <span className="text-base font-serif font-bold text-[#1F100A]">
                  Ganaches & Pralinés d'Exception
                </span>
              </div>
              <span className="text-xs text-[#75685F]">
                {bonbonProducts.length} créations
              </span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[550px] pr-1">
              {bonbonProducts.map((bonbon) => {
                const count = counts[bonbon.id] || 0;
                const isOutOfStock = bonbon.stockQuantity <= 0;
                return (
                  <div
                    key={bonbon.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition ${
                      count > 0
                        ? 'bg-[#FDFBF7] border-[#1F100A]'
                        : 'bg-[#FBF7EF] border-[#EFE7DE] hover:border-[#D4C5B5]'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-serif font-bold text-[#1F100A] truncate">
                          {bonbon.name}
                        </span>
                        {bonbon.cacaoPercentage && (
                          <span className="px-1.5 py-0.5 rounded-full bg-white text-[#40200F] text-[10px] font-mono font-semibold border border-[#E0D5C7] shrink-0">
                            {bonbon.cacaoPercentage}%
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#75685F] line-clamp-1 mt-0.5">
                        {bonbon.tastingNotes || bonbon.origin}
                      </p>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-1.5 shrink-0 bg-white border border-[#E0D5C7] rounded-full p-0.5">
                      <button
                        onClick={() => handleDecrement(bonbon.id)}
                        disabled={count <= 0}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[#75685F] hover:text-[#1F100A] disabled:opacity-30 transition-transform duration-150 active:scale-75 hover:scale-110"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="w-5 text-center font-mono font-bold text-xs text-[#1F100A]">
                        {count}
                      </span>

                      <button
                        onClick={() => handleIncrement(bonbon.id)}
                        disabled={isComplete || isOutOfStock || count >= bonbon.stockQuantity}
                        className="w-7 h-7 rounded-full bg-[#1F100A] text-white flex items-center justify-center shadow-xs hover:bg-[#40200F] disabled:opacity-30 transition-transform duration-150 active:scale-75 hover:scale-110"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
