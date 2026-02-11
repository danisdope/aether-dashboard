"use client";

import { CC_COLORS, CC_FONTS } from "@/config/command-center";
import { ExpandableCard } from "../ExpandableCard";

interface TestsTabProps {
	testHealth: {
		total: number;
		passing: number;
		suites: { name: string; count: number }[];
		history?: { date: string; total: number; passing: number }[];
	};
	ciStatus: string;
}

export function TestsTab({ testHealth, ciStatus }: TestsTabProps) {
	const allPassing = testHealth.passing === testHealth.total;
	const passRate = Math.round((testHealth.passing / testHealth.total) * 100);

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
						<div style={{ 
							fontSize: 48, 
							marginBottom: 8,
						}}>
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
						<p style={{ 
							fontSize: 14, 
							color: CC_COLORS.textSecondary,
							marginTop: 4,
						}}>
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
	// Friendly names for non-technical users
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
			<div style={{
				display: "flex",
				alignItems: "center",
				gap: 6,
			}}>
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
