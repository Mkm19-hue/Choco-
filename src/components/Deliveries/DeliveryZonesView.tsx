import React, { useState } from 'react';
import { DeliveryZone, formatAriary } from '../../types/pos';
import { Plus, Edit2, Trash2, Check, X, MapPin, Clock, Truck, AlertCircle } from 'lucide-react';

interface DeliveryZonesViewProps {
  zones: DeliveryZone[];
  onAddZone: (zone: DeliveryZone) => void;
  onUpdateZone: (zone: DeliveryZone) => void;
  onDeleteZone: (zoneId: string) => void;
  onToggleActive: (zoneId: string) => void;
}

export const DeliveryZonesView: React.FC<DeliveryZonesViewProps> = ({
  zones,
  onAddZone,
  onUpdateZone,
  onDeleteZone,
  onToggleActive,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);

  // New zone form state
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneFee, setNewZoneFee] = useState<number>(5000);
  const [newZoneTime, setNewZoneTime] = useState('30-45 min');
  const [newZoneActive, setNewZoneActive] = useState(true);

  // Edit zone form state
  const [editName, setEditName] = useState('');
  const [editFee, setEditFee] = useState<number>(0);
  const [editTime, setEditTime] = useState('');
  const [editActive, setEditActive] = useState(true);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const activeZonesCount = zones.filter((z) => z.active).length;
  const avgFee = zones.length > 0 ? Math.round(zones.reduce((acc, z) => acc + z.fee, 0) / zones.length) : 0;

  const handleOpenAddModal = () => {
    setNewZoneName('');
    setNewZoneFee(5000);
    setNewZoneTime('30-45 min');
    setNewZoneActive(true);
    setIsAddModalOpen(true);
  };

  const handleSaveNewZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName.trim() || newZoneFee < 0) return;

    const newZone: DeliveryZone = {
      id: `zone-${Date.now()}`,
      name: newZoneName.trim(),
      fee: Math.round(Number(newZoneFee)),
      estimatedTime: newZoneTime.trim() || '45 min',
      active: newZoneActive,
    };

    onAddZone(newZone);
    setIsAddModalOpen(false);
  };

  const handleStartEdit = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setEditName(zone.name);
    setEditFee(zone.fee);
    setEditTime(zone.estimatedTime);
    setEditActive(zone.active);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingZone || !editName.trim() || editFee < 0) return;

    const updated: DeliveryZone = {
      ...editingZone,
      name: editName.trim(),
      fee: Math.round(Number(editFee)),
      estimatedTime: editTime.trim() || '45 min',
      active: editActive,
    };

    onUpdateZone(updated);
    setEditingZone(null);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FBF7EF] text-[#241811] p-4 sm:p-6 lg:p-8 pb-28 lg:pb-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE7DE] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#8C572F] font-semibold">
                Logistique Madagascar 🇲🇬
              </span>
              <span className="text-xs text-[#75685F]">·</span>
              <span className="text-xs text-[#75685F]">{activeZonesCount} zones actives</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F100A] tracking-tight mt-1">
              Zones de Livraison & Tarifs
            </h1>
            <p className="text-xs sm:text-sm text-[#75685F] mt-0.5">
              Configuration 100% dynamique des quartiers d'Antananarivo, frais en Ariary et délais d'acheminement.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1F100A] text-white text-xs font-semibold shadow-xs hover:bg-[#40200F] transition active:scale-95 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Ajouter une zone</span>
          </button>
        </div>

        {/* Dynamic Zone Cards */}
        <div className="space-y-3">
          {zones.map((zone) => {
            const isEditing = editingZone?.id === zone.id;

            if (isEditing) {
              return (
                <form
                  key={zone.id}
                  onSubmit={handleSaveEdit}
                  className="p-5 rounded-3xl bg-white border-2 border-[#1F100A] shadow-md space-y-4 animate-fade-in"
                >
                  <div className="flex items-center justify-between border-b border-[#F0E6DB] pb-2">
                    <span className="font-serif font-bold text-sm text-[#1F100A]">
                      Modifier la zone : {zone.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingZone(null)}
                      className="p-1 text-[#75685F] hover:text-[#1F100A]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#75685F] block">
                        Nom du quartier / zone :
                      </label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FBF7EF] border border-[#E0D5C7] rounded-xl text-xs text-[#1F100A] focus:outline-none focus:border-[#40200F]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#75685F] block">
                        Frais de livraison (Ariary) :
                      </label>
                      <input
                        type="number"
                        required
                        step="500"
                        min="0"
                        value={editFee}
                        onChange={(e) => setEditFee(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#FBF7EF] border border-[#E0D5C7] rounded-xl text-xs font-mono font-bold text-[#1F100A] focus:outline-none focus:border-[#40200F]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#75685F] block">
                        Délai estimé :
                      </label>
                      <input
                        type="text"
                        required
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        placeholder="ex : 45-60 min"
                        className="w-full px-3 py-2 bg-[#FBF7EF] border border-[#E0D5C7] rounded-xl text-xs text-[#1F100A] focus:outline-none focus:border-[#40200F]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1F100A]">
                      <input
                        type="checkbox"
                        checked={editActive}
                        onChange={(e) => setEditActive(e.target.checked)}
                        className="rounded text-[#1F100A] focus:ring-0"
                      />
                      <span>Zone active pour les commandes de caisse</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingZone(null)}
                        className="px-3.5 py-1.5 rounded-full text-xs text-[#75685F] hover:text-[#1F100A]"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-full bg-[#1F100A] text-white text-xs font-semibold hover:bg-[#40200F] transition"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                </form>
              );
            }

            return (
              <div
                key={zone.id}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-[#EAE1D6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-[#D9CCBE]"
              >
                {/* Zone Info */}
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-serif font-bold text-base text-[#1F100A] truncate">
                      {zone.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        zone.active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {zone.active ? 'Active' : 'Désactivée'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#75685F]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#8C572F]" />
                      <span>Délai moyen : {zone.estimatedTime}</span>
                    </span>
                  </div>
                </div>

                {/* Right: Fee in Ariary + Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F5EFE7]">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-[#A69486] block tracking-wide">
                      FRAIS DE LIVRAISON
                    </span>
                    <span className="font-mono font-bold text-lg text-[#1F100A]">
                      {formatAriary(zone.fee)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Toggle Active Button */}
                    <button
                      onClick={() => onToggleActive(zone.id)}
                      title={zone.active ? 'Désactiver la zone' : 'Activer la zone'}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                        zone.active
                          ? 'bg-[#FBF7EF] text-[#75685F] hover:bg-[#F3ECE0]'
                          : 'bg-[#1F100A] text-white hover:bg-[#40200F]'
                      }`}
                    >
                      {zone.active ? 'Désactiver' : 'Activer'}
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleStartEdit(zone)}
                      title="Modifier la zone"
                      className="p-2 rounded-full text-[#75685F] hover:text-[#1F100A] hover:bg-[#FBF7EF] transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    {deleteConfirmId === zone.id ? (
                      <div className="flex items-center gap-1 bg-red-50 p-1 rounded-full border border-red-200">
                        <button
                          onClick={() => onDeleteZone(zone.id)}
                          title="Confirmer la suppression"
                          className="px-2 py-0.5 text-[10px] font-bold text-red-700 hover:underline"
                        >
                          Supprimer
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="p-0.5 text-stone-500 hover:text-stone-800"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(zone.id)}
                        title="Supprimer la zone"
                        className="p-2 rounded-full text-[#A69486] hover:text-[#C94A4A] hover:bg-[#FBF7EF] transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {zones.length === 0 && (
            <div className="text-center py-16 text-[#75685F] space-y-3">
              <Truck className="w-10 h-10 mx-auto text-[#D4C5B5] stroke-[1.4]" />
              <p className="font-serif text-base text-[#1F100A]">Aucune zone de livraison configurée.</p>
              <p className="text-xs">Créez votre première zone pour activer la livraison sur la caisse.</p>
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 rounded-full bg-[#1F100A] text-white text-xs font-semibold"
              >
                Créer une zone
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL: AJOUT NOUVELLE ZONE */}
      {/* ============================================================ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#EAE1D6] space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#F0E6DB] pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#8C572F] font-semibold">
                  Logistique Madagascar
                </span>
                <h3 className="font-serif font-bold text-lg text-[#1F100A]">
                  Nouvelle Zone de Livraison
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-[#75685F] hover:text-[#1F100A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewZone} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1F100A] block">
                  Nom du quartier ou secteur :
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex : Ambatobe, Ilafy, Ivato..."
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FBF7EF] border border-[#E0D5C7] rounded-xl text-xs sm:text-sm text-[#1F100A] focus:outline-none focus:border-[#40200F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1F100A] block">
                    Frais en Ariary (MGA) :
                  </label>
                  <input
                    type="number"
                    required
                    step="500"
                    min="0"
                    value={newZoneFee}
                    onChange={(e) => setNewZoneFee(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#FBF7EF] border border-[#E0D5C7] rounded-xl text-xs sm:text-sm font-mono font-bold text-[#1F100A] focus:outline-none focus:border-[#40200F]"
                  />
                  <span className="text-[10px] text-[#75685F]">
                    {formatAriary(newZoneFee)}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1F100A] block">
                    Délai d'acheminement :
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex : 30-45 min"
                    value={newZoneTime}
                    onChange={(e) => setNewZoneTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FBF7EF] border border-[#E0D5C7] rounded-xl text-xs sm:text-sm text-[#1F100A] focus:outline-none focus:border-[#40200F]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1F100A]">
                  <input
                    type="checkbox"
                    checked={newZoneActive}
                    onChange={(e) => setNewZoneActive(e.target.checked)}
                    className="rounded text-[#1F100A] focus:ring-0"
                  />
                  <span>Activer immédiatement cette zone</span>
                </label>
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
                  className="px-5 py-2 rounded-full bg-[#1F100A] text-white text-xs font-semibold shadow-xs hover:bg-[#40200F] transition"
                >
                  Créer la zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
