import { useCallback, useEffect, useRef } from "react";
import { View } from "react-native";
import { LoginLogoSection } from "@/components/login/login-logo-section";
import { AppSplash } from "@/components/splash/app-splash";

type Props = {
	onReady: () => void;
	fontsReady: boolean;
};

export function SplashSession({ onReady, fontsReady }: Props) {
	const lottieDoneRef = useRef(false);
	const notifiedRef = useRef(false);
	const onReadyRef = useRef(onReady);
	onReadyRef.current = onReady;

	const tryAdvance = useCallback(() => {
		if (notifiedRef.current || !lottieDoneRef.current || !fontsReady) {
			return;
		}
		notifiedRef.current = true;
		onReadyRef.current();
	}, [fontsReady]);

	const handleLottieFinish = useCallback(() => {
		lottieDoneRef.current = true;
		tryAdvance();
	}, [tryAdvance]);

	useEffect(() => {
		tryAdvance();
	}, [fontsReady, tryAdvance]);

	return (
		<>
			<View
				pointerEvents="none"
				style={{
					position: "absolute",
					width: 1,
					height: 1,
					opacity: 0,
					overflow: "hidden",
				}}
			>
				<LoginLogoSection />
			</View>
			<AppSplash onFinish={handleLottieFinish} />
		</>
	);
}
