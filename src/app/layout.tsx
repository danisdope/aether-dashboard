import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aether Dashboard",
  description: "Aether's operational dashboard for Aetherion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
