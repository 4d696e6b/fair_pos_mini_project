import { db } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";

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

export async function getOrders(): Promise<Order[]> {
  const snap = await getDocs(collection(db, "orders"));
  const orders = snap.docs.map((d) => {
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
  });
  return orders.sort((a, b) => {
    const aTime = a.orderList[0]?.createdAt?.getTime?.() ?? 0;
    const bTime = b.orderList[0]?.createdAt?.getTime?.() ?? 0;
    return bTime - aTime;
  });
}
