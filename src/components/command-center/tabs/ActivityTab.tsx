"use client";

import { CC_COLORS, CC_FONTS } from "@/config/command-center";
import { ExpandableCard } from "../ExpandableCard";

interface Commit {
	hash: string;
	message: string;
	timeAgo: string;
	status: string;
}

interface ActivityTabProps {
	recentCommits: Commit[];
}

// Static activity for now - can be wired to Supabase later
const RECENT_ACTIVITY = [
	{
		agent: "🤖 Surgeon",
		action: "Fixing FAQ handling",
		detail: "Adding interrupt detection to booking flow",
		time: "Just now",
		type: "code",
	},
	{
		agent: "🔍 Codex",
		action: "Reviewed Surgeon's plan",
		detail: "Requested hard guards for deterministic behavior",
		time: "10 min ago",
		type: "review",
	},
	{
		agent: "🦉 Aether",
		action: "Updated dashboard",
		detail: "Wired up real-time data from GitHub",
		time: "20 min ago",
		type: "code",
	},
	{
		agent: "🤖 Surgeon",
		action: "Fixed email service",
		detail: "Added MOCK_MODE guards to confirmation emails",
		time: "1 hour ago",
		type: "code",
	},
	{
		agent: "👨‍💼 Daniel",
		action: "Manual testing",
		detail: "Ran booking agent test scenarios T1-T6",
		time: "2 hours ago",
		type: "testing",
	},
];

export function ActivityTab({ recentCommits }: ActivityTabProps) {
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			{/* Agent Activity */}
			<ExpandableCard
				title="🤖 Agent Activity"
				subtitle="What your AI team is doing"
				defaultExpanded={true}
			>
				<div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
					{RECENT_ACTIVITY.map((activity, i) => (
						<ActivityRow key={i} {...activity} />
					))}
				</div>
			</ExpandableCard>

			{/* Recent Code Changes */}
			<ExpandableCard
				title="📝 Recent Code Changes"
				subtitle="Latest updates to the codebase"
			>
				<div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
					{recentCommits.length > 0 ? (
						recentCommits.map((commit, i) => (
							<CommitRow key={i} commit={commit} />
						))
					) : (
						<p style={{ color: CC_COLORS.textMuted, textAlign: "center", padding: 20 }}>
							Loading recent changes...
						</p>
					)}
				</div>
			</ExpandableCard>

			{/* Agent Status */}
			<ExpandableCard
				title="💡 Agent Status"
				subtitle="Your AI team's current state"
			>
				<div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
					<AgentCard
						name="Aether"
						role="Chief of Staff"
						status="online"
						task="Monitoring dashboard"
						emoji="🦉"
					/>
					<AgentCard
						name="Surgeon"
						role="Code Specialist"
						status="working"
						task="Fixing FAQ handling"
						emoji="🤖"
					/>
					<AgentCard
						name="Codex"
						role="Code Reviewer"
						status="standby"
						task="Waiting for review"
						emoji="🔍"
					/>
				</div>
			</ExpandableCard>
		</div>
	);
}

function ActivityRow({ agent, action, detail, time, type }: {
	agent: string;
	action: string;
	detail: string;
	time: string;
	type: string;
}) {
	const typeColors: Record<string, string> = {
		code: CC_COLORS.purple,
		review: CC_COLORS.info,
		testing: CC_COLORS.warning,
	};

	return (
		<div style={{
			display: "flex",
			alignItems: "flex-start",
			gap: 12,
			padding: "12px 14px",
			borderRadius: 8,
			background: CC_COLORS.elevated,
			border: `1px solid ${CC_COLORS.border}`,
		}}>
			<span style={{ fontSize: 20 }}>{agent.split(" ")[0]}</span>
			<div style={{ flex: 1, minWidth: 0 }}>
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<span style={{ 
						fontSize: 14, 
						fontWeight: 500, 
						color: CC_COLORS.textPrimary,
					}}>
						{agent.split(" ").slice(1).join(" ")}
					</span>
					<span style={{ 
						fontSize: 10, 
						fontWeight: 600,
						textTransform: "uppercase",
						color: typeColors[type] || CC_COLORS.textMuted,
						background: `${typeColors[type] || CC_COLORS.textMuted}15`,
						padding: "2px 6px",
						borderRadius: 4,
					}}>
						{type}
					</span>
				</div>
				<p style={{ fontSize: 13, color: CC_COLORS.textPrimary, marginTop: 2 }}>
					{action}
				</p>
				<p style={{ fontSize: 12, color: CC_COLORS.textMuted, marginTop: 2 }}>
					{detail}
				</p>
			</div>
			<span style={{ 
				fontSize: 11, 
				color: CC_COLORS.textMuted,
				whiteSpace: "nowrap",
			}}>
				{time}
			</span>
		</div>
	);
}

function CommitRow({ commit }: { commit: Commit }) {
	return (
		<div style={{
			display: "flex",
			alignItems: "center",
			gap: 12,
			padding: "10px 14px",
			borderRadius: 8,
			background: CC_COLORS.elevated,
		}}>
			<span style={{
				fontSize: 12,
				fontFamily: CC_FONTS.jetbrains,
				color: CC_COLORS.purple,
				background: `${CC_COLORS.purple}15`,
				padding: "4px 8px",
				borderRadius: 4,
			}}>
				{commit.hash}
			</span>
			<span style={{ 
				flex: 1, 
				fontSize: 13, 
				color: CC_COLORS.textPrimary,
				overflow: "hidden",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap",
			}}>
				{commit.message}
			</span>
			<span style={{ 
				fontSize: 11, 
				color: CC_COLORS.textMuted,
				whiteSpace: "nowrap",
			}}>
				{commit.timeAgo}
			</span>
		</div>
	);
}

function AgentCard({ name, role, status, task, emoji }: {
	name: string;
	role: string;
	status: "online" | "working" | "standby" | "offline";
	task: string;
	emoji: string;
}) {
	const statusColors = {
		online: CC_COLORS.success,
		working: CC_COLORS.warning,
		standby: CC_COLORS.info,
		offline: CC_COLORS.textMuted,
	};

	const statusLabels = {
		online: "Online",
		working: "Working",
		standby: "Standby",
		offline: "Offline",
	};

	return (
		<div style={{
			padding: 16,
			borderRadius: 8,
			background: CC_COLORS.elevated,
			border: `1px solid ${CC_COLORS.border}`,
		}}>
			<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
				<span style={{ fontSize: 28 }}>{emoji}</span>
				<div>
					<p style={{ fontSize: 15, fontWeight: 600, color: CC_COLORS.textPrimary }}>
						{name}
					</p>
					<p style={{ fontSize: 12, color: CC_COLORS.textMuted }}>
						{role}
					</p>
				</div>
			</div>
			<div style={{ 
				display: "flex", 
				alignItems: "center", 
				gap: 6,
				marginTop: 8,
			}}>
				<div style={{
					width: 8,
					height: 8,
					borderRadius: "50%",
					background: statusColors[status],
					boxShadow: `0 0 6px ${statusColors[status]}60`,
				}} />
				<span style={{ fontSize: 12, color: statusColors[status], fontWeight: 500 }}>
					{statusLabels[status]}
				</span>
			</div>
			<p style={{ fontSize: 12, color: CC_COLORS.textMuted, marginTop: 6 }}>
				{task}
			</p>
		</div>
	);
}
