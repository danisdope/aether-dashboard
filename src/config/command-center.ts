// ─── Design Tokens ───

export const CC_COLORS = {
	bg: "#050505",
	surface: "#0E0E0E",
	elevated: "#171717",
	border: "rgba(255,255,255,0.06)",
	borderHover: "rgba(255,255,255,0.10)",
	purpleWhisper: "rgba(167,139,250,0.10)",
	textPrimary: "#F5F5F5",
	textSecondary: "#A0A0A0",
	textTertiary: "#666666",
	textMuted: "#444444",
	success: "#34D399",
	warning: "#FBBF24",
	danger: "#F87171",
	info: "#60A5FA",
	purple: "#A78BFA",
} as const;

export const CC_FONTS = {
	outfit: "var(--font-outfit), 'Outfit', sans-serif",
	dmSans: "var(--font-dm-sans), 'DM Sans', sans-serif",
	jetbrains: "var(--font-jetbrains), 'JetBrains Mono', monospace",
} as const;

export const CC_TYPOGRAPHY = {
	heading: {
		fontFamily: CC_FONTS.outfit,
		fontWeight: 700,
		letterSpacing: "-0.025em",
	},
	sectionTitle: {
		fontFamily: CC_FONTS.outfit,
		fontSize: 15,
		fontWeight: 600,
		letterSpacing: "-0.01em",
	},
	body: {
		fontFamily: CC_FONTS.dmSans,
		fontSize: 14,
	},
	label: {
		fontFamily: CC_FONTS.dmSans,
		fontSize: 13,
	},
	caption: {
		fontFamily: CC_FONTS.dmSans,
		fontSize: 12,
	},
	badge: {
		fontFamily: CC_FONTS.dmSans,
		fontSize: 10,
		fontWeight: 600,
		textTransform: "uppercase" as const,
		letterSpacing: "0.05em",
	},
	mono: {
		fontFamily: CC_FONTS.jetbrains,
		fontSize: 12,
		fontWeight: 500,
	},
	monoLarge: {
		fontFamily: CC_FONTS.jetbrains,
		fontSize: 28,
		fontWeight: 700,
		letterSpacing: "-0.02em",
	},
} as const;

// ─── Quick Actions ───

export interface QuickAction {
	icon: string;
	label: string;
	href?: string;
}

export const CC_QUICK_ACTIONS: QuickAction[] = [
	{ icon: "✎", label: "Tests" },
	{ icon: "◉", label: "GitHub" },
	{ icon: "⬆", label: "Production" },
	{ icon: "▦", label: "Supabase" },
	{ icon: "◧", label: "Langfuse" },
	{ icon: "▲", label: "Vercel" },
];

// ─── Mock Data ───

export interface MetricData {
	value: string;
	label: string;
	sublabel?: string;
	color: string;
}

export const CC_MOCK_METRICS: MetricData[] = [
	{
		value: "469",
		label: "Tests Passing",
		sublabel: "100% · all green",
		color: CC_COLORS.success,
	},
	{
		value: "30",
		label: "Promptfoo",
		sublabel: "baseline",
		color: CC_COLORS.textSecondary,
	},
	{
		value: "1/5",
		label: "Week Progress",
		sublabel: "Day 1 · 15%",
		color: CC_COLORS.warning,
	},
	{
		value: "8",
		label: "Streak",
		sublabel: "days",
		color: CC_COLORS.textPrimary,
	},
];

export interface TaskData {
	done: boolean;
	text: string;
	tag?: string;
}

export const CC_MOCK_TASKS: TaskData[] = [
	{
		done: true,
		text: "Deploy MOCK_MODE fix to production",
		tag: "deploy",
	},
	{
		done: false,
		text: "Review booking agent prompt changes",
		tag: "review",
	},
	{
		done: false,
		text: "Update CS dashboard implementation plan",
		tag: "planning",
	},
];

export interface CommitData {
	hash: string;
	status: "passed" | "failed" | "skipped";
	message: string;
	timeAgo: string;
}

export const CC_MOCK_COMMIT: CommitData = {
	hash: "73162d3",
	status: "skipped",
	message: "fix(email): add MOCK_MODE guards to confirmation email",
	timeAgo: "4m ago",
};

export interface TestHealthData {
	total: number;
	passing: number;
	suites: { name: string; count: number }[];
}

export const CC_MOCK_TEST_HEALTH: TestHealthData = {
	total: 469,
	passing: 469,
	suites: [
		{ name: "aetherion-core", count: 351 },
		{ name: "mcp-server", count: 118 },
	],
};
