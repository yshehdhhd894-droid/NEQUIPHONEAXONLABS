import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { LOADING_MUNDIAL_HTML } from "@/libs/loading-mundial-html";
import { setPwaThemeColor } from "@/libs/pwa-theme-color";
import { MUNDIAL_RESTART_ANIMATIONS_JS } from "@/libs/mundial-webview-scripts";
import { MundialWebView } from "./mundial-webview";

const FADE_IN_MS = 220;
const FADE_OUT_MS = 280;

type Props = {
	isHiding: boolean;
	onFinish: () => void;
};

/** Loading Mundial: rombo + pelota (sin escala que distorsione el SVG). */
export function MundialLoadingOverlay({ isHiding, onFinish }: Props) {
	const [readyToUnmount, setReadyToUnmount] = useState(false);
	const [mountKey] = useState(() => Date.now());
	const opacity = useSharedValue(0);

	useEffect(() => {
		setPwaThemeColor("#FFFFFF");
		opacity.value = withTiming(1, {
			duration: FADE_IN_MS,
			easing: Easing.out(Easing.ease),
		});
	}, [opacity]);

	useEffect(() => {
		if (!isHiding) return;

		opacity.value = withTiming(0, {
			duration: FADE_OUT_MS,
			easing: Easing.in(Easing.ease),
		});

		const finishTimer = setTimeout(() => {
			setReadyToUnmount(true);
			onFinish();
		}, FADE_OUT_MS + 40);

		return () => clearTimeout(finishTimer);
	}, [isHiding, onFinish, opacity]);

	const overlayStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	if (readyToUnmount) return null;

	return (
		<Animated.View style={[styles.overlay, overlayStyle]} pointerEvents="auto">
			<MundialWebView
				key={mountKey}
				html={LOADING_MUNDIAL_HTML}
				backgroundColor="#FFFFFF"
				androidLayerType="software"
				injectedJavaScript={MUNDIAL_RESTART_ANIMATIONS_JS}
			/>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "#FFFFFF",
		zIndex: 90,
		elevation: 16,
	},
});
