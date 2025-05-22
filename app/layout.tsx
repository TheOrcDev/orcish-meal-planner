import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import { ThemeProvider } from "@/components/providers";
import { ScreenSize } from "@/components/ui/screen-size";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  title: "AI Meal Planner - Plan your meals with AI",
  description:
    "Your personal chef & nutritionist. Transform your eating habits. Get your meal plan in seconds.",
  openGraph: {
    images: "/images/healthy-food.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          {process.env.APP_ENV === "development" && <ScreenSize />}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
