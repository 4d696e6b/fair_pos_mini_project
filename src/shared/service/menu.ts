import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

const menuOrder = [
  { id: "m1", name: "ข้าวกระเพราหมู", price: 60, img: "https://www.tecnoplusthai.com/wp-content/uploads/2025/08/9.3.webp", category: "main" },
  { id: "m2", name: "ข้าวกระเพราเนื้อ", price: 60, img: "https://api2.krua.co/wp-content/uploads/2021/05/RT1652_Gallery_-01.jpg", category: "main" },
  { id: "m3", name: "ข้าวหน้าเนื้อ", price: 80, img: "https://api2.krua.co/wp-content/uploads/2022/10/RI1801_ImageBanner_1140x507.jpg", category: "main" },
  { id: "m4", name: "ข้าวผัด", price: 50, img: "https://www.maggi.co.th/sites/default/files/srh_recipes/a1b6cab9710d963ab0d30f62e5d3a88a.jpeg", category: "main" },
  { id: "m5", name: "ผัดไทยกุ้งสด", price: 60, img: "https://img.wongnai.com/p/1920x0/2021/08/09/f5ff71c37a2c4101b895432aae1ac01a.jpg", category: "main" },
  { id: "m6", name: "ปูผัดผงกระหรี่", price: 70, img: "https://aroifin.com/wp-content/uploads/2025/12/cover-11122025-stir-fried-crab-with-curry-powder.webp", category: "main" },
  { id: "m7", name: "หมึกผัดไข่เค็ม", price: 70, img: "https://api2.krua.co/wp-content/uploads/2020/06/SlideBanner1140x507-354.jpg", category: "main" },
  { id: "m8", name: "เล้งแซ่บ", price: 80, img: "https://api2.krua.co/wp-content/uploads/2020/06/RT1385_________________________ImageBanner_1140x507.jpg", category: "main" },
  { id: "m9", name: "ปอเปี๊ยะทอด", price: 45, img: "https://www.mapfood.co.th/wp-content/uploads/2024/03/fried-chinese-spring-rolls-served-with-chili-sauce-decorated-rose-tomatoes-with-green-leaved-wood-space-concept-asian-food-scaled-2048x1363.jpg", category: "snack" },
  { id: "m10", name: "ไก่ทอด", price: 55, img: "https://api2.krua.co/wp-content/themes/krua/images/share/sch-space-thumb.png", category: "snack" },
  { id: "m11", name: "เกี๊ยวกรอบ", price: 40, img: "https://www.maggi.co.th/sites/default/files/srh_recipes/c8e98420522cf8fd10d0374593da9265.jpg", category: "snack" },
  { id: "m12", name: "ชาไทยเย็น", price: 35, img: "https://www.bluemochatea.com/wp-content/webp-express/webp-images/uploads/2020/09/71176432_492567911326523_3890343149804582778_n-768x768.jpg.webp", category: "drink" },
  { id: "m13", name: "น้ำมะนาว", price: 30, img: "https://www.th-hellomagazine.com/wp-content/uploads/2020/04/3627519.jpg?tr=w-1600", category: "drink" },
  { id: "m14", name: "โค้ก", price: 25, img: "https://t3.ftcdn.net/jpg/03/06/17/30/240_F_306173087_XbMsavtqGIHz7Ug07Z6j4Eyi9QMu3ivQ.jpg", category: "drink" },
  { id: "m15", name: "ข้าวเหนียวมะม่วง", price: 65, img: "https://blog.hungryhub.com/wp-content/uploads/2022/04/fresh-ripe-mango-sticky-rice-with-coconut-milk-dark-surface-768x512.jpg", category: "dessert" },
  { id: "m16", name: "ไอศกรีมกะทิ", price: 40, img: "https://s359.kapook.com/pagebuilder/95fda6be-5c79-48aa-bcc8-8209055c44ef.jpg", category: "dessert" },
];

export async function createMenu() {
  await setDoc(
    doc(db, "menu", "menuOrder"),
    { menuOrder },
    { merge: true }
  );
}

