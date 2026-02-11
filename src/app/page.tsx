"use client";

import { useState } from 'react';
import {
	CommandCenterHeader,
	NoiseOverlay,
	QuickActionBar,
	TabNavigation,
	TodayTab,
	WeekTab,
	TestsTab,
	TasksTab,
	RoadmapTab,
	ActivityTab,
} from "@/components/command-center";
import { CC_COLORS } from "@/config/command-center";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useGitHubData } from "@/hooks/useGitHubData";
import { useTasks } from "@/hooks/useTasks";

export default function CommandCenterPage() {
	const [activeTab, setActiveTab] = useState("today");
	const dashboardData = useDashboardData();
	const githubData = useGitHubData();
	const { tasks, toggleTask, addTask, deleteTask } = useTasks();

	// Format commits for activity tab with full data
	const formattedCommits = githubData.recentCommits.map(c => ({
		hash: c.sha?.substring(0, 7) || "",
		message: c.message || "",
		author: c.author || "",
		timeAgo: c.date ? getTimeAgo(new Date(c.date)) : "",
		status: githubData.workflow?.conclusion || "unknown",
		url: c.url || "",
	}));

	// Merge GitHub data into dashboard data
	const commit = githubData.commit || dashboardData.commit;

	// Count today's commits
	const today = new Date().toDateString();
	const commitsToday = githubData.recentCommits.filter(c => 
		c.date && new Date(c.date).toDateString() === today
	).length;

	// Daily wins based on today's work
	const dailyWins = [
		{
			emoji: "🤖",
			title: "Booking Agent Demo Ready",
			detail: "FAQ in all stages, lock TTL hardened, parent name guard working. T1, T8, T9 all passing.",
			commits: 10,
		},
		{
			emoji: "📊",
			title: "Teacher Dashboard Polished",
			detail: "Report triage dashboard, grading flow fixes, demo generation working.",
			commits: 6,
		},
		{
			emoji: "✅",
			title: "Test Suite Improvements",
			detail: "isFAQPath test refactor, classifier tests updated.",
			commits: 3,
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

			{/* CSS for animations */}
			<style jsx global>{`
				@keyframes pulse {
					0%, 100% { opacity: 1; }
					50% { opacity: 0.5; }
				}
				@keyframes spin {
					to { transform: rotate(360deg); }
				}
			`}</style>

			<div
				style={{
					position: "relative",
					zIndex: 1,
					maxWidth: 960,
					margin: "0 auto",
					padding: "0 32px",
				}}
			>
				{/* Header with real data */}
				<CommandCenterHeader 
					testCount={dashboardData.testHealth.passing}
					allPassing={dashboardData.allTestsPassing}
					prodLive={githubData.workflow?.conclusion === 'success'}
					workDay={dashboardData.workWeek.label}
				/>

				{/* Tab Navigation */}
				<TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

				{/* Quick Links */}
				<QuickActionBar />

				{/* Tab Content */}
				<div style={{ paddingTop: 24, paddingBottom: 48 }}>
					{activeTab === "today" && (
						<TodayTab
							testHealth={dashboardData.testHealth}
							workWeek={dashboardData.workWeek}
							commit={commit}
							tasks={tasks}
							onToggleTask={toggleTask}
							onAddTask={addTask}
							onDeleteTask={deleteTask}
							dailyWins={dailyWins}
							commitsToday={commitsToday}
						/>
					)}

					{activeTab === "week" && (
						<WeekTab workWeek={dashboardData.workWeek} />
					)}

					{activeTab === "tests" && (
						<TestsTab 
							testHealth={dashboardData.testHealth}
							ciStatus={githubData.workflow?.conclusion || dashboardData.ciStatus}
						/>
					)}

					{activeTab === "tasks" && (
						<TasksTab
							tasks={tasks}
							onToggle={toggleTask}
							onAdd={addTask}
							onDelete={deleteTask}
						/>
					)}

					{activeTab === "roadmap" && (
						<RoadmapTab />
					)}

					{activeTab === "activity" && (
						<ActivityTab recentCommits={formattedCommits} />
					)}
				</div>
			</div>
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
