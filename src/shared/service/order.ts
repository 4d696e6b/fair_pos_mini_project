import { db } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc, onSnapshot, updateDoc } from "firebase/firestore";

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  img: string;
  quantity: number;
  note: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
};

export type Order = {
  id: string;
  orderList: OrderItem[];
};

function generateOrderId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

export async function addOrder(orderList: OrderItem[]) {
  const orderId = generateOrderId();
  await setDoc(
    doc(db, "orders", orderId),
    { orderList },
    { merge: true }
  );
  return orderId;
}

function parseOrderDoc(d: { id: string; data: () => Record<string, any> }): Order {
  const data = d.data() as { orderList?: unknown[] };
  const orderList = (data.orderList || []).map((item: any): OrderItem => ({
    id: String(item.id ?? ""),
    name: String(item.name ?? ""),
    price: Number(item.price ?? 0),
    img: String(item.img ?? ""),
    quantity: Number(item.quantity ?? 0),
    note: String(item.note ?? ""),
    status: ((item.status as OrderItem["status"]) ?? "pending"),
    createdAt: item.createdAt?.toDate ? item.createdAt.toDate() : new Date(item.createdAt ?? Date.now()),
  }));
  return { id: d.id, orderList };
}

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function filterToday(orders: Order[]): Order[] {
  return orders.filter((o) => {
    const created = o.orderList[0]?.createdAt;
    return created && isToday(created);
  });
}

function sortOrders(orders: Order[]): Order[] {
  return filterToday(orders).sort((a, b) => {
    const aTime = a.orderList[0]?.createdAt?.getTime?.() ?? 0;
    const bTime = b.orderList[0]?.createdAt?.getTime?.() ?? 0;
    return bTime - aTime;
  });
}

export async function getOrders(): Promise<Order[]> {
  const snap = await getDocs(collection(db, "orders"));
  return sortOrders(snap.docs.map(parseOrderDoc));
}

export function subscribeOrders(callback: (orders: Order[]) => void) {
  return onSnapshot(collection(db, "orders"), (snap) => {
    callback(sortOrders(snap.docs.map(parseOrderDoc)));
  });
}

export async function updateOrderStatus(orderId: string, status: OrderItem["status"]) {
  const snap = await getDocs(collection(db, "orders"));
  const orderDoc = snap.docs.find((d) => d.id === orderId);
  if (!orderDoc) return;
  const data = orderDoc.data() as { orderList?: any[] };
  const updatedList = (data.orderList || []).map((item: any) => ({
    ...item,
    status,
  }));
  await updateDoc(doc(db, "orders", orderId), { orderList: updatedList });
}
