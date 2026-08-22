"use client";

import { useEffect, useMemo, useState } from "react";
import { OrderCard } from "./components/OrderCard";
import type { Order } from "./components/OrderCard";
import { Header } from "@/app/components/Header";
import { EmptyState } from "@/app/components/EmptyState";
import Footer from "./components/footer";
import { ArrowUpDown } from "lucide-react";
import { subscribeOrders, updateOrderStatus } from "@/shared/service/order";
import type { Order as FirestoreOrder } from "@/shared/service/order";

const OVERDUE_THRESHOLD = 15;

function mapFirestoreOrder(order: FirestoreOrder): Order {
  const createdAt = order.orderList[0]?.createdAt ?? new Date();
  return {
    id: order.id,
    createdAt,
    orderType: "ทานที่ร้าน",
    items: order.orderList.map((item) => ({
      qty: item.quantity,
      name: item.name,
      note: item.note || undefined,
    })),
  };
}

const TABS = ["รายการอาหาร", "ประวัติ", "สต็อกสินค้า"] as const;

export default function RestaurantPage() {
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]>("รายการอาหาร");
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [sortDirection, setSortDirection] = useState<"oldest" | "newest">("oldest");

  useEffect(() => {
    const unsubscribe = subscribeOrders((firestoreOrders) => {
      const pending = firestoreOrders.filter((o) =>
        o.orderList.some((item) => item.status === "pending")
      );
      setOrders(pending.map(mapFirestoreOrder));
    });
    return () => unsubscribe();
  }, []);

  async function markReady(id: string) {
    await updateOrderStatus(id, "completed");
  }

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const aTime = a.createdAt.getTime();
      const bTime = b.createdAt.getTime();
      return sortDirection === "oldest" ? aTime - bTime : bTime - aTime;
    });
  }, [orders, sortDirection]);

  const overdueCount = orders.filter(
    (o) => Math.floor((Date.now() - o.createdAt.getTime()) / 60000) >= OVERDUE_THRESHOLD
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
            <div className="mb-4 flex items-center justify-end">
              <button
                onClick={() => setSortDirection((d) => (d === "oldest" ? "newest" : "oldest"))}
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-zinc-600 shadow-sm ring-1 ring-zinc-200 transition-colors hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-800"
              >
                <ArrowUpDown size={14} />
                {sortDirection === "oldest" ? "รอนานสุดก่อน" : "ล่าสุดก่อน"}
              </button>
            </div>
            {sortedOrders.length === 0 ? (
              <p className="mt-16 text-center text-sm text-zinc-400">
                ไม่มีออร์เดอร์ที่กำลังดำเนินการ
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {sortedOrders.map((order) => (
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

          <Footer overdueCount={overdueCount} page={page} setPage={setPage} />
        </>
      )}
    </div>
  );
}