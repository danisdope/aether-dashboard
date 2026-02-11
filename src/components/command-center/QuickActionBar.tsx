"use client";

import { useState } from "react";
import { CC_COLORS, CC_FONTS } from "@/config/command-center";

// Real links for each action
const QUICK_ACTIONS = [
	{ 
		icon: "📚", 
		label: "Vault", 
		href: "obsidian://open?vault=Aetherion%20Vault",
		description: "Open Aetherion Vault in Obsidian"
	},
	{ 
		icon: "🧪", 
		label: "Tests", 
		href: "https://github.com/danisdope/aetherion-edu-os/actions",
		description: "View test results in GitHub Actions"
	},
	{ 
		icon: "📦", 
		label: "GitHub", 
		href: "https://github.com/danisdope/aetherion-edu-os",
		description: "Main codebase repository"
	},
	{ 
		icon: "🚀", 
		label: "Production", 
		href: "https://aetherion-core.vercel.app",
		description: "Live booking agent"
	},
	{ 
		icon: "🗄️", 
		label: "Supabase", 
		href: "https://supabase.com/dashboard/project/wftlfuswumcqceidhrpf",
		description: "Database & auth"
	},
	{ 
		icon: "📊", 
		label: "Langfuse", 
		href: "https://cloud.langfuse.com",
		description: "AI observability & traces"
	},
	{ 
		icon: "▲", 
		label: "Vercel", 
		href: "https://vercel.com/aetherion1",
		description: "Deployments & hosting"
	},
];

function QuickActionPill({ icon, label, href, description }: { 
	icon: string; 
	label: string; 
	href: string;
	description: string;
}) {
	const [hovered, setHovered] = useState(false);

	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			title={description}
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
				textDecoration: "none",
			}}
		>
			<span style={{ fontSize: 13 }}>{icon}</span>
			{label}
		</a>
	);
}

export function QuickActionBar() {
	return (
		<div style={{ padding: "20px 0 0" }}>
			<div style={{ 
				display: "flex", 
				alignItems: "center", 
				justifyContent: "space-between",
				marginBottom: 10,
			}}>
				<span style={{ 
					fontFamily: CC_FONTS.dmSans, 
					fontSize: 12, 
					color: CC_COLORS.textMuted,
					textTransform: "uppercase",
					letterSpacing: "0.05em",
				}}>
					Quick Links
				</span>
			</div>
			<div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
				{QUICK_ACTIONS.map((action) => (
					<QuickActionPill key={action.label} {...action} />
				))}
			</div>
		</div>
	);
}
