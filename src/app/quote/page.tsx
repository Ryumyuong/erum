import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { getLocale } from "next-intl/server";
import { Suspense } from "react";
import { QuoteForm } from "@/components/quote/QuoteForm";
import { CATEGORY_OPTIONS, HEAR_OPTIONS } from "@/lib/quote-options";
import { QuoteTypeChooser } from "@/components/quote/QuoteTypeChooser";
import {
  getGuideTaxonomy,
  getQuoteFormOptions,
  getPortfolio,
  getQuoteOptions,
} from "@/lib/db/queries";

export async function generateMetadata(): Promise<Metadata> {
  const ko = (await getLocale()) === "ko";
  return pageMeta({
    title: ko ? "견적 문의하기" : "Request a Quote",
    description: ko
      ? "제품 정보와 수량만 알려주시면 맞춤 패키지 견적을 보내드립니다. 전문 용어를 몰라도 추천받을 수 있습니다."
      : "Tell us the product and quantity and we'll send a custom packaging quote — no jargon required.",
    path: "/quote",
  });
}

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const type = one(sp.type);
  const mode = one(sp.mode);
  const item = one(sp.item);

  // No type picked yet → show the chooser. `?mode=` is the pre-existing deep
  // link into a form, so it counts as a choice.
  const chooseFirst = !type && !mode;
  const itemQuery = item ? `&item=${encodeURIComponent(item)}` : "";

  return (
    <div className="bg-[#F4F4F4]">
      {chooseFirst ? (
        <div className="pt-16 desktop:pt-22">
          <QuoteTypeChooser itemQuery={itemQuery} />
        </div>
      ) : (
        <div className="pt-16 desktop:pt-44">
          <Suspense>
            <QuoteFormSection />
          </Suspense>
        </div>
      )}
    </div>
  );
}

async function QuoteFormSection() {
  const [taxonomy, options, portfolio, quoteOptions] = await Promise.all([
    getGuideTaxonomy(),
    getQuoteFormOptions({
      category: CATEGORY_OPTIONS,
      hearAbout: HEAR_OPTIONS,
    }),
    getPortfolio(),
    getQuoteOptions(),
  ]);

  return (
    <QuoteForm
      taxonomy={taxonomy}
      categoryOptions={options.category}
      hearOptions={options.hearAbout}
      // Saved references are stored as item numbers only; the form needs
      // this to show each one as a product card.
      refProducts={portfolio.map((p) => ({
        itemNo: p.itemNo,
        name: p.name,
        thumbnail: p.thumbnail,
      }))}
      materialOptions={Object.fromEntries(
        Object.entries(quoteOptions)
          .filter(([g]) => g.startsWith("material"))
          .map(([g, list]) => [
            g,
            list.map((o) => ({
              id: o.id,
              label: o.label,
              desc: o.desc,
              image: o.image,
              kind: o.kind,
            })),
          ]),
      )}
      specOptions={Object.fromEntries(
        Object.entries(quoteOptions)
          .filter(([g]) => ["accessoryNeeded","printNeeded","printColorsOpp","printColorsPoly","printColorsDefault","printSpot","finishHandle","finishCoating","finishSpecialCoating","finishFoil","finishEmboss","finishDiecut"].includes(g))
          .map(([g, list]) => [
            g,
            list.map((o) => ({
              id: o.id,
              label: o.label,
              desc: o.desc,
              image: o.image,
              kind: o.kind,
            })),
          ]),
      )}
      packageOptions={(quoteOptions.packageType ?? []).map((o) => ({
        id: o.id,
        tab: o.tab ?? "",
        label: o.label,
        desc: o.desc,
        image: o.image,
        kind: o.kind,
      }))}
      sectionTips={Object.fromEntries(
        (quoteOptions.sectionTip ?? [])
          .filter((o) => o.desc.ko || o.desc.en)
          .map((o) => [o.id, o.desc]),
      )}
      tabNotes={Object.fromEntries(
        (quoteOptions.packageTab ?? [])
          .filter((o) => o.desc.ko || o.desc.en)
          .map((o) => [o.id, o.desc]),
      )}
    />
  );
}
