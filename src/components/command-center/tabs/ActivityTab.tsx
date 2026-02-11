"use client";

import { CC_COLORS, CC_FONTS } from "@/config/command-center";
import { ExpandableCard } from "../ExpandableCard";
import { useActivityLog, useAgentHeartbeats } from "@/hooks/useSupabaseData";

interface Commit {
	hash: string;
	message: string;
	timeAgo: string;
	status: string;
	author?: string;
	url?: string;
}

interface ActivityTabProps {
	recentCommits: Commit[];
}

export function ActivityTab({ recentCommits }: ActivityTabProps) {
	const { activities, loading: activitiesLoading } = useActivityLog(15);
	const { heartbeats, getAgentStatus, loading: heartbeatsLoading } = useAgentHeartbeats();

	// Get current agent tasks from heartbeats
	const aetherHeartbeat = heartbeats.find(h => h.agent === 'aether');
	const surgeonHeartbeat = heartbeats.find(h => h.agent === 'surgeon');

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			{/* Agent Status - Real-time from Supabase */}
			<ExpandableCard
				title="🤖 Agent Status"
				subtitle={heartbeatsLoading ? "Loading..." : "Your AI team's current state"}
				defaultExpanded={true}
			>
				<div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
					<AgentCard
						name="Aether"
						role="Chief of Staff"
						status={getAgentStatus('aether')}
						task={aetherHeartbeat?.current_task || "Monitoring"}
						emoji="🦉"
						lastSeen={aetherHeartbeat?.last_beat}
					/>
					<AgentCard
						name="Surgeon"
						role="Code Specialist"
						status={getAgentStatus('surgeon')}
						task={surgeonHeartbeat?.current_task || "Standby"}
						emoji="🤖"
						lastSeen={surgeonHeartbeat?.last_beat}
					/>
					<AgentCard
						name="Codex"
						role="Code Reviewer"
						status="standby"
						task="Waiting for review requests"
						emoji="🔍"
					/>
				</div>
			</ExpandableCard>

			{/* Real-time Activity Feed from Supabase */}
			<ExpandableCard
				title="📋 Activity Feed"
				subtitle={activitiesLoading ? "Loading..." : `${activities.length} recent activities`}
				defaultExpanded={true}
			>
				<div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
					{activitiesLoading ? (
						<LoadingPlaceholder />
					) : activities.length > 0 ? (
						activities.map((activity) => (
							<ActivityRow 
								key={activity.id} 
								agent={activity.agent}
								action={activity.action}
								detail={activity.detail || ""}
								time={getTimeAgo(new Date(activity.created_at))}
								metadata={activity.metadata}
							/>
						))
					) : (
						<EmptyState message="No activity yet. Activity will appear here as agents work." />
					)}
				</div>
			</ExpandableCard>

			{/* Recent Code Changes from GitHub */}
			<ExpandableCard
				title="📝 Recent Code Changes"
				subtitle={`${recentCommits.length} recent commits`}
			>
				<div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
					{recentCommits.length > 0 ? (
						recentCommits.map((commit, i) => (
							<CommitRow key={i} commit={commit} />
						))
					) : (
						<EmptyState message="Loading commits from GitHub..." />
					)}
				</div>
			</ExpandableCard>

			{/* Live Stats */}
			<ExpandableCard
				title="📊 Live Stats"
				subtitle="Real-time metrics"
			>
				<div style={{ 
					marginTop: 12, 
					display: "grid", 
					gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", 
					gap: 12 
				}}>
					<StatBox 
						label="Activities" 
						value={activities.length.toString()} 
						color={CC_COLORS.info} 
					/>
					<StatBox 
						label="Commits" 
						value={recentCommits.length.toString()} 
						color={CC_COLORS.purple} 
					/>
					<StatBox 
						label="Agents Online" 
						value={heartbeats.filter(h => {
							const status = getAgentStatus(h.agent);
							return status !== 'offline';
						}).length.toString()} 
						color={CC_COLORS.success} 
					/>
				</div>
			</ExpandableCard>
		</div>
	);
}

