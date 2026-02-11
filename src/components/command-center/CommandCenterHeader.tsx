'use client';

import { CC_COLORS, CC_FONTS, CC_TYPOGRAPHY } from "@/config/command-center";
import { OwlAvatar, OwlLogo } from "./OwlIcon";
import { StatusDot } from "./StatusDot";

interface HeaderProps {
	testCount?: number;
	allPassing?: boolean;
	prodLive?: boolean;
	workDay?: string;
}

export function CommandCenterHeader({ 
	testCount = 469, 
	allPassing = true,
	prodLive = true,
	workDay = "Day 1/5"
}: HeaderProps) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "24px 0 0",
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
				<OwlLogo size={26} />
				<span
					style={{
						...CC_TYPOGRAPHY.heading,
						fontSize: 17,
						color: CC_COLORS.textPrimary,
					}}
				>
					Aetherion
				</span>
				<span
					style={{
						fontFamily: CC_FONTS.dmSans,
						fontSize: 12,
						color: CC_COLORS.textMuted,
						fontWeight: 400,
						marginLeft: 2,
					}}
				>
					Command Center
				</span>
			</div>

			<div style={{ display: "flex", alignItems: "center", gap: 16 }}>
				<div style={{ display: "flex", alignItems: "center", gap: 14 }}>
					<StatusDot 
						color={allPassing ? CC_COLORS.success : CC_COLORS.warning} 
						label={`${testCount} tests`} 
					/>
					<StatusDot 
						color={prodLive ? CC_COLORS.info : CC_COLORS.danger} 
						label={prodLive ? "Prod live" : "Prod down"} 
					/>
					<StatusDot 
						color={CC_COLORS.warning} 
						label={workDay} 
					/>
				</div>
				<div
					style={{
						width: 1,
						height: 20,
						background: CC_COLORS.border,
						margin: "0 4px",
					}}
				/>
				<OwlAvatar size={34} />
			</div>
		</div>
	);
}
