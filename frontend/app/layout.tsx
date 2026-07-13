import "./globals.css";

export const metadata = {
  title: "HireBuilders",
  description: "Location d'employés qualifiés au Sénégal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}