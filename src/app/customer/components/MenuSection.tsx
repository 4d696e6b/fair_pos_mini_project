"use client";

import { Plus } from "lucide-react";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  img: string;
  category: Category;
};

export type Category = "main" | "snack" | "drink" | "dessert";

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "main", label: "เมนูหลัก" },
  { id: "snack", label: "ของทานเล่น" },
  { id: "drink", label: "เครื่องดื่ม" },
  { id: "dessert", label: "ของหวาน" },
];

type MenuSectionProps = {
  menu: Record<Category, MenuItem[]>;
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  onAddToCart: (item: MenuItem) => void;
};

export function MenuSection({
  menu,
  activeCategory,
  onCategoryChange,
  onAddToCart,
}: MenuSectionProps) {
  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="mb-6 flex flex-wrap gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "cursor-default bg-orange-600 text-white"
                : "cursor-pointer bg-white text-zinc-600 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
        {menu[activeCategory].map((item) => (
          <MenuCard key={item.id} item={item} onAdd={onAddToCart} />
        ))}
      </div>
    </main>
  );
}

function MenuCard({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-800">
      <img
        src={item.img}
        alt={item.name}
        className="flex w-full object-contain h-32 items-center justify-center text-5xl"
      />
      <div className="flex items-center justify-between p-3">
        <div>
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            {item.name}
          </p>
          <p className="text-sm font-bold text-orange-600">{item.price} บาท</p>
        </div>
        <button
          onClick={() => onAdd(item)}
          aria-label={`เพิ่ม ${item.name}`}
          className="flex cursor-pointer h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-white transition-transform hover:scale-105 active:scale-95"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
