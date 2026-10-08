import React, { useState } from 'react';
import { SaleTransaction, formatAriary } from '../../types/pos';
import { Printer, MessageCircle, X, Check, Share2, ArrowRight } from 'lucide-react';

interface ReceiptModalProps {
  transaction: SaleTransaction;
  onClose: () => void;
  whatsappTemplate?: string;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  onClose,
  whatsappTemplate,
}) => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  // Generate WhatsApp message
  const generateWhatsAppMessage = () => {
    const client = transaction.customerName || 'Client';
    const commande = transaction.receiptNumber;
    const total = formatAriary(transaction.total);
    const zone = transaction.deliveryZone ? transaction.deliveryZone.name : 'Retrait en boutique';
    const livraison = transaction.deliveryFee > 0 ? formatAriary(transaction.deliveryFee) : 'Gratuit';
    const adresse = transaction.deliveryAddress || 'En boutique';
    const date = new Date(transaction.timestamp).toLocaleDateString('fr-FR');

    let template = whatsappTemplate || `Bonjour {client},

Votre commande {commande} chez Gourmandise Chocolat est confirmée.

Total : {total}
Livraison : {zone} ({livraison})

Merci pour votre confiance et à très bientôt pour savourer nos créations !`;

    return template
      .replace(/{client}/g, client)
      .replace(/{commande}/g, commande)
      .replace(/{total}/g, total)
      .replace(/{zone}/g, zone)
      .replace(/{livraison}/g, livraison)
      .replace(/{adresse}/g, adresse)
      .replace(/{date}/g, date);
  };

  const handleOpenWhatsApp = () => {
    const rawPhone = transaction.customerPhone || '';
    // Clean phone number for WhatsApp wa.me
    const cleanedDigits = rawPhone.replace(/[^\d]/g, '');
    let finalPhone = cleanedDigits;
    if (finalPhone.startsWith('0')) {
      finalPhone = '261' + finalPhone.substring(1);
    } else if (!finalPhone.startsWith('261') && finalPhone.length === 9) {
      finalPhone = '261' + finalPhone;
    }

    const message = generateWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const url = finalPhone
      ? `https://wa.me/${finalPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyMessage = () => {
    const message = generateWhatsAppMessage();
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col text-[#1F100A] border border-[#EAE1D6]">
        {/* Top Header Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0E6DB] bg-[#FBF7EF]">
          <span className="text-xs uppercase tracking-widest text-[#8C572F] font-semibold">
            Reçu Gourmandise Chocolat
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-[#75685F] hover:text-[#1F100A] rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[70vh] bg-white space-y-5" id="thermal-receipt-print-area">
          {/* Brand Header */}
          <div className="text-center pb-4 border-b border-[#F0E6DB] space-y-1">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-[#1F100A]">
              Gourmandise Chocolat
            </h2>
            <p className="text-xs uppercase tracking-widest text-[#8C572F] font-semibold">
              Haute Chocolaterie Artisanale
            </p>
            <p className="text-[11px] text-[#75685F]">
              Antananarivo · Madagascar 🇲🇬
            </p>
          </div>

          {/* Ticket metadata */}
          <div className="flex justify-between text-xs text-[#75685F] border-b border-[#F5EFE7] pb-3">
            <div>
              <span className="text-[#A69486] block text-[10px]">COMMANDE</span>
              <strong className="font-mono text-[#1F100A] text-sm">
                {transaction.receiptNumber}
              </strong>
            </div>
            <div className="text-right">
              <span className="text-[#A69486] block text-[10px]">DATE & HEURE</span>
              <div className="font-mono text-[#1F100A]">
                {new Date(transaction.timestamp).toLocaleDateString('fr-FR')} à{' '}
                {new Date(transaction.timestamp).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>

          {/* Client & Delivery Info */}
          {(transaction.customerName || transaction.deliveryAddress) && (
            <div className="p-3 rounded-2xl bg-[#FBF7EF] border border-[#EFE7DE] text-xs space-y-1">
              {transaction.customerName && (
                <div className="flex justify-between">
                  <span className="text-[#75685F]">Client :</span>
                  <span className="font-semibold text-[#1F100A]">
                    {transaction.customerName} {transaction.customerPhone ? `(${transaction.customerPhone})` : ''}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#75685F]">Mode :</span>
                <span className="font-semibold text-[#8C572F]">
                  {transaction.orderType === 'delivery' ? 'Livraison à domicile' : 'Retrait en boutique'}
                </span>
              </div>
              {transaction.deliveryZone && (
                <div className="flex justify-between">
                  <span className="text-[#75685F]">Zone :</span>
                  <span>{transaction.deliveryZone.name}</span>
                </div>
              )}
              {transaction.deliveryAddress && (
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#75685F]">Adresse :</span>
                  <span className="text-right max-w-[200px] truncate">{transaction.deliveryAddress}</span>
                </div>
              )}
            </div>
          )}

          {/* Items lines */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-[10px] font-semibold uppercase text-[#A69486] border-b border-[#F0E6DB] pb-1">
              <span>Article</span>
              <span className="text-right">Total Ar</span>
            </div>

            {transaction.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-baseline gap-2">
                <div>
                  <span className="font-medium text-[#1F100A]">{item.product.name}</span>
                  <div className="text-[11px] text-[#75685F]">
                    {item.quantity} × {formatAriary(item.product.price)}
                  </div>
                </div>
                <span className="font-mono font-semibold text-[#1F100A]">
                  {formatAriary(item.itemPrice)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals & Payments */}
          <div className="pt-3 border-t border-[#F0E6DB] space-y-1.5 text-xs text-[#75685F]">
            <div className="flex justify-between">
              <span>Sous-total :</span>
              <span className="font-mono text-[#1F100A]">{formatAriary(transaction.subtotal)}</span>
            </div>

            {transaction.discountAmount > 0 && (
              <div className="flex justify-between text-[#2F8F61]">
                <span>Remise :</span>
                <span className="font-mono">- {formatAriary(transaction.discountAmount)}</span>
              </div>
            )}

            {transaction.deliveryFee > 0 && (
              <div className="flex justify-between text-[#8C572F]">
                <span>Livraison :</span>
                <span className="font-mono">{formatAriary(transaction.deliveryFee)}</span>
              </div>
            )}

            <div className="flex justify-between items-baseline pt-2 border-t border-[#1F100A] text-[#1F100A] font-bold">
              <span className="font-serif text-base">TOTAL TTC</span>
              <span className="font-mono text-xl">{formatAriary(transaction.total)}</span>
            </div>

            <div className="pt-2 text-[11px] text-[#A69486] flex justify-between">
              <span>Mode de paiement :</span>
              <span className="font-semibold uppercase text-[#1F100A]">
                {transaction.paymentMethod === 'mvola'
                  ? 'MVola Mobile Money'
                  : transaction.paymentMethod === 'cash'
                  ? 'Espèces'
                  : transaction.paymentMethod === 'card'
                  ? 'Carte Bancaire'
                  : transaction.paymentMethod}
              </span>
            </div>
            {transaction.mobileMoneyRef && (
              <div className="text-[10px] text-[#75685F] text-right font-mono">
                Réf: {transaction.mobileMoneyRef}
              </div>
            )}
          </div>

          {/* Footer Thank You */}
          <div className="text-center pt-3 border-t border-dashed border-[#E0D5C7] text-xs text-[#75685F]">
            <p className="font-serif italic text-sm text-[#1F100A]">Merci pour votre gourmandise !</p>
            <p className="text-[10px] text-[#A69486] mt-0.5">Fait avec amour à Madagascar</p>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-[#FBF7EF] border-t border-[#F0E6DB] flex items-center justify-between gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 rounded-full bg-white border border-[#E8DFD3] text-xs font-semibold text-[#1F100A] hover:bg-[#F5EFE7] transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer</span>
          </button>

          <button
            onClick={handleOpenWhatsApp}
            className="flex-1 py-2.5 px-3 rounded-full bg-[#2F8F61] text-white text-xs font-semibold hover:bg-[#25734E] transition flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleCopyMessage}
            title="Copier le texte du message"
            className="p-2.5 rounded-full bg-white border border-[#E8DFD3] text-xs font-semibold text-[#75685F] hover:text-[#1F100A] shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-[#2F8F61]" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
