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

// Política de seguridad de contenido. GitHub Pages no deja poner cabeceras, así que va
// en una <meta> (por eso no lleva frame-ancestors, que en <meta> se ignora).
// connect-src 'self' es lo que hace cumplir lo que dice la web: el texto del revisor
// no puede salir a ningún otro sitio aunque alguien cuele un script.
// 'unsafe-inline' en scripts hace falta porque la exportación estática de Next mete
// scripts en línea y sin servidor no hay nonce posible. En desarrollo no se aplica:
// next dev necesita eval.
const origen = (url?: string) => {
  try {
    return url ? new URL(url).origin : "";
  } catch {
    return "";
  }
};
const MEDIOS = [origen(process.env.NEXT_PUBLIC_ASSET_BASE), origen(process.env.NEXT_PUBLIC_VIDEO_BASE)]
  .filter(Boolean)
  .join(" ");
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${MEDIOS}`.trim(),
  `media-src 'self' ${MEDIOS}`.trim(),
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "upgrade-insecure-requests",
].join("; ");
const CON_CSP = process.env.NODE_ENV === "production";

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
      <head>
        {CON_CSP && <meta httpEquiv="Content-Security-Policy" content={CSP} />}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body>{children}</body>
    </html>
  );
}
