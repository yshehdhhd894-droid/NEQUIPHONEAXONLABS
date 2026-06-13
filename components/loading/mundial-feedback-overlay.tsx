import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FEEDBACK_SUCCESS_MUNDIAL_HTML } from "@/libs/feedback-success-mundial-html";
import { MUNDIAL_FEEDBACK_MS } from "@/libs/mundial-timing";
import { MUNDIAL_RESTART_ANIMATIONS_JS } from "@/libs/mundial-webview-scripts";
import { MundialWebView } from "./mundial-webview";

type Props = {
	onFinish?: () => void;
	durationMs?: number;
};

/**
 * Personaje rosa pateando + "¡Listo!" sobre el comprobante ya renderizado.
 */
export function MundialFeedbackOverlay({
	onFinish,
	durationMs = MUNDIAL_FEEDBACK_MS,
}: Props) {
	const [visible, setVisible] = useState(true);
	const [mountKey] = useState(() => Date.now());
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const animStartedRef = useRef(false);

	const handleAnimationStart = useCallback(() => {
		if (animStartedRef.current) return;
		animStartedRef.current = true;

		timerRef.current = setTimeout(() => {
			setVisible(false);
			onFinish?.();
		}, durationMs);
	}, [durationMs, onFinish]);

	useEffect(
		() => () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		},
		[],
	);

	if (!visible) return null;

	return (
		<View style={styles.overlay} pointerEvents="auto">
			<MundialWebView
				key={mountKey}
				html={FEEDBACK_SUCCESS_MUNDIAL_HTML}
				backgroundColor="transparent"
				androidLayerType="software"
				injectedJavaScript={MUNDIAL_RESTART_ANIMATIONS_JS}
				onAnimationStart={handleAnimationStart}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(255, 255, 255, 0.94)",
		zIndex: 100,
		elevation: 20,
	},
});
