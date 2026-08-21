"use client";

import { useEffect, useState } from "react";
import { Header } from "@/app/components/Header";
import { OrderHistory } from "./components/OrderHistory";
import { MenuSection, type MenuItem, type Category } from "./components/MenuSection";
import { CartSidebar, type CartLine } from "./components/CartSidebar";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { createMenu } from "@/shared/service/menu";
import { addOrder, getOrders } from "@/shared/service/order";
import type { Order } from "@/shared/service/order";

const TABS = ["เมนูอาหาร", "ประวัติ"] as const;

export default function CustomerPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("เมนูอาหาร");
  const [activeCategory, setActiveCategory] = useState<Category>("main");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Define menu from Firestore
  const [menu, setMenu] = useState<Record<Category, MenuItem[]>>({
    main: [],
    snack: [],
    drink: [],
    dessert: [],
  });
  // End Define menu from Firestore

  // Load menu from Firestore
  useEffect(() => {
    const menuRef = doc(db, "menu", "menuOrder");

    getDoc(menuRef)
      .then(async (snap) => {
        if (!snap.exists()) {
          // Create menu if it doesn't exist
          await createMenu();
        }
        const freshSnap = await getDoc(menuRef);
        if (freshSnap.exists()) {
          const data = freshSnap.data() as { menuOrder: MenuItem[] };
          const grouped: Record<Category, MenuItem[]> = {
            main: [],
            snack: [],
            drink: [],
            dessert: [],
          };
          for (const item of data.menuOrder) {
            const category = (item.category ?? "main") as Category;
            grouped[category].push(item);
          }
          setMenu(grouped);
        }
      })
      .catch((err) => console.error("Failed to load menu", err));
  }, []);
  // End Load menu from Firestore

  // Load order history when on the history tab
  useEffect(() => {
    if (activeTab !== "ประวัติ") return;
    let mounted = true;
    setLoadingOrders(true);
    getOrders()
      .then((data) => {
        if (mounted) setOrders(data);
      })
      .catch((err) => console.error("Failed to load orders", err))
      .finally(() => {
        if (mounted) setLoadingOrders(false);
      });
    return () => {
      mounted = false;
    };
  }, [activeTab]);

  function addToCart(item: MenuItem) {
    setCart((prev) => {
      const existing = prev.find((line) => line.id === item.id);
      if (existing) {
        return prev.map((line) =>
          line.id === item.id ? { ...line, qty: line.qty + 1 } : line
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          note: "",
          unitPrice: item.price,
          qty: 1,
          img: item.img,
          status: 'pending',
          createdAt: new Date(),
        },
      ];
    });
  }

  function clearCart() {
    setCart([]);
  }

  async function submitOrder() {
    if (cart.length === 0 || submitting) return;
    setSubmitting(true);
    try {
      const orderList = cart.map((line) => ({
        id: line.id,
        name: line.name,
        price: line.unitPrice,
        img: line.img,
        quantity: line.qty,
        note: line.note,
        status: 'pending' as const,
        createdAt: new Date(),
      }));
      await addOrder(orderList);
      clearCart();
    } catch (err) {
      console.error("Failed to submit order", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <Header
        brand="Fair POS - ฝั่งลูกค้า"
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* History Page */}
      {activeTab === "ประวัติ" ? (
        <div className="flex-1 overflow-y-auto p-8">
          <OrderHistory orders={orders} loading={loadingOrders} />
        </div>
      ) : (
        // Menu Page
        <div className="flex flex-1 overflow-hidden">
          <MenuSection
            menu={menu}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onAddToCart={addToCart}
          />
          <CartSidebar
            cart={cart}
            setCart={setCart}
            onClearCart={clearCart}
            onSubmit={submitOrder}
            submitting={submitting}
          />
        </div>
      )}
    </div>
  );
}