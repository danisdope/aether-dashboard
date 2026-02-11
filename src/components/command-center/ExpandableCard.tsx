"use client";

import { useState, type ReactNode } from "react";
import { CC_COLORS, CC_FONTS } from "@/config/command-center";

interface ExpandableCardProps {
	title: string;
	subtitle?: string;
	children: ReactNode;
	defaultExpanded?: boolean;
}

export function ExpandableCard({ 
	title, 
	subtitle, 
	children, 
	defaultExpanded = false 
}: ExpandableCardProps) {
	const [expanded, setExpanded] = useState(defaultExpanded);

	return (
		<div style={{
			background: CC_COLORS.surface,
			border: `1px solid ${CC_COLORS.border}`,
			borderRadius: 12,
			overflow: "hidden",
			transition: "all 0.2s ease",
		}}>
			{/* Header - always visible */}
			<button
				onClick={() => setExpanded(!expanded)}
				style={{
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "16px 18px",
					background: "transparent",
					border: "none",
					cursor: "pointer",
					textAlign: "left",
				}}
			>
				<div>
					<p style={{
						fontSize: 15,
						fontWeight: 600,
						color: CC_COLORS.textPrimary,
						fontFamily: CC_FONTS.dmSans,
					}}>
						{title}
					</p>
					{subtitle && (
						<p style={{
							fontSize: 12,
							color: CC_COLORS.textMuted,
							marginTop: 2,
						}}>
							{subtitle}
						</p>
					)}
				</div>
				<div style={{
					width: 24,
					height: 24,
					borderRadius: 6,
					background: CC_COLORS.elevated,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					transition: "transform 0.2s ease",
					transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
				}}>
					<svg 
						width="12" 
						height="12" 
						viewBox="0 0 24 24" 
						fill="none" 
						stroke={CC_COLORS.textMuted}
						strokeWidth="2"
					>
						<path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</div>
			</button>

			{/* Content - collapsible */}
			{expanded && (
				<div style={{
					padding: "0 18px 18px",
					borderTop: `1px solid ${CC_COLORS.border}`,
				}}>
					{children}
				</div>
			)}
		</div>
	);
}
