export type ProductCategory = 
  | 'chocolats'
  | 'coffrets' 
  | 'tablettes' 
  | 'pralines' 
  | 'truffes' 
  | 'confiseries' 
  | 'cadeaux' 
  | 'promotions'
  | string;

export type UnitType = 'piece' | 'weight_100g' | 'box';

export type DesignTheme = 'prestige_gold' | 'artisan_clay' | 'velvet_rose';

export type DevicePreviewMode = 'responsive' | 'mobile' | 'tablet' | 'desktop';

export type UserRole = 'admin' | 'employee';

export type OrderType = 'pickup' | 'delivery';

export type PaymentStatus = 'pending' | 'confirmed' | 'failed';

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number; // en Ariary
  estimatedTime: string;
  active: boolean;
}

export interface FlavorProfile {
  fruity: number; // 0-100
  woody: number; // 0-100
  floral: number; // 0-100
  spicy: number; // 0-100
  praline: number; // 0-100
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  cacaoPercentage?: number;
  origin?: string;
  tastingNotes?: string;
  price: number; // en Ariary (Ar)
  unitType: UnitType;
  stockQuantity: number; // en unités ou en portions de 100g
  minStockThreshold: number;
  image: string;
  sku: string;
  isCustomizableBox?: boolean;
  boxCapacity?: number;
  allergens?: string[];
  temperatureGuide?: string;
  flavorProfile?: FlavorProfile;
}

export interface CustomBoxItem {
  productId: string;
  productName: string;
  quantity: number;
  cacaoPercentage?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  weightGrams?: number;
  giftWrapping?: boolean;
  isothermalBag?: boolean;
  customBoxSelection?: CustomBoxItem[];
  ribbonColor?: 'gold' | 'cacao' | 'ruby' | 'none';
  customGiftNote?: string;
  itemPrice: number; // calculé selon la quantité ou le poids
}

export type PaymentMethod = 'mvola' | 'orange_money' | 'airtel_money' | 'cash' | 'card' | 'gift_card';

export const formatAriary = (amount: number): string => {
  return Math.round(amount).toLocaleString('fr-FR').replace(/\s/g, ' ') + ' Ar';
};

export interface SaleTransaction {
  id: string;
  receiptNumber: string;
  timestamp: string;
  items: CartItem[];
  subtotal: number;
  deliveryZone?: DeliveryZone;
  deliveryFee: number;
  taxRate: number; // 20% TVA légale à Madagascar
  taxAmount: number;
  discountAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  mobileMoneyRef?: string;
  paymentProofNote?: string;
  orderType: OrderType;
  deliveryAddress?: string;
  amountReceived?: number;
  changeGiven?: number;
  customerName?: string;
  customerPhone?: string;
  loyaltyPointsEarned?: number;
  cashierName: string;
  notes?: string;
}

export interface StockMovement {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  type: 'sale' | 'restock' | 'adjustment' | 'tasting_loss';
  delta: number;
  previousStock: number;
  newStock: number;
  note?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  loyaltyPoints: number;
  totalSpent: number; // en Ariary
  favoriteOrigin?: string;
  allergies?: string[];
  notes?: string;
}
