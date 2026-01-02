import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skillytics - AI/ML Mission-Based Learning",
  description: "Master AI/ML by fixing, building, training, debugging, and deploying models in real scenarios. No videos. No lectures. Only missions.",
  keywords: ["Skillytics", "AI", "ML", "Machine Learning", "Education", "Missions", "Coding", "Data Science", "Python"],
  authors: [{ name: "Skillytics Team" }],
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Skillytics",
  },
  openGraph: {
    title: "Skillytics - AI/ML Mission-Based Learning",
    description: "Master AI/ML by doing real missions, not watching videos. Build practical skills through hands-on problem solving.",
    url: "https://skillytics.com",
    siteName: "Skillytics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skillytics - AI/ML Mission-Based Learning",
    description: "Master AI/ML by doing real missions, not watching videos.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
