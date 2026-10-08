/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Product, CartItem, SaleTransaction, StockMovement, Customer, PaymentMethod, DeliveryZone, OrderType, UserRole, DevicePreviewMode, PaymentStatus } from './types/pos';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_DELIVERY_ZONES, DEFAULT_WHATSAPP_TEMPLATE } from './data/initialChocolates';
import { HeaderNav, AppView } from './components/HeaderNav';
import { POSView } from './components/POS/POSView';
import { CustomBoxStudio } from './components/POS/CustomBoxStudio';
import { CatalogAdminView } from './components/Catalog/CatalogAdminView';
import { OrdersView } from './components/Orders/OrdersView';
import { CustomersView } from './components/Customers/CustomersView';
import { DeliveryZonesView } from './components/Deliveries/DeliveryZonesView';
import { PaymentsView } from './components/Payments/PaymentsView';
import { EditorialDashboardView } from './components/Reports/EditorialDashboardView';
import { SettingsView } from './components/Settings/SettingsView';
import { ReceiptModal } from './components/POS/ReceiptModal';
import { Smartphone, Tablet } from 'lucide-react';

export default function App() {
  // Navigation & Role State
  const [activeView, setActiveView] = useState<AppView>('pos');
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [deviceMode, setDeviceMode] = useState<DevicePreviewMode>('responsive');
  const [cashierName, setCashierName] = useState<string>(() => {
    return localStorage.getItem('gourmandise_cashier_name') || 'Mathieu';
  });

  // Shared Cart & Selected Customer State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gourmandise_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Delivery Zones State (Dynamic for Madagascar)
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() => {
    const saved = localStorage.getItem('gourmandise_delivery_zones');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_DELIVERY_ZONES;
  });

  // WhatsApp Message Template State
  const [whatsappTemplate, setWhatsappTemplate] = useState<string>(() => {
    return localStorage.getItem('gourmandise_whatsapp_template') || DEFAULT_WHATSAPP_TEMPLATE;
  });

  // Products State with LocalStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('gourmandise_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].price < 500) {
          localStorage.removeItem('gourmandise_products');
        } else {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Customers State
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('gourmandise_customers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CUSTOMERS;
  });

  // Sales Transactions State
  const [transactions, setTransactions] = useState<SaleTransaction[]>(() => {
    const saved = localStorage.getItem('gourmandise_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'tx-seed-1',
        receiptNumber: 'CMD-2026-0041',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        items: [
          {
            id: 'item-seed-1',
            product: INITIAL_PRODUCTS[0],
            quantity: 1,
            itemPrice: 85000,
          },
          {
            id: 'item-seed-2',
            product: INITIAL_PRODUCTS[3],
            quantity: 2,
            itemPrice: 36000,
          },
        ],
        subtotal: 121000,
        deliveryFee: 5000,
        deliveryZone: INITIAL_DELIVERY_ZONES[0],
        orderType: 'delivery',
        deliveryAddress: 'Villa 14, Ivandry',
        taxRate: 20,
        taxAmount: 21000,
        discountAmount: 0,
        total: 126000,
        paymentMethod: 'mvola',
        paymentStatus: 'confirmed',
        mobileMoneyRef: 'MVOLA-882194',
        customerName: 'Bako Rasoamanana',
        customerPhone: '+261 34 12 345 67',
        loyaltyPointsEarned: 126,
        cashierName: 'Mathieu',
      },
      {
        id: 'tx-seed-2',
        receiptNumber: 'CMD-2026-0042',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        items: [
          {
            id: 'item-seed-3',
            product: INITIAL_PRODUCTS[11],
            quantity: 1,
            itemPrice: 24000,
          },
        ],
        subtotal: 24000,
        deliveryFee: 0,
        orderType: 'pickup',
        taxRate: 20,
        taxAmount: 4000,
        discountAmount: 0,
        total: 24000,
        paymentMethod: 'cash',
        paymentStatus: 'confirmed',
        amountReceived: 30000,
        changeGiven: 6000,
        cashierName: 'Mathieu',
      },
    ];
  });

  // Stock Movements State
  const [movements, setMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('gourmandise_movements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'mov-1',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        productId: INITIAL_PRODUCTS[0].id,
        productName: INITIAL_PRODUCTS[0].name,
        type: 'restock',
        delta: 10,
        previousStock: 8,
        newStock: 18,
        note: 'Arrivage atelier du matin',
      },
      {
        id: 'mov-2',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        productId: INITIAL_PRODUCTS[0].id,
        productName: INITIAL_PRODUCTS[0].name,
        type: 'sale',
        delta: -1,
        previousStock: 18,
        newStock: 17,
        note: 'Vente commande CMD-2026-0041',
      },
    ];
  });

  // Active Receipt Modal
  const [activeReceipt, setActiveReceipt] = useState<SaleTransaction | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('gourmandise_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gourmandise_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('gourmandise_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('gourmandise_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('gourmandise_movements', JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem('gourmandise_delivery_zones', JSON.stringify(deliveryZones));
  }, [deliveryZones]);

  useEffect(() => {
    localStorage.setItem('gourmandise_whatsapp_template', whatsappTemplate);
  }, [whatsappTemplate]);

  useEffect(() => {
    localStorage.setItem('gourmandise_cashier_name', cashierName);
  }, [cashierName]);

  // Handle Add Custom Box from Studio
  const handleAddCustomBoxToCart = (boxCartItem: CartItem) => {
    setCart((prev) => [boxCartItem, ...prev]);
    setIsCartDrawerOpen(true);
  };

  // Handle Complete Sale
  const handleCompleteSale = (
    items: CartItem[],
    total: number,
    subtotal: number,
    taxAmount: number,
    discountAmount: number,
    paymentMethod: PaymentMethod,
    deliveryZone?: DeliveryZone,
    deliveryFee?: number,
    orderType: OrderType = 'pickup',
    deliveryAddress?: string,
    mobileMoneyRef?: string,
    amountReceived?: number,
    changeGiven?: number,
    customer?: Customer | null
  ) => {
    const receiptNum = `CMD-${new Date().getFullYear()}-${String(transactions.length + 43).padStart(4, '0')}`;
    const timestamp = new Date().toISOString();
    const pointsEarned = Math.floor(total / 1000);

    const newTx: SaleTransaction = {
      id: `tx-${Date.now()}`,
      receiptNumber: receiptNum,
      timestamp,
      items,
      subtotal,
      deliveryZone,
      deliveryFee: deliveryFee || 0,
      taxRate: 20,
      taxAmount,
      discountAmount,
      total,
      paymentMethod,
      paymentStatus: 'confirmed',
      mobileMoneyRef,
      orderType,
      deliveryAddress,
      amountReceived,
      changeGiven,
      customerName: customer ? customer.name : undefined,
      customerPhone: customer ? customer.phone : undefined,
      loyaltyPointsEarned: customer ? pointsEarned : undefined,
      cashierName,
    };

    // Update stocks & movements
    const newMovements: StockMovement[] = [];
    const updatedProducts = [...products];

    items.forEach((item) => {
      const prod = updatedProducts.find((p) => p.id === item.product.id);
      if (prod) {
        const prev = prod.stockQuantity;
        prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
        newMovements.push({
          id: `mov-${Date.now()}-${Math.random()}`,
          timestamp,
          productId: prod.id,
          productName: prod.name,
          type: 'sale',
          delta: -item.quantity,
          previousStock: prev,
          newStock: prod.stockQuantity,
          note: `Vente ${receiptNum}`,
        });
      }
    });

    setProducts(updatedProducts);
    setMovements((prev) => [...newMovements, ...prev]);
    setTransactions((prev) => [newTx, ...prev]);

    // Update Customer loyalty points
    if (customer) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === customer.id
            ? {
                ...c,
                loyaltyPoints: c.loyaltyPoints + pointsEarned,
                totalSpent: Math.round((c.totalSpent + total) * 100) / 100,
                address: deliveryAddress || c.address,
              }
            : c
        )
      );
    }

    // Open receipt modal immediately
    setActiveReceipt(newTx);
  };

  // Stock update handler
  const handleUpdateStock = (
    productId: string,
    delta: number,
    type: 'restock' | 'adjustment' | 'tasting_loss',
    note?: string
  ) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const prev = prod.stockQuantity;
    const next = Math.max(0, prev + delta);

    setProducts((prevList) =>
      prevList.map((p) => (p.id === productId ? { ...p, stockQuantity: next } : p))
    );

    const newMov: StockMovement = {
      id: `mov-${Date.now()}`,
      timestamp: new Date().toISOString(),
      productId: prod.id,
      productName: prod.name,
      type,
      delta,
      previousStock: prev,
      newStock: next,
      note: note || (delta > 0 ? 'Réassort atelier' : 'Correction stock'),
    };

    setMovements((prev) => [newMov, ...prev]);
  };

  // Customers handler
  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
  };

  // Delivery Zones CRUD handlers
  const handleAddZone = (newZone: DeliveryZone) => {
    setDeliveryZones((prev) => [...prev, newZone]);
  };

  const handleUpdateZone = (updatedZone: DeliveryZone) => {
    setDeliveryZones((prev) =>
      prev.map((z) => (z.id === updatedZone.id ? updatedZone : z))
    );
  };

  const handleDeleteZone = (zoneId: string) => {
    setDeliveryZones((prev) => prev.filter((z) => z.id !== zoneId));
  };

  const handleToggleZoneActive = (zoneId: string) => {
    setDeliveryZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, active: !z.active } : z))
    );
  };

  // Payment Status Update handler
  const handleUpdatePaymentStatus = (transactionId: string, status: PaymentStatus, ref?: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? {
              ...t,
              paymentStatus: status,
              mobileMoneyRef: ref !== undefined ? ref : t.mobileMoneyRef,
            }
          : t
      )
    );
  };

  const totalCartCount = cart.reduce((acc, it) => acc + it.quantity, 0);

  // Render Inner Application Content
  const renderAppContent = () => (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[#FBF7EF] text-[#241811]">
      {/* Light Luxury Header Bar */}
      <HeaderNav
        activeView={activeView}
        onNavigate={setActiveView}
        cartCount={totalCartCount}
        onOpenCart={() => {
          setActiveView('pos');
          setIsCartDrawerOpen(true);
        }}
        deviceMode={deviceMode}
        onSetDeviceMode={setDeviceMode}
        userRole={userRole}
        onToggleUserRole={() => setUserRole((r) => (r === 'admin' ? 'employee' : 'admin'))}
      />

      {/* Main View Router */}
      <main className="flex-1 overflow-hidden flex flex-col relative">
        <div
          key={activeView}
          className="flex-1 overflow-hidden flex flex-col w-full h-full animate-page-fade-in"
        >
          {/* 1. CAISSE (Écran Principal) */}
          {activeView === 'pos' && (
            <POSView
              products={products}
              customers={customers}
              deliveryZones={deliveryZones}
              onCompleteSale={handleCompleteSale}
              cart={cart}
              setCart={setCart}
              isCartDrawerOpen={isCartDrawerOpen}
              setIsCartDrawerOpen={setIsCartDrawerOpen}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
              onAddNewCustomer={handleAddCustomer}
              onOpenCustomBoxStudio={() => setActiveView('custom_box')}
            />
          )}

          {/* 2. COMMANDES (Journal des ventes & commandes) */}
          {activeView === 'orders' && (
            <OrdersView
              transactions={transactions}
              onViewReceipt={setActiveReceipt}
            />
          )}

          {/* 3. CATALOGUE & STOCKS */}
          {activeView === 'catalog' && (
            <CatalogAdminView
              products={products}
              movements={movements}
              onUpdateStock={handleUpdateStock}
              onAddNewProduct={(newP) => setProducts((p) => [newP, ...p])}
            />
          )}

          {/* 4. CLIENTS */}
          {activeView === 'customers' && (
            <CustomersView
              customers={customers}
              onAddCustomer={handleAddCustomer}
              onSelectCustomerForCart={(cust) => {
                setSelectedCustomer(cust);
                setActiveView('pos');
                setIsCartDrawerOpen(true);
              }}
            />
          )}

          {/* 5. LIVRAISONS (Zones de livraison dynamiques à Madagascar) */}
          {activeView === 'deliveries' && (
            <DeliveryZonesView
              zones={deliveryZones}
              onAddZone={handleAddZone}
              onUpdateZone={handleUpdateZone}
              onDeleteZone={handleDeleteZone}
              onToggleActive={handleToggleZoneActive}
            />
          )}

          {/* 6. PAIEMENTS (MVola, Orange Money, Airtel, Espèces, Cartes) */}
          {activeView === 'payments' && (
            <PaymentsView
              transactions={transactions}
              onUpdatePaymentStatus={handleUpdatePaymentStatus}
              onViewReceipt={setActiveReceipt}
            />
          )}

          {/* 7. RAPPORTS & DASHBOARD ÉDITORIAL */}
          {activeView === 'reports' && (
            <EditorialDashboardView
              transactions={transactions}
              onNavigate={setActiveView}
              onViewReceipt={setActiveReceipt}
              cashierName={cashierName}
            />
          )}

          {/* 8. PARAMÈTRES (Administration, WhatsApp template & devise) */}
          {activeView === 'settings' && (
            <SettingsView
              whatsappTemplate={whatsappTemplate}
              onSaveWhatsappTemplate={setWhatsappTemplate}
              cashierName={cashierName}
              onChangeCashierName={setCashierName}
            />
          )}

          {/* 9. ÉCRIN SUR-MESURE (Atelier Coffret Personnalisé) */}
          {activeView === 'custom_box' && (
            <CustomBoxStudio
              products={products}
              onAddCustomBoxToCart={handleAddCustomBoxToCart}
              onNavigateToPOS={() => setActiveView('pos')}
            />
          )}
        </div>
      </main>

      {/* Boutique Receipt Modal (with WhatsApp & Print) */}
      {activeReceipt && (
        <ReceiptModal
          transaction={activeReceipt}
          onClose={() => setActiveReceipt(null)}
          whatsappTemplate={whatsappTemplate}
        />
      )}
    </div>
  );

  // If Mobile or Tablet Simulator is chosen on large screens, display inside a realistic frame
  if (deviceMode === 'mobile') {
    return (
      <div className="h-screen w-screen overflow-hidden bg-[#ECE4D8] flex flex-col items-center justify-center p-2 sm:p-4">
        <div className="mb-2 flex items-center gap-2 bg-white border border-[#DDD1C3] px-3.5 py-1.5 rounded-full text-xs text-[#75685F] shadow-sm">
          <span className="font-semibold text-[#1F100A] flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-[#8C572F]" />
            Simulation Mobile 390px
          </span>
          <span>·</span>
          <button
            onClick={() => setDeviceMode('responsive')}
            className="text-xs text-[#8C572F] font-semibold hover:underline"
          >
            Quitter la simulation
          </button>
        </div>

        <div className="w-[390px] h-[844px] max-h-[92vh] bg-[#FBF7EF] rounded-[48px] border-[8px] border-[#2A1D15] shadow-2xl overflow-hidden flex flex-col relative ring-1 ring-black/10 transform-gpu">
          <div className="h-6 bg-white flex items-center justify-center shrink-0 select-none z-40 border-b border-[#F0E6DB]">
            <div className="w-24 h-3.5 bg-[#1F100A] rounded-full" />
          </div>
          <div className="flex-1 overflow-hidden flex flex-col">
            {renderAppContent()}
          </div>
        </div>
      </div>
    );
  }

  if (deviceMode === 'tablet') {
    return (
      <div className="h-screen w-screen overflow-hidden bg-[#ECE4D8] flex flex-col items-center justify-center p-2 sm:p-4">
        <div className="mb-2 flex items-center gap-2 bg-white border border-[#DDD1C3] px-3.5 py-1.5 rounded-full text-xs text-[#75685F] shadow-sm">
          <span className="font-semibold text-[#1F100A] flex items-center gap-1.5">
            <Tablet className="w-3.5 h-3.5 text-[#8C572F]" />
            Simulation Tablette iPad 768px
          </span>
          <span>·</span>
          <button
            onClick={() => setDeviceMode('responsive')}
            className="text-xs text-[#8C572F] font-semibold hover:underline"
          >
            Quitter la simulation
          </button>
        </div>

        <div className="w-[768px] h-[1024px] max-h-[92vh] bg-[#FBF7EF] rounded-[36px] border-[10px] border-[#2A1D15] shadow-2xl overflow-hidden flex flex-col relative ring-1 ring-black/10 transform-gpu">
          <div className="flex-1 overflow-hidden flex flex-col">
            {renderAppContent()}
          </div>
        </div>
      </div>
    );
  }

  // Standard Responsive Mode
  return (
    <div className="h-screen w-screen overflow-hidden">
      {renderAppContent()}
    </div>
  );
}
