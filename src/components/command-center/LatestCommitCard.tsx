import { CommandGlassCard } from "@/components/ui/CommandGlassCard";
import {
	CC_COLORS,
	CC_FONTS,
	CC_TYPOGRAPHY,
	type CommitData,
} from "@/config/command-center";

const STATUS_COLORS: Record<CommitData["status"], string> = {
	passed: CC_COLORS.success,
	failed: CC_COLORS.danger,
	skipped: CC_COLORS.warning,
};

export function LatestCommitCard({
	hash,
	status,
	message,
	timeAgo,
}: CommitData) {
	const statusColor = STATUS_COLORS[status];

	return (
		<div style={{ padding: "20px 0 0" }}>
			<CommandGlassCard style={{ padding: "14px 20px" }}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 16,
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 12,
							minWidth: 0,
							flex: 1,
						}}
					>
						<span
							style={{
								...CC_TYPOGRAPHY.mono,
								color: CC_COLORS.textSecondary,
								flexShrink: 0,
							}}
						>
							{hash}
						</span>
						<span
							style={{
								...CC_TYPOGRAPHY.badge,
								color: statusColor,
								background: `${statusColor}12`,
								padding: "2px 8px",
								borderRadius: 4,
								flexShrink: 0,
							}}
						>
							{status}
						</span>
						<span
							style={{
								fontFamily: CC_FONTS.dmSans,
								fontSize: 13,
								color: CC_COLORS.textSecondary,
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
							}}
						>
							{message}
						</span>
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 10,
							flexShrink: 0,
						}}
					>
						<span
							style={{
								fontFamily: CC_FONTS.dmSans,
								fontSize: 11,
								color: CC_COLORS.textMuted,
							}}
						>
							{timeAgo}
						</span>
						<span
							style={{
								color: CC_COLORS.textMuted,
								cursor: "pointer",
								fontSize: 13,
							}}
						>
							↗
						</span>
					</div>
				</div>
			</CommandGlassCard>
		</div>
	);
}
