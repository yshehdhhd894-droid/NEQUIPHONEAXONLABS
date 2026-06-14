import * as NavigationBar from "expo-navigation-bar";
import * as SplashScreen from "expo-splash-screen";
import { DotLottie } from "@lottiefiles/dotlottie-web";
import LottieView from "lottie-react-native";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	Platform,
	StyleSheet,
	useWindowDimensions,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { setSystemNavBarDefault, UVA_COLOR } from "@/libs/navigation-bar";
import { setPwaThemeColor } from "@/libs/pwa-theme-color";
import { SPLASH_LOTTIE_SOURCE } from "@/libs/splash-lottie-ready";

const LOTTIE_WHITE = "#FFFFFF";
const LOTTIE_NAV_BLACK = "#000000";
const SPLASH_LOTTIE_WIDTH = 1080;
const SPLASH_LOTTIE_HEIGHT = 1920;
/** Pequeño margen para evitar líneas blancas por redondeo/subpíxeles. */
const COVER_BUFFER = 1.04;
const PURPLE_HOLD_MS = 400;
const ANDROID_NAV_BAR_FALLBACK = 48;
const WEB_SPLASH_MAX_MS = 4500;

const LOTTIE_LAYOUT = {
	fit: "cover" as const,
	align: [0.5, 0.5] as [number, number],
};

export function getSplashLottieCoverSize(
	viewportWidth: number,
	viewportHeight: number,
) {
	if (viewportWidth <= 0 || viewportHeight <= 0) {
		return {
			width: SPLASH_LOTTIE_WIDTH,
			height: SPLASH_LOTTIE_HEIGHT,
		};
	}

	const scale =
		Math.max(
			viewportWidth / SPLASH_LOTTIE_WIDTH,
			viewportHeight / SPLASH_LOTTIE_HEIGHT,
		) * COVER_BUFFER;

	return {
		width: SPLASH_LOTTIE_WIDTH * scale,
		height: SPLASH_LOTTIE_HEIGHT * scale,
	};
}

type AppSplashProps = {
	onFinish: () => void;
};

function WebSplash({ onFinish }: { onFinish: () => void }) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const playerRef = useRef<DotLottie | null>(null);
	const finishedRef = useRef(false);
	const onFinishRef = useRef(onFinish);
	onFinishRef.current = onFinish;
	const { width, height } = useWindowDimensions();

	const complete = useCallback(() => {
		if (finishedRef.current) return;
		finishedRef.current = true;
		onFinishRef.current();
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || finishedRef.current || width <= 0 || height <= 0) {
			return;
		}

		playerRef.current?.destroy();
		playerRef.current = null;

		const dpr =
			typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
		canvas.width = Math.round(width * dpr);
		canvas.height = Math.round(height * dpr);
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;

		try {
			const player = new DotLottie({
				canvas,
				data: SPLASH_LOTTIE_SOURCE,
				autoplay: true,
				loop: false,
				layout: LOTTIE_LAYOUT,
				backgroundColor: LOTTIE_WHITE,
				renderConfig: {
					autoResize: true,
					devicePixelRatio: dpr,
				},
			});
			player.addEventListener("complete", complete);
			player.addEventListener("loadError", complete);
			playerRef.current = player;
		} catch {
			complete();
		}

		return () => {
			playerRef.current?.destroy();
			playerRef.current = null;
		};
	}, [complete, width, height]);

	useEffect(() => {
		const timer = setTimeout(complete, WEB_SPLASH_MAX_MS);
		return () => clearTimeout(timer);
	}, [complete]);

	return (
		<canvas
			ref={canvasRef}
			style={{
				width: "100%",
				height: "100%",
				display: "block",
				backgroundColor: LOTTIE_WHITE,
			}}
		/>
	);
}

