"use client";

import { CC_COLORS, CC_FONTS } from "@/config/command-center";

const TABS = [
	{ id: "today", label: "Today", icon: "📋" },
	{ id: "week", label: "This Week", icon: "📅" },
	{ id: "tests", label: "Tests", icon: "✅" },
	{ id: "tasks", label: "Tasks", icon: "📝" },
	{ id: "roadmap", label: "Roadmap", icon: "🗺️" },
	{ id: "activity", label: "Activity", icon: "📊" },
];

interface TabNavigationProps {
	activeTab: string;
	onTabChange: (tab: string) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
	return (
		<>
			<div style={{ display: "flex", gap: 2, padding: "16px 0 0", overflowX: "auto" }}>
				{TABS.map((tab) => (
					<button
						key={tab.id}
						onClick={() => onTabChange(tab.id)}
						type="button"
						style={{
							fontFamily: CC_FONTS.dmSans,
							fontSize: 13,
							fontWeight: activeTab === tab.id ? 600 : 400,
							padding: "8px 14px",
							borderRadius: 6,
							border: "none",
							cursor: "pointer",
							background:
								activeTab === tab.id ? CC_COLORS.elevated : "transparent",
							color:
								activeTab === tab.id
									? CC_COLORS.textPrimary
									: CC_COLORS.textTertiary,
							transition: "all 0.2s ease",
							display: "flex",
							alignItems: "center",
							gap: 6,
							whiteSpace: "nowrap",
						}}
					>
						<span>{tab.icon}</span>
						{tab.label}
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
