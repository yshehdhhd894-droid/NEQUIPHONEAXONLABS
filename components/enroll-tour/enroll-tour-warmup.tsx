import { useRef } from "react";
import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import {
	ENROLL_TOUR_SVG_HEIGHT,
	ENROLL_TOUR_SVG_WIDTH,
} from "@/components/enroll-tour/constants";
import { markEnrollTourReady } from "@/libs/enroll-tour-ready";
import { ENROLL_TOUR_SLIDES } from "@/libs/enroll-tour";

/**
 * Precarga los 5 SVG del tutorial a tamaño real (fuera de pantalla)
 * durante el splash para que el swipe no congele.
 */
export function EnrollTourWarmup() {
	const markedRef = useRef(false);
	const loadedRef = useRef(0);

	const onSlideReady = () => {
		loadedRef.current += 1;
		if (markedRef.current || loadedRef.current < ENROLL_TOUR_SLIDES.length) {
			return;
		}
		markedRef.current = true;
		markEnrollTourReady();
	};

	return (
		<View
			pointerEvents="none"
			style={{
				position: "absolute",
				left: -4000,
				top: 0,
				opacity: 0,
				overflow: "hidden",
			}}
		>
			{ENROLL_TOUR_SLIDES.map((slide) => (
				<View key={slide.id} onLayout={onSlideReady}>
					<SvgXml
						xml={slide.svgXml}
						width={ENROLL_TOUR_SVG_WIDTH}
						height={ENROLL_TOUR_SVG_HEIGHT}
					/>
				</View>
			))}
		</View>
	);
}
