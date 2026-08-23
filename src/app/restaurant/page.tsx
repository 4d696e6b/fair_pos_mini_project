"use client";

import { useEffect, useMemo, useState } from "react";
import { OrderCard } from "./components/OrderCard";
import type { Order } from "./components/OrderCard";
import { Header } from "@/app/components/Header";
import { EmptyState } from "@/app/components/EmptyState";
import Footer from "./components/footer";
import { ArrowUpDown } from "lucide-react";
import { subscribeOrders, updateOrderStatus, getOrders } from "@/shared/service/order";
import type { Order as FirestoreOrder } from "@/shared/service/order";
import { OrderHistory } from "./components/OrderHistory";

const OVERDUE_THRESHOLD = 15;

function mapFirestoreOrder(order: FirestoreOrder, orderNumber: number): Order {
  const createdAt = order.orderList[0]?.createdAt ?? new Date();
  return {
    id: order.id,
    orderNumber,
    createdAt,
    orderType: "ทานที่ร้าน",
    items: order.orderList.map((item) => ({
      qty: item.quantity,
      name: item.name,
      note: item.note || undefined,
    })),
  };
}

function buildOrderNumberMap(orders: FirestoreOrder[]): Map<string, number> {
  const sorted = [...orders].sort((a, b) => {
    const aTime = a.orderList[0]?.createdAt?.getTime?.() ?? 0;
    const bTime = b.orderList[0]?.createdAt?.getTime?.() ?? 0;
    return aTime - bTime;
  });
  const map = new Map<string, number>();
  sorted.forEach((o, idx) => map.set(o.id, idx + 1));
  return map;
}

const TABS = ["รายการอาหาร", "ประวัติ", "สต็อกสินค้า"] as const;

export default function RestaurantPage() {
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]>("รายการอาหาร");
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [sortDirection, setSortDirection] = useState<"oldest" | "newest">("oldest");
  const [historyOrders, setHistoryOrders] = useState<FirestoreOrder[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [orderNumberMap, setOrderNumberMap] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const unsubscribe = subscribeOrders((firestoreOrders) => {
      const numberMap = buildOrderNumberMap(firestoreOrders);
      setOrderNumberMap(numberMap);
      const pending = firestoreOrders.filter((o) =>
        o.orderList.some((item) => item.status === "pending")
      );
      setOrders(pending.map((o) => mapFirestoreOrder(o, numberMap.get(o.id) ?? 0)));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (activeTab !== "ประวัติ") return;
    let mounted = true;
    setLoadingHistory(true);
    getOrders()
      .then((data) => {
        if (mounted) {
          const done = data.filter((o) =>
            o.orderList.every((item) => item.status === "completed" || item.status === "cancelled")
          );
          setHistoryOrders(done);
        }
      })
      .catch((err) => console.error("Failed to load order history", err))
      .finally(() => {
        if (mounted) setLoadingHistory(false);
      });
    return () => { mounted = false; };
  }, [activeTab]);

  async function markReady(id: string) {
    await updateOrderStatus(id, "completed");
  }

  async function cancelOrder(id: string) {
    await updateOrderStatus(id, "cancelled");
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

      {activeTab === "ประวัติ" ? (
        <OrderHistory orders={historyOrders} loading={loadingHistory} orderNumberMap={orderNumberMap} />
      ) : activeTab === "สต็อกสินค้า" ? (
        <EmptyState message="ยังไม่มีข้อมูลสต็อกสินค้า" />
      ) : (
        <>
          <main className="flex flex-1 flex-col overflow-hidden py-8">
            <div className="mb-4 flex items-center justify-end px-8">
              <button
                onClick={() => setSortDirection((d) => (d === "oldest" ? "newest" : "oldest"))}
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-zinc-600 shadow-sm ring-1 ring-zinc-200 transition-colors hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-800"
              >
                <ArrowUpDown size={14} />
                {sortDirection === "oldest" ? "รอนานสุดก่อน" : "ล่าสุดก่อน"}
              </button>
            </div>
            {sortedOrders.length === 0 ? (
              <p className="mt-16 text-center text-sm text-zinc-400 px-8">
                ไม่มีออร์เดอร์ที่กำลังดำเนินการ
              </p>
            ) : (
              <div className="flex flex-1 items-stretch gap-6 overflow-x-auto px-8 pb-4">
                {sortedOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onReady={markReady}
                    onCancel={cancelOrder}
                    overdueThreshold={OVERDUE_THRESHOLD}
                  />
                ))}

                <div className="w-0 shrink-0" aria-hidden />
              </div>
            )}
          </main>

          <Footer overdueCount={overdueCount} page={page} setPage={setPage} />
        </>
      )}
    </div>
  );
}