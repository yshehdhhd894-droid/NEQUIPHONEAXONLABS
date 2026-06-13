import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NequiSpinner from "@/components/basic/spinner";
import Text, { type FontWeight } from "@/components/basic/text";
import TuPlataShimmer from "@/components/money/tu-plata-shimmer";
import {
	AvaliableOutline,
	CardOutline,
	GoalsOutline,
	MattressOutline,
	PocketsOutline,
} from "@/components/logos/outline";
import { formatCurrencyDisplay } from "@/libs/utils";
import { walletService } from "@/services/api.service";

const CARDS_MIN_MS = 1000;
const CARDS_MAX_MS = 3000;
const BALANCE_MIN_MS = 600;
const BALANCE_MAX_MS = 1200;

function randomDelay(min: number, max: number) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

export default function Money() {
	const { top } = useSafeAreaInsets();
	const [showCards, setShowCards] = useState(false);
	const [showBalance, setShowBalance] = useState(false);
	const [focusKey, setFocusKey] = useState(0);

	const { data, isSuccess, isLoading } = useQuery({
		queryKey: ["wallet"],
		queryFn: () => walletService.getWallet(),
	});

	useFocusEffect(
		useCallback(() => {
			setFocusKey((key) => key + 1);
			setShowCards(false);
			setShowBalance(false);

			const cardsTimer = setTimeout(
				() => setShowCards(true),
				randomDelay(CARDS_MIN_MS, CARDS_MAX_MS),
			);

			return () => clearTimeout(cardsTimer);
		}, []),
	);

	useEffect(() => {
		if (!isSuccess) {
			setShowBalance(false);
			return;
		}

		setShowBalance(false);
		const balanceTimer = setTimeout(
			() => setShowBalance(true),
			randomDelay(BALANCE_MIN_MS, BALANCE_MAX_MS),
		);

		return () => clearTimeout(balanceTimer);
	}, [isSuccess, data, focusKey]);

	const { available = 0, pockets = [] } = data ?? {};
	const pocketsValue = pockets.reduce((sum, p) => sum + p.amount, 0);
	const total = available + pocketsValue;

	const [pocketsInteger, pocketsDecimal] = formatCurrencyDisplay(pocketsValue);
	const [totalInteger, totalDecimal] = formatCurrencyDisplay(total);
	const [availableInteger, availableDecimal] = formatCurrencyDisplay(available);

	const balanceLoading = !showBalance || isLoading;
	const cardsLoading = !showCards;

	return (
		<View className="flex-1 w-full bg-uva" style={{ paddingTop: top }}>
			<Pressable onPress={() => router.back()} className="px-3 mt-2">
				<Ionicons name="arrow-back" size={28} color="white" />
			</Pressable>

			<Text
				fontWeight="semibold"
				className="text-[26px] text-white px-3 pt-2 pb-6"
			>
				Así está tu plata
			</Text>

			<View className="items-center gap-2 pb-4">
				<Text className="text-[18px] leading-none">Toda tu plata suma</Text>

				{balanceLoading ? (
					<NequiSpinner size={28} color="#ffffff" opacity={1} />
				) : (
					<CurrencyDisplay
						integer={totalInteger}
						decimal={totalDecimal}
						size={24}
						weight="bold"
					/>
				)}
			</View>

			<View className="flex-1">
				{cardsLoading ? (
					<TuPlataShimmer />
				) : (
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
					>
						<View className="gap-3">
							<Card
								icon={<AvaliableOutline height={48} width={48} />}
								text="Disponible"
								subTitle={
									balanceLoading ? null : (
										<CurrencyDisplay
											integer={availableInteger}
											decimal={availableDecimal}
											size={16}
											weight="regular"
										/>
									)
								}
							/>

							<Card
								icon={<CardOutline height={48} width={48} />}
								text="Tarjeta"
								subTitle={
									<CurrencyDisplay
										integer="0"
										decimal="00"
										size={16}
										weight="regular"
									/>
								}
							/>

							<Card
								icon={<MattressOutline height={48} width={48} />}
								text="Colchón"
								subTitle={
									<CurrencyDisplay
										integer="0"
										decimal="00"
										size={16}
										weight="regular"
									/>
								}
							/>

							<Card
								icon={<PocketsOutline height={48} width={48} />}
								text="Bolsillos"
								background="#2b0d2b"
								subTitle={
									pocketsInteger === "0" ? (
										"Organiza tu plata"
									) : balanceLoading ? null : (
										<CurrencyDisplay
											integer={pocketsInteger}
											decimal={pocketsDecimal}
											size={16}
											weight="regular"
										/>
									)
								}
							/>

							<Card
								icon={<GoalsOutline height={48} width={48} />}
								background="#2b0d2b"
								text="Metas"
								subTitle="Ahorra para un sueño acá"
							/>
						</View>
					</ScrollView>
				)}
			</View>

			{!cardsLoading && (
				<View className="bg-white p-2 absolute bottom-4 left-3 right-3 rounded-[4px]">
					<Text className="text-uva">Tus topes</Text>
				</View>
			)}
		</View>
	);
}

function CurrencyDisplay({
	integer,
	decimal,
	size = 24,
	offset = 2,
	weight = "medium",
}: {
	integer: string;
	decimal: string;
	size?: number;
	offset?: number;
	weight?: FontWeight;
}) {
	return (
		<View className="flex-row items-center">
			<Text
				style={{ fontSize: size }}
				fontWeight={weight}
				className="mr-1 leading-none"
			>
				$
			</Text>
			<Text
				style={{ fontSize: size }}
				fontWeight={weight}
				className="leading-none"
			>
				{integer}
			</Text>
			{decimal && (
				<Text
					fontWeight={weight}
					style={{ fontSize: size - offset, marginTop: offset }}
					className="leading-none"
				>
					,{decimal}
				</Text>
			)}
		</View>
	);
}

function Card(props: {
	text: string;
	icon: ReactNode;
	background?: string;
	subTitle?: string | ReactNode | null;
}) {
	return (
		<View
			style={{ backgroundColor: props.background || "#4D334D" }}
			className="rounded-lg flex-row gap-4 px-3.5 py-[1.2rem] items-center"
		>
			{props.icon}
			<View className="flex gap-0.5">
				<Text fontWeight="medium" className="leading-none text-[18px]">
					{props.text}
				</Text>
				{typeof props.subTitle === "string" ? (
					<Text fontWeight="regular" style={{ fontSize: 14 }} className="opacity-80">
						{props.subTitle}
					</Text>
				) : (
					props.subTitle
				)}
			</View>
		</View>
	);
}
