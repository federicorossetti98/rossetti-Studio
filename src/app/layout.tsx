import type { Metadata, Viewport } from "next";
import { Inter_Tight, Instrument_Serif } from "next/font/google";
import { estudio } from "@/content/site";
import { Encabezado, Pie } from "@/components/Encabezado";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: `${estudio.nombre} — Diseño, Audiovisual, Fotografía y Publicidad`,
  description: estudio.descripcion,
  openGraph: {
    title: estudio.nombre,
    description: estudio.lema,
    type: "website",
    locale: "es_AR",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f2ee",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${interTight.variable} ${instrumentSerif.variable} antialiased`}>
      <body className="min-h-dvh bg-paper font-sans text-ink">
        <Encabezado />
        {children}
        <Pie />
      </body>
    </html>
  );
}
