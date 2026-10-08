import React, { useState } from 'react';
import { Settings, MessageSquare, Check, Sparkles, Building2, Shield, Info } from 'lucide-react';
import { DEFAULT_WHATSAPP_TEMPLATE } from '../../data/initialChocolates';

interface SettingsViewProps {
  whatsappTemplate: string;
  onSaveWhatsappTemplate: (template: string) => void;
  cashierName: string;
  onChangeCashierName: (name: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  whatsappTemplate,
  onSaveWhatsappTemplate,
  cashierName,
  onChangeCashierName,
}) => {
  const [template, setTemplate] = useState(whatsappTemplate);
  const [name, setName] = useState(cashierName);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveWhatsappTemplate(template);
    onChangeCashierName(name);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FBF7EF] text-[#241811] p-4 sm:p-6 lg:p-8 pb-28 lg:pb-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="border-b border-[#EFE7DE] pb-4">
          <span className="text-xs uppercase tracking-widest text-[#8C572F] font-semibold">
            Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F100A] tracking-tight mt-1">
            Paramètres de la Boutique
          </h1>
          <p className="text-xs sm:text-sm text-[#75685F] mt-0.5">
            Personnalisation de l'identité, des messages WhatsApp et des règles commerciales.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Identity & Legal Info */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EAE1D6] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#F0E6DB] pb-3">
              <Building2 className="w-4 h-4 text-[#8C572F]" />
              <h2 className="font-serif font-bold text-base text-[#1F100A]">
                Identité & Localisation
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#75685F] block">
                  Nom de l'établissement :
                </label>
                <input
                  type="text"
                  disabled
                  value="Gourmandise Chocolat"
                  className="w-full px-3.5 py-2.5 bg-[#FBF7EF] border border-[#E8DFD3] rounded-xl text-xs sm:text-sm text-[#1F100A] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#75685F] block">
                  Pays & Devise :
                </label>
                <input
                  type="text"
                  disabled
                  value="Madagascar 🇲🇬 · Ariary (MGA)"
                  className="w-full px-3.5 py-2.5 bg-[#FBF7EF] border border-[#E8DFD3] rounded-xl text-xs sm:text-sm text-[#1F100A] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#75685F] block">
                  Responsable / Caissier :
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex : Mathieu"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E0D5C7] rounded-xl text-xs sm:text-sm text-[#1F100A] focus:outline-none focus:border-[#40200F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#75685F] block">
                  Régime fiscal malgache :
                </label>
                <input
                  type="text"
                  disabled
                  value="TVA légale 20% incluse dans les prix"
                  className="w-full px-3.5 py-2.5 bg-[#FBF7EF] border border-[#E8DFD3] rounded-xl text-xs sm:text-sm text-[#1F100A]"
                />
              </div>
            </div>
          </div>

          {/* WhatsApp Template Customizer */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EAE1D6] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0E6DB] pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#2F8F61]" />
                <h2 className="font-serif font-bold text-base text-[#1F100A]">
                  Modèle de Message WhatsApp Client
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setTemplate(DEFAULT_WHATSAPP_TEMPLATE)}
                className="text-xs text-[#8C572F] hover:underline"
              >
                Rétablir modèle par défaut
              </button>
            </div>

            <p className="text-xs text-[#75685F]">
              Variables dynamiques disponibles qui seront automatiquement remplacées par la caisse :<br />
              <code className="text-[#8C572F] font-bold">{'{client}'}</code>,{' '}
              <code className="text-[#8C572F] font-bold">{'{commande}'}</code>,{' '}
              <code className="text-[#8C572F] font-bold">{'{total}'}</code>,{' '}
              <code className="text-[#8C572F] font-bold">{'{livraison}'}</code>.
            </p>

            <textarea
              rows={7}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full p-3.5 bg-[#FBF7EF] border border-[#E0D5C7] rounded-2xl text-xs sm:text-sm text-[#1F100A] font-sans focus:outline-none focus:border-[#40200F]"
            />
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {savedSuccess && (
              <span className="text-xs font-semibold text-[#2F8F61] flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>Paramètres enregistrés avec succès !</span>
              </span>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#1F100A] text-white text-xs font-semibold shadow-xs hover:bg-[#40200F] transition active:scale-95"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
