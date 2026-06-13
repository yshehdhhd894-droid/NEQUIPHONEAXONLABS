import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/basic/text";

const STEP_DURATION = 1500;
const STEP_PAUSE = 400;
const STEP_TARGETS = [0.1, 0.55, 1];
const ORQUIDEA = "#da0081";

const stepsConfig = [
	{ icon: "cash-outline", text: "Inicio de envío", offset: 18 },
	{ icon: "arrow-up-circle-outline", text: "Enviando plata", offset: 14 },
	{ icon: "thumbs-up-outline", text: "¡Terminado!", offset: 16 },
] as const;

type SendingAnimationProps = {
	onComplete: () => void;
};

/** Animación de envío (Bre-B / Nequi). */
export function SendingAnimation({ onComplete }: SendingAnimationProps) {
	const [activeStep, setActiveStep] = useState(0);
	const [steps, setSteps] = useState([false, false, false]);
	const { top } = useSafeAreaInsets();

	const checkScale0 = useSharedValue(0);
	const checkScale1 = useSharedValue(0);
	const checkScale2 = useSharedValue(0);
	const checkScales = [checkScale0, checkScale1, checkScale2];

	const checkStyle0 = useAnimatedStyle(() => ({
		transform: [{ scale: checkScale0.value }],
		opacity: checkScale0.value,
	}));
	const checkStyle1 = useAnimatedStyle(() => ({
		transform: [{ scale: checkScale1.value }],
		opacity: checkScale1.value,
	}));
	const checkStyle2 = useAnimatedStyle(() => ({
		transform: [{ scale: checkScale2.value }],
		opacity: checkScale2.value,
	}));
	const checkStyles = [checkStyle0, checkStyle1, checkStyle2];

	const [fillPercent, setFillPercent] = useState(0);
	const fillRef = useRef(0);
	const animFrameRef = useRef<number | null>(null);

	const animateTo = useCallback((targetPercent: number) => {
		const start = fillRef.current;
		const startTime = performance.now();

		return new Promise<void>((resolve) => {
			const tick = (now: number) => {
				const elapsed = now - startTime;
				const t = Math.min(elapsed / STEP_DURATION, 1);
				const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
				const current = start + (targetPercent - start) * eased;

				fillRef.current = current;
				setFillPercent(current);

				if (t < 1) {
					animFrameRef.current = requestAnimationFrame(tick);
				} else {
					fillRef.current = targetPercent;
					setFillPercent(targetPercent);
					resolve();
				}
			};
			animFrameRef.current = requestAnimationFrame(tick);
		});
	}, []);

	useEffect(() => {
		let cancelled = false;

		const run = async () => {
			for (let i = 0; i < steps.length; i++) {
				if (cancelled) return;
				setActiveStep(i);
				await animateTo(STEP_TARGETS[i]);

				setSteps((prev) => {
					const next = [...prev];
					next[i] = true;
					return next;
				});

				checkScales[i].value = withTiming(1, {
					duration: 300,
					easing: Easing.out(Easing.back(1.4)),
				});

				await wait(STEP_PAUSE);
			}

			if (!cancelled) {
				await animateTo(1);
				onComplete();
			}
		};

		run();

		return () => {
			cancelled = true;
			if (animFrameRef.current !== null) {
				cancelAnimationFrame(animFrameRef.current);
			}
		};
	}, [animateTo, onComplete]);

	const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	return (
		<View className="bg-white flex-1 justify-between">
			<View>
				<View style={{ height: top }} className="bg-uva" />
				<Text fontWeight="medium" className="text-uva text-[22px] px-11 mt-[1.3rem]">
					Procesando tu envío...
				</Text>
			</View>

			<View className="items-center justify-center mt-48">
				<View className="flex-row items-center justify-between mb-2 w-[45%]">
					{steps.map((completed, index) => (
						<View key={index} className="items-center justify-center">
							{completed && index <= activeStep ? (
								<Animated.View style={checkStyles[index]}>
									<Ionicons name="checkmark-outline" size={28} color="gray" />
								</Animated.View>
							) : activeStep === index ? (
								<View className="items-center justify-center">
									<LoadingBurst active offset={stepsConfig[index].offset} />
									<Ionicons
										name={stepsConfig[index].icon}
										size={28}
										color="#200020"
									/>
								</View>
							) : (
								<View style={{ width: 28, height: 28 }} />
							)}
						</View>
					))}
				</View>

				<View className="h-[0.8rem] bg-[#e8e8eb] w-[45%] rounded-[2px] relative overflow-hidden mb-1">
					<View
						style={{
							position: "absolute",
							left: 0,
							top: 0,
							bottom: 0,
							width: `${fillPercent * 100}%`,
							backgroundColor: ORQUIDEA,
							borderRadius: 2,
						}}
					/>
					<View className="absolute inset-0 flex-row items-center justify-between px-2">
						<View className="bg-white size-2 rounded-[2px]" />
						<View className="bg-white size-2 rounded-[2px]" />
						<View className="bg-white size-2 rounded-[2px]" />
					</View>
				</View>

				<Text fontWeight="bold" className="text-uva text-[22px]">
					{stepsConfig[activeStep].text}
				</Text>

				<Text className="text-[22px] text-uva max-w-[84%] text-center mx-auto pt-24">
					Quédate hasta que se complete el envío
				</Text>
			</View>

			<View className="h-[8.2rem]" />
		</View>
	);
}

function LoadingBurst({
	active,
	offset = 18,
}: {
	active: boolean;
	offset?: number;
}) {
	return (
		<View className="absolute items-center justify-center">
			{Array.from({ length: 12 }).map((_, index) => (
				<LoadingDot key={index} index={index} total={12} active={active} offset={offset} />
			))}
		</View>
	);
}

function LoadingDot({
	index,
	total,
	active,
	offset,
}: {
	index: number;
	total: number;
	active: boolean;
	offset: number;
}) {
	const progress = useSharedValue(0);
	const angle = (360 / total) * index;

	useEffect(() => {
		if (active) {
			progress.value = withRepeat(
				withTiming(1, { duration: 900, easing: Easing.linear }),
				-1,
				false,
			);
		} else {
			progress.value = 0;
		}
	}, [active, progress]);

	const style = useAnimatedStyle(() => ({
		transform: [
			{ rotate: `${angle}deg` },
			{ translateY: -offset - progress.value * 3 },
			{ scaleY: 1 + progress.value },
		],
		opacity: 1 - progress.value,
	}));

	return (
		<Animated.View
			style={[
				style,
				{
					position: "absolute",
					width: 2,
					height: 4,
					borderRadius: 2,
					backgroundColor: "#200020",
				},
			]}
		/>
	);
}
