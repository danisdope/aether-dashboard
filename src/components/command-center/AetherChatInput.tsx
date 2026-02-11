"use client";

import { useState } from "react";
import { CC_COLORS, CC_FONTS } from "@/config/command-center";
import { OwlMini } from "./OwlIcon";

export function AetherChatInput() {
	const [focused, setFocused] = useState(false);

	return (
		<div style={{ padding: "20px 0 0" }}>
			<button
				type="button"
				onClick={() => setFocused(!focused)}
				style={{
					background: CC_COLORS.surface,
					border: `1px solid ${focused ? "rgba(167,139,250,0.15)" : CC_COLORS.border}`,
					borderRadius: 12,
					width: "100%",
					textAlign: "left",
					padding: "14px 20px",
					cursor: "text",
					transition: "all 0.35s ease",
					boxShadow: focused ? "0 0 30px rgba(167,139,250,0.04)" : "none",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 10,
						}}
					>
						<OwlMini />
						<span
							style={{
								fontFamily: CC_FONTS.dmSans,
								fontSize: 14,
								color: CC_COLORS.textMuted,
							}}
						>
							Message Aether...
						</span>
					</div>
					<span
						style={{
							fontFamily: CC_FONTS.jetbrains,
							fontSize: 11,
							color: CC_COLORS.textMuted,
							background: CC_COLORS.elevated,
							padding: "2px 8px",
							borderRadius: 4,
						}}
					>
						⌘K
					</span>
				</div>
			</button>
		</div>
	);
}
