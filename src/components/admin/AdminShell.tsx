import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-admin">
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="container-page flex h-[var(--spacing-header)] items-center justify-between">
          <Link href="/admin" className="flex min-w-0 items-center gap-6 max-[500px]:gap-2">
            <Image src="/logo/iiroom-ko.png" alt="iiroom design & package" width={532} height={240} className="h-9 max-[500px]:h-7 w-auto" />
            <span className="whitespace-nowrap text-[1.5rem] max-[500px]:text-[0.8125rem] font-bold leading-none text-[#101828]">관리자 대시보드</span>
          </Link>
          <form action={signOut} className="shrink-0">
            <button
              type="submit"
              className="inline-flex items-center gap-2 max-[500px]:gap-1 rounded-[0.625rem] bg-[#FD7304] px-4 max-[500px]:px-2 py-2.5 max-[500px]:py-1.5 text-[1rem] max-[500px]:text-[0.6875rem] font-extrabold text-white hover:bg-brand-dark"
            >
              <Image src="/icons/admin-logout.png" alt="" width={24} height={26} className="h-4 max-[500px]:h-3 w-auto" />
              관리자모드 종료
            </button>
          </form>
        </div>
      </header>
      <AdminNav />
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
    <div className="mb-16 max-[500px]:mb-9 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-[2.25rem] max-[500px]:text-[1.375rem] font-bold text-[#101828]">{title}</h1>
      <div className="flex items-center gap-10">
        <Link href="/admin" className="text-[0.875rem] text-[#4A5565] hover:text-ink">
          ← 대시보드
        </Link>
        {actions}
      </div>
    </div>
  );
}
