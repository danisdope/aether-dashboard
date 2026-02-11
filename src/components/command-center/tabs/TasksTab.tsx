"use client";

import { useState } from "react";
import { CC_COLORS, CC_FONTS } from "@/config/command-center";
import { ExpandableCard } from "../ExpandableCard";

interface Task {
	id: string;
	text: string;
	done: boolean;
	tag?: string;
	details?: string;
	createdAt?: string;
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
	const [newTaskDetails, setNewTaskDetails] = useState("");
	const [showAdvanced, setShowAdvanced] = useState(false);
	
	const completedTasks = tasks.filter(t => t.done);
	const pendingTasks = tasks.filter(t => !t.done);

	const handleAdd = () => {
		if (newTaskText.trim()) {
			onAdd(newTaskText.trim(), newTaskTag.trim() || undefined);
			setNewTaskText("");
			setNewTaskTag("");
			setNewTaskDetails("");
			setShowAdvanced(false);
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
							onKeyDown={(e) => e.key === "Enter" && !showAdvanced && handleAdd()}
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
						
						{/* Advanced options toggle */}
						<button
							onClick={() => setShowAdvanced(!showAdvanced)}
							style={{
								background: "transparent",
								border: "none",
								color: CC_COLORS.textMuted,
								fontSize: 12,
								cursor: "pointer",
								textAlign: "left",
								padding: "4px 0",
							}}
						>
							{showAdvanced ? "▼ Hide details" : "▶ Add details (optional)"}
						</button>

						{showAdvanced && (
							<>
								<textarea
									value={newTaskDetails}
									onChange={(e) => setNewTaskDetails(e.target.value)}
									placeholder="Add more context, links, or notes..."
									rows={3}
									style={{
										width: "100%",
										padding: "12px 14px",
										borderRadius: 8,
										border: `1px solid ${CC_COLORS.border}`,
										background: CC_COLORS.elevated,
										color: CC_COLORS.textPrimary,
										fontSize: 13,
										fontFamily: CC_FONTS.dmSans,
										resize: "vertical",
									}}
								/>
								<input
									type="text"
									value={newTaskTag}
									onChange={(e) => setNewTaskTag(e.target.value)}
									placeholder="Tag: review, testing, planning, urgent..."
									style={{
										width: "100%",
										padding: "10px 14px",
										borderRadius: 8,
										border: `1px solid ${CC_COLORS.border}`,
										background: CC_COLORS.elevated,
										color: CC_COLORS.textPrimary,
										fontSize: 13,
										fontFamily: CC_FONTS.dmSans,
									}}
								/>
							</>
						)}

						<button
							onClick={handleAdd}
							disabled={!newTaskText.trim()}
							style={{
								padding: "12px 20px",
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
							<ExpandableTaskRow 
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
							<ExpandableTaskRow 
								key={task.id} 
								task={task} 
								onToggle={() => onToggle(task.id)}
								onDelete={() => onDelete(task.id)}
							/>
						))}
					</div>
				</ExpandableCard>
			)}

			{/* Quick Stats */}
			<ExpandableCard
				title="📊 Task Stats"
				subtitle="Your productivity at a glance"
			>
				<div style={{ 
					marginTop: 12, 
					display: "grid", 
					gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", 
					gap: 12 
				}}>
					<StatBox label="Total" value={tasks.length.toString()} color={CC_COLORS.textPrimary} />
					<StatBox label="Pending" value={pendingTasks.length.toString()} color={CC_COLORS.warning} />
					<StatBox label="Done" value={completedTasks.length.toString()} color={CC_COLORS.success} />
					<StatBox 
						label="Rate" 
						value={tasks.length > 0 ? `${Math.round((completedTasks.length / tasks.length) * 100)}%` : "0%"} 
						color={CC_COLORS.purple} 
					/>
				</div>
			</ExpandableCard>
		</div>
	);
}

function ExpandableTaskRow({ task, onToggle, onDelete }: { 
	task: Task; 
	onToggle: () => void; 
	onDelete: () => void;
}) {
	const [expanded, setExpanded] = useState(false);

	return (
		<div
			style={{
				borderRadius: 8,
				background: task.done ? `${CC_COLORS.success}08` : CC_COLORS.elevated,
				border: `1px solid ${task.done ? CC_COLORS.success + "20" : CC_COLORS.border}`,
				overflow: "hidden",
			}}
		>
			{/* Main row */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 12,
					padding: "14px 16px",
					cursor: "pointer",
				}}
			>
				{/* Checkbox */}
				<div
					onClick={(e) => { e.stopPropagation(); onToggle(); }}
					style={{
						width: 22,
						height: 22,
						borderRadius: 6,
						border: `2px solid ${task.done ? CC_COLORS.success : CC_COLORS.textMuted}`,
						background: task.done ? CC_COLORS.success : "transparent",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexShrink: 0,
						cursor: "pointer",
					}}
				>
					{task.done && (
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
							<path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					)}
				</div>

				{/* Text */}
				<span 
					onClick={() => setExpanded(!expanded)}
					style={{
						flex: 1,
						fontSize: 14,
						color: task.done ? CC_COLORS.textMuted : CC_COLORS.textPrimary,
						textDecoration: task.done ? "line-through" : "none",
						fontFamily: CC_FONTS.dmSans,
						cursor: "pointer",
					}}
				>
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

				{/* Expand button */}
				<button
					onClick={() => setExpanded(!expanded)}
					style={{
						background: "transparent",
						border: "none",
						color: CC_COLORS.textMuted,
						cursor: "pointer",
						padding: 4,
						fontSize: 12,
						transition: "transform 0.2s",
						transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
					}}
				>
					▼
				</button>

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

			{/* Expanded details */}
			{expanded && (
				<div style={{
					padding: "12px 16px",
					borderTop: `1px solid ${CC_COLORS.border}`,
					background: CC_COLORS.surface,
				}}>
					<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
						{task.details ? (
							<p style={{ fontSize: 13, color: CC_COLORS.textSecondary, lineHeight: 1.5 }}>
								{task.details}
							</p>
						) : (
							<p style={{ fontSize: 13, color: CC_COLORS.textMuted, fontStyle: "italic" }}>
								No additional details
							</p>
						)}
						
						<div style={{ display: "flex", gap: 16, fontSize: 11, color: CC_COLORS.textMuted }}>
							{task.createdAt && (
								<span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
							)}
							<span>Status: {task.done ? "Completed ✓" : "Pending"}</span>
							{task.tag && <span>Tag: {task.tag}</span>}
						</div>

						<div style={{ display: "flex", gap: 8, marginTop: 8 }}>
							<button
								onClick={onToggle}
								style={{
									padding: "6px 12px",
									borderRadius: 6,
									border: `1px solid ${CC_COLORS.border}`,
									background: "transparent",
									color: CC_COLORS.textSecondary,
									fontSize: 12,
									cursor: "pointer",
								}}
							>
								{task.done ? "Mark as pending" : "Mark as done"}
							</button>
							<button
								onClick={onDelete}
								style={{
									padding: "6px 12px",
									borderRadius: 6,
									border: `1px solid ${CC_COLORS.danger}30`,
									background: "transparent",
									color: CC_COLORS.danger,
									fontSize: 12,
									cursor: "pointer",
								}}
							>
								Delete task
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
	return (
		<div style={{
			padding: 14,
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
