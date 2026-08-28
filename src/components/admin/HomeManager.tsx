"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { saveHomeConfig } from "@/app/admin/content-actions";
import { cn } from "@/lib/utils";

type PItem = { itemNo: string; name: string; thumbnail: string | null };

const ctrlBtn =
  "flex h-7 items-center justify-center rounded-md bg-black/60 px-2 text-xs font-bold text-white backdrop-blur hover:bg-black/80 disabled:opacity-40";

export function HomeManager({
  hero: initialHero,
  featured: initialFeatured,
  portfolio,
}: {
  hero: string[];
  featured: string[];
  portfolio: PItem[];
}) {
  const router = useRouter();
  const [hero, setHero] = useState<string[]>(initialHero);
  const [featured, setFeatured] = useState<string[]>(initialFeatured);
  const [saving, setSaving] = useState(false);

  const addHero = (url: string) => setHero((h) => [...h, url]);
  const removeHero = (i: number) =>
    setHero((h) => h.filter((_, idx) => idx !== i));
  const moveHero = (i: number, dir: -1 | 1) =>
    setHero((h) => {
      const j = i + dir;
      if (j < 0 || j >= h.length) return h;
      const c = [...h];
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });
  const toggleFeatured = (no: string) =>
    setFeatured((f) => (f.includes(no) ? f.filter((x) => x !== no) : [...f, no]));

  async function save() {
    setSaving(true);
    const res = await saveHomeConfig({ homeHero: hero, homeFeatured: featured });
    setSaving(false);
    if (!res.ok) {
      alert(`저장 실패\n${res.error ?? "알 수 없는 오류"}`);
      return;
    }
    router.refresh();
    alert("저장되었습니다.");
  }

  return (
    <div className="space-y-8">
      {/* Hero slides */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg max-[500px]:text-[0.9375rem] font-bold">메인 이미지 (히어로 슬라이드)</h2>
        <p className="mb-5 mt-1 text-sm text-muted">
          홈 상단에서 순서대로 넘어가는 슬라이드 이미지입니다. 비워두면 기본
          이미지가 표시됩니다. (권장 비율 약 1512 × 620)
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hero.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="relative aspect-[1512/620] overflow-hidden rounded-lg border border-line"
            >
              <Image src={url} alt="" fill className="object-cover" />
              <span className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                {i + 1}
              </span>
              <div className="absolute right-1.5 top-1.5 flex gap-1">
                <button type="button" className={ctrlBtn} onClick={() => moveHero(i, -1)} disabled={i === 0} aria-label="앞으로">
                  ←
                </button>
                <button type="button" className={ctrlBtn} onClick={() => moveHero(i, 1)} disabled={i === hero.length - 1} aria-label="뒤로">
                  →
                </button>
                <button type="button" className={cn(ctrlBtn, "bg-red-600/80 hover:bg-red-600")} onClick={() => removeHero(i)}>
                  삭제
                </button>
              </div>
            </div>
          ))}
          <div className="aspect-[1512/620]">
            <ImageUpload folder="hero" onChange={addHero} />
          </div>
        </div>
      </section>

      {/* Featured portfolio */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg max-[500px]:text-[0.9375rem] font-bold">전시 제품 (홈 포트폴리오 섹션)</h2>
        <p className="mb-5 mt-1 text-sm text-muted">
          홈 &quot;포트폴리오&quot; 섹션에 노출할 제품을 선택하세요. 선택한 순서(번호)대로
          최대 9개까지 표시됩니다. 아무것도 선택하지 않으면 최신 9개가 표시됩니다.
          {featured.length > 0 && ` — 현재 ${featured.length}개 선택`}
        </p>
        {portfolio.length === 0 ? (
          <p className="text-sm text-muted">등록된 포트폴리오가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {portfolio.map((p) => {
              const idx = featured.indexOf(p.itemNo);
              const checked = idx >= 0;
              return (
                <button
                  type="button"
                  key={p.itemNo}
                  onClick={() => toggleFeatured(p.itemNo)}
                  className={cn(
                    "overflow-hidden rounded-lg border-2 bg-white text-left transition-colors",
                    checked ? "border-brand" : "border-line hover:border-brand/40",
                  )}
                >
                  <div className="relative aspect-square bg-[#F3F4F6]">
                    {p.thumbnail && (
                      <Image src={p.thumbnail} alt="" fill className="object-cover" />
                    )}
                    {checked && (
                      <span className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                        {idx + 1}
                      </span>
                    )}
                  </div>
                  <p className="truncate px-2 py-2 text-xs font-medium">{p.name}</p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-[0.625rem] bg-brand px-6 py-3 text-[1rem] font-bold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {saving ? "저장 중…" : "저장"}
        </button>
      </div>
    </div>
  );
}
