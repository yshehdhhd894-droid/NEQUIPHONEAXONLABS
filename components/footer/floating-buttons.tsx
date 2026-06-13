import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import Text from "@/components/basic/text";
import { useFooterLayoutMetrics } from "@/hooks/useFooterLayoutMetrics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FloatingActionButton({
	isOpen,
	onPress,
}: FloatingActionButtonProps) {
	const footer = useFooterLayoutMetrics();
	const { animatedStyle, triggerAnimation } = useFloatingButtonAnimation();

	const handlePress = () => {
		triggerAnimation();
		onPress();
	};

	return (
		<AnimatedPressable
			onPress={handlePress}
			style={[
				animatedStyle,
				{
					width: footer.fabSize,
					height: footer.fabSize,
					borderRadius: footer.tabRadius,
					backgroundColor: isOpen ? "#EAE8F5" : "#da0081",
					flexShrink: 0,
					zIndex: 20,
				},
			]}
		>
			<View style={StyleSheet.absoluteFill} className="justify-center items-center">
				{isOpen ? (
					<Text
						fontWeight="bold"
						className="text-center leading-none text-black"
						style={{ fontSize: footer.fabIconSize * 0.7 }}
					>
						✕
					</Text>
				) : (
					<Text
						fontWeight="bold"
						className="text-white text-center leading-none"
						style={{ fontSize: footer.fabLabelSize * 0.7 }}
					>
						$
					</Text>
				)}
			</View>
		</AnimatedPressable>
	);
}

const useFloatingButtonAnimation = () => {
	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	const triggerAnimation = () => {
		scale.value = withTiming(1.1, { duration: 120 }, () => {
			scale.value = withTiming(1, { duration: 120 });
		});
	};

	return { animatedStyle, triggerAnimation };
};

interface FloatingActionButtonProps {
	isOpen: boolean;
	onPress: () => void;
}
