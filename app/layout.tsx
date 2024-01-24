import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import Disclaimer from "./_components/Disclaimer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DXdao archives",
  description:
    "An archive of DXdao's proposals, forum and videos - by The Internet Community Company",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center pt-16 max-w-4xl mx-auto">
          <Header />
          {children}

          <Disclaimer />
        </main>
      </body>
    </html>
  );
}
