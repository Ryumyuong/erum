import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/admin/actions";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/logo/boxdle.png" alt="BOXDLE" width={254} height={52} className="h-6 w-auto" />
            <span className="text-sm font-bold text-ink">관리자 대시보드</span>
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              관리자모드 종료
            </button>
          </form>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

export function AdminPageHeader({
  title,
  actions,
}: {
  title: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
      <div className="flex items-center gap-3">
        <Link href="/admin" className="text-sm text-muted hover:text-ink">
          ← 대시보드
        </Link>
        {actions}
      </div>
    </div>
  );
}
