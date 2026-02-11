"use client";

import { useState } from "react";
import { CC_COLORS, CC_FONTS } from "@/config/command-center";
import { ExpandableCard } from "../ExpandableCard";

interface TodayTabProps {
	testHealth: {
		total: number;
		passing: number;
		suites: { name: string; count: number }[];
	};
	workWeek: { day: number; total: number; label: string };
	commit: { hash: string; message: string; status: string; timeAgo: string } | null;
	tasks: Array<{ id: string; text: string; done: boolean; tag?: string }>;
	onToggleTask: (id: string) => void;
	onAddTask: (text: string) => void;
	onDeleteTask: (id: string) => void;
}

export function TodayTab({ 
	testHealth, 
	workWeek, 
	commit, 
	tasks,
	onToggleTask,
	onAddTask,
	onDeleteTask,
}: TodayTabProps) {
	const completedTasks = tasks.filter(t => t.done).length;
	const [showAddTask, setShowAddTask] = useState(false);
	const [newTaskText, setNewTaskText] = useState("");

	const handleAddTask = () => {
		if (newTaskText.trim()) {
			onAddTask(newTaskText.trim());
			setNewTaskText("");
			setShowAddTask(false);
		}
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			{/* Daily Summary */}
			<ExpandableCard
				title="📊 Daily Summary"
				subtitle="Your business at a glance"
				defaultExpanded={true}
			>
				<div style={{ 
					display: "grid", 
					gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", 
					gap: 12,
					marginTop: 12,
				}}>
					<SummaryCard
						label="Code Health"
						value={testHealth.passing === testHealth.total ? "All Good ✅" : "Issues Found ⚠️"}
						detail={`${testHealth.passing} automated checks passing`}
						color={testHealth.passing === testHealth.total ? CC_COLORS.success : CC_COLORS.warning}
					/>
					<SummaryCard
						label="Week Progress"
						value={workWeek.label}
						detail={`${Math.round((workWeek.day / workWeek.total) * 100)}% through the work week`}
						color={CC_COLORS.purple}
					/>
					<SummaryCard
						label="Tasks"
						value={`${completedTasks}/${tasks.length}`}
						detail={completedTasks === tasks.length ? "All done! 🎉" : `${tasks.length - completedTasks} remaining`}
						color={completedTasks === tasks.length ? CC_COLORS.success : CC_COLORS.warning}
					/>
					<SummaryCard
						label="Last Update"
						value={commit?.timeAgo || "..."}
						detail={commit?.message?.slice(0, 40) + "..." || "Loading..."}
						color={commit?.status === "passed" ? CC_COLORS.success : CC_COLORS.textSecondary}
					/>
				</div>
			</ExpandableCard>

			{/* Today's Tasks */}
			<ExpandableCard
				title="✅ Today's Tasks"
				subtitle={`${completedTasks} of ${tasks.length} completed`}
				defaultExpanded={true}
			>
				<div style={{ marginTop: 12 }}>
					{/* Add task button */}
					<div style={{ marginBottom: 12 }}>
						{showAddTask ? (
							<div style={{ display: "flex", gap: 8 }}>
								<input
									type="text"
									value={newTaskText}
									onChange={(e) => setNewTaskText(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
									placeholder="What needs to be done?"
									autoFocus
									style={{
										flex: 1,
										padding: "10px 12px",
										borderRadius: 8,
										border: `1px solid ${CC_COLORS.border}`,
										background: CC_COLORS.elevated,
										color: CC_COLORS.textPrimary,
										fontSize: 14,
										fontFamily: CC_FONTS.dmSans,
									}}
								/>
								<button
									onClick={handleAddTask}
									style={{
										padding: "10px 16px",
										borderRadius: 8,
										border: "none",
										background: CC_COLORS.purple,
										color: "white",
										fontSize: 14,
										fontWeight: 500,
										cursor: "pointer",
									}}
								>
									Add
								</button>
								<button
									onClick={() => setShowAddTask(false)}
									style={{
										padding: "10px 12px",
										borderRadius: 8,
										border: `1px solid ${CC_COLORS.border}`,
										background: "transparent",
										color: CC_COLORS.textSecondary,
										fontSize: 14,
										cursor: "pointer",
									}}
								>
									Cancel
								</button>
							</div>
						) : (
							<button
								onClick={() => setShowAddTask(true)}
								style={{
									width: "100%",
									padding: "10px",
									borderRadius: 8,
									border: `1px dashed ${CC_COLORS.border}`,
									background: "transparent",
									color: CC_COLORS.textMuted,
									fontSize: 14,
									cursor: "pointer",
									fontFamily: CC_FONTS.dmSans,
								}}
							>
								+ Add a task
							</button>
						)}
					</div>

					{/* Task list */}
					<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
						{tasks.length === 0 ? (
							<p style={{ color: CC_COLORS.textMuted, textAlign: "center", padding: 20 }}>
								No tasks yet. Add one above!
							</p>
						) : (
							tasks.map((task) => (
								<TaskItem
									key={task.id}
									task={task}
									onToggle={() => onToggleTask(task.id)}
									onDelete={() => onDeleteTask(task.id)}
								/>
							))
						)}
					</div>
				</div>
			</ExpandableCard>

			{/* What's Happening */}
			<ExpandableCard
				title="🔄 What's Happening"
				subtitle="Recent activity from your team"
			>
				<div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
					<ActivityItem
						icon="🤖"
						title="Surgeon fixing booking agent"
						detail="Working on FAQ interrupt handling"
						time="Just now"
					/>
					<ActivityItem
						icon="✅"
						title="Codex reviewed Surgeon's plan"
						detail="Requested hard guards for deterministic behavior"
						time="10m ago"
					/>
					<ActivityItem
						icon="🦉"
						title="Aether updated dashboard"
						detail="Wired up real-time data sources"
						time="15m ago"
					/>
				</div>
			</ExpandableCard>
		</div>
	);
}

function SummaryCard({ label, value, detail, color }: { 
	label: string; 
	value: string; 
	detail: string;
	color: string;
}) {
	return (
		<div style={{
			padding: 12,
			borderRadius: 8,
			background: CC_COLORS.elevated,
			border: `1px solid ${CC_COLORS.border}`,
		}}>
			<p style={{ 
				fontSize: 11, 
				color: CC_COLORS.textMuted, 
				marginBottom: 4,
				textTransform: "uppercase",
				letterSpacing: "0.05em",
			}}>
				{label}
			</p>
			<p style={{ 
				fontSize: 18, 
				fontWeight: 600, 
				color,
				fontFamily: CC_FONTS.dmSans,
			}}>
				{value}
			</p>
			<p style={{ 
				fontSize: 11, 
				color: CC_COLORS.textMuted, 
				marginTop: 4,
			}}>
				{detail}
			</p>
		</div>
	);
}

function TaskItem({ task, onToggle, onDelete }: { 
	task: { id: string; text: string; done: boolean; tag?: string };
	onToggle: () => void;
	onDelete: () => void;
}) {
	return (
		<div
			onClick={onToggle}
			style={{
				display: "flex",
				alignItems: "center",
				gap: 12,
				padding: "12px 14px",
				borderRadius: 8,
				background: task.done ? `${CC_COLORS.success}10` : CC_COLORS.elevated,
				border: `1px solid ${task.done ? CC_COLORS.success + "30" : CC_COLORS.border}`,
				cursor: "pointer",
				transition: "all 0.2s",
			}}
		>
			<div style={{
				width: 20,
				height: 20,
				borderRadius: 6,
				border: `2px solid ${task.done ? CC_COLORS.success : CC_COLORS.textMuted}`,
				background: task.done ? CC_COLORS.success : "transparent",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexShrink: 0,
			}}>
				{task.done && (
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
						<path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				)}
			</div>
			<span style={{
				flex: 1,
				fontSize: 14,
				color: task.done ? CC_COLORS.textMuted : CC_COLORS.textPrimary,
				textDecoration: task.done ? "line-through" : "none",
				fontFamily: CC_FONTS.dmSans,
			}}>
				{task.text}
			</span>
			{task.tag && (
				<span style={{
					fontSize: 10,
					fontWeight: 600,
					textTransform: "uppercase",
					color: CC_COLORS.textMuted,
					background: CC_COLORS.surface,
					padding: "4px 8px",
					borderRadius: 4,
				}}>
					{task.tag}
				</span>
			)}
			<button
				onClick={(e) => { e.stopPropagation(); onDelete(); }}
				style={{
					background: "transparent",
					border: "none",
					color: CC_COLORS.textMuted,
					cursor: "pointer",
					padding: 4,
					opacity: 0.5,
				}}
			>
				✕
			</button>
		</div>
	);
}

function ActivityItem({ icon, title, detail, time }: {
	icon: string;
	title: string;
	detail: string;
	time: string;
}) {
	return (
		<div style={{
			display: "flex",
			alignItems: "flex-start",
			gap: 12,
			padding: "10px 12px",
			borderRadius: 8,
			background: CC_COLORS.elevated,
		}}>
			<span style={{ fontSize: 18 }}>{icon}</span>
			<div style={{ flex: 1 }}>
				<p style={{ fontSize: 14, color: CC_COLORS.textPrimary, fontWeight: 500 }}>{title}</p>
				<p style={{ fontSize: 12, color: CC_COLORS.textMuted, marginTop: 2 }}>{detail}</p>
			</div>
			<span style={{ fontSize: 11, color: CC_COLORS.textMuted }}>{time}</span>
		</div>
	);
}
