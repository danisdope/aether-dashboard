import { CommandGlassCard } from "@/components/ui/CommandGlassCard";
import {
	CC_COLORS,
	CC_FONTS,
	CC_TYPOGRAPHY,
	type TaskData,
} from "@/config/command-center";

interface TaskItemProps extends TaskData {
	isLast?: boolean;
}

function TaskItem({ done, text, tag, isLast = false }: TaskItemProps) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 12,
				padding: "10px 0",
				borderBottom: isLast ? "none" : `1px solid ${CC_COLORS.border}`,
			}}
		>
			<div
				style={{
					width: 18,
					height: 18,
					borderRadius: 4,
					border: done ? "none" : `1.5px solid ${CC_COLORS.textMuted}`,
					background: done ? CC_COLORS.textPrimary : "transparent",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexShrink: 0,
				}}
			>
				{done && (
					<span
						style={{
							color: CC_COLORS.bg,
							fontSize: 11,
							fontWeight: 700,
						}}
					>
						✓
					</span>
				)}
			</div>
			<span
				style={{
					fontFamily: CC_FONTS.dmSans,
					fontSize: 14,
					color: done ? CC_COLORS.textMuted : CC_COLORS.textPrimary,
					textDecoration: done ? "line-through" : "none",
					flex: 1,
				}}
			>
				{text}
			</span>
			{tag && (
				<span
					style={{
						...CC_TYPOGRAPHY.badge,
						color: CC_COLORS.textMuted,
						background: CC_COLORS.elevated,
						padding: "3px 8px",
						borderRadius: 4,
					}}
				>
					{tag}
				</span>
			)}
		</div>
	);
}

interface TaskListProps {
	tasks: TaskData[];
}

export function TaskList({ tasks }: TaskListProps) {
	const completedCount = tasks.filter((t) => t.done).length;

	return (
		<div style={{ padding: "28px 0 0" }}>
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
						...CC_TYPOGRAPHY.sectionTitle,
						color: CC_COLORS.textPrimary,
					}}
				>
					Today&apos;s Tasks
				</span>
				<span
					style={{
						...CC_TYPOGRAPHY.mono,
						color: CC_COLORS.textMuted,
					}}
				>
					{completedCount}/{tasks.length}
				</span>
			</div>
			<CommandGlassCard style={{ padding: "4px 20px" }}>
				{tasks.map((task, i) => (
					<TaskItem key={task.text} {...task} isLast={i === tasks.length - 1} />
				))}
			</CommandGlassCard>
		</div>
	);
}
