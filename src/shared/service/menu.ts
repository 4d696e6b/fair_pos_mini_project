import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

const menuOrder = [
  { id: "m1", name: "ข้าวกระเพราหมู", price: 60, img: "ImagePlaceHolder.jpg", category: "main" },
  { id: "m2", name: "ข้าวกระเพราเนื้อ", price: 60, img: "ImagePlaceHolder.jpg", category: "main" },
  { id: "m3", name: "ข้าวหน้าเนื้อ", price: 80, img: "ImagePlaceHolder.jpg", category: "main" },
  { id: "m4", name: "ข้าวผัด", price: 50, img: "ImagePlaceHolder.jpg", category: "main" },
  { id: "m5", name: "ผัดไทยกุ้งสด", price: 60, img: "ImagePlaceHolder.jpg", category: "main" },
  { id: "m6", name: "ปูผัดผงกระหรี่", price: 70, img: "ImagePlaceHolder.jpg", category: "main" },
  { id: "m7", name: "หมึกผัดไข่เค็ม", price: 70, img: "ImagePlaceHolder.jpg", category: "main" },
  { id: "m8", name: "เล้งแซ่บ", price: 80, img: "ImagePlaceHolder.jpg", category: "main" },
];

export async function createMenu() {
  await setDoc(
    doc(db, "menu", "menuOrder"),
    { menuOrder },
    { merge: true }
  );
}

