import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyQuoteBar } from "@/components/StickyQuoteBar";
import { Chrome } from "@/components/Chrome";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BOXDLE — Custom Packaging Manufacturer",
    template: "%s · BOXDLE",
  },
  description:
    "Premium custom packaging for bakery, cafe, dessert and food brands. Made to be remembered.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <Chrome
            header={<Header />}
            footer={<Footer />}
            sticky={<StickyQuoteBar />}
          >
            {children}
          </Chrome>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
