import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 dark:bg-black">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Fair POS
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          เลือกฝั่งที่ต้องการเข้าใช้งาน <br/> (หน้านี้เป็นเพีอการทดลองใช้งานเท่านั้น Development Process Only!!)
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <Link
            href="/customer"
            className="flex flex-col items-start gap-1 rounded-2xl border border-zinc-200 bg-white px-6 py-5 text-left transition-colors hover:border-orange-300 hover:bg-orange-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-orange-900 dark:hover:bg-zinc-800"
          >
            <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              ฝั่งลูกค้า / พนักงานสั่งอาหาร
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              เลือกเมนู สั่งอาหาร และชำระเงิน
            </span>
          </Link>

          <Link
            href="/restaurant"
            className="flex flex-col items-start gap-1 rounded-2xl border border-zinc-200 bg-white px-6 py-5 text-left transition-colors hover:border-orange-300 hover:bg-orange-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-orange-900 dark:hover:bg-zinc-800"
          >
            <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              ฝั่งร้านอาหาร / ครัว
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              ดูออร์เดอร์ที่เข้ามาและจัดการสถานะ
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}