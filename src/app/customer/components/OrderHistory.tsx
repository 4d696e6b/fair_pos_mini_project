"use client";

import type { Order } from "@/shared/service/order";
import { EmptyState } from "@/app/components/EmptyState";

type OrderHistoryProps = {
  orders: Order[];
  loading: boolean;
};

export function OrderHistory({ orders, loading }: OrderHistoryProps) {
  if (loading) {
    return <div className="text-center text-zinc-400">กำลังโหลดประวัติ...</div>;
  }

  if (orders.length === 0) {
    return <EmptyState message="ยังไม่มีประวัติการสั่งซื้อ" />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {orders.map((order) => {
        const orderTotal = order.orderList.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const orderDate = order.orderList[0]?.createdAt ?? new Date();
        return (
          <div
            key={order.id}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-800"
          >
            <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  คำสั่งซื้อ #{order.id.slice(0, 10)}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {orderDate.toLocaleString("th-TH")}
                </p>
              </div>
              <span className="text-sm font-bold text-orange-600">
                ฿{orderTotal.toFixed(2)}
              </span>
            </div>
            <ul className="space-y-3">
              {order.orderList.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="flex h-14 w-14 items-center justify-center rounded-xl object-cover text-4xl"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                      {item.name}
                    </p>
                    {item.note && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        หมายเหตุ: {item.note}
                      </p>
                    )}
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      จำนวน: {item.quantity} · ฿{item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
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
