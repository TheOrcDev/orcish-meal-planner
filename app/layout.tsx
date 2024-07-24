import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer, Header } from "@/components/ui";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

import { TRPCProvider, ThemeProvider } from "@/components/providers";

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
            </ThemeProvider>
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
