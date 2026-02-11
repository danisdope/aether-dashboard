export function NoiseOverlay() {
	return (
		<svg
			aria-hidden="true"
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				pointerEvents: "none",
				zIndex: 0,
				opacity: 0.08,
			}}
		>
			<filter id="noise">
				<feTurbulence
					type="fractalNoise"
					baseFrequency="0.65"
					numOctaves={4}
					stitchTiles="stitch"
				/>
				<feColorMatrix type="saturate" values="0" />
			</filter>
			<rect width="100%" height="100%" filter="url(#noise)" />
		</svg>
	);
}