function AgentCard({ name, role, status, task, emoji, lastSeen }: {
	name: string;
	role: string;
	status: "online" | "working" | "standby" | "offline";
	task: string;
	emoji: string;
	lastSeen?: string;
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
					boxShadow: status !== 'offline' ? `0 0 6px ${statusColors[status]}60` : 'none',
					animation: status === 'working' ? 'pulse 2s infinite' : 'none',
				}} />
				<span style={{ fontSize: 12, color: statusColors[status], fontWeight: 500 }}>
					{statusLabels[status]}
				</span>
			</div>
			<p style={{ fontSize: 12, color: CC_COLORS.textMuted, marginTop: 6 }}>
				{task}
			</p>
			{lastSeen && (
				<p style={{ fontSize: 10, color: CC_COLORS.textMuted, marginTop: 4 }}>
					Last seen: {getTimeAgo(new Date(lastSeen))}
				</p>
			)}
		</div>
	);
}

function ActivityRow({ agent, action, detail, time, metadata }: {
	agent: string;
	action: string;
	detail: string;
	time: string;
	metadata?: Record<string, unknown> | null;
}) {
	const agentEmojis: Record<string, string> = {
		aether: "🦉",
		surgeon: "🤖",
		daniel: "👨‍💼",
		system: "⚙️",
	};

	const agentNames: Record<string, string> = {
		aether: "Aether",
		surgeon: "Surgeon",
		daniel: "Daniel",
		system: "System",
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
			<span style={{ fontSize: 20 }}>{agentEmojis[agent] || "📌"}</span>
			<div style={{ flex: 1, minWidth: 0 }}>
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<span style={{ 
						fontSize: 14, 
						fontWeight: 500, 
						color: CC_COLORS.textPrimary,
					}}>
						{agentNames[agent] || agent}
					</span>
				</div>
				<p style={{ fontSize: 13, color: CC_COLORS.textPrimary, marginTop: 2 }}>
					{action}
				</p>
				{detail && (
					<p style={{ fontSize: 12, color: CC_COLORS.textMuted, marginTop: 2 }}>
						{detail}
					</p>
				)}
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
		<a
			href={commit.url}
			target="_blank"
			rel="noopener noreferrer"
			style={{
				display: "flex",
				alignItems: "center",
				gap: 12,
				padding: "10px 14px",
				borderRadius: 8,
				background: CC_COLORS.elevated,
				textDecoration: "none",
				transition: "background 0.2s",
			}}
		>
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
			{commit.author && (
				<span style={{ fontSize: 11, color: CC_COLORS.textMuted }}>
					{commit.author}
				</span>
			)}
			<span style={{ 
				fontSize: 11, 
				color: CC_COLORS.textMuted,
				whiteSpace: "nowrap",
			}}>
				{commit.timeAgo}
			</span>
		</a>
	);
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
	return (
		<div style={{
			padding: 12,
			borderRadius: 8,
			background: CC_COLORS.elevated,
			textAlign: "center",
		}}>
			<p style={{ fontSize: 10, color: CC_COLORS.textMuted, textTransform: "uppercase" }}>
				{label}
			</p>
			<p style={{ fontSize: 24, fontWeight: 700, color, fontFamily: CC_FONTS.jetbrains }}>
				{value}
			</p>
		</div>
	);
}

function LoadingPlaceholder() {
	return (
		<div style={{ padding: 20, textAlign: "center" }}>
			<div style={{ 
				width: 24, 
				height: 24, 
				border: `2px solid ${CC_COLORS.border}`,
				borderTopColor: CC_COLORS.purple,
				borderRadius: "50%",
				animation: "spin 1s linear infinite",
				margin: "0 auto",
			}} />
			<p style={{ color: CC_COLORS.textMuted, marginTop: 8 }}>Loading activity...</p>
		</div>
	);
}

function EmptyState({ message }: { message: string }) {
	return (
		<div style={{ 
			padding: 24, 
			textAlign: "center", 
			color: CC_COLORS.textMuted,
			background: CC_COLORS.elevated,
			borderRadius: 8,
		}}>
			<span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>📭</span>
			{message}
		</div>
	);
}

function getTimeAgo(date: Date): string {
	const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
	if (seconds < 60) return `${seconds}s ago`;
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	return `${days}d ago`;
}
