import { Suspense } from "react";
import { QuoteForm } from "@/components/quote/QuoteForm";

export default function QuotePage() {
  return (
    <div className="bg-cream/40 pt-10">
      <Suspense>
        <QuoteForm />
      </Suspense>
    </div>
  );
}
