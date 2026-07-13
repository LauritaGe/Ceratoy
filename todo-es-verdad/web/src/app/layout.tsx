import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Todo es verdad",
    template: "%s · Todo es verdad",
  },
  description:
    "Canal de noticias ficticias generadas con IA. Donde todo es verdad, nada lo es.",
  openGraph: {
    title: "Todo es verdad",
    description: "Noticias alternativas del pasado, presentadas como hechos verificados.",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
