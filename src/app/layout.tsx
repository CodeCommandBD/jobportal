import '@/lib/polyfill';
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/Components/helpers/LayoutWrapper";
import Provider from "@/Components/HOC/Provider";
import StoreProvider from "@/providers/StoreProvider";
import TanstackProvider from "@/providers/TanstackProvider";
import AuthProvider from "@/providers/AuthProvider";
import { Toaster } from 'react-hot-toast';

const font = Roboto({
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
  subsets: ["latin"],
});

import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";

export async function generateMetadata(): Promise<Metadata> {
  await dbConnect();
  const settings = await Settings.findOne();

  return {
    title: settings?.siteName || "Job Portal",
    description: settings?.siteDescription || "Find your dream job",
    keywords: settings?.metaKeywords || "jobs, tech, hire",
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} antialiased`}>
        <StoreProvider>
          <TanstackProvider>
            <AuthProvider>
              <Provider>
                <LayoutWrapper>
                  <Toaster />
                  {children}
                </LayoutWrapper>
              </Provider>
            </AuthProvider>
          </TanstackProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
