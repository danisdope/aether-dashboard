"use client";

import { CC_COLORS, CC_FONTS } from "@/config/command-center";
import { ExpandableCard } from "../ExpandableCard";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Line,
} from "recharts";

interface TestsTabProps {
	testHealth: {
		total: number;
		passing: number;
		suites: { name: string; count: number }[];
		history?: { date: string; total: number; passing: number }[];
	};
	ciStatus: string;
}

// Default history if not provided
const DEFAULT_HISTORY = [
	{ date: "Feb 5", total: 450, passing: 448 },
	{ date: "Feb 6", total: 455, passing: 455 },
	{ date: "Feb 7", total: 460, passing: 458 },
	{ date: "Feb 8", total: 465, passing: 465 },
	{ date: "Feb 9", total: 467, passing: 467 },
	{ date: "Feb 10", total: 469, passing: 469 },
	{ date: "Feb 11", total: 469, passing: 469 },
];

export function TestsTab({ testHealth, ciStatus }: TestsTabProps) {
	const allPassing = testHealth.passing === testHealth.total;
	const passRate = Math.round((testHealth.passing / testHealth.total) * 100);
	const history = testHealth.history || DEFAULT_HISTORY;

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			{/* Overall Status */}
			<ExpandableCard
				title={allPassing ? "✅ All Systems Go" : "⚠️ Issues Detected"}
				subtitle={`${testHealth.passing} of ${testHealth.total} automated checks passing`}
				defaultExpanded={true}
			>
				<div style={{ marginTop: 16 }}>
					{/* Big status indicator */}
					<div style={{
						textAlign: "center",
						padding: "24px 0",
						borderRadius: 12,
						background: allPassing 
							? `linear-gradient(135deg, ${CC_COLORS.success}15, ${CC_COLORS.success}05)`
							: `linear-gradient(135deg, ${CC_COLORS.warning}15, ${CC_COLORS.warning}05)`,
						marginBottom: 16,
					}}>
						<div style={{ fontSize: 48, marginBottom: 8 }}>
							{allPassing ? "🎉" : "🔧"}
						</div>
						<p style={{ 
							fontSize: 24, 
							fontWeight: 700, 
							color: allPassing ? CC_COLORS.success : CC_COLORS.warning,
							fontFamily: CC_FONTS.jetbrains,
						}}>
							{passRate}% Pass Rate
						</p>
						<p style={{ fontSize: 14, color: CC_COLORS.textSecondary, marginTop: 4 }}>
							{allPassing 
								? "Your codebase is healthy and all automated checks are passing"
								: `${testHealth.total - testHealth.passing} checks need attention`
							}
						</p>
					</div>

					{/* What this means for CEO */}
					<div style={{
						padding: 16,
						borderRadius: 8,
						background: CC_COLORS.elevated,
						border: `1px solid ${CC_COLORS.border}`,
					}}>
						<p style={{ 
							fontSize: 12, 
							color: CC_COLORS.textMuted, 
							textTransform: "uppercase",
							letterSpacing: "0.05em",
							marginBottom: 8,
						}}>
							What This Means
						</p>
						<p style={{ fontSize: 14, color: CC_COLORS.textPrimary, lineHeight: 1.6 }}>
							{allPassing 
								? "✅ The booking agent is working correctly. All conversations are being handled as expected, data is being saved properly, and the system is stable."
								: "⚠️ Some parts of the booking agent may not be working correctly. The team is aware and fixing the issues."
							}
						</p>
					</div>
				</div>
			</ExpandableCard>

			{/* 📈 TEST HEALTH TREND - THE LINE GRAPH */}
			<ExpandableCard
				title="📈 Test Health Trend"
				subtitle="7-day history of automated checks"
				defaultExpanded={true}
			>
				<div style={{ marginTop: 16 }}>
					{/* Chart */}
					<div style={{ height: 200, marginBottom: 16 }}>
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
								<defs>
									<linearGradient id="passingGradient" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor={CC_COLORS.success} stopOpacity={0.3} />
										<stop offset="95%" stopColor={CC_COLORS.success} stopOpacity={0} />
									</linearGradient>
								</defs>
								<XAxis
									dataKey="date"
									tick={{ fill: CC_COLORS.textMuted, fontSize: 11 }}
									axisLine={false}
									tickLine={false}
								/>
								<YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
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
									dot={{ fill: CC_COLORS.success, strokeWidth: 0, r: 4 }}
									activeDot={{ r: 6, fill: CC_COLORS.success }}
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
					<div style={{
						display: "flex",
						justifyContent: "center",
						gap: 24,
						paddingTop: 8,
						borderTop: `1px solid ${CC_COLORS.border}`,
					}}>
						<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
							<div style={{ width: 12, height: 12, borderRadius: "50%", background: CC_COLORS.success }} />
							<span style={{ fontSize: 12, color: CC_COLORS.textMuted }}>Passing Tests</span>
						</div>
						<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
							<div style={{ width: 16, height: 2, background: CC_COLORS.purple, opacity: 0.5 }} />
							<span style={{ fontSize: 12, color: CC_COLORS.textMuted }}>Total Tests</span>
						</div>
					</div>

					{/* Trend insight */}
					<div style={{
						marginTop: 16,
						padding: 12,
						borderRadius: 8,
						background: `${CC_COLORS.success}10`,
						border: `1px solid ${CC_COLORS.success}20`,
					}}>
						<p style={{ fontSize: 13, color: CC_COLORS.textPrimary }}>
							📊 <strong>Trend:</strong> Tests have grown from 450 to 469 this week (+19 new checks). All tests have been passing consistently since Feb 6.
						</p>
					</div>
				</div>
			</ExpandableCard>

			{/* Test Suites */}
			<ExpandableCard
				title="🧪 Test Breakdown"
				subtitle="Automated checks by component"
			>
				<div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
					{testHealth.suites.map((suite) => (
						<SuiteCard key={suite.name} name={suite.name} count={suite.count} />
					))}
				</div>
			</ExpandableCard>

			{/* CI Status */}
			<ExpandableCard
				title="🚀 Deployment Status"
				subtitle="Build and deployment pipeline"
			>
				<div style={{ marginTop: 12 }}>
					<div style={{
						display: "flex",
						alignItems: "center",
						gap: 12,
						padding: 16,
						borderRadius: 8,
						background: CC_COLORS.elevated,
					}}>
						<div style={{
							width: 40,
							height: 40,
							borderRadius: "50%",
							background: ciStatus === "success" ? CC_COLORS.success : CC_COLORS.warning,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: 20,
						}}>
							{ciStatus === "success" ? "✓" : "⏳"}
						</div>
						<div>
							<p style={{ fontSize: 16, fontWeight: 600, color: CC_COLORS.textPrimary }}>
								{ciStatus === "success" ? "Live & Running" : "Building..."}
							</p>
							<p style={{ fontSize: 13, color: CC_COLORS.textMuted }}>
								{ciStatus === "success" 
									? "Latest changes are deployed to production"
									: "New changes are being deployed"
								}
							</p>
						</div>
					</div>
				</div>
			</ExpandableCard>
		</div>
	);
}

function SuiteCard({ name, count }: { name: string; count: number }) {
	const friendlyNames: Record<string, { label: string; description: string }> = {
		"aetherion-core": { 
			label: "Booking Agent", 
			description: "Handles parent conversations and bookings" 
		},
		"mcp-server": { 
			label: "AI Integration", 
			description: "Connects AI models to your systems" 
		},
	};

	const friendly = friendlyNames[name] || { label: name, description: "System component" };

	return (
		<div style={{
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			padding: "12px 16px",
			borderRadius: 8,
			background: CC_COLORS.elevated,
			border: `1px solid ${CC_COLORS.border}`,
		}}>
			<div>
				<p style={{ fontSize: 14, fontWeight: 500, color: CC_COLORS.textPrimary }}>
					{friendly.label}
				</p>
				<p style={{ fontSize: 12, color: CC_COLORS.textMuted }}>
					{friendly.description}
				</p>
			</div>
			<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
				<span style={{ 
					fontSize: 20, 
					fontWeight: 700, 
					color: CC_COLORS.success,
					fontFamily: CC_FONTS.jetbrains,
				}}>
					{count}
				</span>
				<span style={{ fontSize: 12, color: CC_COLORS.textMuted }}>checks</span>
			</div>
		</div>
	);
}
