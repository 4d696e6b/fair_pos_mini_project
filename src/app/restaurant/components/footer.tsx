"use client";

export default function Footer({ overdueCount, page, setPage }: { overdueCount: number; page: number; setPage: React.Dispatch<React.SetStateAction<number>> }) {
  return (
    <footer className="flex items-center justify-between border-t border-zinc-200 bg-white px-8 py-4 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
      <span className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        แสดงรายการที่ค้างเกิน 15 นาที ({overdueCount})
      </span>
      <span className="flex items-center gap-3">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded-full px-2 py-1 hover:bg-zinc-100 disabled:opacity-40 dark:hover:bg-zinc-800"
          disabled={page === 1}
        >
          ‹
        </button>
        หน้า {page} จาก 1
        <button
          onClick={() => setPage((p) => Math.min(1, p + 1))}
          className="rounded-full px-2 py-1 hover:bg-zinc-100 disabled:opacity-40 dark:hover:bg-zinc-800"
          disabled={page === 1}
        >
          ›
        </button>
      </span>
    </footer>
  );
}