"use client";

import { useState } from "react";
import { CC_COLORS, CC_FONTS } from "@/config/command-center";
import { ExpandableCard } from "../ExpandableCard";

interface Task {
	id: string;
	text: string;
	done: boolean;
	tag?: string;
}

interface TasksTabProps {
	tasks: Task[];
	onToggle: (id: string) => void;
	onAdd: (text: string, tag?: string) => void;
	onDelete: (id: string) => void;
}

export function TasksTab({ tasks, onToggle, onAdd, onDelete }: TasksTabProps) {
	const [newTaskText, setNewTaskText] = useState("");
	const [newTaskTag, setNewTaskTag] = useState("");
	
	const completedTasks = tasks.filter(t => t.done);
	const pendingTasks = tasks.filter(t => !t.done);

	const handleAdd = () => {
		if (newTaskText.trim()) {
			onAdd(newTaskText.trim(), newTaskTag.trim() || undefined);
			setNewTaskText("");
			setNewTaskTag("");
		}
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			{/* Add New Task */}
			<ExpandableCard
				title="➕ Add New Task"
				subtitle="What needs to get done?"
				defaultExpanded={true}
			>
				<div style={{ marginTop: 12 }}>
					<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
						<input
							type="text"
							value={newTaskText}
							onChange={(e) => setNewTaskText(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleAdd()}
							placeholder="Describe the task..."
							style={{
								width: "100%",
								padding: "12px 14px",
								borderRadius: 8,
								border: `1px solid ${CC_COLORS.border}`,
								background: CC_COLORS.elevated,
								color: CC_COLORS.textPrimary,
								fontSize: 14,
								fontFamily: CC_FONTS.dmSans,
							}}
						/>
						<div style={{ display: "flex", gap: 8 }}>
							<input
								type="text"
								value={newTaskTag}
								onChange={(e) => setNewTaskTag(e.target.value)}
								placeholder="Tag (optional): review, testing, planning..."
								style={{
									flex: 1,
									padding: "10px 14px",
									borderRadius: 8,
									border: `1px solid ${CC_COLORS.border}`,
									background: CC_COLORS.elevated,
									color: CC_COLORS.textPrimary,
									fontSize: 13,
									fontFamily: CC_FONTS.dmSans,
								}}
							/>
							<button
								onClick={handleAdd}
								disabled={!newTaskText.trim()}
								style={{
									padding: "10px 20px",
									borderRadius: 8,
									border: "none",
									background: newTaskText.trim() ? CC_COLORS.purple : CC_COLORS.border,
									color: "white",
									fontSize: 14,
									fontWeight: 500,
									cursor: newTaskText.trim() ? "pointer" : "not-allowed",
									transition: "all 0.2s",
								}}
							>
								Add Task
							</button>
						</div>
					</div>
				</div>
			</ExpandableCard>

			{/* Pending Tasks */}
			<ExpandableCard
				title={`📋 To Do (${pendingTasks.length})`}
				subtitle="Tasks that need your attention"
				defaultExpanded={true}
			>
				<div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
					{pendingTasks.length === 0 ? (
						<div style={{ 
							textAlign: "center", 
							padding: 24, 
							color: CC_COLORS.textMuted,
							background: CC_COLORS.elevated,
							borderRadius: 8,
						}}>
							<span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>🎉</span>
							All caught up! No pending tasks.
						</div>
					) : (
						pendingTasks.map((task) => (
							<TaskRow 
								key={task.id} 
								task={task} 
								onToggle={() => onToggle(task.id)}
								onDelete={() => onDelete(task.id)}
							/>
						))
					)}
				</div>
			</ExpandableCard>

			{/* Completed Tasks */}
			{completedTasks.length > 0 && (
				<ExpandableCard
					title={`✅ Completed (${completedTasks.length})`}
					subtitle="Tasks you've finished"
				>
					<div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
						{completedTasks.map((task) => (
							<TaskRow 
								key={task.id} 
								task={task} 
								onToggle={() => onToggle(task.id)}
								onDelete={() => onDelete(task.id)}
							/>
						))}
					</div>
				</ExpandableCard>
			)}
		</div>
	);
}

function TaskRow({ task, onToggle, onDelete }: { 
	task: Task; 
	onToggle: () => void; 
	onDelete: () => void;
}) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 12,
				padding: "14px 16px",
				borderRadius: 8,
				background: task.done ? `${CC_COLORS.success}08` : CC_COLORS.elevated,
				border: `1px solid ${task.done ? CC_COLORS.success + "20" : CC_COLORS.border}`,
				cursor: "pointer",
				transition: "all 0.2s",
			}}
			onClick={onToggle}
		>
			{/* Checkbox */}
			<div style={{
				width: 22,
				height: 22,
				borderRadius: 6,
				border: `2px solid ${task.done ? CC_COLORS.success : CC_COLORS.textMuted}`,
				background: task.done ? CC_COLORS.success : "transparent",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexShrink: 0,
			}}>
				{task.done && (
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
						<path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				)}
			</div>

			{/* Text */}
			<span style={{
				flex: 1,
				fontSize: 14,
				color: task.done ? CC_COLORS.textMuted : CC_COLORS.textPrimary,
				textDecoration: task.done ? "line-through" : "none",
				fontFamily: CC_FONTS.dmSans,
			}}>
				{task.text}
			</span>

			{/* Tag */}
			{task.tag && (
				<span style={{
					fontSize: 10,
					fontWeight: 600,
					textTransform: "uppercase",
					letterSpacing: "0.05em",
					color: CC_COLORS.purple,
					background: `${CC_COLORS.purple}15`,
					padding: "4px 10px",
					borderRadius: 4,
				}}>
					{task.tag}
				</span>
			)}

			{/* Delete */}
			<button
				onClick={(e) => { e.stopPropagation(); onDelete(); }}
				style={{
					background: "transparent",
					border: "none",
					color: CC_COLORS.textMuted,
					cursor: "pointer",
					padding: 4,
					fontSize: 16,
					opacity: 0.5,
					transition: "opacity 0.2s",
				}}
				onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
				onMouseLeave={(e) => e.currentTarget.style.opacity = "0.5"}
			>
				×
			</button>
		</div>
	);
}
