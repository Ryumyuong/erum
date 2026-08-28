import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingQuote } from "@/components/FloatingQuote";
import { Chrome } from "@/components/Chrome";
import { ZoomLock } from "@/components/ZoomLock";
import { StructuredData } from "@/components/StructuredData";
import { getContact } from "@/lib/contact";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Primary UI font — Pretendard (covers Latin + Korean). Self-hosted variable font.
const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "100 900",
});

const SITE_NAME = "BOXDLE";
const SITE_TITLE = "BOXDLE — Custom Packaging Manufacturer";
const SITE_DESCRIPTION =
  "Premium custom packaging for bakery, cafe, dessert and food brands. Made to be remembered.";

// Absolute URLs are required for og:image — crawlers cannot resolve relative paths.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_TITLE,
    template: "%s · BOXDLE",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    // "summary" → small square thumbnail beside the text, not a full-width banner.
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const contact = await getContact();

  return (
    <html
      lang={locale}
      className={`${pretendard.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <StructuredData contact={contact} locale={locale} />
        <ZoomLock />
        <NextIntlClientProvider>
          <Chrome
            header={<Header />}
            footer={<Footer contact={contact} />}
            sticky={<FloatingQuote />}
          >
            {children}
          </Chrome>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
