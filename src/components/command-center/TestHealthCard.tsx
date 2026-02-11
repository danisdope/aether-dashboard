'use client';

import { CommandGlassCard } from "@/components/ui/CommandGlassCard";
import {
	CC_COLORS,
	CC_FONTS,
	CC_TYPOGRAPHY,
	type TestHealthData,
} from "@/config/command-center";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Line,
} from "recharts";

// 7-day trend data (mock for now — later connect to GitHub Actions API)
const TREND_DATA = [
	{ date: "Feb 5", total: 450, passing: 448 },
	{ date: "Feb 6", total: 455, passing: 455 },
	{ date: "Feb 7", total: 460, passing: 458 },
	{ date: "Feb 8", total: 465, passing: 465 },
	{ date: "Feb 9", total: 467, passing: 467 },
	{ date: "Feb 10", total: 469, passing: 469 },
	{ date: "Feb 11", total: 469, passing: 469 },
];

export function TestHealthCard({ total, passing, suites }: TestHealthData) {
	const percentage = total > 0 ? (passing / total) * 100 : 0;
	const allPassing = passing === total;

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
				<div>
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
							...CC_TYPOGRAPHY.caption,
							color: CC_COLORS.textMuted,
							marginLeft: 8,
						}}
					>
						7-day trend
					</span>
				</div>
				<div style={{ textAlign: "right" }}>
					<span
						style={{
							...CC_TYPOGRAPHY.monoLarge,
							fontSize: 20,
							color: allPassing ? CC_COLORS.success : CC_COLORS.warning,
						}}
					>
						{passing}
					</span>
					<span
						style={{
							...CC_TYPOGRAPHY.mono,
							color: CC_COLORS.textMuted,
							marginLeft: 4,
						}}
					>
						/ {total}
					</span>
					<div
						style={{
							...CC_TYPOGRAPHY.caption,
							color: allPassing ? CC_COLORS.success : CC_COLORS.warning,
							marginTop: 2,
						}}
					>
						{allPassing ? "✓ All passing" : `${total - passing} failing`}
					</div>
				</div>
			</div>

			<CommandGlassCard style={{ padding: "16px 20px" }}>
				{/* Line Chart */}
				<div style={{ height: 120, marginBottom: 16 }}>
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={TREND_DATA} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
							<defs>
								<linearGradient id="passingGradient" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor={CC_COLORS.success} stopOpacity={0.3} />
									<stop offset="95%" stopColor={CC_COLORS.success} stopOpacity={0} />
								</linearGradient>
							</defs>
							<XAxis
								dataKey="date"
								tick={{ fill: CC_COLORS.textMuted, fontSize: 10 }}
								axisLine={false}
								tickLine={false}
							/>
							<YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
							<Tooltip
								contentStyle={{
									background: CC_COLORS.elevated,
									border: `1px solid ${CC_COLORS.border}`,
									borderRadius: 8,
									boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
								}}
								labelStyle={{ color: CC_COLORS.textSecondary, marginBottom: 4 }}
								itemStyle={{ color: CC_COLORS.textPrimary }}
							/>
							<Area
								type="monotone"
								dataKey="passing"
								stroke={CC_COLORS.success}
								strokeWidth={2}
								fill="url(#passingGradient)"
								dot={{ fill: CC_COLORS.success, strokeWidth: 0, r: 3 }}
								activeDot={{ r: 5, fill: CC_COLORS.success }}
							/>
							<Line
								type="monotone"
								dataKey="total"
								stroke={CC_COLORS.purple}
								strokeWidth={1.5}
								strokeDasharray="4 4"
								dot={false}
								opacity={0.5}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>

				{/* Legend */}
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						gap: 24,
						marginBottom: 16,
						...CC_TYPOGRAPHY.caption,
						color: CC_COLORS.textMuted,
					}}
				>
					<span style={{ display: "flex", alignItems: "center", gap: 6 }}>
						<span
							style={{
								width: 10,
								height: 10,
								borderRadius: "50%",
								background: CC_COLORS.success,
							}}
						/>
						Passing
					</span>
					<span style={{ display: "flex", alignItems: "center", gap: 6 }}>
						<span
							style={{
								width: 12,
								height: 2,
								background: CC_COLORS.purple,
								opacity: 0.5,
							}}
						/>
						Total
					</span>
				</div>

				{/* Suite breakdown */}
				<div
					style={{
						display: "flex",
						gap: 24,
						paddingTop: 12,
						borderTop: `1px solid ${CC_COLORS.border}`,
					}}
				>
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
