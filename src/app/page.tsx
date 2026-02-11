"use client";

import { useState } from 'react';
import {
	AetherChatInput,
	CommandCenterHeader,
	LatestCommitCard,
	MetricCard,
	NoiseOverlay,
	QuickActionBar,
	TabNavigation,
	TestHealthCard,
} from "@/components/command-center";
import {
	CC_COLORS,
	CC_QUICK_ACTIONS,
} from "@/config/command-center";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useTasks } from "@/hooks/useTasks";

export default function CommandCenterPage() {
	const dashboardData = useDashboardData();
	const { tasks, completedCount, totalCount, toggleTask, addTask, deleteTask } = useTasks();

	// Dynamic metrics based on real data
	const metrics = [
		{
			value: dashboardData.testHealth.passing.toString(),
			label: "Tests Passing",
			sublabel: dashboardData.allTestsPassing ? "100% · all green" : `${Math.round((dashboardData.testHealth.passing / dashboardData.testHealth.total) * 100)}%`,
			color: dashboardData.allTestsPassing ? CC_COLORS.success : CC_COLORS.warning,
		},
		{
			value: dashboardData.promptfoo.count.toString(),
			label: "Promptfoo",
			sublabel: dashboardData.promptfoo.status,
			color: CC_COLORS.textSecondary,
		},
		{
			value: `${completedCount}/${totalCount}`,
			label: "Tasks Done",
			sublabel: completedCount === totalCount ? "All done! 🎉" : "In progress",
			color: completedCount === totalCount ? CC_COLORS.success : CC_COLORS.warning,
		},
		{
			value: dashboardData.ciStatus === 'success' ? '✓' : dashboardData.ciStatus === 'failure' ? '✗' : '•',
			label: "CI Status",
			sublabel: dashboardData.ciStatus,
			color: dashboardData.ciStatus === 'success' 
				? CC_COLORS.success 
				: dashboardData.ciStatus === 'failure'
				? CC_COLORS.danger
				: CC_COLORS.textSecondary,
		},
	];

	return (
		<div
			style={{
				background: CC_COLORS.bg,
				minHeight: "100vh",
				color: CC_COLORS.textPrimary,
				position: "relative",
			}}
		>
			<NoiseOverlay />

			<div
				style={{
					position: "relative",
					zIndex: 1,
					maxWidth: 960,
					margin: "0 auto",
					padding: "0 32px",
				}}
			>
				<CommandCenterHeader 
					testCount={dashboardData.testHealth.passing}
					allPassing={dashboardData.allTestsPassing}
					prodLive={dashboardData.ciStatus === 'success'}
					workDay={dashboardData.workWeek.label}
				/>
				<TabNavigation />

				{/* Metrics row */}
				<div
					style={{
						display: "flex",
						gap: 12,
						padding: "24px 0 0",
						flexWrap: "wrap",
					}}
				>
					{metrics.map((metric) => (
						<MetricCard key={metric.label} {...metric} />
					))}
				</div>

				{/* Latest commit - real data */}
				{dashboardData.commit && !dashboardData.loading ? (
					<LatestCommitCard
						hash={dashboardData.commit.hash}
						status={dashboardData.commit.status as 'passed' | 'failed' | 'skipped'}
						message={dashboardData.commit.message}
						timeAgo={dashboardData.commit.timeAgo}
					/>
				) : (
					<div style={{ padding: "16px 0", color: CC_COLORS.textMuted }}>
						Loading commit data...
					</div>
				)}

				<QuickActionBar actions={CC_QUICK_ACTIONS} />
				<AetherChatInput />
				
				{/* Interactive task list */}
				<TaskListInteractive 
					tasks={tasks}
					onToggle={toggleTask}
					onAdd={addTask}
					onDelete={deleteTask}
					completedCount={completedCount}
					totalCount={totalCount}
				/>

				{/* Test Health with real data */}
				<TestHealthCard 
					total={dashboardData.testHealth.total}
					passing={dashboardData.testHealth.passing}
					suites={dashboardData.testHealth.suites}
				/>

				{/* Bottom spacer */}
				<div style={{ height: 48 }} />
			</div>
		</div>
	);
}

