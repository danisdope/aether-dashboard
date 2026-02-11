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
	CC_MOCK_COMMIT,
	CC_MOCK_METRICS,
	CC_MOCK_TASKS,
	CC_MOCK_TEST_HEALTH,
	CC_QUICK_ACTIONS,
} from "@/config/command-center";

export default function CommandCenterPage() {
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
					{CC_MOCK_METRICS.map((metric) => (
						<MetricCard key={metric.label} {...metric} />
					))}
				</div>

				<LatestCommitCard {...CC_MOCK_COMMIT} />
				<QuickActionBar actions={CC_QUICK_ACTIONS} />
				<AetherChatInput />
				<TaskList tasks={CC_MOCK_TASKS} />
				<TestHealthCard {...CC_MOCK_TEST_HEALTH} />

				{/* Bottom spacer */}
				<div style={{ height: 48 }} />
			</div>
		</div>
	);
}
