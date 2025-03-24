import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CommonLayout from "@/components/common-layout";
import { Suspense } from "react";
import Loading from "./loading";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: "GIHU JOBS",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
      <body
        className={`${geistSans.variable} bg-gradient-to-br from-gray-300 to-blue-600 ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<Loading />}>
          <CommonLayout children={children} />
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
