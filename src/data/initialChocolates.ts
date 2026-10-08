import { Product, Customer, DeliveryZone } from '../types/pos';

export interface CategoryDefinition {
  id: string;
  label: string;
  description?: string;
}

export const INITIAL_CATEGORIES: CategoryDefinition[] = [
  { id: 'chocolats', label: 'Chocolats', description: 'Assortiments et créations pures de la chocolaterie' },
  { id: 'coffrets', label: 'Coffrets', description: 'Écrins de prestige et boîtes cadeaux' },
  { id: 'tablettes', label: 'Tablettes', description: 'Grands crus pure plantation de Madagascar' },
  { id: 'pralines', label: 'Pralinés', description: 'Pralinés croustillants et ganaches au détail' },
  { id: 'truffes', label: 'Truffes', description: 'Truffes roulées main et gourmandises poudrées' },
  { id: 'confiseries', label: 'Confiseries', description: 'Boissons chaudes, écorces confites et douceurs' },
  { id: 'cadeaux', label: 'Cadeaux', description: 'Compositions de fête et attentions gourmandes' },
  { id: 'promotions', label: 'Promotions', description: 'Offres spéciales de saison' },
];

export const INITIAL_PRODUCTS: Product[] = [
  // COFFRETS & BALLOTTINS DE PRESTIGE
  {
    id: 'choc-1',
    name: 'Écrin Prestige Grand Cru Sambirano 24 Pièces',
    category: 'coffrets',
    price: 85000,
    unitType: 'box',
    stockQuantity: 18,
    minStockThreshold: 5,
    cacaoPercentage: 74,
    origin: 'Vallée du Sambirano, Madagascar',
    tastingNotes: 'Ganaches pures origines, pralinés croquants aux noix de cajou de Majunga et touches de feuille d\'or.',
    image: '/src/assets/images/choc_assortiment_luxe_1791440776603.jpg',
    sku: 'BOX-PRESTIGE-24',
    isCustomizableBox: true,
    boxCapacity: 24,
    allergens: ['Fruits à coque', 'Lait'],
    temperatureGuide: '16°C - 18°C à l\'abri de l\'humidité'
  },
  {
    id: 'choc-2',
    name: 'Coffret Découverte Ambanja 12 Pièces',
    category: 'coffrets',
    price: 48000,
    unitType: 'box',
    stockQuantity: 24,
    minStockThreshold: 8,
    cacaoPercentage: 68,
    origin: 'Madagascar - Haut Sambirano',
    tastingNotes: 'Assortiment raffiné de ganaches acidulées fruits rouges et pralinés feuilletés au miel sauvage.',
    image: '/src/assets/images/choc_coffret_prestige_1791353441608.jpg',
    sku: 'BOX-DECOUV-12',
    isCustomizableBox: true,
    boxCapacity: 12,
    allergens: ['Fruits à coque', 'Lait'],
    temperatureGuide: '16°C - 18°C'
  },
  {
    id: 'choc-3',
    name: 'Ballotin Sur-Mesure Plantation 350g',
    category: 'coffrets',
    price: 65000,
    unitType: 'box',
    stockQuantity: 14,
    minStockThreshold: 4,
    cacaoPercentage: 70,
    origin: 'Assemblage Fèves Malagasy',
    tastingNotes: 'Composition personnalisée au choix de la clientèle parmi les créations du présentoir.',
    image: '/src/assets/images/choc_assortiment_luxe_1791440776603.jpg',
    sku: 'BAL-SURMESURE-350',
    isCustomizableBox: true,
    boxCapacity: 18,
    allergens: ['Fruits à coque', 'Lait'],
    temperatureGuide: '16°C - 18°C'
  },

  // TABLETTES PUR TERROIR DE MADAGASCAR
  {
    id: 'choc-4',
    name: 'Tablette Noir 72% Sambirano Millésimé',
    category: 'tablettes',
    price: 18000,
    unitType: 'piece',
    stockQuantity: 32,
    minStockThreshold: 10,
    cacaoPercentage: 72,
    origin: 'Vallée du Sambirano, Ambanja',
    tastingNotes: 'Notes vives de groseille, cerise griotte et subtile finale boisée de vanillier.',
    image: '/src/assets/images/choc_tablettes_artisan_1791440787716.jpg',
    sku: 'TAB-SAMBIRANO-72',
    allergens: ['Traces éventuelles de fruits à coque'],
    temperatureGuide: '16°C - 20°C'
  },
  {
    id: 'choc-5',
    name: 'Tablette Noir 85% Ambanja Cacao Sauvage',
    category: 'tablettes',
    price: 20000,
    unitType: 'piece',
    stockQuantity: 12,
    minStockThreshold: 8,
    cacaoPercentage: 85,
    origin: 'Madagascar - Plantation Historique',
    tastingNotes: 'Cacao d\'une intensité remarquable, arômes d\'agrumes séchés, amertume franche et soyeuse.',
    image: '/src/assets/images/choc_tablette_origine_1791353456852.jpg',
    sku: 'TAB-AMBANJA-85',
    allergens: ['Sans allergènes majeurs'],
    temperatureGuide: '16°C - 20°C'
  },
  {
    id: 'choc-6',
    name: 'Tablette Lait 45% Cajou & Sel Marin d\'Ifaty',
    category: 'tablettes',
    price: 16500,
    unitType: 'piece',
    stockQuantity: 28,
    minStockThreshold: 6,
    cacaoPercentage: 45,
    origin: 'Sambirano & Marais Salants d\'Ifaty',
    tastingNotes: 'Praliné doux de noix de cajou torréfiées, éclat de fleur de sel récoltée dans le Sud.',
    image: '/src/assets/images/choc_tablettes_artisan_1791440787716.jpg',
    sku: 'TAB-CAJOU-IFATY-45',
    allergens: ['Lait', 'Fruits à coque'],
    temperatureGuide: '16°C - 19°C'
  },
  {
    id: 'choc-7',
    name: 'Tablette Blanc Velours & Vanille Bourbon Sambava',
    category: 'tablettes',
    price: 17000,
    unitType: 'piece',
    stockQuantity: 19,
    minStockThreshold: 5,
    cacaoPercentage: 34,
    origin: 'Beurre de Cacao pressé & Sambava',
    tastingNotes: 'Infusion de gousses de vanille Bourbon affinées 9 mois, douceur lactée veloutée.',
    image: '/src/assets/images/choc_tablette_origine_1791353456852.jpg',
    sku: 'TAB-BLANC-VANILLE-BOURBON',
    allergens: ['Lait'],
    temperatureGuide: '16°C - 18°C'
  },
  {
    id: 'choc-17',
    name: 'Tablette Noir 70% Poivre Sauvage Voatsiperifery',
    category: 'tablettes',
    price: 19000,
    unitType: 'piece',
    stockQuantity: 25,
    minStockThreshold: 7,
    cacaoPercentage: 70,
    origin: 'Forêts humides de l\'Est malgache',
    tastingNotes: 'Notes résineuses et florales du poivre rare cueilli à la cime des grands arbres.',
    image: '/src/assets/images/choc_tablettes_artisan_1791440787716.jpg',
    sku: 'TAB-VOATSIPERIFERY-70',
    allergens: ['Traces de fruits à coque'],
    temperatureGuide: '16°C - 20°C'
  },

  // BONBONS & PRALINÉS
  {
    id: 'choc-8',
    name: 'Palet d\'Or Ganache Noire Sambirano 70%',
    category: 'pralines',
    price: 3500,
    unitType: 'piece',
    stockQuantity: 65,
    minStockThreshold: 20,
    cacaoPercentage: 70,
    origin: 'Cacao Grand Cru Sambirano',
    tastingNotes: 'Ganache fondante d\'une grande finesse, paillette d\'or pur 24 carats.',
    image: '/src/assets/images/choc_rochers_pralines_1791440798294.jpg',
    sku: 'BON-PALET-OR-MADA',
    allergens: ['Lait'],
    temperatureGuide: '15°C - 17°C'
  },
  {
    id: 'choc-9',
    name: 'Praliné Croquant Noisettes & Cajou de Majunga',
    category: 'pralines',
    price: 3500,
    unitType: 'piece',
    stockQuantity: 18,
    minStockThreshold: 15,
    cacaoPercentage: 60,
    origin: 'Majunga & Piémont',
    tastingNotes: 'Noix de cajou de Boeny caramélisées, pointe de fleur de sel.',
    image: '/src/assets/images/choc_pralines_detail_1791353475578.jpg',
    sku: 'BON-PRAL-CAJOU-MAJUNGA',
    allergens: ['Fruits à coque', 'Lait'],
    temperatureGuide: '15°C - 17°C'
  },
  {
    id: 'choc-10',
    name: 'Ganache Velours Framboise & Zeste de Combava',
    category: 'pralines',
    price: 3800,
    unitType: 'piece',
    stockQuantity: 42,
    minStockThreshold: 15,
    cacaoPercentage: 66,
    origin: 'Ambanja & Vergers de Mananjary',
    tastingNotes: 'Acidité vivifiante de la pulpe de framboise et parfum exotique du combava.',
    image: '/src/assets/images/choc_rochers_pralines_1791440798294.jpg',
    sku: 'BON-GAN-COMBAVA',
    allergens: ['Lait'],
    temperatureGuide: '15°C - 17°C'
  },
  {
    id: 'choc-11',
    name: 'Praliné Noir Sésame Grillé & Miel d\'Eucalyptus',
    category: 'pralines',
    price: 3800,
    unitType: 'piece',
    stockQuantity: 38,
    minStockThreshold: 12,
    cacaoPercentage: 68,
    origin: 'Hautes Terres centrales',
    tastingNotes: 'Contraste du sésame noir torréfié et du miel d\'eucalyptus des hauts plateaux.',
    image: '/src/assets/images/choc_pralines_detail_1791353475578.jpg',
    sku: 'BON-SESAME-EUCALYPTUS',
    allergens: ['Sésame', 'Lait'],
    temperatureGuide: '15°C - 17°C'
  },

  // TRUFFES & GOURMANDISES AU POIDS (100g)
  {
    id: 'choc-12',
    name: 'Truffes Pures Cacao Amer Sambirano (100g)',
    category: 'truffes',
    price: 24000,
    unitType: 'weight_100g',
    stockQuantity: 45,
    minStockThreshold: 10,
    cacaoPercentage: 75,
    origin: 'Féverole de Sambirano',
    tastingNotes: 'Ganache onctueuse roulée à la main dans une poudre de cacao pur sans sucres ajoutés.',
    image: '/src/assets/images/choc_truffes_cacao_1791440812616.jpg',
    sku: 'TRUF-SAMBIRANO-100G',
    allergens: ['Lait'],
    temperatureGuide: '14°C - 16°C'
  },
  {
    id: 'choc-13',
    name: 'Rochers Cajou & Feuillantine (100g)',
    category: 'truffes',
    price: 22000,
    unitType: 'weight_100g',
    stockQuantity: 22,
    minStockThreshold: 8,
    cacaoPercentage: 64,
    origin: 'Noix de cajou de Madagascar',
    tastingNotes: 'Éclats de cajou grillées, enrobage chocolat noir et croustillant crêpe dentelle.',
    image: '/src/assets/images/choc_truffes_artisan_1791353465828.jpg',
    sku: 'ROCH-CAJOU-100G',
    allergens: ['Gluten', 'Fruits à coque', 'Lait'],
    temperatureGuide: '16°C - 18°C'
  },
  {
    id: 'choc-14',
    name: 'Écorces d\'Oranges Confites & Combava (100g)',
    category: 'confiseries',
    price: 23000,
    unitType: 'weight_100g',
    stockQuantity: 15,
    minStockThreshold: 6,
    cacaoPercentage: 70,
    origin: 'Agrumes de l\'Océan Indien',
    tastingNotes: 'Écorces confites lentement pendant 8 jours, enrobées de chocolat noir craquant.',
    image: '/src/assets/images/choc_truffes_cacao_1791440812616.jpg',
    sku: 'ORANG-COMBAVA-100G',
    allergens: ['Traces éventuelles'],
    temperatureGuide: '16°C - 20°C'
  },

  // CHOCOLATS & CONFISERIES
  {
    id: 'choc-15',
    name: 'Chocolat Chaud Onctueux Grand Cru (Tasse)',
    category: 'confiseries',
    price: 12000,
    unitType: 'piece',
    stockQuantity: 80,
    minStockThreshold: 20,
    cacaoPercentage: 70,
    origin: 'Chocolat fondu au lait entier fermier',
    tastingNotes: 'Texture veloutée, cannelle fraîche et vanille Bourbon de Sambava.',
    image: '/src/assets/images/choc_pralines_detail_1791353475578.jpg',
    sku: 'BOIS-CHOC-CHAUD-MADA',
    allergens: ['Lait'],
    temperatureGuide: 'Servi chaud à 68°C'
  },
  {
    id: 'choc-16',
    name: 'Moelleux Fondant Cœur Coulant Sambirano',
    category: 'confiseries',
    price: 10000,
    unitType: 'piece',
    stockQuantity: 9,
    minStockThreshold: 5,
    cacaoPercentage: 68,
    origin: 'Chocolat noir de plantation',
    tastingNotes: 'Pâtisserie fine préparée chaque matin au laboratoire.',
    image: '/src/assets/images/choc_coffret_prestige_1791353441608.jpg',
    sku: 'PAT-MOELLEUX-SAMBIRANO',
    allergens: ['Gluten', 'Œufs', 'Lait'],
    temperatureGuide: 'Consommer le jour même'
  },
  {
    id: 'choc-18',
    name: 'Coffret Cadeau Fête & Ruban Doré',
    category: 'cadeaux',
    price: 95000,
    unitType: 'box',
    stockQuantity: 10,
    minStockThreshold: 3,
    cacaoPercentage: 72,
    origin: 'Madagascar Prestige',
    tastingNotes: 'Sélection d\'exception présentée avec ruban satiné doré et carte calligraphiée.',
    image: '/src/assets/images/choc_assortiment_luxe_1791440776603.jpg',
    sku: 'CAD-FETE-RUBAN',
    allergens: ['Fruits à coque', 'Lait'],
    temperatureGuide: '16°C - 18°C'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Bako Rasoamanana',
    phone: '+261 34 12 345 67',
    email: 'bako.rasoamanana@moov.mg',
    address: 'Villa 14, Ivandry, Antananarivo',
    loyaltyPoints: 420,
    totalSpent: 480000,
    favoriteOrigin: 'Sambirano 85%'
  },
  {
    id: 'cust-2',
    name: 'Andry Rakotomalala',
    phone: '+261 32 98 765 43',
    email: 'andry.rakoto@cabinet.mg',
    address: 'Immeuble Aro, Ampefiloha, Antananarivo',
    loyaltyPoints: 160,
    totalSpent: 195000,
    favoriteOrigin: 'Pralinés Cajou Majunga'
  },
  {
    id: 'cust-3',
    name: 'Mialy Randrianasolo',
    phone: '+261 33 45 218 90',
    email: 'mialy.randria@atelier.mg',
    address: 'Lot IVB, Analakely, Antananarivo',
    loyaltyPoints: 85,
    totalSpent: 98000,
    favoriteOrigin: 'Tablette Sambirano 72%'
  }
];

