import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Hot Seat",
  description: "A jackbox style implementation of the card game Hot Seat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="flex justify-center items-center space-x-2 mt-6">
          <Image src="cards.png" width={64} height={64} alt="cards" />
          <h1 className="text-6xl text-amber-50 font-semibold">Hot Seat</h1>
        </header>
        {children}
      </body>
    </html>
  );
}
