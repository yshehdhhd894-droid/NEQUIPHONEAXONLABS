import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Text from "@/components/basic/text";
import { HeaderBalanceSkeletonGroup } from "@/components/home/header-balance-skeleton";
import { HomeRefreshPanel } from "@/components/home/home-refresh-panel";
import HomeLoadingShimmer from "@/components/home/home-loading-shimmer";
import {
	HomeBackground,
	LockClosed,
	Notification,
	Question,
	UserImage,
} from "@/components/logos";
import { HomeBodyBase } from "@/components/sections/home-body-base";
import HomeNormalBody from "@/components/sections/home-normal-body";
import HomeSavingsBody from "@/components/sections/home-savings-body";
import { Skeleton } from "@/components/skeleton";
import { useAuthStore } from "@/hooks/useAuth";
import { useHomeLayoutMetrics } from "@/hooks/useHomeLayoutMetrics";
import { useHomeLoadingReveal } from "@/hooks/useHomeLoadingReveal";
import { useHomePullRefresh } from "@/hooks/useHomePullRefresh";
import { getAccountTypeLabel } from "@/libs/account-type";
import { formatCurrencyDisplay } from "@/libs/utils";
import { userService, walletService } from "@/services/api.service";
import { useAppStore } from "@/store/useAppStore";

export default function Home() {
	const router = useRouter();
	const balanceVisible = useAppStore((state) => state.balanceVisible);
	const toggleBalanceVisibility = useAppStore(
		(state) => state.toggleBalanceVisibility,
	);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const isRefreshingRef = useRef(false);
	const m = useHomeLayoutMetrics();

	const {
		panelHeight,
		panGesture,
		scrollHandler,
		runRefresh,
		bindOnTrigger,
	} = useHomePullRefresh();

	const { data: user, isSuccess: isUserLoaded, refetch: refetchUser } =
		useQuery({
			queryKey: ["user"],
			queryFn: () => userService.getUserInfo(),
		});

	const {
		data: wallet,
		isSuccess: isWalletLoaded,
		refetch: refetchWallet,
	} = useQuery({
		queryKey: ["wallet"],
		queryFn: () => walletService.getWallet(),
	});

	const accountType =
		useAuthStore((s) => s.user?.accountType) ?? user?.accountType;

	const isSavingsMode = accountType === "savings";

	const accountTypeLabel = useMemo(
		() => getAccountTypeLabel(accountType),
		[accountType],
	);

	const available = wallet?.available || 0;
	const pockets = wallet?.pockets || [];
	const total = available + pockets.reduce((sum, p) => sum + p.amount, 0);

	const [avaliableInteger, avaliableDecimal] = formatCurrencyDisplay(available);
	const [totalInteger, totalDecimal] = formatCurrencyDisplay(total);

	const isDataReady = isUserLoaded && isWalletLoaded;
	const {
		showBottomShimmer,
		showTarjetillaShimmer,
		showBottomContent,
		showTarjetillaContent,
		isHeaderBalanceRefreshing,
		hasInitiallyLoaded,
		startRefreshShimmers,
	} = useHomeLoadingReveal(isDataReady);

	const balanceLoading =
		isHeaderBalanceRefreshing ||
		(!isWalletLoaded && !hasInitiallyLoaded);
	const showAccountType =
		isUserLoaded && (isWalletLoaded || hasInitiallyLoaded);

	const handleTriggerRefresh = useCallback(async () => {
		if (isRefreshingRef.current) return;

		isRefreshingRef.current = true;
		setIsRefreshing(true);
		startRefreshShimmers();

		try {
			await runRefresh(async () => {
				await Promise.all([refetchUser(), refetchWallet()]);
			});
		} finally {
			isRefreshingRef.current = false;
			setIsRefreshing(false);
		}
	}, [runRefresh, refetchUser, refetchWallet, startRefreshShimmers]);

	useEffect(() => {
		bindOnTrigger(() => {
			void handleTriggerRefresh();
		});
	}, [bindOnTrigger, handleTriggerRefresh]);

	return (
		<View className="flex-1 bg-uva" collapsable={false}>
			<HomeRefreshPanel height={panelHeight} isRefreshing={isRefreshing} />

			<GestureDetector gesture={panGesture}>
				<View className="flex-1 bg-white" collapsable={false}>
					<HomeBodyBase scrollHandler={scrollHandler}>
					<HomeLoadingShimmer
						showTarjetilla={showTarjetillaShimmer}
						showBottom={showBottomShimmer}
					/>

					{showTarjetillaContent && isUserLoaded ? (
						isSavingsMode ? (
							<HomeSavingsBody showSections={false} />
						) : (
							<HomeNormalBody showSections={false} />
						)
					) : null}

					{showBottomContent && isUserLoaded ? (
						isSavingsMode ? (
							<HomeSavingsBody showBanner={false} />
						) : (
							<HomeNormalBody showBanner={false} />
						)
					) : null}
				</HomeBodyBase>

				<View
					pointerEvents="none"
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						zIndex: 2,
						elevation: 0,
						shadowOpacity: 0,
					}}
				>
					<View
						className="bg-uva"
						style={{ height: m.headerStatusHeight }}
					/>
					<HomeBackground
						height={m.headerOrchidHeight}
						color={isSavingsMode ? "#ebe7f5" : ""}
					/>
				</View>

				<View
					pointerEvents="box-none"
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						zIndex: 3,
						elevation: 0,
						shadowOpacity: 0,
					}}
				>
					<View
						className="flex flex-row justify-between items-center"
						style={{
							paddingHorizontal: m.headerPaddingX,
							height: m.greetingRowHeight,
							marginTop: m.greetingRowTop,
						}}
					>
						<Pressable
							onPress={() => router.push("/settings/info")}
							id="header"
							className="flex flex-row"
							style={{ gap: m.headerGreetingGap }}
						>
							<UserImage />
							<View className="flex justify-between">
								<Text
									className="leading-none"
									style={{ fontSize: m.greetingFontSize }}
								>
									Hola,
								</Text>
								<Text
									className="leading-tight font-semibold"
									style={{ fontSize: m.nameFontSize }}
								>
									{!isUserLoaded ? (
										<Skeleton
											width={m.scale(100)}
											height={m.nameFontSize}
											borderRadius={4}
										/>
									) : (
										user?.name
									)}
								</Text>
							</View>
						</Pressable>

						<HeaderIcons gap={m.headerIconGap} />
					</View>

					<View
						className="flex items-center"
						style={{
							paddingHorizontal: m.headerPaddingX,
							marginTop: m.balanceSectionMarginTop,
						}}
					>
						<Pressable
							onPress={toggleBalanceVisibility}
							className="items-center"
						>
							{showAccountType ? (
								<View className="flex-row items-end gap-1">
									<Text style={{ fontSize: m.accountTypeFontSize }}>
										{accountTypeLabel}
									</Text>
									<Ionicons
										className="mb-0.5"
										name={
											balanceVisible ? "eye-off-outline" : "eye-outline"
										}
										size={m.eyeIconSize}
										color="white"
									/>
								</View>
							) : (
								<Skeleton
									width={m.scale(150)}
									height={m.accountTypeFontSize}
									borderRadius={4}
								/>
							)}

							{balanceLoading ? (
								<HeaderBalanceSkeletonGroup />
							) : (
								<>
									<BalanceDisplay
										balanceVisible={balanceVisible}
										integer={avaliableInteger}
										decimal={avaliableDecimal}
										metrics={m}
									/>

									<View
										className="flex-row items-center"
										style={{ marginTop: m.scaleV(6) }}
									>
										<TotalDisplay
											balanceVisible={balanceVisible}
											integer={totalInteger}
											decimal={totalDecimal}
											metrics={m}
										/>
									</View>
								</>
							)}
						</Pressable>

						<Pressable
							onPress={() => router.push("/settings/money")}
							className="border border-[#f4f5f8d0] flex-row items-center"
							style={{
								paddingRight: m.scale(16),
								paddingLeft: m.scale(20),
								paddingVertical: m.scaleV(2),
								borderRadius: m.scale(4),
								marginTop: m.tuPlataMarginTop,
								gap: m.scale(8),
							}}
						>
							<Text style={{ fontSize: m.accountTypeFontSize }}>Tu plata</Text>
							<Ionicons
								name="chevron-down"
								size={m.tuPlataIconSize}
								color="white"
								className="-mb-1"
							/>
						</Pressable>
					</View>
				</View>
			</View>
			</GestureDetector>
		</View>
	);
}

