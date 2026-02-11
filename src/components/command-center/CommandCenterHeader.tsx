import { CC_COLORS, CC_FONTS, CC_TYPOGRAPHY } from "@/config/command-center";
import { OwlAvatar, OwlLogo } from "./OwlIcon";
import { StatusDot } from "./StatusDot";

export function CommandCenterHeader() {
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
					<StatusDot color={CC_COLORS.success} label="469 tests" />
					<StatusDot color={CC_COLORS.info} label="Prod live" />
					<StatusDot color={CC_COLORS.warning} label="Day 1/5" />
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
