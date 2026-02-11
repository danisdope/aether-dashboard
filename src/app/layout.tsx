import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
	subsets: ["latin"],
	variable: "--font-outfit",
	display: "swap",
});

const dmSans = DM_Sans({
	subsets: ["latin"],
	variable: "--font-dm-sans",
	display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-jetbrains",
	display: "swap",
});

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
		<html
			lang="en"
			className={`${outfit.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
		>
			<body className="antialiased">{children}</body>
		</html>
	);
}
