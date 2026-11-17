import type { Metadata } from "next";
import "./globals.css";

const TITLE = "TEXTOneitor — Textos que no huelan a IA";
const DESCRIPTION =
  "Le das un texto y te dice qué suena a máquina y por qué. Sin IA por dentro y sin salir a internet.";

// LinkedIn, WhatsApp y X necesitan la URL completa de la imagen de vista previa.
// La base sale del mismo NEXT_PUBLIC_BASE_PATH que usa next.config.ts, así que
// si el repo se renombra la URL se ajusta sola.
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://josulo72.github.io";
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const URL_WEB = `${SITE}${BASE}/`;
const OG_IMAGE = {
  url: `${SITE}${BASE}/og.png`,
  width: 1200,
  height: 630,
  alt: "TEXTOneitor: textos que no huelan a IA. 38 reglas, sin IA por dentro.",
};

export const metadata: Metadata = {
  metadataBase: new URL(URL_WEB),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "TEXTOneitor",
    url: URL_WEB,
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
