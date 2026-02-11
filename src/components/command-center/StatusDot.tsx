import { CC_COLORS, CC_FONTS } from "@/config/command-center";

interface StatusDotProps {
	color: string;
	label: string;
}

export function StatusDot({ color, label }: StatusDotProps) {
	return (
		<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
			<div
				style={{
					width: 6,
					height: 6,
					borderRadius: "50%",
					background: color,
					boxShadow: `0 0 6px ${color}40`,
				}}
			/>
			<span
				style={{
					fontFamily: CC_FONTS.dmSans,
					fontSize: 12,
					color: CC_COLORS.textTertiary,
				}}
			>
				{label}
			</span>
		</div>
	);
}
