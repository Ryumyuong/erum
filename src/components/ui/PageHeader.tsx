import { Fragment } from "react";

export function PageHeader({
  title,
  subtitle,
  subtitleSize = "text-[min(3.4vw,14px)] max-[500px]:text-[min(2.913vw,12.23px)] desktop:text-[1rem]",
}: {
  title: string;
  subtitle?: string;
  /** Font-size classes for the subtitle (mobile vw + desktop). Override per page. */
  subtitleSize?: string;
}) {
  return (
    <div className="container-page pt-8 pb-4 desktop:pt-22 desktop:pb-8">
      <h1 className="text-[min(7.767vw,32px)] max-[500px]:text-[min(6.553vw,27.53px)] desktop:text-[2.25rem] font-bold text-[#101828]">{title}</h1>
      {subtitle && (
        <p className={`max-w-2xl ${subtitleSize} leading-relaxed text-black/70`}>
          {subtitle.split("|").map((line, i, arr) => (
            <Fragment key={i}>
              {line}
              {i < arr.length - 1 && (
                  <>
                    <br className="desktop:hidden" />
                    <span className="hidden desktop:inline"> </span>
                  </>
                )}
            </Fragment>
          ))}
        </p>
      )}
    </div>
  );
}
