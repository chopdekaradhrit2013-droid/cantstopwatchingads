import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { StoreProvider } from "@/lib/store";
import { LiveProvider } from "@/lib/live";
import { AuthGateProvider } from "@/components/AuthGate";
import { AnnouncementBar } from "@/components/AnnouncementBar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
export const metadata: Metadata = {
  title: "CAN'T STOP WATCHING ADS",
  description: "Discover the ads you actually want to watch.",
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
            </AuthGateProvider>
          </LiveProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
