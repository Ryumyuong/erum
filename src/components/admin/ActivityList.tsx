"use client";

import Image from "next/image";
import { useState } from "react";
import { Pagination } from "@/components/admin/Pagination";
import type { Activity } from "@/lib/db/queries";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "방금 전";
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  return `${day}일 전`;
}

const PER_PAGE = 10;

export function ActivityList({ items }: { items: Activity[] }) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const current = Math.min(page, pageCount);
  const paged = items.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  if (items.length === 0) {
    return <p className="py-10 text-center text-sm text-muted">아직 활동이 없습니다.</p>;
  }

  return (
    <>
      <ul className="space-y-6">
        {paged.map((a, i) => (
          <li
            key={i}
            className="flex items-center gap-3 rounded-[0.625rem] bg-[#F9FAFB] px-4 py-3.5"
          >
            <Image src={a.img} alt="" width={96} height={96} className="h-11 w-11 shrink-0" />
            <div>
              <p className="text-[1rem] font-medium text-[#101828]">{a.text}</p>
              <p className="text-[0.875rem] text-[#6A7282]">{timeAgo(a.at)}</p>
            </div>
          </li>
        ))}
      </ul>
      <Pagination page={current} pageCount={pageCount} onChange={setPage} />
    </>
  );
}
