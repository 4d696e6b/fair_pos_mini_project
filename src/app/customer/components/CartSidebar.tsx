"use client";

import { useEffect, useMemo, useState, type SetStateAction } from "react";
import { Minus, Plus, Trash2, Wallet, Pencil } from "lucide-react";

export type CartLine = {
  id: string;
  name: string;
  note: string;
  unitPrice: number;
  qty: number;
  img: string;
  status: "pending" | "completed" | "cancelled";
  createdAt: Date;
};

const TAX_RATE = 0.07;

type CartSidebarProps = {
  cart: CartLine[];
  setCart: (value: SetStateAction<CartLine[]>) => void;
  onClearCart: () => void;
  onSubmit: () => void;
  submitting: boolean;
};

export function CartSidebar({
  cart,
  setCart,
  onClearCart,
  onSubmit,
  submitting,
}: CartSidebarProps) {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  useEffect(() => {
    if (cart.length === 0) {
      setEditingNoteId(null);
      setNoteDraft("");
    }
  }, [cart]);

  const subtotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.unitPrice * line.qty, 0),
    [cart]
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  function changeQty(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((line) =>
          line.id === id ? { ...line, qty: line.qty + delta } : line
        )
        .filter((line) => line.qty > 0)
    );
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

  function handleClear() {
    onClearCart();
    setEditingNoteId(null);
    setNoteDraft("");
  }

  return (
    <aside className="flex w-90 shrink-0 flex-col border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between px-6 py-5">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
          รายการอาหาร
        </h2>
        <button
          onClick={handleClear}
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
                    className="flex w-16 object-cover h-16 rounded-xl items-center justify-center text-5xl shrink-0"
                  />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                    {line.name}
                  </p>

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
          onClick={onSubmit}
          disabled={cart.length === 0 || submitting}
          className="mt-4 cursor-pointer flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          <Wallet size={16} />
          ชำระเงิน
        </button>
      </div>
    </aside>
  );
}
