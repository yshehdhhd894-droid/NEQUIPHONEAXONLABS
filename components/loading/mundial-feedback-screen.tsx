import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FEEDBACK_SUCCESS_MUNDIAL_HTML } from "@/libs/feedback-success-mundial-html";
import { MUNDIAL_FEEDBACK_MS } from "@/libs/mundial-timing";
import { MUNDIAL_RESTART_ANIMATIONS_JS } from "@/libs/mundial-webview-scripts";
import { MundialWebView } from "./mundial-webview";

type Props = {
	onComplete: () => void;
	durationMs?: number;
};

/** Personaje pateando + "¡Listo!" en fondo morado, antes del comprobante. */
export function MundialFeedbackScreen({
	onComplete,
	durationMs = MUNDIAL_FEEDBACK_MS,
}: Props) {
	const [mountKey] = useState(() => Date.now());
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const animStartedRef = useRef(false);

	const handleAnimationStart = useCallback(() => {
		if (animStartedRef.current) return;
		animStartedRef.current = true;

		timerRef.current = setTimeout(() => {
			onComplete();
		}, durationMs);
	}, [durationMs, onComplete]);

	useEffect(
		() => () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		},
		[],
	);

	return (
		<View style={styles.screen}>
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
	screen: {
		flex: 1,
		backgroundColor: "#fbf7fb",
	},
});
