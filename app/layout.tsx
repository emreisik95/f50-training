import type { Metadata, Viewport } from "next";
import { Teko, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const teko = Teko({
  variable: "--font-teko",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "F50 Training | Elite Fitness",
  description: "Elite fitness training with cutting-edge technology. QR check-ins, class bookings, and membership management.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/f50-logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "F50 Training",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0f1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${teko.variable} ${geistMono.variable} antialiased font-sans`}
      >
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
