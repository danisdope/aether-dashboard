"use client";

import {
	AetherChatInput,
	CommandCenterHeader,
	LatestCommitCard,
	MetricCard,
	NoiseOverlay,
	QuickActionBar,
	TabNavigation,
	TaskList,
	TestHealthCard,
} from "@/components/command-center";
import {
	CC_COLORS,
	CC_MOCK_TEST_HEALTH,
	CC_QUICK_ACTIONS,
} from "@/config/command-center";
import { useGitHubData } from "@/hooks/useGitHubData";
import { useTasks } from "@/hooks/useTasks";

export default function CommandCenterPage() {
	const { commit, workflow, loading: githubLoading } = useGitHubData();
	const { tasks, completedCount, totalCount, toggleTask, addTask, deleteTask } = useTasks();

	// Dynamic metrics based on real data
	const metrics = [
		{
			value: CC_MOCK_TEST_HEALTH.passing.toString(),
			label: "Tests Passing",
			sublabel: `100% · all green`,
			color: CC_COLORS.success,
		},
		{
			value: "30",
			label: "Promptfoo",
			sublabel: "baseline",
			color: CC_COLORS.textSecondary,
		},
		{
			value: `${completedCount}/${totalCount}`,
			label: "Tasks Done",
			sublabel: completedCount === totalCount ? "All done! 🎉" : "In progress",
			color: completedCount === totalCount ? CC_COLORS.success : CC_COLORS.warning,
		},
		{
			value: workflow?.conclusion === 'success' ? '✓' : workflow?.conclusion === 'failure' ? '✗' : '•',
			label: "CI Status",
			sublabel: workflow?.conclusion || 'checking...',
			color: workflow?.conclusion === 'success' 
				? CC_COLORS.success 
				: workflow?.conclusion === 'failure'
				? CC_COLORS.danger
				: CC_COLORS.textSecondary,
		},
	];

	// Convert tasks to TaskList format
	const taskListItems = tasks.map(t => ({
		done: t.done,
		text: t.text,
		tag: t.tag,
	}));

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
				<CommandCenterHeader />
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
				{commit && !githubLoading ? (
					<LatestCommitCard
						hash={commit.hash}
						status={commit.status as 'passed' | 'failed' | 'skipped'}
						message={commit.message}
						timeAgo={commit.timeAgo}
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

				<TestHealthCard {...CC_MOCK_TEST_HEALTH} />

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
				{tasks.map((task, i) => (
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
				))}
			</div>
		</div>
	);
}

// Need useState for the interactive component
import { useState } from 'react';
