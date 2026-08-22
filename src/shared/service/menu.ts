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
  { id: "m9", name: "ปอเปี๊ยะทอด", price: 45, img: "ImagePlaceHolder.jpg", category: "snack" },
  { id: "m10", name: "ไก่ทอด", price: 55, img: "ImagePlaceHolder.jpg", category: "snack" },
  { id: "m11", name: "เกี๊ยวกรอบ", price: 40, img: "ImagePlaceHolder.jpg", category: "snack" },
  { id: "m12", name: "ชาไทยเย็น", price: 35, img: "ImagePlaceHolder.jpg", category: "drink" },
  { id: "m13", name: "น้ำมะนาว", price: 30, img: "ImagePlaceHolder.jpg", category: "drink" },
  { id: "m14", name: "โค้ก", price: 25, img: "ImagePlaceHolder.jpg", category: "drink" },
  { id: "m15", name: "ข้าวเหนียวมะม่วง", price: 65, img: "ImagePlaceHolder.jpg", category: "dessert" },
  { id: "m16", name: "ไอศกรีมกะทิ", price: 40, img: "ImagePlaceHolder.jpg", category: "dessert" },
];

export async function createMenu() {
  await setDoc(
    doc(db, "menu", "menuOrder"),
    { menuOrder },
    { merge: true }
  );
}

