"use client";

import { useState } from "react";
import { CC_COLORS, CC_FONTS, type QuickAction } from "@/config/command-center";

function QuickActionPill({ icon, label }: QuickAction) {
	const [hovered, setHovered] = useState(false);

	return (
		<button
			type="button"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			style={{
				background: hovered ? CC_COLORS.elevated : "transparent",
				border: `1px solid ${hovered ? CC_COLORS.borderHover : CC_COLORS.border}`,
				borderRadius: 8,
				padding: "8px 14px",
				color: hovered ? CC_COLORS.textPrimary : CC_COLORS.textSecondary,
				fontFamily: CC_FONTS.dmSans,
				fontSize: 13,
				fontWeight: 500,
				cursor: "pointer",
				transition: "all 0.2s ease",
				display: "flex",
				alignItems: "center",
				gap: 6,
				whiteSpace: "nowrap",
			}}
		>
			<span style={{ fontSize: 13 }}>{icon}</span>
			{label}
		</button>
	);
}

interface QuickActionBarProps {
	actions: QuickAction[];
}

export function QuickActionBar({ actions }: QuickActionBarProps) {
	return (
		<div style={{ padding: "20px 0 0" }}>
			<div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
				{actions.map((action) => (
					<QuickActionPill key={action.label} {...action} />
				))}
			</div>
		</div>
	);
}
