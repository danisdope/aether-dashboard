"use client";

import { CC_COLORS, CC_FONTS } from "@/config/command-center";
import { ExpandableCard } from "../ExpandableCard";

interface WeekTabProps {
	workWeek: { day: number; total: number; label: string };
}

const DAYS: Array<{ day: string; focus: string; status: "done" | "today" | "upcoming"; highlights: string[] }> = [
	{ day: "Monday", focus: "Booking Agent Testing", status: "done", highlights: ["Ran T1-T6", "Found FAQ bug", "Sent to Surgeon"] },
	{ day: "Tuesday", focus: "Booking Agent Fixes", status: "today", highlights: ["Surgeon fixing FAQ", "Codex reviewing", "Dashboard updates"] },
	{ day: "Wednesday", focus: "Regression Testing", status: "upcoming", highlights: ["Re-run all tests", "Promptfoo setup", "Fix remaining bugs"] },
	{ day: "Thursday", focus: "Demo Prep", status: "upcoming", highlights: ["WonderMind demo script", "Edge case handling", "Performance check"] },
	{ day: "Friday", focus: "Demo Day", status: "upcoming", highlights: ["Live demo", "Feedback collection", "Next sprint planning"] },
];

export function WeekTab({ workWeek }: WeekTabProps) {
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			{/* Week Overview */}
			<ExpandableCard
				title="📅 This Week's Mission"
				subtitle="Booking Agent → Demo Ready"
				defaultExpanded={true}
			>
				<div style={{ marginTop: 12 }}>
					{/* Progress bar */}
					<div style={{ marginBottom: 16 }}>
						<div style={{ 
							display: "flex", 
							justifyContent: "space-between", 
							marginBottom: 8,
						}}>
							<span style={{ fontSize: 13, color: CC_COLORS.textMuted }}>Week Progress</span>
							<span style={{ 
								fontSize: 13, 
								fontWeight: 600, 
								color: CC_COLORS.purple,
								fontFamily: CC_FONTS.jetbrains,
							}}>
								{workWeek.label}
							</span>
						</div>
						<div style={{
							height: 10,
							borderRadius: 5,
							background: CC_COLORS.elevated,
							overflow: "hidden",
						}}>
							<div style={{
								height: "100%",
								width: `${(workWeek.day / workWeek.total) * 100}%`,
								borderRadius: 5,
								background: `linear-gradient(90deg, ${CC_COLORS.purple}, ${CC_COLORS.info})`,
								transition: "width 0.5s ease",
							}} />
						</div>
					</div>

					{/* Goal */}
					<div style={{
						padding: 16,
						borderRadius: 8,
						background: `linear-gradient(135deg, ${CC_COLORS.purple}10, ${CC_COLORS.info}05)`,
						border: `1px solid ${CC_COLORS.purple}20`,
					}}>
						<p style={{ 
							fontSize: 14, 
							color: CC_COLORS.textPrimary,
							lineHeight: 1.6,
						}}>
							<strong>Goal:</strong> Get the booking agent demo-ready for WonderMind by Friday. 
							The agent should handle parent inquiries, collect booking info, and schedule placement tests — 
							all without human intervention.
						</p>
					</div>
				</div>
			</ExpandableCard>

			{/* Day by Day */}
			<ExpandableCard
				title="📋 Day by Day"
				subtitle="What's happening each day"
				defaultExpanded={true}
			>
				<div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
					{DAYS.map((day, i) => (
						<DayCard key={i} {...day} isCurrentDay={i + 1 === workWeek.day} />
					))}
				</div>
			</ExpandableCard>

			{/* Key Metrics */}
			<ExpandableCard
				title="📊 Week Metrics"
				subtitle="How we're tracking"
			>
				<div style={{ 
					marginTop: 12, 
					display: "grid", 
					gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", 
					gap: 12 
				}}>
					<MetricBox label="Tests Passing" value="469" trend="+19 this week" color={CC_COLORS.success} />
					<MetricBox label="Bugs Fixed" value="12" trend="+5 today" color={CC_COLORS.info} />
					<MetricBox label="Commits" value="24" trend="Active development" color={CC_COLORS.purple} />
					<MetricBox label="Days to Demo" value="4" trend="Friday deadline" color={CC_COLORS.warning} />
				</div>
			</ExpandableCard>
		</div>
	);
}

function DayCard({ day, focus, status, highlights, isCurrentDay }: {
	day: string;
	focus: string;
	status: "done" | "today" | "upcoming";
	highlights: string[];
	isCurrentDay: boolean;
}) {
	const statusConfig = {
		done: { bg: `${CC_COLORS.success}08`, border: `${CC_COLORS.success}20`, icon: "✓", color: CC_COLORS.success },
		today: { bg: `${CC_COLORS.purple}10`, border: `${CC_COLORS.purple}30`, icon: "→", color: CC_COLORS.purple },
		upcoming: { bg: CC_COLORS.elevated, border: CC_COLORS.border, icon: "○", color: CC_COLORS.textMuted },
	};

	const config = statusConfig[status];

	return (
		<div style={{
			padding: "14px 16px",
			borderRadius: 8,
			background: config.bg,
			border: `1px solid ${config.border}`,
			opacity: status === "done" ? 0.7 : 1,
		}}>
			<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
				<span style={{ 
					fontSize: 14, 
					color: config.color,
					fontWeight: 600,
				}}>
					{config.icon}
				</span>
				<span style={{ 
					fontSize: 14, 
					fontWeight: 600, 
					color: status === "done" ? CC_COLORS.textMuted : CC_COLORS.textPrimary,
				}}>
					{day}
				</span>
				{isCurrentDay && (
					<span style={{
						fontSize: 10,
						fontWeight: 600,
						textTransform: "uppercase",
						color: CC_COLORS.purple,
						background: `${CC_COLORS.purple}20`,
						padding: "2px 8px",
						borderRadius: 4,
					}}>
						Today
					</span>
				)}
			</div>
			<p style={{ 
				fontSize: 13, 
				color: status === "done" ? CC_COLORS.textMuted : CC_COLORS.textSecondary,
				marginBottom: 8,
			}}>
				{focus}
			</p>
			<div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
				{highlights.map((h, i) => (
					<span key={i} style={{
						fontSize: 11,
						color: CC_COLORS.textMuted,
						background: CC_COLORS.surface,
						padding: "3px 8px",
						borderRadius: 4,
						textDecoration: status === "done" ? "line-through" : "none",
					}}>
						{h}
					</span>
				))}
			</div>
		</div>
	);
}

function MetricBox({ label, value, trend, color }: {
	label: string;
	value: string;
	trend: string;
	color: string;
}) {
	return (
		<div style={{
			padding: 14,
			borderRadius: 8,
			background: CC_COLORS.elevated,
			textAlign: "center",
		}}>
			<p style={{ 
				fontSize: 11, 
				color: CC_COLORS.textMuted, 
				textTransform: "uppercase",
				letterSpacing: "0.05em",
				marginBottom: 4,
			}}>
				{label}
			</p>
			<p style={{ 
				fontSize: 24, 
				fontWeight: 700, 
				color,
				fontFamily: CC_FONTS.jetbrains,
			}}>
				{value}
			</p>
			<p style={{ fontSize: 10, color: CC_COLORS.textMuted, marginTop: 4 }}>
				{trend}
			</p>
		</div>
	);
}
