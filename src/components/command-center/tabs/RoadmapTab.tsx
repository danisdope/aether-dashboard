"use client";

import { CC_COLORS, CC_FONTS } from "@/config/command-center";
import { ExpandableCard } from "../ExpandableCard";

const ROADMAP_ITEMS = [
	{
		phase: "Phase 1",
		title: "Booking Agent",
		status: "in-progress",
		progress: 85,
		items: [
			{ text: "Core conversation flow", done: true },
			{ text: "FAQ handling", done: false },
			{ text: "Slot collection", done: true },
			{ text: "Confirmation emails", done: true },
			{ text: "Manual testing", done: false },
		],
		eta: "This Week",
	},
	{
		phase: "Phase 2",
		title: "Teacher Dashboard",
		status: "planned",
		progress: 30,
		items: [
			{ text: "Student profiles", done: true },
			{ text: "Progress tracking", done: false },
			{ text: "Parent portal", done: false },
			{ text: "Reports & insights", done: false },
		],
		eta: "Next 2 Weeks",
	},
	{
		phase: "Phase 3",
		title: "CS Agent",
		status: "planned",
		progress: 0,
		items: [
			{ text: "Progress updates to parents", done: false },
			{ text: "Schedule changes", done: false },
			{ text: "Payment reminders", done: false },
		],
		eta: "Month 2",
	},
];

export function RoadmapTab() {
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			{/* Vision */}
			<ExpandableCard
				title="🎯 The Vision"
				subtitle="What we're building"
				defaultExpanded={true}
			>
				<div style={{ 
					marginTop: 12, 
					padding: 16, 
					background: `linear-gradient(135deg, ${CC_COLORS.purple}10, ${CC_COLORS.info}05)`,
					borderRadius: 8,
					border: `1px solid ${CC_COLORS.purple}20`,
				}}>
					<p style={{ 
						fontSize: 16, 
						color: CC_COLORS.textPrimary, 
						lineHeight: 1.6,
						fontFamily: CC_FONTS.dmSans,
					}}>
						<strong>Aetherion</strong> automates your school's operations so you can focus on teaching. 
						AI handles parent inquiries, books placements tests, tracks student progress, and keeps 
						everyone informed — 24/7, in their preferred language.
					</p>
				</div>
			</ExpandableCard>

			{/* Phases */}
			{ROADMAP_ITEMS.map((phase) => (
				<ExpandableCard
					key={phase.phase}
					title={`${phase.status === "in-progress" ? "🚧" : "📅"} ${phase.phase}: ${phase.title}`}
					subtitle={`${phase.progress}% complete • ETA: ${phase.eta}`}
					defaultExpanded={phase.status === "in-progress"}
				>
					<div style={{ marginTop: 12 }}>
						{/* Progress bar */}
						<div style={{ marginBottom: 16 }}>
							<div style={{
								height: 8,
								borderRadius: 4,
								background: CC_COLORS.elevated,
								overflow: "hidden",
							}}>
								<div style={{
									height: "100%",
									width: `${phase.progress}%`,
									borderRadius: 4,
									background: phase.status === "in-progress" 
										? `linear-gradient(90deg, ${CC_COLORS.purple}, ${CC_COLORS.info})`
										: CC_COLORS.textMuted,
									transition: "width 0.5s ease",
								}} />
							</div>
						</div>

						{/* Checklist */}
						<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
							{phase.items.map((item, i) => (
								<div 
									key={i}
									style={{
										display: "flex",
										alignItems: "center",
										gap: 10,
										padding: "10px 12px",
										borderRadius: 6,
										background: item.done ? `${CC_COLORS.success}08` : CC_COLORS.elevated,
									}}
								>
									<span style={{ 
										fontSize: 14,
										color: item.done ? CC_COLORS.success : CC_COLORS.textMuted,
									}}>
										{item.done ? "✓" : "○"}
									</span>
									<span style={{
										fontSize: 14,
										color: item.done ? CC_COLORS.textMuted : CC_COLORS.textPrimary,
										textDecoration: item.done ? "line-through" : "none",
									}}>
										{item.text}
									</span>
								</div>
							))}
						</div>
					</div>
				</ExpandableCard>
			))}

			{/* Timeline */}
			<ExpandableCard
				title="📊 Timeline"
				subtitle="When things will be ready"
			>
				<div style={{ marginTop: 12 }}>
					<div style={{
						display: "flex",
						flexDirection: "column",
						gap: 0,
						position: "relative",
						paddingLeft: 20,
					}}>
						{/* Vertical line */}
						<div style={{
							position: "absolute",
							left: 6,
							top: 8,
							bottom: 8,
							width: 2,
							background: CC_COLORS.border,
						}} />

						<TimelineItem 
							date="This Week" 
							title="Booking Agent v1.0" 
							description="Ready for demo with WonderMind"
							status="current"
						/>
						<TimelineItem 
							date="Week 3" 
							title="First Paying Customer" 
							description="WonderMind live on Aetherion"
							status="upcoming"
						/>
						<TimelineItem 
							date="Month 2" 
							title="Teacher Dashboard" 
							description="Student progress & parent portal"
							status="planned"
						/>
						<TimelineItem 
							date="Month 3" 
							title="CS Agent" 
							description="Automated parent updates"
							status="planned"
						/>
					</div>
				</div>
			</ExpandableCard>
		</div>
	);
}

function TimelineItem({ date, title, description, status }: {
	date: string;
	title: string;
	description: string;
	status: "current" | "upcoming" | "planned";
}) {
	const colors = {
		current: CC_COLORS.purple,
		upcoming: CC_COLORS.info,
		planned: CC_COLORS.textMuted,
	};

	return (
		<div style={{ display: "flex", gap: 16, paddingBottom: 20 }}>
			{/* Dot */}
			<div style={{
				width: 12,
				height: 12,
				borderRadius: "50%",
				background: colors[status],
				marginLeft: -5,
				marginTop: 4,
				flexShrink: 0,
				boxShadow: status === "current" ? `0 0 8px ${colors[status]}60` : "none",
			}} />
			
			<div>
				<p style={{ 
					fontSize: 11, 
					color: colors[status], 
					fontWeight: 600,
					textTransform: "uppercase",
					letterSpacing: "0.05em",
					marginBottom: 4,
				}}>
					{date}
				</p>
				<p style={{ fontSize: 15, fontWeight: 600, color: CC_COLORS.textPrimary }}>
					{title}
				</p>
				<p style={{ fontSize: 13, color: CC_COLORS.textMuted, marginTop: 2 }}>
					{description}
				</p>
			</div>
		</div>
	);
}
