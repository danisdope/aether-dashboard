"use client";

import { useState } from "react";
import { CC_COLORS, CC_FONTS } from "@/config/command-center";

const TABS = ["Today", "This Week", "Tests", "Tasks", "Roadmap", "Activity"];

export function TabNavigation() {
	const [activeTab, setActiveTab] = useState("Today");

	return (
		<>
			<div style={{ display: "flex", gap: 2, padding: "16px 0 0" }}>
				{TABS.map((tab) => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						type="button"
						style={{
							fontFamily: CC_FONTS.dmSans,
							fontSize: 13,
							fontWeight: activeTab === tab ? 600 : 400,
							padding: "8px 14px",
							borderRadius: 6,
							border: "none",
							cursor: "pointer",
							background:
								activeTab === tab ? CC_COLORS.elevated : "transparent",
							color:
								activeTab === tab
									? CC_COLORS.textPrimary
									: CC_COLORS.textTertiary,
							transition: "all 0.2s ease",
						}}
					>
						{tab}
					</button>
				))}
			</div>
			<div
				style={{
					height: 1,
					background: CC_COLORS.border,
					margin: "8px 0 0",
				}}
			/>
		</>
	);
}
