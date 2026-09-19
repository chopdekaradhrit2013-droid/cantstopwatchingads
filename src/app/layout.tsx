import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";
import { StoreProvider } from "@/lib/store";
import { LiveProvider } from "@/lib/live";
import { AuthGateProvider } from "@/components/AuthGate";
import GradualBlur from "@/components/GradualBlur";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CAN’T STOP WATCHING ADS",
  description: "Discover the ads you actually want to watch.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <StoreProvider>
          <LiveProvider>
            <AuthGateProvider>
              <div style={{ position: "relative", minHeight: "100vh" }}>
                <SiteNav />
                <main className="mx-auto min-h-[calc(100vh-64px)] max-w-6xl px-4 pb-28 pt-28">{children}</main>
                <GradualBlur target="page" position="bottom" height="6rem" strength={2} divCount={5} curve="bezier" exponential opacity={1} />
              </div>
            </AuthGateProvider>
          </LiveProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
