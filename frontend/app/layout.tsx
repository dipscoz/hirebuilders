import "./globals.css";

import type {
  Metadata,
  Viewport,
} from "next";

export const metadata: Metadata = {
  title: "HireBuilders",
  description:
    "Plateforme de mise en relation avec des professionnels du BTP au Sénégal.",

  applicationName:
    "HireBuilders",

  manifest:
    "/site.webmanifest",

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
        url: "/favicon-96x96.png",
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

  appleWebApp: {
    title:
      "HireBuilders",

    capable: true,

    statusBarStyle:
      "black-translucent",
  },
};

export const viewport: Viewport = {
  width:
    "device-width",

  initialScale: 1,

  maximumScale: 1,

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
        {children}
      </body>
    </html>
  );
}