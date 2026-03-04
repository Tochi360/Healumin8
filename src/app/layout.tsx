import type { Metadata, Viewport } from "next";

import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { basehub } from "basehub";

import { Providers } from "./providers";
import { Header } from "./_components/header";
import { Footer } from "./_components/footer";
import { draftMode } from "next/headers";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  fallback: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Oxygen",
    "Ubuntu",
    "Cantarell",
    "Fira Sans",
    "Droid Sans",
    "Helvetica Neue",
    "sans-serif",
  ],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  fallback: ["monaco", "monospace"],
});

export const generateMetadata = async (): Promise<Metadata> => {
  const data = await basehub({ cache: "no-store", draft: (await draftMode()).isEnabled }).query({
    site: {
      settings: {
        metadata: {
          sitename: true,
          titleTemplate: true,
          defaultTitle: true,
          defaultDescription: true,
          favicon: {
            url: true,
            mimeType: true,
          },
          ogImage: {
            url: true,
          },
          xAccount: {
            url: true,
          },
        },
      },
    },
  });

  const images = [{ url: data.site.settings.metadata.ogImage?.url ?? "" }].filter(
    (i) => i.url,
  );
  let xAccount: string | undefined = undefined;
  if (data.site.settings.metadata.xAccount?.url) {
    try {
      const xUrl = new URL(data.site.settings.metadata.xAccount.url);
      const split = xUrl.pathname.split("/");
      xAccount = split[split.length - 1];
    } catch {
      // invalid url noop
    }
  }

  const siteName = "Healumin8";
  const defaultTitle =
    "Healumin8 – Modernizing Primary Healthcare Infrastructure in Africa";
  const defaultDescription =
    "Healumin8 digitizes patient records, connects fragmented hospital systems, and builds AI-ready healthcare infrastructure for emerging markets.";

  return {
    title: {
      default: defaultTitle,
      template: "%s – Healumin8",
    },
    applicationName: siteName,
    description: defaultDescription,
    icons: [
      {
        url: "/favicon.png",
        rel: "icon",
        type: "image/png",
      },
    ],
    openGraph: {
      type: "website",
      images: images.length ? images : undefined,
      siteName,
      title: defaultTitle,
      description: defaultDescription,
    },
    twitter: {
      card: "summary_large_image",
      images: images.length ? images : undefined,
      site: siteName,
      creator: xAccount ?? "Healumin8",
    },
  };
};

export const viewport: Viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`min-h-svh max-w-[100vw] bg-surface-primary text-text-primary dark:bg-dark-surface-primary dark:text-dark-text-primary ${geistMono.variable} ${geist.variable} font-sans`}
      >
        <Providers>
          <Header />
          <main className="min-h-[calc(100svh-var(--header-height))]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
