import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/basic/text";
import Button from "@/components/button";
import { FormFooter } from "@/components/form-footer";
import { Arrow } from "@/components/logos";
import { useLoadingPromise } from "@/hooks/useLoading";
import { preloadVoucherAssets } from "@/hooks/useVoucherPreload";
import { queryClient } from "@/libs/api";
import { showAppAlert } from "@/libs/app-alert";
import { formatMoney } from "@/libs/utils";
import { walletService } from "@/services/api.service";
import { obfuscateName } from "@/components/sheets/confirm";
import {
	ACCOUNT_TYPES,
	COLOMBIAN_BANKS,
	DOCUMENT_TYPES,
} from "@/data/bancos-options";

const accountTypeLabels = Object.fromEntries(
	ACCOUNT_TYPES.map(({ label, value }) => [value, label]),
) as Record<string, string>;

const documentTypeLabels = Object.fromEntries(
	DOCUMENT_TYPES.map(({ label, value }) => [value, label]),
) as Record<string, string>;

const bankLabels = Object.fromEntries(
	COLOMBIAN_BANKS.map(({ label, value }) => [value, label]),
) as Record<string, string>;

export default function BancosConfirmScreen() {
	const [voucherId, setVoucherId] = useState<string | null>(null);
	const { top } = useSafeAreaInsets();
	const { withLoading } = useLoadingPromise();

	const {
		recipientName,
		documentType,
		documentNumber,
		bank,
		accountType,
		accountNumber,
		amount,
	} = useLocalSearchParams<{
		recipientName: string;
		documentType: string;
		documentNumber: string;
		bank: string;
		accountType: "ahorro" | "corriente";
		accountNumber: string;
		amount: string;
	}>();

	const amountNumber = parseInt(amount?.replace(/\D/g, "") ?? "0", 10);

	useEffect(() => {
		void preloadVoucherAssets();
	}, []);

	useEffect(() => {
		if (!voucherId) return;
		const timer = setTimeout(() => {
			router.replace(
				`/vouchers/nequi-full?id=${encodeURIComponent(voucherId)}`,
			);
		}, 150);
		return () => clearTimeout(timer);
	}, [voucherId]);

	if (voucherId) {
		return null;
	}

	if (
		!recipientName ||
		!documentType ||
		!documentNumber ||
		!bank ||
		!accountType ||
		!accountNumber ||
		!amountNumber
	) {
		return null;
	}

	const displayName = obfuscateName(recipientName, true);

	return (
		<View className="flex-1 bg-white justify-between">
			<View>
				<View style={{ height: top }} className="bg-uva" />
				<View className="flex-row justify-between items-center p-2.5">
					<Pressable
						onPress={() => router.back()}
						className="size-8 justify-center"
					>
						<Arrow color="#200020" />
					</Pressable>

					<Ionicons name="chevron-down-outline" size={28} color="#200020" />
				</View>

				<View className="px-4 pt-3">
					<Text fontWeight="bold" className="text-[26px] text-uva">
						Verifica la info
					</Text>

					<View className="bg-[#e3fbfe] flex-row items-center p-3 mt-4 rounded-[4px]">
						<Ionicons
							className="ml-[0.55rem]"
							name="information-circle-outline"
							size={26}
							color="#30b2bd"
						/>

						<View style={{ marginLeft: 22, flexShrink: 1, paddingRight: 1 }}>
							<Text className="text-black text-[15px]" fontWeight="bold">
								Revisa bien esta información.{" "}
								<Text className="text-black text-[15px]" fontWeight="regular">
									Si envias la plata a la persona equivocada, no podremos
									recuperarla
								</Text>
							</Text>
						</View>
					</View>

					<View className="flex pt-[2.7rem] px-1 gap-[0.8rem]">
						<View>
							<Text className="text-uva text-[15px]">Vas a enviar a:</Text>
							<Text
								fontWeight="medium"
								className="text-uva text-[18px] leading-[1.7rem] uppercase"
							>
								{displayName}
							</Text>
						</View>

						<View>
							<Text className="text-uva text-[15px]">¿Cuánto?</Text>
							<Text
								fontWeight="medium"
								className="text-uva text-[18px] leading-[1.7rem]"
							>
								{formatMoney(amountNumber)}
							</Text>
						</View>

						<View>
							<Text className="text-uva text-[15px]">Banco</Text>
							<Text
								fontWeight="medium"
								className="text-uva text-[18px] leading-[1.7rem]"
							>
								{bankLabels[bank] ?? bank}
							</Text>
						</View>

						<View>
							<Text className="text-uva text-[15px]">Tipo de documento</Text>
							<Text
								fontWeight="medium"
								className="text-uva text-[18px] leading-[1.7rem]"
							>
								{documentTypeLabels[documentType] ?? documentType}
							</Text>
						</View>

						<View>
							<Text className="text-uva text-[15px]">Documento</Text>
							<Text
								fontWeight="medium"
								className="text-uva text-[18px] leading-[1.7rem]"
							>
								{documentNumber}
							</Text>
						</View>

						<View>
							<Text className="text-uva text-[15px]">Tipo de cuenta</Text>
							<Text
								fontWeight="medium"
								className="text-uva text-[18px] leading-[1.7rem]"
							>
								{accountTypeLabels[accountType]}
							</Text>
						</View>

						<View>
							<Text className="text-uva text-[15px]">Número de cuenta</Text>
							<Text
								fontWeight="medium"
								className="text-uva text-[18px] leading-[1.7rem]"
							>
								{accountNumber}
							</Text>
						</View>

						<View>
							<Text className="text-uva text-[15px]">
								¿De dónde saldrá la plata?
							</Text>
							<Text
								fontWeight="medium"
								className="text-uva text-[18px] leading-[1.7rem]"
							>
								Disponible
							</Text>
						</View>
					</View>
				</View>
			</View>

			<FormFooter style={{ paddingTop: 16 }}>
				<Button
					onPress={async () => {
						try {
							const transaction = await withLoading(
								walletService.transfer({
									type: "transfer.bank",
									accountType,
									amount: amountNumber,
									name: recipientName,
									phone: accountNumber,
									bank,
								}),
							);

							queryClient.setQueryData(
								["transaction", transaction.id],
								transaction,
							);
							setVoucherId(transaction.id);
						} catch (error) {
							const msg =
								error instanceof Error ? error.message : "No se pudo enviar";
							showAppAlert(msg);
						}
					}}
					title="Continuar"
				/>
				<Pressable onPress={() => router.back()}>
					<Text
						fontWeight="semibold"
						className="text-uva text-center underline text-[17px] mt-4"
					>
						Corrige la info
					</Text>
				</Pressable>
			</FormFooter>
		</View>
	);
}
