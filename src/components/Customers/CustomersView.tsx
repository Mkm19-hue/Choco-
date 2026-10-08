import React, { useState } from 'react';
import { Customer, formatAriary } from '../../types/pos';
import { Search, Plus, Phone, MapPin, User, Check, ArrowRight, ShoppingBag } from 'lucide-react';

interface CustomersViewProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onSelectCustomerForCart?: (customer: Customer) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onAddCustomer,
  onSelectCustomerForCart,
}) => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedbackCustName, setFeedbackCustName] = useState<string | null>(null);

  // New Customer Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('+261 ');
  const [newAddress, setNewAddress] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.address && c.address.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: newName.trim(),
      phone: newPhone.trim(),
      email: `${newName.toLowerCase().replace(/\s+/g, '.')}@client.mg`,
      address: newAddress.trim() || undefined,
      loyaltyPoints: 20, // 20 points de bienvenue
      totalSpent: 0,
      notes: newNotes.trim() || undefined,
    };

    onAddCustomer(newCust);
    setShowAddModal(false);
    setNewName('');
    setNewPhone('+261 ');
    setNewAddress('');
    setNewNotes('');
  };

  const handleSelectCustomer = (c: Customer) => {
    if (onSelectCustomerForCart) {
      onSelectCustomerForCart(c);
      setFeedbackCustName(c.name);
      setTimeout(() => setFeedbackCustName(null), 2000);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FBF7EF] text-[#241811] p-4 sm:p-6 lg:p-8 pb-28 lg:pb-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE7DE] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#8C572F] font-semibold">
                Fidélité & Clientèle
              </span>
              <span className="text-xs text-[#75685F]">· Madagascar 🇲🇬</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F100A] tracking-tight mt-1">
              Répertoire Clients
            </h1>
            <p className="text-xs sm:text-sm text-[#75685F] mt-0.5">
              Recherche rapide par nom ou numéro (+261), coordonnées et cumul de points fidélité.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1F100A] text-white text-xs font-semibold shadow-xs hover:bg-[#40200F] transition active:scale-95 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nouveau client</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#75685F]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou numéro (+261)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8DFD3] rounded-full text-xs sm:text-sm text-[#241811] placeholder-[#A69486] focus:outline-none focus:border-[#40200F] shadow-xs"
          />
        </div>

        {/* Compact Customers Cards */}
        <div className="space-y-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="p-4 sm:p-5 rounded-3xl bg-white border border-[#EAE1D6] shadow-xs hover:border-[#D9CCBE] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Left Info: Name, Phone, Address */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-serif font-bold text-base text-[#1F100A]">
                    {c.name}
                  </h3>
                  <span className="font-mono text-xs text-[#8C572F] font-semibold">
                    {c.phone}
                  </span>
                </div>

                {c.address && (
                  <p className="text-xs text-[#75685F] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#A69486] shrink-0" />
                    <span className="truncate">{c.address}</span>
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-[#75685F] pt-0.5">
                  <span>
                    Cumul d'achats : <strong className="text-[#1F100A] font-mono">{formatAriary(c.totalSpent)}</strong>
                  </span>
                  <span>·</span>
                  <span>
                    Fidélité : <strong className="text-[#8C572F] font-mono font-bold">{c.loyaltyPoints} points</strong>
                  </span>
                </div>
              </div>

              {/* Action Button: Attach to Cart */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F5EFE7]">
                <button
                  onClick={() => handleSelectCustomer(c)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FBF7EF] hover:bg-[#F3ECE0] border border-[#E0D5C7] text-xs font-semibold text-[#1F100A] transition"
                  title="Associer à la commande en cours"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#8C572F]" />
                  <span>Choisir en caisse</span>
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#75685F] space-y-2">
              <User className="w-10 h-10 mx-auto text-[#D4C5B5] stroke-[1.4]" />
              <p className="font-serif text-base text-[#1F100A]">Aucun client trouvé.</p>
              <p className="text-xs">Tapez un autre nom ou ajoutez immédiatement ce client.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-full bg-[#1F100A] text-white text-xs font-semibold"
              >
                Ajouter ce client
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL: AJOUT NOUVEAU CLIENT */}
      {/* ============================================================ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#EAE1D6] space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#F0E6DB] pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#8C572F] font-semibold">
                  Fidélité Madagascar
                </span>
                <h3 className="font-serif font-bold text-lg text-[#1F100A]">
                  Nouveau Client
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-[#75685F] hover:text-[#1F100A]"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1F100A] block">
                  Nom et Prénom :
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex : Bako Rasoamanana"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FBF7EF] border border-[#E0D5C7] rounded-xl text-xs sm:text-sm text-[#1F100A] focus:outline-none focus:border-[#40200F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1F100A] block">
                  Numéro de Téléphone (+261) :
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+261 34 12 345 67"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FBF7EF] border border-[#E0D5C7] rounded-xl text-xs sm:text-sm font-mono text-[#1F100A] focus:outline-none focus:border-[#40200F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1F100A] block">
                  Adresse de livraison habituelle :
                </label>
                <input
                  type="text"
                  placeholder="ex : Villa 14, Ivandry..."
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FBF7EF] border border-[#E0D5C7] rounded-xl text-xs sm:text-sm text-[#1F100A] focus:outline-none focus:border-[#40200F]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0E6DB]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full text-xs text-[#75685F] hover:text-[#1F100A]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#1F100A] text-white text-xs font-semibold shadow-xs hover:bg-[#40200F] transition"
                >
                  Enregistrer le client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