// Interactive task list component
function TaskListInteractive({ 
	tasks, 
	onToggle, 
	onAdd, 
	onDelete,
	completedCount,
	totalCount,
}: { 
	tasks: Array<{ id: string; text: string; done: boolean; tag?: string }>;
	onToggle: (id: string) => void;
	onAdd: (text: string, tag?: string) => void;
	onDelete: (id: string) => void;
	completedCount: number;
	totalCount: number;
}) {
	const [showAdd, setShowAdd] = useState(false);
	const [newText, setNewText] = useState('');

	const handleAdd = () => {
		if (newText.trim()) {
			onAdd(newText.trim());
			setNewText('');
			setShowAdd(false);
		}
	};

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
				<span
					style={{
						fontFamily: "var(--font-outfit), sans-serif",
						fontSize: 15,
						fontWeight: 600,
						color: CC_COLORS.textPrimary,
					}}
				>
					Today's Tasks
				</span>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					<span
						style={{
							fontFamily: "var(--font-jetbrains), monospace",
							fontSize: 12,
							color: CC_COLORS.textMuted,
						}}
					>
						{completedCount}/{totalCount}
					</span>
					<button
						onClick={() => setShowAdd(!showAdd)}
						style={{
							background: 'transparent',
							border: `1px solid ${CC_COLORS.border}`,
							borderRadius: 6,
							padding: '4px 8px',
							color: CC_COLORS.textSecondary,
							cursor: 'pointer',
							fontSize: 12,
						}}
					>
						+ Add
					</button>
				</div>
			</div>

			{showAdd && (
				<div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
					<input
						type="text"
						value={newText}
						onChange={(e) => setNewText(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
						placeholder="New task..."
						autoFocus
						style={{
							flex: 1,
							background: CC_COLORS.elevated,
							border: `1px solid ${CC_COLORS.border}`,
							borderRadius: 8,
							padding: '8px 12px',
							color: CC_COLORS.textPrimary,
							fontSize: 14,
						}}
					/>
					<button
						onClick={handleAdd}
						style={{
							background: CC_COLORS.purple,
							border: 'none',
							borderRadius: 8,
							padding: '8px 16px',
							color: 'white',
							cursor: 'pointer',
							fontSize: 14,
							fontWeight: 500,
						}}
					>
						Add
					</button>
				</div>
			)}

			<div
				style={{
					background: CC_COLORS.surface,
					border: `1px solid ${CC_COLORS.border}`,
					borderRadius: 12,
					overflow: 'hidden',
				}}
			>
				{tasks.length === 0 ? (
					<div style={{ padding: 16, textAlign: 'center', color: CC_COLORS.textMuted }}>
						No tasks yet. Add one above!
					</div>
				) : (
					tasks.map((task, i) => (
						<div
							key={task.id}
							onClick={() => onToggle(task.id)}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 12,
								padding: '14px 16px',
								borderBottom: i < tasks.length - 1 ? `1px solid ${CC_COLORS.border}` : 'none',
								cursor: 'pointer',
								transition: 'background 0.15s',
							}}
							onMouseEnter={(e) => e.currentTarget.style.background = CC_COLORS.elevated}
							onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
						>
							{/* Checkbox */}
							<div
								style={{
									width: 20,
									height: 20,
									borderRadius: 6,
									border: `2px solid ${task.done ? CC_COLORS.success : CC_COLORS.textMuted}`,
									background: task.done ? CC_COLORS.success : 'transparent',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									flexShrink: 0,
								}}
							>
								{task.done && (
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
										<path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								)}
							</div>

							{/* Text */}
							<span
								style={{
									flex: 1,
									fontFamily: "var(--font-dm-sans), sans-serif",
									fontSize: 14,
									color: task.done ? CC_COLORS.textMuted : CC_COLORS.textPrimary,
									textDecoration: task.done ? 'line-through' : 'none',
								}}
							>
								{task.text}
							</span>

							{/* Tag */}
							{task.tag && (
								<span
									style={{
										fontFamily: "var(--font-dm-sans), sans-serif",
										fontSize: 10,
										fontWeight: 600,
										textTransform: 'uppercase',
										letterSpacing: '0.05em',
										color: CC_COLORS.textMuted,
										background: CC_COLORS.elevated,
										padding: '4px 8px',
										borderRadius: 4,
									}}
								>
									{task.tag}
								</span>
							)}

							{/* Delete */}
							<button
								onClick={(e) => {
									e.stopPropagation();
									onDelete(task.id);
								}}
								style={{
									background: 'transparent',
									border: 'none',
									color: CC_COLORS.textMuted,
									cursor: 'pointer',
									padding: 4,
									opacity: 0.5,
									transition: 'opacity 0.15s',
								}}
								onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
								onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
							>
								✕
							</button>
						</div>
					))
				)}
			</div>
		</div>
	);
}
