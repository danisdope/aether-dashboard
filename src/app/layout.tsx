import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aetherion Digital | Command Center",
  description: "Your CEO dashboard for building Aetherion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-950 text-white">
        {children}
      </body>
    </html>
  );
}
