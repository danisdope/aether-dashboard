import { CommandGlassCard } from "@/components/ui/CommandGlassCard";
import {
	CC_COLORS,
	CC_FONTS,
	CC_TYPOGRAPHY,
	type MetricData,
} from "@/config/command-center";

export function MetricCard({ value, label, sublabel, color }: MetricData) {
	return (
		<CommandGlassCard style={{ padding: "16px 20px", flex: 1, minWidth: 140 }}>
			<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
				<div
					style={{
						width: 7,
						height: 7,
						borderRadius: "50%",
						background: color,
						boxShadow: `0 0 8px ${color}40`,
					}}
				/>
				<span
					style={{
						...CC_TYPOGRAPHY.monoLarge,
						color: CC_COLORS.textPrimary,
					}}
				>
					{value}
				</span>
			</div>
			<div
				style={{
					marginTop: 4,
					fontFamily: CC_FONTS.dmSans,
					fontSize: 13,
					color: CC_COLORS.textSecondary,
				}}
			>
				{label}
			</div>
			{sublabel && (
				<div
					style={{
						marginTop: 2,
						fontFamily: CC_FONTS.dmSans,
						fontSize: 11,
						color: CC_COLORS.textMuted,
					}}
				>
					{sublabel}
				</div>
			)}
		</CommandGlassCard>
	);
}
