import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NequiAmountInfoBanner } from "@/components/send/nequi-amount-info-banner";

const HORIZONTAL_MARGIN = 4;
const TOP_OFFSET = 0;
const SLIDE_DURATION_MS = 350;
const HIDDEN_OFFSET = 160;

type Props = {
	visible: boolean;
};

export function NequiAmountInfoToast({ visible }: Props) {
	const { top } = useSafeAreaInsets();
	const translateY = useRef(new Animated.Value(-HIDDEN_OFFSET)).current;
	const [mounted, setMounted] = useState(false);
	const wasVisibleRef = useRef(false);

	useEffect(() => {
		const hiddenY = -(top + TOP_OFFSET + HIDDEN_OFFSET);
		const visibleY = top + TOP_OFFSET;

		if (visible) {
			wasVisibleRef.current = true;
			setMounted(true);
			translateY.setValue(hiddenY);
			Animated.timing(translateY, {
				toValue: visibleY,
				duration: SLIDE_DURATION_MS,
				easing: Easing.out(Easing.cubic),
				useNativeDriver: true,
			}).start();
			return;
		}

		if (!wasVisibleRef.current) {
			return;
		}

		wasVisibleRef.current = false;
		Animated.timing(translateY, {
			toValue: hiddenY,
			duration: SLIDE_DURATION_MS,
			easing: Easing.in(Easing.cubic),
			useNativeDriver: true,
		}).start(({ finished }) => {
			if (finished) {
				setMounted(false);
			}
		});
	}, [visible, top, translateY]);

	if (!mounted) {
		return null;
	}

	return (
		<Animated.View
			pointerEvents="none"
			style={{
				position: Platform.OS === "web" ? ("fixed" as const) : "absolute",
				top: 0,
				left: HORIZONTAL_MARGIN,
				right: HORIZONTAL_MARGIN,
				zIndex: 9999,
				elevation: 9999,
				transform: [{ translateY }],
			}}
		>
			<NequiAmountInfoBanner />
		</Animated.View>
	);
}
