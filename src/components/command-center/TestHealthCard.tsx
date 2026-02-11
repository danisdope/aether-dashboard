import { CommandGlassCard } from "@/components/ui/CommandGlassCard";
import {
	CC_COLORS,
	CC_FONTS,
	CC_TYPOGRAPHY,
	type TestHealthData,
} from "@/config/command-center";

export function TestHealthCard({ total, passing, suites }: TestHealthData) {
	const percentage = total > 0 ? (passing / total) * 100 : 0;

	return (
		<div style={{ padding: "24px 0 0" }}>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: 12,
				}}
			>
				<span
					style={{
						...CC_TYPOGRAPHY.sectionTitle,
						color: CC_COLORS.textPrimary,
					}}
				>
					Test Health
				</span>
				<span
					style={{
						...CC_TYPOGRAPHY.mono,
						color: CC_COLORS.success,
					}}
				>
					{passing}/{total}
				</span>
			</div>
			<CommandGlassCard style={{ padding: "16px 20px" }}>
				{/* Progress bar */}
				<div
					style={{
						height: 4,
						borderRadius: 2,
						background: CC_COLORS.elevated,
						overflow: "hidden",
						marginBottom: 14,
					}}
				>
					<div
						style={{
							height: "100%",
							width: `${percentage}%`,
							borderRadius: 2,
							background:
								"linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.85))",
						}}
					/>
				</div>
				<div style={{ display: "flex", gap: 24 }}>
					{suites.map((suite) => (
						<div key={suite.name}>
							<span
								style={{
									fontFamily: CC_FONTS.jetbrains,
									fontSize: 14,
									fontWeight: 700,
									color: CC_COLORS.textPrimary,
								}}
							>
								{suite.count}
							</span>
							<span
								style={{
									fontFamily: CC_FONTS.dmSans,
									fontSize: 12,
									color: CC_COLORS.textMuted,
									marginLeft: 6,
								}}
							>
								{suite.name}
							</span>
						</div>
					))}
				</div>
			</CommandGlassCard>
		</div>
	);
}
