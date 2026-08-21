"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Settings, Minus, Plus, Trash2, Wallet, Pencil } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { createMenu } from "@/shared/service/menu";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  img: string;
};

type Category = "main" | "snack" | "drink" | "dessert";

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "main", label: "เมนูหลัก" },
  { id: "snack", label: "ของทานเล่น" },
  { id: "drink", label: "เครื่องดื่ม" },
  { id: "dessert", label: "ของหวาน" },
];


type CartLine = {
  id: string;
  name: string;
  note: string;
  unitPrice: number;
  qty: number;
  img: string;
};

const INITIAL_CART: CartLine[] = [
  {
    id: "c1",
    name: "ข้าวกะเพราเนื้อ",
    note: "ไม่ผัก ไข่ดาวสุก",
    unitPrice: 30,
    qty: 2,
    img: "ImagePlaceholder.jpg"
  },
  {
    id: "c2",
    name: "ข้าวหน้าเนื้อ",
    note: "ไข่อ่อนเค็ม",
    unitPrice: 80,
    qty: 1,
    img: "ImagePlaceholder.jpg"
  },
];

const TAX_RATE = 0.07;
const TABS = ["เมนูอาหาร", "ประวัติ"] as const;

export default function CustomerPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("เมนูอาหาร");
  const [activeCategory, setActiveCategory] = useState<Category>("main");
  const [cart, setCart] = useState<CartLine[]>(INITIAL_CART);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

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
          setMenu((prev) => ({ ...prev, main: data.menuOrder }));
        }
      })
      .catch((err) => console.error("Failed to load menu", err));
  }, []);
  // End Load menu from Firestore

  const subtotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.unitPrice * line.qty, 0),
    [cart]
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

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
        },
      ];
    });
  }

  function changeQty(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((line) =>
          line.id === id ? { ...line, qty: line.qty + delta } : line
        )
        .filter((line) => line.qty > 0)
    );
  }

  function clearCart() {
    setCart([]);
    setEditingNoteId(null);
  }

  function startEditNote(line: CartLine) {
    setEditingNoteId(line.id);
    setNoteDraft(line.note);
  }

  function saveNote(id: string) {
    const trimmed = noteDraft.trim();
    setCart((prev) =>
      prev.map((line) => (line.id === id ? { ...line, note: trimmed } : line))
    );
    setEditingNoteId(null);
    setNoteDraft("");
  }

  function cancelEditNote() {
    setEditingNoteId(null);
    setNoteDraft("");
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      {/* Header Navbar */}
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-8 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-10">
          <Link href="/" className="text-lg font-bold text-orange-600">Fair POS - ฝั่งลูกค้า</Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 pb-1 transition-colors ${
                  activeTab === tab
                    ? "cursor-default border-orange-600 text-orange-600"
                    : "cursor-pointer border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400">
          <button aria-label="แจ้งเตือน" className="cursor-not-allowed rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <Bell size={18} />
          </button>
          <button aria-label="ตั้งค่า" className="cursor-not-allowed rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* History Page */}
      {activeTab === "ประวัติ" ? (
        <div className="flex flex-1 items-center justify-center text-zinc-400">
          ยังไม่มีประวัติการสั่งซื้อ
        </div>
      ) : (
        // Menu Page
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-8">
            <div className="mb-6 flex flex-wrap gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                    activeCategory === cat.id
                      ? "cursor-default bg-orange-600 text-white"
                      : "cursor-pointer bg-white text-zinc-600 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
              {menu[activeCategory].map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-800"
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className={`flex w-full object-contain h-32 items-center justify-center text-5xl`}
                  />
                  <div className="flex items-center justify-between p-3">
                    <div>
                      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                        {item.name}
                      </p>
                      <p className="text-sm font-bold text-orange-600">
                        {item.price} บาท
                      </p>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      aria-label={`เพิ่ม ${item.name}`}
                      className="flex cursor-pointer h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-white transition-transform hover:scale-105 active:scale-95"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>

          {/* Order sidebar */}
          <aside className="flex w-90 shrink-0 flex-col border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between px-6 py-5">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                รายการอาหาร
              </h2>
              <button
                onClick={clearCart}
                className="flex items-center gap-1 cursor-pointer text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                <Trash2 size={14} />
                ลบทั้งหมด
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {cart.length === 0 ? (
                <p className="mt-10 text-center text-sm text-zinc-400">
                  ยังไม่มีรายการอาหาร
                </p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {cart.map((line) => (
                    <li key={line.id} className="flex items-start gap-3">
                      <img
                        src={line.img}
                        alt={line.name}
                        className={`flex w-16 object-cover h-16 rounded-xl items-center justify-center text-5xl shrink-0`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                          {line.name}
                        </p>

                        {/* Note: view, edit, or empty state */}
                        {editingNoteId === line.id ? (
                          <input
                            autoFocus
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveNote(line.id);
                              if (e.key === "Escape") cancelEditNote();
                            }}
                            onBlur={() => saveNote(line.id)}
                            placeholder="เช่น ไม่ผัก, เผ็ดน้อย"
                            className="mt-0.5 w-full rounded-md border border-orange-300 bg-orange-50/50 px-2 py-1 text-xs text-zinc-700 outline-none focus:border-orange-500 dark:border-orange-900 dark:bg-zinc-800 dark:text-zinc-200"
                          />
                        ) : line.note ? (
                          <button
                            onClick={() => startEditNote(line)}
                            className="mt-0.5 flex cursor-pointer items-center gap-1 truncate text-xs text-zinc-400 hover:text-orange-600"
                          >
                            <Pencil size={10} className="shrink-0" />
                            <span className="truncate">{line.note}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => startEditNote(line)}
                            className="mt-0.5 flex cursor-pointer items-center gap-1 text-xs text-zinc-300 hover:text-orange-600 dark:text-zinc-600"
                          >
                            <Pencil size={10} />
                            เพิ่มโน้ต
                          </button>
                        )}

                        <p className="mt-1 text-sm font-bold text-zinc-800 dark:text-zinc-100">
                          ฿{(line.unitPrice * line.qty).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          onClick={() => changeQty(line.id, -1)}
                          aria-label="ลดจำนวน"
                          className="flex cursor-pointer h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-4 text-center text-sm font-medium text-zinc-800 dark:text-zinc-100">
                          {line.qty}
                        </span>
                        <button
                          onClick={() => changeQty(line.id, 1)}
                          aria-label="เพิ่มจำนวน"
                          className="flex cursor-pointer h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-zinc-200 px-6 py-5 dark:border-zinc-800">
              <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                <span>ยอดรวม</span>
                <span>฿{subtotal.toFixed(2)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                <span>ภาษี (7%)</span>
                <span>฿{tax.toFixed(2)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-dashed border-zinc-200 pt-3 text-base font-bold text-zinc-900 dark:border-zinc-700 dark:text-zinc-50">
                <span>ยอดสุทธิ</span>
                <span>฿{total.toFixed(2)}</span>
              </div>
              <button
                disabled={cart.length === 0}
                className="mt-4 cursor-pointer flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
              >
                <Wallet size={16} />
                ชำระเงิน
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}