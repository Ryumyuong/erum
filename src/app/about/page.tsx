import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/PageHeader";
import { Thumb } from "@/components/ui/Thumb";
import { whyIcons } from "@/components/icons";
import { pick } from "@/lib/content";
import { whyUs } from "@/lib/data/home";

const clientTones = [
  "from-neutral-100 to-white",
  "from-amber-50 to-white",
  "from-rose-50 to-white",
  "from-sky-50 to-white",
];

export default function AboutPage() {
  const t = useTranslations("page.about");
  const locale = useLocale();

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      {/* Equipment hero image */}
      <div className="container-page">
        <Thumb tone="from-stone-200 to-neutral-100" ratio="wide" />
      </div>

      {/* Our story */}
      <section className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:py-20">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl">{t("story")}</h2>
          <p className="mt-4 leading-relaxed text-muted">{t("storyBody")}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Thumb tone="from-amber-100 to-orange-50" ratio="video" />
          <Thumb tone="from-neutral-200 to-neutral-50" ratio="video" />
        </div>
      </section>

      {/* Strengths */}
      <section className="bg-cream">
        <div className="container-page py-16 md:py-20">
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">
            {t("strengths")}
          </h2>
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((item) => {
              const Icon = whyIcons[item.icon];
              return (
                <div key={item.icon} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand">
                    {Icon ? <Icon className="h-5 w-5" /> : null}
                  </span>
                  <div>
                    <h3 className="font-semibold">{pick(item.title, locale)}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {pick(item.desc, locale)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Factory & equipment gallery */}
      <section className="container-page py-16 md:py-20">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">{t("gallery")}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {["from-neutral-200 to-neutral-50", "from-stone-200 to-stone-50", "from-zinc-200 to-zinc-50", "from-slate-200 to-slate-50", "from-gray-200 to-gray-50", "from-stone-300 to-stone-100"].map(
            (tone, i) => (
              <Thumb key={i} tone={tone} ratio="video" />
            ),
          )}
        </div>
      </section>

      {/* Clients */}
      <section className="bg-cream">
        <div className="container-page py-16 md:py-20">
          <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
            {t("clients")}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`flex h-20 items-center justify-center rounded-[var(--radius-card)] bg-gradient-to-br ${clientTones[i % clientTones.length]} text-sm font-semibold text-faint`}
              >
                CLIENT
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
