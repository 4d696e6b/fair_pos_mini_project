"use client";

import { useEffect, useState } from "react";
import { OrderCard } from "./components/OrderCard";
import type { Order } from "./components/OrderCard";
import { Header } from "@/app/components/Header";
import { EmptyState } from "@/app/components/EmptyState";


const INITIAL_ORDERS: Order[] = [
  // Hardcoded Order
  {
    id: 1,
    placedAt: "12:30 PM",
    minutesAgo: 15,
    orderType: "ทานที่ร้าน",
    items: [
      { qty: 2, name: "ข้าวกะเพราเนื้อ", note: "ไม่ผัก ไข่ดาวสุก" },
      { qty: 1, name: "ข้าวหน้าเนื้อ", note: "ไข่อ่อนเค็ม" },
      { qty: 1, name: "ชาไทยเย็น" },
    ],
  },
  {
    id: 2,
    placedAt: "12:35 PM",
    minutesAgo: 10,
    orderType: "สั่งกลับบ้าน",
    items: [
      { qty: 3, name: "ปอเปี๊ยะทอด" },
      { qty: 1, name: "ผัดไทยกุ้งสด", note: "กุ้ง, แพ้ถั่วลิสง" },
    ],
  },
];

const OVERDUE_THRESHOLD = 15;
const TABS = ["รายการอาหาร", "ประวัติ", "สต็อกสินค้า"] as const;

export default function RestaurantPage() {
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]>("รายการอาหาร");
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [page, setPage] = useState(1);

  // Tick minutesAgo upward so the "overdue" state feels alive.
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prev) =>
        prev.map((order) => ({ ...order, minutesAgo: order.minutesAgo + 1 }))
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  function markReady(id: number) {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  }

  const overdueCount = orders.filter(
    (o) => o.minutesAgo >= OVERDUE_THRESHOLD
  ).length;

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <Header
        brand="Fair POS - ฝั่งร้านอาหาร"
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {activeTab !== "รายการอาหาร" ? (
        <EmptyState
          message={
            activeTab === "ประวัติ"
              ? "ยังไม่มีประวัติออร์เดอร์"
              : "ยังไม่มีข้อมูลสต็อกสินค้า"
          }
        />
      ) : (
        <>
          <main className="flex-1 overflow-y-auto p-8">
            {orders.length === 0 ? (
              <p className="mt-16 text-center text-sm text-zinc-400">
                ไม่มีออร์เดอร์ที่กำลังดำเนินการ
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onReady={markReady}
                    overdueThreshold={OVERDUE_THRESHOLD}
                  />
                ))}
              </div>
            )}
          </main>

          {/* <footer className="flex items-center justify-between border-t border-zinc-200 bg-white px-8 py-4 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              แสดงรายการที่ค้างเกิน 15 นาที ({overdueCount})
            </span>
            <span className="flex items-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full px-2 py-1 hover:bg-zinc-100 disabled:opacity-40 dark:hover:bg-zinc-800"
                disabled={page === 1}
              >
                ‹
              </button>
              หน้า {page} จาก 1
              <button
                onClick={() => setPage((p) => Math.min(1, p + 1))}
                className="rounded-full px-2 py-1 hover:bg-zinc-100 disabled:opacity-40 dark:hover:bg-zinc-800"
                disabled={page === 1}
              >
                ›
              </button>
            </span>
          </footer> */}
        </>
      )}
    </div>
  );
}