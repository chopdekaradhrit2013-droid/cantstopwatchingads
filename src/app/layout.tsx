import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { StoreProvider } from "@/lib/store";
import { LiveProvider } from "@/lib/live";
import { AuthGateProvider } from "@/components/AuthGate";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import GradualBlur from "@/components/GradualBlur";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
export const metadata: Metadata = {
  title: "CAN'T STOP WATCHING ADS",
  description: "Watch the world advertise.",
  metadataBase: new URL("https://cantstopwatchingads.vercel.app"),
  openGraph: {
    title: "CAN'T STOP WATCHING ADS",
    description: "Watch the world advertise.",
    siteName: "CAN'T STOP WATCHING ADS",
  },
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <StoreProvider>
          <LiveProvider>
            <AuthGateProvider>
              <AnnouncementBar />
              <Header />
              <main className="mx-auto min-h-[calc(100vh-64px)] max-w-6xl px-4 py-8">{children}</main>
              <footer className="relative z-10 px-4 py-6 text-center text-xs text-neutral-500">
                CAN'T STOP WATCHING ADS · CSWA-78956
              </footer>
              <GradualBlur target="page" position="bottom" height="5rem" strength={2} divCount={4} curve="bezier" exponential opacity={1} />
            </AuthGateProvider>
          </LiveProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
