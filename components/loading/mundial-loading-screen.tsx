import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { LOADING_MUNDIAL_HTML } from "@/libs/loading-mundial-html";
import { MUNDIAL_LOADING_MIN_MS } from "@/libs/mundial-timing";
import { MUNDIAL_RESTART_ANIMATIONS_JS } from "@/libs/mundial-webview-scripts";
import { MundialWebView } from "./mundial-webview";

type Props = {
	onComplete: () => void;
	minMs?: number;
};

/** Pantalla completa de loading mundial (rombo + pelota). */
export function MundialLoadingScreen({
	onComplete,
	minMs = MUNDIAL_LOADING_MIN_MS,
}: Props) {
	const [mountKey] = useState(() => Date.now());

	useEffect(() => {
		const timer = setTimeout(onComplete, minMs);
		return () => clearTimeout(timer);
	}, [minMs, onComplete]);

	return (
		<View style={styles.screen}>
			<MundialWebView
				key={mountKey}
				html={LOADING_MUNDIAL_HTML}
				backgroundColor="#FFFFFF"
				androidLayerType="software"
				injectedJavaScript={MUNDIAL_RESTART_ANIMATIONS_JS}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
});
