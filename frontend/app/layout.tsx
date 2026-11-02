import "./globals.css";
import Link from "next/link";

import type {
  Metadata,
  Viewport,
} from "next";

const BASE_URL =
  "https://hirebuilders-tn8k.vercel.app";

export const metadata: Metadata = {
  metadataBase:
    new URL(BASE_URL),

  title: {
    default:
      "HireBuilders — Professionnels du BTP à Dakar",

    template:
      "%s | HireBuilders",
  },

  description:
    "Découvrez les métiers du BTP à Dakar. Les inscriptions et demandes HireBuilders sont temporairement suspendues pendant la préparation du service.",

  keywords: [
    "HireBuilders",
    "professionnels du BTP",
    "métiers du bâtiment",
    "maçons",
    "électriciens",
    "plombiers",
    "réservation professionnel BTP",
    "BTP Dakar",
  ],

  applicationName:
    "HireBuilders",

  manifest:
    "/site.webmanifest",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview":
        "large",
      "max-snippet":
        -1,
      "max-video-preview":
        -1,
    },
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },

      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },

      {
        url:
          "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
    ],

    shortcut:
      "/favicon.ico",

    apple: [
      {
        url:
          "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  openGraph: {
    type: "website",

    locale:
      "fr_SN",

    url:
      BASE_URL,

    siteName:
      "HireBuilders",

    title:
      "HireBuilders — Professionnels du BTP à Dakar",

    description:
      "Découvrez les métiers du BTP à Dakar. Les demandes HireBuilders sont temporairement suspendues pendant la préparation du service.",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "HireBuilders — Professionnels du BTP à Dakar",

    description:
      "Découvrez les métiers du BTP à Dakar. Les demandes HireBuilders sont temporairement suspendues pendant la préparation du service.",
  },

  appleWebApp: {
    title:
      "HireBuilders",

    capable:
      true,

    statusBarStyle:
      "black-translucent",
  },
};

export const viewport: Viewport = {
  width:
    "device-width",

  initialScale:
    1,

  themeColor:
    "#f59e0b",

  colorScheme:
    "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>

        {/* ================================================
            GOOGLE SEARCH CONSOLE
        ================================================= */}

        <meta
          name="google-site-verification"
          content="dRCaede5F4DeFHK7Jfn-QqDUqbuW5cQYtygZZq5oMhI"
        />

        {/* ================================================
            PWA / MOBILE
        ================================================= */}

        <meta
          name="mobile-web-app-capable"
          content="yes"
        />

        <meta
          name="apple-mobile-web-app-capable"
          content="yes"
        />

        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        <meta
          name="apple-mobile-web-app-title"
          content="HireBuilders"
        />

      </head>

      <body>
        <div className="servicePauseBanner" role="status">
          Les inscriptions et demandes HireBuilders sont temporairement suspendues. <Link href="/service-en-preparation">En savoir plus</Link>
        </div>
        {children}
      </body>
    </html>
  );
}
