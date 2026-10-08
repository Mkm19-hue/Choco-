import React, { useState } from 'react';
import { Product, ProductCategory, StockMovement, formatAriary } from '../../types/pos';
import { Search, Plus, Minus, Package, Filter, Check, X, Camera, AlertTriangle, History } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../../data/initialChocolates';

interface CatalogAdminViewProps {
  products: Product[];
  movements: StockMovement[];
  onUpdateStock: (productId: string, delta: number, type: 'restock' | 'adjustment' | 'tasting_loss', note?: string) => void;
  onAddNewProduct: (product: Product) => void;
}

export const CatalogAdminView: React.FC<CatalogAdminViewProps> = ({
  products,
  movements,
  onUpdateStock,
  onAddNewProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // New Product Form
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<string>('chocolats');
  const [newPrice, setNewPrice] = useState<number>(20000);
  const [newStock, setNewStock] = useState<number>(20);
  const [newOrigin, setNewOrigin] = useState('Vallée du Sambirano, Madagascar');
  const [newImage, setNewImage] = useState('/src/assets/images/choc_assortiment_luxe_1791440776603.jpg');

  const availablePhotos = [
    { label: 'Assortiment de Luxe', path: '/src/assets/images/choc_assortiment_luxe_1791440776603.jpg' },
    { label: 'Coffret Prestige', path: '/src/assets/images/choc_coffret_prestige_1791353441608.jpg' },
    { label: 'Tablettes Artisanales', path: '/src/assets/images/choc_tablettes_artisan_1791440787716.jpg' },
    { label: 'Tablette Pure Origine', path: '/src/assets/images/choc_tablette_origine_1791353456852.jpg' },
    { label: 'Rochers & Pralinés', path: '/src/assets/images/choc_rochers_pralines_1791440798294.jpg' },
    { label: 'Pralinés au Détail', path: '/src/assets/images/choc_pralines_detail_1791353475578.jpg' },
    { label: 'Truffes Cacao Amer', path: '/src/assets/images/choc_truffes_cacao_1791440812616.jpg' },
    { label: 'Truffes Artisanales', path: '/src/assets/images/choc_truffes_artisan_1791353465828.jpg' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch =
      search.trim() === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.origin && p.origin.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newPrice <= 0) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      price: Math.round(Number(newPrice)),
      unitType: 'piece',
      stockQuantity: Math.max(0, Number(newStock)),
      minStockThreshold: 5,
      image: newImage,
      sku: `GC-${Date.now().toString().slice(-4)}`,
      origin: newOrigin.trim(),
    };

    onAddNewProduct(newProd);
    setIsAddModalOpen(false);
    setNewName('');
    setNewPrice(20000);
    setNewStock(20);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FBF7EF] text-[#241811] p-4 sm:p-6 lg:p-8 pb-28 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE7DE] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#8C572F] font-semibold">
                Catalogue & Stocks
              </span>
              <span className="text-xs text-[#75685F]">· Madagascar 🇲🇬</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F100A] tracking-tight mt-1">
              Catalogue des Créations Gourmandise
            </h1>
            <p className="text-xs sm:text-sm text-[#75685F] mt-0.5">
              Gestion visuelle des produits chocolatés, prix en Ariary et ajustements de stock.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#E0D5C7] text-[#1F100A] text-xs font-medium hover:bg-[#FBF7EF] transition shadow-xs"
            >
              <History className="w-3.5 h-3.5 text-[#8C572F]" />
              <span>Journal des stocks</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1F100A] text-white text-xs font-semibold hover:bg-[#40200F] transition shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Nouveau produit</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#75685F]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par création, fèves, terroir..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#E8DFD3] rounded-full text-xs sm:text-sm text-[#241811] placeholder-[#A69486] focus:outline-none focus:border-[#40200F] shadow-xs"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === 'all'
                  ? 'bg-[#1F100A] text-white shadow-xs font-semibold'
                  : 'bg-white text-[#75685F] border border-[#EAE1D6] hover:bg-[#F3ECE0]'
              }`}
            >
              Tous
            </button>
            {INITIAL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-[#1F100A] text-white shadow-xs font-semibold'
                    : 'bg-white text-[#75685F] border border-[#EAE1D6] hover:bg-[#F3ECE0]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid: Pure Photography & Visual Polish */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl p-4 border border-[#ECE2D5] shadow-xs hover:border-[#D9CCBE] transition flex flex-col justify-between"
            >
              {/* Product Photo */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F7F2EB] mb-3">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[#40200F] text-[10px] font-semibold">
                  {prod.category}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-1 mb-3">
                <h3 className="font-serif font-bold text-base text-[#1F100A] line-clamp-1">
                  {prod.name}
                </h3>
                <p className="text-xs text-[#75685F] line-clamp-1">
                  {prod.origin || 'Madagascar'}
                </p>
                <div className="pt-1">
                  <span className="font-mono font-bold text-base text-[#1F100A]">
                    {formatAriary(prod.price)}
                  </span>
                </div>
              </div>

              {/* Stock Stepper Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-[#F5EFE7] text-xs">
                <div>
                  <span className="text-[10px] text-[#A69486] block">EN STOCK</span>
                  <span
                    className={`font-mono font-bold text-sm ${
                      prod.stockQuantity <= prod.minStockThreshold
                        ? 'text-[#D7952E]'
                        : 'text-[#1F100A]'
                    }`}
                  >
                    {prod.stockQuantity} {prod.unitType === 'weight_100g' ? 'x 100g' : 'unités'}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-[#FBF7EF] border border-[#E8DFD3] rounded-full p-0.5">
                  <button
                    onClick={() => onUpdateStock(prod.id, -1, 'adjustment')}
                    title="Décrémenter stock (-1)"
                    className="w-7 h-7 rounded-full bg-white text-[#1F100A] flex items-center justify-center hover:bg-[#F3ECE0] transition shadow-xs"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onUpdateStock(prod.id, 5, 'restock', 'Réassort atelier')}
                    title="Ajouter réassort (+5)"
                    className="w-7 h-7 rounded-full bg-[#1F100A] text-white flex items-center justify-center hover:bg-[#40200F] transition shadow-xs"
                  >
                    <Plus className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-[#75685F] space-y-2">
            <Package className="w-10 h-10 mx-auto text-[#D4C5B5] stroke-[1.4]" />
            <p className="font-serif text-base text-[#1F100A]">Aucun produit trouvé.</p>
            <p className="text-xs">Modifiez la recherche ou la catégorie.</p>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL: AJOUTER UN PRODUIT */}
      {/* ============================================================ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#EAE1D6] space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#F0E6DB] pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#8C572F] font-semibold">
                  Atelier & Création
                </span>
                <h3 className="font-serif font-bold text-xl text-[#1F100A]">
                  Nouveau Chocolat Gourmandise
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-[#75685F] hover:text-[#1F100A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1F100A] block">
                  Nom de la création :
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex : Coffret Découverte 16 Pièces..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FBF7EF] border border-[#E0D5C7] rounded-xl text-xs sm:text-sm text-[#1F100A] focus:outline-none focus:border-[#40200F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1F100A] block">
                    Catégorie :
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FBF7EF] border border-[#E0D5C7] rounded-xl text-xs text-[#1F100A] focus:outline-none"
                  >
                    {INITIAL_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1F100A] block">
                    Prix en Ariary (Ar) :
                  </label>
                  <input
                    type="number"
                    required
                    step="500"
                    min="500"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-[#FBF7EF] border border-[#E0D5C7] rounded-xl text-xs sm:text-sm font-mono font-bold text-[#1F100A] focus:outline-none"
                  />
                  <span className="text-[10px] text-[#75685F]">
                    {formatAriary(newPrice)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1F100A] block">
                    Stock initial :
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-[#FBF7EF] border border-[#E0D5C7] rounded-xl text-xs font-mono text-[#1F100A] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1F100A] block">
                    Origine fèves / terroir :
                  </label>
                  <input
                    type="text"
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FBF7EF] border border-[#E0D5C7] rounded-xl text-xs text-[#1F100A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Photo Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1F100A] block">
                  Photographie du produit :
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availablePhotos.slice(0, 4).map((p) => (
                    <button
                      type="button"
                      key={p.path}
                      onClick={() => setNewImage(p.path)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                        newImage === p.path ? 'border-[#1F100A] ring-2 ring-[#E6B352]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={p.path} alt={p.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0E6DB]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs text-[#75685F] hover:text-[#1F100A]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#1F100A] text-white text-xs font-semibold shadow-xs hover:bg-[#40200F] transition"
                >
                  Ajouter au catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: HISTORIQUE DES MOUVEMENTS DE STOCK */}
      {/* ============================================================ */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-[#EAE1D6] space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#F0E6DB] pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#8C572F]" />
                <h3 className="font-serif font-bold text-lg text-[#1F100A]">
                  Journal des Mouvements de Stock
                </h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 text-[#75685F] hover:text-[#1F100A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {movements.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-2xl bg-[#FBF7EF] border border-[#EAE1D6] text-xs flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-semibold text-[#1F100A] block">{m.productName}</span>
                    <span className="text-[11px] text-[#75685F]">
                      {new Date(m.timestamp).toLocaleDateString('fr-FR')} {new Date(m.timestamp).toLocaleTimeString('fr-FR')} · {m.note || m.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-mono font-bold text-sm ${
                        m.delta > 0 ? 'text-[#2F8F61]' : 'text-[#C94A4A]'
                      }`}
                    >
                      {m.delta > 0 ? `+${m.delta}` : m.delta}
                    </span>
                    <span className="text-[10px] text-[#75685F] block">
                      Nouveau : {m.newStock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
