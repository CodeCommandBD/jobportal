import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import ResponsiveNav from "@/Components/Home/Navbar/ResponsiveNav";
import Provider from "@/Components/HOC/Provider";
import Footer from "@/Components/Home/Footer/Footer";
import ScrollToTheTop from "@/Components/helpers/ScrollToTheTop";
import StoreProvider from "@/providers/StoreProvider";
import TanstackProvider from "@/providers/TanstackProvider";
import AuthProvider from "@/providers/AuthProvider";
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

export const metadata: Metadata = {
  title: "Job portal | Landing page",
  description: "Job portal Landing page next js 15",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body className={`${font.className} antialiased`}>
        <StoreProvider>
          <TanstackProvider>
            <AuthProvider>
              <Provider>
                <ResponsiveNav />
                {children}
                <Footer />
                <ScrollToTheTop />
              </Provider>
            </AuthProvider>
          </TanstackProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
