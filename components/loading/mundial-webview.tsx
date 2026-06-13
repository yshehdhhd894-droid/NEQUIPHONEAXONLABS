import { useRef, useEffect, createElement } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

type Props = {
	html: string;
	backgroundColor?: string;
	androidLayerType?: "none" | "software" | "hardware";
	injectedJavaScript?: string;
	/** Se dispara cuando el SVG reinició y la animación SMIL comenzó. */
	onAnimationStart?: () => void;
};

function Iframe(props: Record<string, unknown>) {
	return createElement("iframe", props);
}

function MundialWebViewWeb({
	html,
	backgroundColor = "#FFFFFF",
	onAnimationStart,
}: Props) {
	const startedRef = useRef(false);

	useEffect(() => {
		if (startedRef.current) return;
		const timer = setTimeout(() => {
			startedRef.current = true;
			onAnimationStart?.();
		}, 200);
		return () => clearTimeout(timer);
	}, [onAnimationStart]);

	return (
		<View style={[styles.container, { backgroundColor }]}>
			<Iframe
				srcDoc={html}
				style={styles.iframe}
				title="loading"
				scrolling="no"
			/>
		</View>
	);
}

function MundialWebViewNative({
	html,
	backgroundColor = "#FFFFFF",
	androidLayerType,
	injectedJavaScript,
	onAnimationStart,
}: Props) {
	const startedRef = useRef(false);
	const layerType =
		androidLayerType ??
		(Platform.OS === "android" ? "software" : undefined);

	const handleMessage = (data: string) => {
		if (data !== "anim-start" || startedRef.current || !onAnimationStart) return;
		startedRef.current = true;
		onAnimationStart();
	};

	return (
		<WebView
			source={{ html }}
			style={[styles.webview, { backgroundColor }]}
			scrollEnabled={false}
			bounces={false}
			overScrollMode="never"
			showsHorizontalScrollIndicator={false}
			showsVerticalScrollIndicator={false}
			originWhitelist={["*"]}
			androidLayerType={layerType}
			androidHardwareAccelerationDisabled={layerType === "software"}
			setSupportMultipleWindows={false}
			allowFileAccess={false}
			allowFileAccessFromFileURLs={false}
			allowUniversalAccessFromFileURLs={false}
			injectedJavaScript={injectedJavaScript}
			onMessage={(event) => handleMessage(event.nativeEvent.data)}
			onLoadEnd={() => {
				if (!injectedJavaScript && onAnimationStart && !startedRef.current) {
					startedRef.current = true;
					setTimeout(onAnimationStart, 100);
				}
			}}
		/>
	);
}

export function MundialWebView(props: Props) {
	if (Platform.OS === "web") {
		return <MundialWebViewWeb {...props} />;
	}
	return <MundialWebViewNative {...props} />;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	iframe: {
		width: "100%",
		height: "100%",
		border: "none",
	} as object,
	webview: {
		flex: 1,
	},
});
