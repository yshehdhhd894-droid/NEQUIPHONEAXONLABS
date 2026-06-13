import { useCallback, useRef } from "react";
import { Gesture } from "react-native-gesture-handler";
import {
	runOnJS,
	useAnimatedScrollHandler,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

const PANEL_MAX = 55;
const PANEL_TRIGGER = 38;
const PULL_ACTIVATE_DY = 8;

function wait(ms: number) {
	return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function useHomePullRefresh() {
	const panelHeight = useSharedValue(0);
	const scrollY = useSharedValue(0);
	const isRefreshing = useSharedValue(false);
	const touchStartY = useSharedValue(0);
	const onTriggerRef = useRef<(() => void) | null>(null);

	const triggerPull = useCallback(() => {
		onTriggerRef.current?.();
	}, []);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y;

			if (isRefreshing.value) return;

			if (event.contentOffset.y < 0) {
				panelHeight.value = Math.min(-event.contentOffset.y, PANEL_MAX);
				return;
			}

			if (panelHeight.value > 0) {
				panelHeight.value = 0;
			}
		},
	});

	const panGesture = Gesture.Pan()
		.manualActivation(true)
		.onTouchesDown((event, state) => {
			touchStartY.value = event.allTouches[0]?.y ?? 0;
		})
		.onTouchesMove((event, state) => {
			if (isRefreshing.value) {
				state.fail();
				return;
			}

			if (scrollY.value > 1) {
				state.fail();
				return;
			}

			const currentY = event.allTouches[0]?.y ?? touchStartY.value;
			const deltaY = currentY - touchStartY.value;

			if (deltaY > PULL_ACTIVATE_DY) {
				state.activate();
				return;
			}

			if (deltaY < -PULL_ACTIVATE_DY) {
				state.fail();
			}
		})
		.onUpdate((event) => {
			if (scrollY.value > 1 || isRefreshing.value) return;

			if (event.translationY > 0) {
				panelHeight.value = Math.min(event.translationY, PANEL_MAX);
			}
		})
		.onEnd(() => {
			if (isRefreshing.value) return;

			if (panelHeight.value >= PANEL_TRIGGER) {
				runOnJS(triggerPull)();
				return;
			}

			panelHeight.value = withTiming(0, { duration: 200 });
		})
		.onFinalize(() => {
			if (isRefreshing.value) return;

			if (panelHeight.value > 0 && panelHeight.value < PANEL_TRIGGER) {
				panelHeight.value = withTiming(0, { duration: 200 });
			}
		});

	const runRefresh = useCallback(async (onRefresh: () => Promise<void>) => {
		if (isRefreshing.value) return;

		isRefreshing.value = true;
		panelHeight.value = withTiming(PANEL_MAX, { duration: 120 });
		await wait(130);

		try {
			await onRefresh();
		} finally {
			panelHeight.value = withTiming(0, { duration: 180 });
			await wait(190);
			isRefreshing.value = false;
		}
	}, [isRefreshing, panelHeight]);

	const bindOnTrigger = useCallback((fn: () => void) => {
		onTriggerRef.current = fn;
	}, []);

	return {
		panelHeight,
		panGesture,
		scrollHandler,
		runRefresh,
		bindOnTrigger,
	};
}
