"use client";

import type { Order } from "@/shared/service/order";
import { EmptyState } from "@/app/components/EmptyState";
import { CheckCircle2, XCircle } from "lucide-react";

type OrderHistoryProps = {
  orders: Order[];
  loading: boolean;
  orderNumberMap: Map<string, number>;
};

const statusConfig = {
  completed: { label: "เสร็จสิ้น", className: "bg-lime-50 text-lime-600 dark:bg-lime-950/40 dark:text-lime-400" },
  cancelled: { label: "ยกเลิก", className: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400" },
  pending: { label: "กำลังดำเนินการ", className: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400" },
} as const;

export function OrderHistory({ orders, loading, orderNumberMap }: OrderHistoryProps) {
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-zinc-400">กำลังโหลดประวัติ...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return <EmptyState message="ยังไม่มีประวัติออร์เดอร์" />;
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 overflow-y-auto p-8">
      {orders.map((order) => {
        const orderDate = order.orderList[0]?.createdAt ?? new Date();
        const status = order.orderList[0]?.status ?? "pending";
        const config = statusConfig[status];
        const orderTotal = order.orderList.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        return (
          <div
            key={order.id}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-800"
          >
            <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  ออร์เดอร์ #{orderNumberMap.get(order.id) ?? "-"}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {orderDate.toLocaleString("th-TH")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-orange-600">
                  ฿{orderTotal.toFixed(2)}
                </span>
                <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}>
                  {status === "completed" ? <CheckCircle2 size={12} /> : status === "cancelled" ? <XCircle size={12} /> : null}
                  {config.label}
                </span>
              </div>
            </div>
            <ul className="space-y-2">
              {order.orderList.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                    {item.quantity}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">
                      {item.name}
                    </p>
                    {item.note && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        หมายเหตุ: {item.note}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    ฿{(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
