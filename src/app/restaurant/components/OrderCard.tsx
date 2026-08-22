"use client";

import { useState } from "react";
import { Clock, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export type OrderItem = {
  qty: number;
  name: string;
  note?: string;
};

export type Order = {
  id: string;
  createdAt: Date;
  orderType: "ทานที่ร้าน" | "สั่งกลับบ้าน";
  items: OrderItem[];
};

type OrderCardProps = {
  order: Order;
  onReady: (id: string) => void;
  onCancel: (id: string) => void;
  overdueThreshold: number;
};

export function OrderCard({ order, onReady, onCancel, overdueThreshold }: OrderCardProps) {
  const minutesAgo = Math.floor((Date.now() - order.createdAt.getTime()) / 60000);
  const placedAt = order.createdAt.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
  const overdue = minutesAgo >= overdueThreshold;
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  return (
    <div className="flex w-80 shrink-0 flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-800">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
          ออร์เดอร์ที่ #{order.id}
        </h3>
        <span className="text-xs text-zinc-400">{placedAt}</span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            overdue
              ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
              : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
          }`}
        >
          {overdue ? <AlertCircle size={12} /> : <Clock size={12} />}
          {minutesAgo} นาทีที่แล้ว
        </span>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {order.orderType}
        </span>
      </div>

      <ul className="mt-4 flex flex-1 flex-col gap-3">
        {order.items.map((item, idx) => (
          <li key={idx} className="flex gap-3">
            <span className="text-base font-bold text-zinc-800 dark:text-zinc-100">
              {item.qty}
            </span>
            <div>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                {item.name}
              </p>
              {item.note && <p className="text-xs text-zinc-400">{item.note}</p>}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex gap-2">
        <button
          onClick={() => onReady(order.id)}
          className="cursor-pointer flex flex-1 items-center justify-center gap-2 rounded-full bg-lime-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-lime-600"
        >
          <CheckCircle2 size={16} />
          พร้อมเสิร์ฟ (Ready)
        </button>
        <button
          onClick={() => setConfirmingCancel(true)}
          className="cursor-pointer flex items-center justify-center gap-1.5 rounded-full bg-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
        >
          <XCircle size={16} />
          ยกเลิก
        </button>
      </div>

      {confirmingCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConfirmingCancel(false)}>
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900" onClick={(e) => e.stopPropagation()}>
            <h4 className="text-center text-base font-bold text-zinc-900 dark:text-zinc-50">
              ยืนยันยกเลิกออร์เดอร์?
            </h4>
            <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
              ออร์เดอร์ #{order.id} จะถูกยกเลิกและไม่สามารถย้อนกลับได้
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirmingCancel(false)}
                className="cursor-pointer flex flex-1 items-center justify-center rounded-full bg-zinc-200 py-3 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
              >
                ไม่ใช่
              </button>
              <button
                onClick={() => { onCancel(order.id); setConfirmingCancel(false); }}
                className="cursor-pointer flex flex-1 items-center justify-center gap-2 rounded-full bg-red-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                <XCircle size={16} />
                ยกเลิกออร์เดอร์
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
