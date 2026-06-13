import { useCallback, useEffect, useRef, useState } from "react";

const BOTTOM_MIN_MS = 1200;
const TARJETILLA_EXTRA_MS = 2200;
const TAB_RETURN_TARJETILLA_MS = 800;
const REFRESH_BOTTOM_SHIMMER_MS = 2200;
const REFRESH_TARJETILLA_SHIMMER_MS = 4200;

let initialHomeLoadComplete = false;

function randomExtra(min: number, max: number) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

export function useHomeLoadingReveal(isDataReady: boolean) {
	const isReturnVisit = useRef(initialHomeLoadComplete);
	const refreshTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
	const [showBottomShimmer, setShowBottomShimmer] = useState(
		!initialHomeLoadComplete,
	);
	const [showTarjetillaShimmer, setShowTarjetillaShimmer] = useState(true);
	const [showBottomContent, setShowBottomContent] = useState(
		initialHomeLoadComplete,
	);
	const [showTarjetillaContent, setShowTarjetillaContent] = useState(
		initialHomeLoadComplete,
	);
	const [isPullRefreshing, setIsPullRefreshing] = useState(false);
	const [isHeaderBalanceRefreshing, setIsHeaderBalanceRefreshing] =
		useState(false);
	const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(
		initialHomeLoadComplete,
	);
	const mountAtRef = useRef(Date.now());

	const clearRefreshTimers = useCallback(() => {
		for (const timer of refreshTimersRef.current) {
			clearTimeout(timer);
		}
		refreshTimersRef.current = [];
	}, []);

	useEffect(() => {
		if (isReturnVisit.current) {
			setShowBottomShimmer(false);
			setShowBottomContent(true);
			setShowTarjetillaShimmer(true);
			setShowTarjetillaContent(false);

			const timer = setTimeout(() => {
				setShowTarjetillaShimmer(false);
				setShowTarjetillaContent(true);
			}, TAB_RETURN_TARJETILLA_MS);

			return () => clearTimeout(timer);
		}

		mountAtRef.current = Date.now();
		setShowBottomShimmer(true);
		setShowTarjetillaShimmer(true);
		setShowBottomContent(false);
		setShowTarjetillaContent(false);
	}, []);

	useEffect(() => {
		if (!isDataReady || isPullRefreshing || initialHomeLoadComplete) return;

		const elapsed = Date.now() - mountAtRef.current;
		const bottomTarget = randomExtra(BOTTOM_MIN_MS, BOTTOM_MIN_MS + 800);
		const tarjetillaTarget =
			bottomTarget + randomExtra(TARJETILLA_EXTRA_MS, TARJETILLA_EXTRA_MS + 1200);
		const bottomDelay = Math.max(0, bottomTarget - elapsed);
		const tarjetillaDelay = Math.max(0, tarjetillaTarget - elapsed);

		const bottomTimer = setTimeout(() => {
			setShowBottomShimmer(false);
			setShowBottomContent(true);
		}, bottomDelay);

		const tarjetillaTimer = setTimeout(() => {
			setShowTarjetillaShimmer(false);
			setShowTarjetillaContent(true);
		}, tarjetillaDelay);

		return () => {
			clearTimeout(bottomTimer);
			clearTimeout(tarjetillaTimer);
		};
	}, [isDataReady, isPullRefreshing]);

	useEffect(() => {
		if (showBottomContent && showTarjetillaContent && !isPullRefreshing) {
			initialHomeLoadComplete = true;
			setHasInitiallyLoaded(true);
		}
	}, [showBottomContent, showTarjetillaContent, isPullRefreshing]);

	useEffect(() => clearRefreshTimers, [clearRefreshTimers]);

	const startRefreshShimmers = useCallback(() => {
		clearRefreshTimers();
		setIsPullRefreshing(true);
		setIsHeaderBalanceRefreshing(true);
		setShowTarjetillaShimmer(true);
		setShowTarjetillaContent(false);
		setShowBottomShimmer(true);
		setShowBottomContent(false);

		const bottomTimer = setTimeout(() => {
			setShowBottomShimmer(false);
			setShowBottomContent(true);
			setIsHeaderBalanceRefreshing(false);
		}, REFRESH_BOTTOM_SHIMMER_MS);

		const tarjetillaTimer = setTimeout(() => {
			setShowTarjetillaShimmer(false);
			setShowTarjetillaContent(true);
			setIsPullRefreshing(false);
		}, REFRESH_TARJETILLA_SHIMMER_MS);

		refreshTimersRef.current = [bottomTimer, tarjetillaTimer];
	}, [clearRefreshTimers]);

	const isLoading =
		!initialHomeLoadComplete &&
		!isPullRefreshing &&
		(!showBottomContent || !showTarjetillaContent);

	return {
		isLoading,
		isPullRefreshing,
		isHeaderBalanceRefreshing,
		hasInitiallyLoaded,
		showBottomShimmer,
		showTarjetillaShimmer,
		showBottomContent,
		showTarjetillaContent,
		startRefreshShimmers,
	};
}
