import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppNav from "@/components/nav/AppNav";
import QuickAdd from "@/components/quick-add/QuickAdd";
import { getActiveCategories } from "@/lib/data/categories";

// Every screen shows live data from the local database, so opt the whole app
// out of build-time prerendering and render on each request instead.
export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Penny",
  description: "A calm little budget and spending tracker",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetched here (a server component) so the quick-add sheet is instantly
  // available on every page without its own loading state.
  const categories = await getActiveCategories();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppNav />
        {/* bottom padding clears the mobile tab bar; left padding clears the sidebar */}
        <main className="pb-28 md:pb-12 md:pl-60">{children}</main>
        <QuickAdd categories={categories} />
      </body>
    </html>
  );
}