export const INITIAL_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'zone-1',
    name: 'Antananarivo Centre',
    fee: 5000,
    estimatedTime: '30-45 min',
    active: true
  },
  {
    id: 'zone-2',
    name: 'Analakely & Isoraka',
    fee: 5000,
    estimatedTime: '30-40 min',
    active: true
  },
  {
    id: 'zone-3',
    name: 'Ivandry & Alarobia',
    fee: 8000,
    estimatedTime: '45-60 min',
    active: true
  },
  {
    id: 'zone-4',
    name: 'Ankorondrano & Ambodivona',
    fee: 8000,
    estimatedTime: '45-60 min',
    active: true
  },
  {
    id: 'zone-5',
    name: 'Andraharo & Ambohimanarina',
    fee: 8000,
    estimatedTime: '1h-1h15',
    active: true
  },
  {
    id: 'zone-6',
    name: 'Tanjombato & Ankadimbahoaka',
    fee: 10000,
    estimatedTime: '1h15-1h30',
    active: true
  },
  {
    id: 'zone-7',
    name: 'Ilafy & Ambatobe',
    fee: 10000,
    estimatedTime: '1h15-1h30',
    active: true
  }
];

export const DEFAULT_WHATSAPP_TEMPLATE = `Bonjour {client},

Votre commande {commande} chez Gourmandise Chocolat est confirmée.

Total : {total}
Mode : {livraison}

Merci pour votre confiance et à très bientôt pour savourer nos créations chocolatées de Madagascar !`;
