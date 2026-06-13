import { useEffect, useRef, useState } from "react";
import { Animated, Easing, View } from "react-native";
import Text from "@/components/basic/text";
import { Copy } from "@/components/logos";
import CircularProgress from "@/components/logos/circular";

export default function DynamicPassword() {
	const [dynamic, setDynamic] = useState(dynamicGenerator());
	const progressAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		let isMounted = true;

		const startAnimation = () => {
			progressAnim.setValue(0);
			Animated.timing(progressAnim, {
				toValue: 1,
				duration: 45000,
				easing: Easing.linear,
				useNativeDriver: false,
			}).start(({ finished }) => {
				if (finished && isMounted) {
					setDynamic(dynamicGenerator());
					startAnimation();
				}
			});
		};

		startAnimation();

		return () => {
			isMounted = false;
			progressAnim.stopAnimation();
		};
	}, [progressAnim]);

	return (
		<View className="flex px-2 gap-3 flex-row items-center rounded-[6px] bg-[#4d334d] h-[40px]">
			<View>
				<AnimatedCircular progress={progressAnim} />
			</View>

			<View>
				<Text className="text-[14px] leading-3">Clave dinámica</Text>
				<Text
					fontWeight="bold"
					className="text-[17px]"
					style={{ letterSpacing: 2.5 }}
				>
					{dynamic}
				</Text>
			</View>

			<View className="size-6">
				<Copy />
			</View>
		</View>
	);
}

function AnimatedCircular({ progress }: { progress: Animated.Value }) {
	const [displayProgress, setDisplayProgress] = useState(0);

	useEffect(() => {
		const listener = progress.addListener(({ value }) => {
			setDisplayProgress(value);
		});

		return () => progress.removeListener(listener);
	}, [progress]);

	return <CircularProgress progress={displayProgress} />;
}

function dynamicGenerator() {
	const randomNum = Math.floor(100000 + Math.random() * 900000);
	return randomNum.toString();
}