function NativeAppSplash({ onFinish }: AppSplashProps) {
	const { width, height } = useWindowDimensions();
	const insets = useSafeAreaInsets();
	const lottieRef = useRef<LottieView>(null);
	const finishedRef = useRef(false);
	const playbackStartedRef = useRef(false);
	const playbackScheduledRef = useRef(false);
	const nativeSplashHiddenRef = useRef(false);
	const [lottieVisible, setLottieVisible] = useState(false);
	const [lottiePlaying, setLottiePlaying] = useState(false);

	const bottomInset =
		Platform.OS === "android"
			? Math.max(insets.bottom, ANDROID_NAV_BAR_FALLBACK)
			: insets.bottom;

	const { width: lottieWidth, height: lottieHeight } = useMemo(
		() => getSplashLottieCoverSize(width, height),
		[width, height],
	);

	useEffect(() => {
		void NavigationBar.setButtonStyleAsync("light");
		setPwaThemeColor(UVA_COLOR);
	}, []);

	const hideNativeSplash = useCallback(() => {
		if (nativeSplashHiddenRef.current) return;
		nativeSplashHiddenRef.current = true;
		void SplashScreen.hideAsync();
	}, []);

	const finishSplash = useCallback(() => {
		if (finishedRef.current) return;
		finishedRef.current = true;
		void setSystemNavBarDefault();
		setPwaThemeColor(UVA_COLOR);
		onFinish();
	}, [onFinish]);

	const startPlayback = useCallback(() => {
		if (playbackStartedRef.current) return;
		playbackStartedRef.current = true;
		setLottiePlaying(true);
		setLottieVisible(true);
		setPwaThemeColor(LOTTIE_WHITE);
		hideNativeSplash();
		void NavigationBar.setButtonStyleAsync("light");
		lottieRef.current?.play();
	}, [hideNativeSplash]);

	const schedulePlayback = useCallback(() => {
		if (playbackStartedRef.current || playbackScheduledRef.current) return;
		playbackScheduledRef.current = true;
		setTimeout(startPlayback, PURPLE_HOLD_MS);
	}, [startPlayback]);

	useEffect(() => {
		const fallback = setTimeout(() => {
			if (!playbackStartedRef.current) {
				schedulePlayback();
			}
		}, 1000 + PURPLE_HOLD_MS);
		return () => clearTimeout(fallback);
	}, [schedulePlayback]);

	const handleAnimationLoaded = useCallback(() => {
		schedulePlayback();
	}, [schedulePlayback]);

	const handleFinish = useCallback(
		(isCancelled?: boolean) => {
			if (isCancelled || finishedRef.current || !playbackStartedRef.current) {
				return;
			}
			finishSplash();
		},
		[finishSplash],
	);

	return (
		<View style={[styles.root, { backgroundColor: UVA_COLOR }]}>
			<StatusBar
				style={lottiePlaying ? "dark" : "light"}
				backgroundColor={lottiePlaying ? LOTTIE_WHITE : UVA_COLOR}
			/>

			{insets.top > 0 ? (
				<View
					pointerEvents="none"
					style={[
						styles.systemNavStrip,
						{
							top: 0,
							bottom: undefined,
							height: insets.top,
							backgroundColor: lottiePlaying ? LOTTIE_WHITE : UVA_COLOR,
						},
					]}
				/>
			) : null}

			{lottiePlaying ? (
				<View
					pointerEvents="none"
					style={[styles.lottieBackdrop, { backgroundColor: LOTTIE_WHITE }]}
				/>
			) : null}

			<View style={styles.lottieStage}>
				<LottieView
					ref={lottieRef}
					source={SPLASH_LOTTIE_SOURCE}
					autoPlay={false}
					loop={false}
					cacheComposition
					hardwareAccelerationAndroid={Platform.OS === "android"}
					renderMode={Platform.OS === "android" ? "HARDWARE" : "AUTOMATIC"}
					onAnimationLoaded={handleAnimationLoaded}
					onAnimationFinish={handleFinish}
					style={{
						width: lottieWidth,
						height: lottieHeight,
						opacity: lottieVisible ? 1 : 0,
					}}
					resizeMode="cover"
				/>
			</View>

			<View
				pointerEvents="none"
				style={[
					styles.systemNavStrip,
					{
						height: bottomInset,
						backgroundColor: lottiePlaying ? LOTTIE_NAV_BLACK : UVA_COLOR,
					},
				]}
			/>
		</View>
	);
}

function WebAppSplash({ onFinish }: AppSplashProps) {
	const insets = useSafeAreaInsets();
	const [lottiePlaying, setLottiePlaying] = useState(false);
	const playbackStartedRef = useRef(false);
	const playbackScheduledRef = useRef(false);

	useEffect(() => {
		setPwaThemeColor(UVA_COLOR);
	}, []);

	const startPlayback = useCallback(() => {
		if (playbackStartedRef.current) return;
		playbackStartedRef.current = true;
		setLottiePlaying(true);
		setPwaThemeColor(LOTTIE_WHITE);
	}, []);

	const schedulePlayback = useCallback(() => {
		if (playbackStartedRef.current || playbackScheduledRef.current) return;
		playbackScheduledRef.current = true;
		setTimeout(startPlayback, PURPLE_HOLD_MS);
	}, [startPlayback]);

	useEffect(() => {
		schedulePlayback();
		const fallback = setTimeout(startPlayback, 1000 + PURPLE_HOLD_MS);
		return () => clearTimeout(fallback);
	}, [schedulePlayback, startPlayback]);

	const chromeColor = lottiePlaying ? LOTTIE_WHITE : UVA_COLOR;
	const bottomStripColor = lottiePlaying ? LOTTIE_NAV_BLACK : UVA_COLOR;

	return (
		<View style={[styles.root, { backgroundColor: chromeColor }]}>
			<StatusBar
				style={lottiePlaying ? "dark" : "light"}
				backgroundColor={chromeColor}
			/>

			{insets.top > 0 ? (
				<View
					pointerEvents="none"
					style={[
						styles.systemNavStrip,
						{
							top: 0,
							bottom: undefined,
							height: insets.top,
							backgroundColor: chromeColor,
						},
					]}
				/>
			) : null}

			{lottiePlaying ? (
				<>
					<View
						pointerEvents="none"
						style={[styles.lottieBackdrop, { backgroundColor: LOTTIE_WHITE }]}
					/>
					<View style={styles.lottieStage}>
						<WebSplash onFinish={onFinish} />
					</View>
				</>
			) : null}

			{insets.bottom > 0 ? (
				<View
					pointerEvents="none"
					style={[
						styles.systemNavStrip,
						{
							height: insets.bottom,
							backgroundColor: bottomStripColor,
						},
					]}
				/>
			) : null}
		</View>
	);
}

function AppSplashComponent({ onFinish }: AppSplashProps) {
	useEffect(() => {
		void SplashScreen.hideAsync();
	}, []);

	if (Platform.OS === "web") {
		return <WebAppSplash onFinish={onFinish} />;
	}

	return <NativeAppSplash onFinish={onFinish} />;
}

export const AppSplash = memo(AppSplashComponent);

const styles = StyleSheet.create({
	root: {
		...StyleSheet.absoluteFillObject,
		overflow: "hidden",
	},
	lottieBackdrop: {
		...StyleSheet.absoluteFillObject,
	},
	lottieStage: {
		...StyleSheet.absoluteFillObject,
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
	},
	systemNavStrip: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 10,
		elevation: 10,
	},
});
