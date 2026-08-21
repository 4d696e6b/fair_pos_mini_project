"use client";

import { useEffect, useState } from "react";
import { Bell, Settings, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

type OrderItem = {
  qty: number;
  name: string;
  note?: string;
};

type Order = {
  id: number;
  placedAt: string;
  minutesAgo: number;
  orderType: "ทานที่ร้าน" | "สั่งกลับบ้าน";
  items: OrderItem[];
};

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
      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-8 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-10">
          <Link  href="/"className="text-lg font-bold text-orange-600 cursor-pointer">Fair POS - ฝั่งร้านอาหาร</Link>
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
          <button
            aria-label="แจ้งเตือน"
            className="cursor-not-allowed relative rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Bell size={18} />
          </button>
          <button aria-label="ตั้งค่า" className="cursor-not-allowed rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {activeTab !== "รายการอาหาร" ? (
        <div className="flex flex-1 items-center justify-center text-zinc-400">
          {activeTab === "ประวัติ" ? "ยังไม่มีประวัติออร์เดอร์" : "ยังไม่มีข้อมูลสต็อกสินค้า"}
        </div>
      ) : (
        <>
          <main className="flex-1 overflow-y-auto p-8">
            {orders.length === 0 ? (
              <p className="mt-16 text-center text-sm text-zinc-400">
                ไม่มีออร์เดอร์ที่กำลังดำเนินการ
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {orders.map((order) => {
                  const overdue = order.minutesAgo >= OVERDUE_THRESHOLD;
                  return (
                    <div
                      key={order.id}
                      className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-800"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                          ออร์เดอร์ที่ #{order.id}
                        </h3>
                        <span className="text-xs text-zinc-400">
                          {order.placedAt}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span
                          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                            overdue
                              ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                              : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          {overdue ? (
                            <AlertCircle size={12} />
                          ) : (
                            <Clock size={12} />
                          )}
                          {order.minutesAgo} นาทีที่แล้ว
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
                              {item.note && (
                                <p className="text-xs text-zinc-400">
                                  {item.note}
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => markReady(order.id)}
                        className="cursor-pointer mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-lime-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-lime-600"
                      >
                        <CheckCircle2 size={16} />
                        พร้อมเสิร์ฟ (Ready)
                      </button>
                    </div>
                  );
                })}
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