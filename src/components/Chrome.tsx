"use client";

import { usePathname } from "next/navigation";

/**
 * Renders the public site chrome (header / footer / sticky CTA) for all routes
 * except /admin, which has its own shell. Server-rendered header/footer are
 * passed in as props so they only render on public routes.
 */
export function Chrome({
  header,
  footer,
  sticky,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  sticky: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
      {sticky}
    </>
  );
}
