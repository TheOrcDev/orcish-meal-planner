import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Footer, Header } from "@/components/ui";

const inter = Inter({ subsets: ["latin"] });

import { ThemeProvider } from "@/components/providers";
import { Toaster } from "@/components/ui";

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
    <ClerkProvider>
      <html suppressHydrationWarning lang="en">
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Footer />
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
