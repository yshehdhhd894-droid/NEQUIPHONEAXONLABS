import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	Dimensions,
	NativeScrollEvent,
	NativeSyntheticEvent,
	Pressable,
	View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Text from "@/components/basic/text";
import EnrollTourSlidePage from "@/components/enroll-tour/enroll-tour-slide";
import { ENROLL_TOUR_SLIDES } from "@/libs/enroll-tour";
import {
	setSystemNavBarDefault,
	setSystemNavBarLogin,
} from "@/libs/navigation-bar";
import { useBottomInset } from "@/hooks/useBottomInset";
import { useAppStore } from "@/store/useAppStore";

const ORQUIDEA = "#DA0081";
const FOOTER_BOTTOM_GAP = 6;
const CREATE_NEQUI_LABEL = "Crea tu Nequi";
const LAST_INDEX = ENROLL_TOUR_SLIDES.length - 1;

export default function EnrollTourScreen() {
	const { width } = Dimensions.get("window");
	const [index, setIndex] = useState(0);
	const scrollRef = useRef<ScrollView>(null);
	const indexRef = useRef(0);
	const insets = useSafeAreaInsets();
	const bottomPad = useBottomInset();
	const completeEnrollTour = useAppStore((s) => s.completeEnrollTour);

	const isLast = index === LAST_INDEX;

	useEffect(() => {
		void setSystemNavBarDefault();
	}, []);

	const finishTour = useCallback(() => {
		completeEnrollTour();
		void setSystemNavBarLogin();
	}, [completeEnrollTour]);

	const syncIndexFromOffset = useCallback(
		(offsetX: number) => {
			const nextIndex = Math.round(offsetX / width);
			const clamped = Math.max(0, Math.min(nextIndex, LAST_INDEX));
			if (clamped === indexRef.current) return;
			indexRef.current = clamped;
			setIndex(clamped);
		},
		[width],
	);

	const onMomentumScrollEnd = useCallback(
		(event: NativeSyntheticEvent<NativeScrollEvent>) => {
			syncIndexFromOffset(event.nativeEvent.contentOffset.x);
		},
		[syncIndexFromOffset],
	);

	const goToSlide = useCallback(
		(slideIndex: number) => {
			const clamped = Math.max(0, Math.min(slideIndex, LAST_INDEX));
			indexRef.current = clamped;
			setIndex(clamped);
			scrollRef.current?.scrollTo({
				x: clamped * width,
				animated: true,
			});
		},
		[width],
	);

	const goNext = useCallback(() => {
		if (isLast) {
			finishTour();
			return;
		}
		goToSlide(indexRef.current + 1);
	}, [finishTour, goToSlide, isLast]);

	return (
		<View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
			<StatusBar style="dark" backgroundColor="#FFFFFF" />

			<ScrollView
				ref={scrollRef}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				decelerationRate="fast"
				scrollEventThrottle={16}
				onMomentumScrollEnd={onMomentumScrollEnd}
				style={{ flex: 1 }}
			>
				{ENROLL_TOUR_SLIDES.map((slide) => (
					<View key={slide.id} style={{ width, flex: 1 }}>
						<EnrollTourSlidePage slide={slide} />
					</View>
				))}
			</ScrollView>

			<View
				className="px-6"
				style={{
					paddingTop: 10,
					paddingBottom: bottomPad + FOOTER_BOTTOM_GAP,
				}}
			>
				<View className="flex-row justify-center items-center gap-2 mb-5">
					{ENROLL_TOUR_SLIDES.map((item, dotIndex) => (
						<View
							key={item.id}
							className="rounded-full"
							style={{
								width: dotIndex === index ? 10 : 8,
								height: dotIndex === index ? 10 : 8,
								backgroundColor:
									dotIndex === index ? ORQUIDEA : "transparent",
								borderWidth: 1.5,
								borderColor: ORQUIDEA,
							}}
						/>
					))}
				</View>

				{isLast ? (
					<Pressable
						onPress={finishTour}
						className="items-center justify-center rounded-[6px]"
						style={{
							height: 48,
							backgroundColor: ORQUIDEA,
						}}
					>
						<Text
							fontWeight="medium"
							className="text-[16px]"
							style={{ color: "#FFFFFF" }}
						>
							{CREATE_NEQUI_LABEL}
						</Text>
					</Pressable>
				) : (
					<View className="flex-row items-center justify-between">
						<Pressable
							onPress={finishTour}
							hitSlop={12}
							className="py-2 px-1"
						>
							<Text
								fontWeight="medium"
								className="text-[16px]"
								style={{ color: ORQUIDEA }}
							>
								Saltar
							</Text>
						</Pressable>

						<Pressable
							onPress={goNext}
							className="items-center justify-center rounded-[6px]"
							style={{
								width: 56,
								height: 56,
								backgroundColor: ORQUIDEA,
							}}
						>
							<Ionicons name="arrow-forward" size={26} color="#FFFFFF" />
						</Pressable>
					</View>
				)}
			</View>
		</View>
	);
}
