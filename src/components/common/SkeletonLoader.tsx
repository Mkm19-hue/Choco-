import React from 'react';

/**
 * Composant de base Skeleton en ivoire/crème avec animation douce de scintillement
 */
export const SkeletonBone: React.FC<{
  className?: string;
  darker?: boolean;
}> = ({ className = '', darker = false }) => {
  return (
    <div
      className={`rounded-md ${
        darker ? 'skeleton-ivory-darker' : 'skeleton-ivory'
      } ${className}`}
      aria-hidden="true"
    />
  );
};

/**
 * Skeleton pour carte produit de la boutique
 */
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div
      className="group rounded-3xl bg-white border border-[#EFE7DE] p-3 sm:p-4 flex flex-col justify-between shadow-xs select-none"
      aria-hidden="true"
    >
      <div>
        {/* Conteneur image ivoire avec reflet crème */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 skeleton-ivory border border-[#F0E8DC] flex items-center justify-center">
          {/* Badge discret cacao factice */}
          <div className="absolute bottom-2 left-2 w-16 h-4 rounded-full skeleton-ivory-darker opacity-80" />
        </div>

        {/* Lignes de texte (Nom du produit et Terroir d'origine) */}
        <div className="space-y-1.5 mb-3">
          <SkeletonBone className="h-4 w-4/5 rounded-md" />
          <SkeletonBone className="h-3 w-1/2 rounded-md opacity-75" />
        </div>
      </div>

      {/* Ligne inférieure : Prix & Bouton d'ajout */}
      <div className="flex items-center justify-between pt-2 border-t border-[#F5EFE7]">
        <SkeletonBone className="h-5 w-20 rounded-md" />
        <SkeletonBone className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0" />
      </div>
    </div>
  );
};

/**
 * Grille de skeletons pour le catalogue produits
 */
export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 animate-fade-in-subtle">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
};

/**
 * Skeleton pour une ligne de commande dans l'historique
 */
export const OrderCardSkeleton: React.FC = () => {
  return (
    <div
      className="p-4 sm:p-5 rounded-3xl bg-white border border-[#EAE1D6] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
      aria-hidden="true"
    >
      {/* Bloc gauche : Référence, date, mode de livraison, statut & client */}
      <div className="space-y-2.5 min-w-0 flex-1">
        {/* Row 1 : Badges et métadonnées */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <SkeletonBone className="h-4 w-28 rounded-md" />
          <span className="w-1 h-1 rounded-full bg-[#E5DACF]" />
          <SkeletonBone className="h-3.5 w-24 rounded-md opacity-70" />
          <SkeletonBone className="h-5 w-32 sm:w-36 rounded-full" />
          <SkeletonBone className="h-5 w-16 rounded-full opacity-80" />
        </div>

        {/* Row 2 : Nom du client & Contact */}
        <div className="flex items-center gap-2">
          <SkeletonBone className="h-3.5 w-36 rounded-md" />
          <SkeletonBone className="h-3 w-24 rounded-md opacity-70" />
          <SkeletonBone className="h-3 w-40 rounded-md opacity-50 hidden sm:block" />
        </div>

        {/* Row 3 : Résumé des articles */}
        <SkeletonBone className="h-3 w-56 sm:w-80 rounded-md opacity-70" />
      </div>

      {/* Bloc droit : Total et bouton d'action */}
      <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#F5EFE7]">
        <div className="space-y-1 text-left md:text-right">
          <SkeletonBone className="h-2.5 w-20 rounded-md md:ml-auto opacity-60" />
          <SkeletonBone className="h-6 w-24 rounded-md md:ml-auto" />
          <SkeletonBone className="h-2.5 w-14 rounded-md md:ml-auto opacity-60" />
        </div>
        <SkeletonBone className="h-8 w-20 rounded-full shrink-0" />
      </div>
    </div>
  );
};

/**
 * Liste de skeletons pour l'historique des commandes
 */
export const OrderListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-3 animate-fade-in-subtle">
      {Array.from({ length: count }).map((_, idx) => (
        <OrderCardSkeleton key={idx} />
      ))}
    </div>
  );
};
