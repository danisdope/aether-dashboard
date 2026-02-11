import { CC_COLORS } from "@/config/command-center";

// ─── OWL LOGO (header brand mark) ───
export function OwlLogo({ size = 26 }: { size?: number }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 32 32"
			fill="none"
			aria-hidden="true"
		>
			{/* Ear tufts */}
			<path
				d="M9 8 L11 3 L12.5 9"
				stroke="#E5E5E5"
				strokeWidth="1.2"
				strokeLinejoin="round"
				fill="none"
			/>
			<path
				d="M23 8 L21 3 L19.5 9"
				stroke="#E5E5E5"
				strokeWidth="1.2"
				strokeLinejoin="round"
				fill="none"
			/>
			{/* Head outline */}
			<circle
				cx="16"
				cy="14"
				r="10"
				stroke="#E5E5E5"
				strokeWidth="1.2"
				fill="none"
			/>
			{/* Left eye */}
			<circle
				cx="12"
				cy="13"
				r="3.8"
				stroke="#E5E5E5"
				strokeWidth="0.9"
				fill="none"
			/>
			<circle cx="12" cy="13" r="1.8" fill="#E5E5E5" />
			<circle cx="12.6" cy="12.4" r="0.6" fill="#0E0E0E" />
			{/* Right eye */}
			<circle
				cx="20"
				cy="13"
				r="3.8"
				stroke="#E5E5E5"
				strokeWidth="0.9"
				fill="none"
			/>
			<circle cx="20" cy="13" r="1.8" fill="#E5E5E5" />
			<circle cx="20.6" cy="12.4" r="0.6" fill="#0E0E0E" />
			{/* Beak */}
			<path d="M15 17.5 L16 19.5 L17 17.5" fill="#E5E5E5" />
			{/* Body hint */}
			<path
				d="M10 23 Q16 30 22 23"
				stroke="#E5E5E5"
				strokeWidth="0.7"
				fill="none"
				opacity="0.3"
			/>
		</svg>
	);
}

// ─── OWL AVATAR (Aether presence) ───
export function OwlAvatar({
	size = 34,
	showOnline = true,
}: {
	size?: number;
	showOnline?: boolean;
}) {
	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: "50%",
				background: CC_COLORS.bg,
				border: "1.5px solid rgba(255,255,255,0.12)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				position: "relative",
			}}
		>
			<svg
				width={size * 0.6}
				height={size * 0.6}
				viewBox="0 0 24 24"
				fill="none"
				aria-hidden="true"
			>
				<path
					d="M7 6 L9 3 L10 7"
					stroke="#D4D4D4"
					strokeWidth="1"
					strokeLinejoin="round"
					fill="none"
				/>
				<path
					d="M17 6 L15 3 L14 7"
					stroke="#D4D4D4"
					strokeWidth="1"
					strokeLinejoin="round"
					fill="none"
				/>
				<circle
					cx="9"
					cy="11"
					r="3"
					stroke="#D4D4D4"
					strokeWidth="0.8"
					fill="none"
				/>
				<circle cx="9" cy="11" r="1.3" fill="#D4D4D4" />
				<circle
					cx="15"
					cy="11"
					r="3"
					stroke="#D4D4D4"
					strokeWidth="0.8"
					fill="none"
				/>
				<circle cx="15" cy="11" r="1.3" fill="#D4D4D4" />
				<path d="M11 15 L12 17 L13 15" fill="#D4D4D4" />
			</svg>
			{showOnline && (
				<div
					style={{
						position: "absolute",
						bottom: -1,
						right: -1,
						width: 9,
						height: 9,
						borderRadius: "50%",
						background: CC_COLORS.success,
						border: `2px solid ${CC_COLORS.bg}`,
					}}
				/>
			)}
		</div>
	);
}

// ─── MINI OWL (for chat input) ───
export function OwlMini() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
			style={{ opacity: 0.4 }}
		>
			<circle
				cx="9"
				cy="11"
				r="2.8"
				stroke="#E5E5E5"
				strokeWidth="0.8"
				fill="none"
			/>
			<circle cx="9" cy="11" r="1.1" fill="#E5E5E5" />
			<circle
				cx="15"
				cy="11"
				r="2.8"
				stroke="#E5E5E5"
				strokeWidth="0.8"
				fill="none"
			/>
			<circle cx="15" cy="11" r="1.1" fill="#E5E5E5" />
			<path
				d="M7 6 L9 3 L10 7"
				stroke="#E5E5E5"
				strokeWidth="0.8"
				strokeLinejoin="round"
				fill="none"
			/>
			<path
				d="M17 6 L15 3 L14 7"
				stroke="#E5E5E5"
				strokeWidth="0.8"
				strokeLinejoin="round"
				fill="none"
			/>
			<path d="M11 15 L12 17 L13 15" fill="#E5E5E5" />
		</svg>
	);
}
