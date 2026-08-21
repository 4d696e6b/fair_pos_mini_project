import { Bell, Settings } from "lucide-react";
import Link from "next/link";

type HeaderProps<T extends string> = {
  brand: string;
  tabs: readonly T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
};

export function Header<T extends string>({ brand, tabs, activeTab, onTabChange }: HeaderProps<T>) {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-8 py-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-10">
        <Link href="/" className="text-lg font-bold text-orange-600">
          {brand}
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
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
          className="cursor-not-allowed rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <Bell size={18} />
        </button>
        <button
          aria-label="ตั้งค่า"
          className="cursor-not-allowed rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
