import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

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
