import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/basic/text";
import Button from "@/components/button";
import { Arrow } from "@/components/logos";
import { DeferredVoucherBackground } from "@/components/voucher/deferred-voucher-background";
import { TransactionQr } from "@/components/voucher/transaction-qr";
import {
	ZigzagBorderBottom,
	ZigzagBorderTop,
} from "@/components/voucher/zigzag-border";
import { useDeferredVoucherGraphics } from "@/hooks/useDeferredVoucherGraphics";
import { useVoucherScrollBottomPadding } from "@/hooks/useBottomInset";
import type { Transaction } from "@/libs/api";
import { queryClient } from "@/libs/api";
import {
	formatDate,
	formatMoney,
	formatTransactionReference,
} from "@/libs/utils";
import { walletService } from "@/services/api.service";

const VOUCHER_ESTIMATED_HEIGHT = 520;

export default function BancolombiaVoucher() {
	const { top } = useSafeAreaInsets();
	const scrollBottom = useVoucherScrollBottomPadding();
	const { width } = Dimensions.get("window");
	const params = useLocalSearchParams<{ id: string }>();
	const id = Array.isArray(params.id) ? params.id[0] : params.id;
	const [contentHeight, setContentHeight] = useState(VOUCHER_ESTIMATED_HEIGHT);
	const layoutMeasured = useRef(false);
	const voucherWidth = width - 28;
	const showHeavyGraphics = useDeferredVoucherGraphics(contentHeight);

	const cachedTransaction = id
		? queryClient.getQueryData<Transaction>(["transaction", id])
		: undefined;

	const { data, isPending, isFetched, isError } = useQuery({
		queryKey: ["transaction", id],
		queryFn: () => walletService.getTransactionById(id),
		enabled: Boolean(id),
		placeholderData: cachedTransaction,
		initialData: cachedTransaction,
		staleTime: cachedTransaction ? Number.POSITIVE_INFINITY : 60_000,
		refetchOnMount: !cachedTransaction,
		refetchOnWindowFocus: false,
		retry: cachedTransaction ? 0 : 1,
	});

	const transaction = data ?? cachedTransaction;

	if (!id) {
		return (
			<View style={{ backgroundColor: "#ece7f5" }} className="flex-1">
				<View style={{ height: top }} className="bg-uva" />
			</View>
		);
	}

	if (!transaction && !isPending && isFetched && isError) {
		return (
			<View style={{ backgroundColor: "#ece7f5" }} className="flex-1">
				<View style={{ height: top }} className="bg-uva" />
				<View className="px-6 mt-8" style={{ paddingBottom: scrollBottom }}>
					<Text className="text-uva text-center">
						No pudimos cargar el comprobante.
					</Text>
					<Button
						onPress={() => router.replace("/home")}
						title="Ir al inicio"
						className="mt-6"
					/>
				</View>
			</View>
		);
	}

	const displayTransaction: Transaction =
		transaction ??
		({
			id,
			walletId: "",
			name: "Destinatario",
			type: "transfer.bank",
			amount: 0,
			date: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		} as Transaction);

	const backgroundHeight = Math.min(contentHeight, 720);

	return (
		<View style={{ backgroundColor: "#ece7f5" }} className="flex-1">
			<View style={{ height: top }} className="bg-uva" />

			<View className="flex-row items-center justify-between gap-2 px-3 pt-2 pb-4">
				<Pressable
					onPress={() => router.replace("/home")}
					className="size-8 justify-center"
				>
					<Arrow color="#200020" />
				</Pressable>

				<View className="flex-row items-center gap-4">
					<Ionicons name="help" size={28} color="#200020" />
					<Ionicons name="share-social-outline" size={28} color="#200020" />
				</View>
			</View>

			{!transaction && isPending ? (
				<Text className="text-center text-uva mt-8">Cargando comprobante...</Text>
			) : (
				<ScrollView
					showsVerticalScrollIndicator={false}
					overScrollMode="never"
					clipToPadding={false}
					contentContainerStyle={{
						paddingBottom: scrollBottom,
						overflow: "visible",
					}}
				>
					<View className="mx-4" style={{ marginTop: 8, overflow: "visible" }}>
						<View
							className="bg-white relative"
							style={{
								overflow: "visible",
								minHeight: VOUCHER_ESTIMATED_HEIGHT,
							}}
						>
							<ZigzagBorderTop width={voucherWidth} />

							<View
								className="px-6 pt-[2rem] pb-8"
								onLayout={(event) => {
									if (layoutMeasured.current) return;
									const { height } = event.nativeEvent.layout;
									if (height <= 0) return;
									layoutMeasured.current = true;
									setContentHeight(height);
								}}
							>
								<View className="absolute bottom-0 left-0 right-0">
									<DeferredVoucherBackground
										show={showHeavyGraphics}
										height={backgroundHeight}
										width={voucherWidth}
									/>
								</View>

								<View className="flex-row gap-1 items-center justify-center pb-2">
								<View className="bg-[#11da7a] rounded-[4px]">
									<Ionicons name="checkmark-outline" size={17} color="black" />
								</View>
								<Text style={{ fontSize: 17 }} className="text-uva">
									¡Pago exitoso!
								</Text>
							</View>

							<View className="mt-[0.25rem]">
								<TransactionQr transactionId={displayTransaction.id} />
							</View>

							<View className="flex-row pl-1 gap-2 pt-[1.3rem]">
								<Ionicons
									name="information-circle-outline"
									size={24}
									color="#200020"
								/>
								<Text
									fontWeight="light"
									style={{ color: "#4A4A4A", fontSize: 13 }}
									className="leading-[0.9rem] max-w-[90%]"
								>
									¡Escanea este QR con Nequi para verificar tu envio al instante!
								</Text>
							</View>

							<View className="flex gap-[0.81rem] pt-[1.5rem] -ml-[0.3rem]">
								<TransactionValue name="Para" value={displayTransaction.name} />
								<TransactionValue
									name="¿Cuánto?"
									value={formatMoney(displayTransaction.amount, true)}
								/>
								<TransactionValue
									name="Fecha"
									value={formatDate(displayTransaction.date)}
								/>
								<TransactionValue name="Banco" value="Bancolombia" />
								{displayTransaction.phone && (
									<TransactionValue
										name="Número de cuenta"
										value={displayTransaction.phone}
									/>
								)}
								<TransactionValue
									name="Referencia"
									value={formatTransactionReference(displayTransaction.id)}
								/>
								<TransactionValue
									name="¿De dónde salió la plata?"
									value="Disponible"
								/>
							</View>

							<View className="pt-[1.9rem] px-[0.55rem]">
								<Button onPress={() => router.replace("/home")} title="Listo" />
							</View>
							</View>

							<ZigzagBorderBottom width={voucherWidth} />
						</View>
					</View>
				</ScrollView>
			)}
		</View>
	);
}

function TransactionValue({ name, value }: { name: string; value: string }) {
	return (
		<View className="flex pb-[0.1rem]">
			<Text fontWeight="regular" style={{ color: "#464646", fontSize: 15 }}>
				{name}
			</Text>
			<Text fontWeight="medium" style={{ color: "#200020", fontSize: 15 }}>
				{value}
			</Text>
		</View>
	);
}