const HeaderIcons = memo(({ gap }: { gap: number }) => (
	<View className="flex-row items-center" style={{ gap }}>
		<Notification color="white" />
		<Question />
		<LockClosed />
	</View>
));

type HomeMetrics = ReturnType<typeof useHomeLayoutMetrics>;

const BalanceDisplay = memo(
	({
		balanceVisible,
		integer,
		decimal,
		metrics: m,
	}: {
		balanceVisible: boolean;
		integer: string;
		decimal: string;
		metrics: HomeMetrics;
	}) => {
		return (
			<View
				className="flex-row items-end"
				style={{ marginTop: m.scaleV(2) }}
			>
				<Text
					fontWeight="semibold"
					style={{
						fontSize: m.balanceSymbolFontSize,
						lineHeight: m.balanceFontSize,
						marginRight: m.balanceSymbolMarginRight,
					}}
				>
					$
				</Text>
				<Text
					fontWeight="semibold"
					style={{
						fontSize: m.balanceFontSize,
						lineHeight: m.balanceFontSize,
					}}
				>
					{balanceVisible ? integer : "*****"}
				</Text>
				{balanceVisible && decimal ? (
					<Text
						fontWeight="semibold"
						style={{
							fontSize: m.balanceDecimalFontSize,
							lineHeight: m.balanceDecimalFontSize,
							marginBottom: m.balanceDecimalOffset,
						}}
					>
						,{decimal}
					</Text>
				) : null}
			</View>
		);
	},
);

const TotalDisplay = memo(
	({
		balanceVisible,
		integer,
		decimal,
		metrics: m,
	}: {
		balanceVisible: boolean;
		integer: string;
		decimal: string;
		metrics: HomeMetrics;
	}) => {
		return (
			<>
				<Text className="mr-1" style={{ fontSize: m.totalFontSize }}>
					Total $
				</Text>
				<Text style={{ fontSize: m.totalFontSize }}>
					{balanceVisible ? integer : "*****"}
				</Text>
				{balanceVisible && decimal && (
					<Text
						style={{
							fontSize: m.totalDecimalFontSize,
							marginTop: m.scaleV(2),
						}}
					>
						,{decimal}
					</Text>
				)}
			</>
		);
	},
);
