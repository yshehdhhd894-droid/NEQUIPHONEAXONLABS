import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenZoomIn } from "@/components/animations/screen-zoom-in";
import Text from "@/components/basic/text";
import Button from "@/components/button";
import { Arrow } from "@/components/logos";
import { Avaliable } from "@/components/logos/pockets";
import { obfuscateName } from "@/components/sheets/confirm";
import { useFormFooterBottomPadding } from "@/hooks/useBottomInset";
import { useLoadingPromise } from "@/hooks/useLoading";
import { preloadVoucherAssets } from "@/hooks/useVoucherPreload";
import { queryClient } from "@/libs/api";
import { MUNDIAL_LOADING_MIN_MS } from "@/libs/mundial-timing";
import { showAppAlert } from "@/libs/app-alert";
import { formatMoney, formatPersonName, formatPhone } from "@/libs/utils";
import { walletService } from "@/services/api.service";
import { useVictimsStore } from "@/store/useVictimsStore";

export default function NequiSendConfirm() {
	const { top } = useSafeAreaInsets();
	const footerBottom = useFormFooterBottomPadding(16);
	const findVictimByType = useVictimsStore((state) => state.findVictimByType);
	const [storeReady, setStoreReady] = useState(false);
	const [sending, setSending] = useState(false);
	const { withLoading } = useLoadingPromise();

	useEffect(() => {
		void preloadVoucherAssets();
	}, []);

	const { phone, amount } = useLocalSearchParams<{
		phone: string;
		amount: string;
	}>();

	const victim = phone ? findVictimByType("phone", phone) : undefined;
	const amountNumber = parseInt(amount ?? "0", 10);
	const displayPhone = formatPhone(victim?.value ?? phone ?? "");
	const displayName = victim
		? obfuscateName(formatPersonName(victim.name), true)
		: "";

	useEffect(() => {
		const timer = setTimeout(() => setStoreReady(true), 80);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (!storeReady || !phone || !amount) return;
		if (!findVictimByType("phone", phone)) {
			router.replace("/settings/victims");
		}
	}, [storeReady, phone, amount, findVictimByType]);

	if (!storeReady || !phone || !amount || !victim || !amountNumber) {
		return (
			<View className="flex-1 bg-white" style={{ paddingTop: top }} />
		);
	}

	const handleSend = async () => {
		if (sending) return;
		setSending(true);

		try {
			const transaction = await withLoading(
				walletService.transfer({
					type: "transfer",
					amount: amountNumber,
					name: victim.name,
					phone: victim.value,
				}),
				MUNDIAL_LOADING_MIN_MS,
			);

			if (!transaction?.id) {
				throw new Error("No se recibió el comprobante del servidor");
			}

			queryClient.setQueryData(
				["transaction", transaction.id],
				transaction,
			);

			router.replace(
				`/vouchers/nequi?${new URLSearchParams({
					id: transaction.id,
					style: "1",
				}).toString()}`,
			);
		} catch (error) {
			showAppAlert(
				error instanceof Error ? error.message : "Error al enviar",
			);
			setSending(false);
		}
	};

	return (
		<ScreenZoomIn>
			<View className="flex-1 bg-white">
				<View style={{ height: top }} className="bg-uva" />
				<View className="flex-row justify-between items-center px-2.5 py-2">
					<Pressable
						onPress={() => router.back()}
						className="size-10 justify-center"
						disabled={sending}
					>
						<Arrow color="#200020" />
					</Pressable>
					<Pressable className="size-10 items-center justify-center">
						<Ionicons name="help-circle-outline" size={28} color="#200020" />
					</Pressable>
				</View>

				<View className="flex-1 px-4 pt-1">
					<Text fontWeight="bold" className="text-[26px] text-uva leading-8">
						Revisa los datos antes de enviar la plata
					</Text>

					<Text fontWeight="bold" className="text-uva text-[17px] mt-6 mb-3">
						Resumen del envío
					</Text>

					<SummaryRow
						label="Vas a enviar a:"
						value={displayName}
						highlight
					/>
					<View className="h-px bg-[#e0e0e0]" />
					<SummaryRow
						label="Nº de celular"
						value={displayPhone}
						valueBold
					/>

					<View className="h-px bg-[#e0e0e0] my-5" />

					<Text fontWeight="bold" className="text-uva text-[15px] mb-3">
						¿De dónde saldrá la plata?
					</Text>
					<View
						style={{ borderWidth: 1, borderColor: "#e0e0e0" }}
						className="w-full flex-row items-center gap-3 rounded-[4px] px-3 py-3"
					>
						<Avaliable width={32} height={32} />
						<Text className="text-uva text-[16px]">Disponible</Text>
					</View>
				</View>

				<View
					className="px-5 gap-3 border-t border-[#ece7f5] pt-4"
					style={{ paddingBottom: footerBottom }}
				>
					<View className="flex-row justify-between items-center">
						<Text fontWeight="bold" className="text-uva text-[15px]">
							Total a enviar
						</Text>
						<Text
							fontWeight="bold"
							style={{ color: "#da0081", fontSize: 28 }}
						>
							{formatMoney(amountNumber, true)}
						</Text>
					</View>

					<Button onPress={handleSend} title="Enviar" disabled={sending} />
					<Pressable
						onPress={() => router.back()}
						disabled={sending}
						className="border border-uva rounded-[4px] py-3.5 items-center active:bg-uva-button-pressed"
					>
						<Text fontWeight="medium" className="text-uva text-[16px]">
							Corregir datos
						</Text>
					</Pressable>
				</View>
			</View>
		</ScreenZoomIn>
	);
}

function SummaryRow({
	label,
	value,
	highlight = false,
	valueBold = false,
}: {
	label: string;
	value: string;
	highlight?: boolean;
	valueBold?: boolean;
}) {
	return (
		<View className="flex-row justify-between items-center py-2">
			<Text className="text-uva text-[15px]">{label}</Text>
			<Text
				fontWeight={valueBold || highlight ? "bold" : "regular"}
				style={{
					color: highlight ? "#da0081" : "#200020",
					fontSize: highlight ? 17 : 16,
				}}
			>
				{value}
			</Text>
		</View>
	);
}
