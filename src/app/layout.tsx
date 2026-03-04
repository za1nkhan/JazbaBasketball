import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jazba Basketball",
  description: "Jazba Basketball - Premium Basketball Apparel",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isAdmin = pathname.startsWith('/admin');

  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-brand-deep focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:outline-none"
          >
            Skip to main content
          </a>
          {!isAdmin && <Navbar />}
          {children}
          {!isAdmin && <Footer />}
        </Providers>
      </body>
    </html>
  );
}
