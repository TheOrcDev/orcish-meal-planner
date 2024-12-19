import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Footer, Header } from "@/components/ui";

const inter = Inter({ subsets: ["latin"] });

import { ThemeProvider, TRPCProvider } from "@/components/providers";
import { Toaster } from "@/components/ui";

export const metadata: Metadata = {
  title: "Orcish Meal Planner",
  description:
    "Your personal chef & nutritionist. Transform your eating habits.",
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
          <TRPCProvider>
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
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
