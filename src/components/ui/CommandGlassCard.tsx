"use client";

import type { ReactNode } from "react";
import { CC_COLORS } from "@/config/command-center";

interface CommandGlassCardProps {
	children: ReactNode;
	hover?: boolean;
	style?: React.CSSProperties;
}

export function CommandGlassCard({
	children,
	hover = true,
	style = {},
}: CommandGlassCardProps) {
	return (
		<div
			className={hover ? "cc-glass-card" : undefined}
			style={{
				background: CC_COLORS.surface,
				border: `1px solid ${CC_COLORS.border}`,
				borderRadius: 12,
				transition: "all 0.3s ease",
				boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
				...style,
			}}
		>
			{children}
		</div>
	);
}
