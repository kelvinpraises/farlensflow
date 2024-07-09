import type { Metadata } from "next";

import LayoutWrapper from "@/components/template/layout-wrapper";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://farlensflow.vercel.app/"),
  title: "Farlensflow",
  icons: "/farlensflow.png",
  description: "",
  openGraph: {
    images: "", //TODO:
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
