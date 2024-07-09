"use client";

import { Inter } from "next/font/google";

import AuroraBackground from "@/components/atoms/aurora-background";
import { Toaster } from "@/components/atoms/sonner";
import Header from "@/components/organisms/header";
import RootProvider from "@/providers";
import { cn } from "@/utils";

const inter = Inter({ subsets: ["latin"], preload: true });

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        <main className="flex w-screen">
          <RootProvider>
            <AuroraBackground className="flex flex-col gap-2 w-full">
              <Header />
              {children}
            </AuroraBackground>
          </RootProvider>
        </main>
        <Toaster />
      </body>
    </html>
  );
};

export default LayoutWrapper;
