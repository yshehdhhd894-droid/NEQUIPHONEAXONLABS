import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/basic/text";
import Button from "@/components/button";
import { FormFooter } from "@/components/form-footer";
import CustomInput from "@/components/inputs/custom-input";
import { Arrow, BreBLogo } from "@/components/logos";
import { Avaliable } from "@/components/logos/pockets";
import ConfirmSheet, { obfuscateName } from "@/components/sheets/confirm";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useLoadingPromise } from "@/hooks/useLoading";
import { useModal } from "@/hooks/useModal";
import { MUNDIAL_LOADING_MIN_MS } from "@/libs/mundial-timing";
import { cn, formatBreBKey, formatMoney } from "@/libs/utils";
import { useVictimsStore } from "@/store/useVictimsStore";

type TipOption = "10" | "other" | "none" | null;

function parseMoney(value: string) {
	return parseInt(value.replace(/\D/g, "") || "0", 10);
}

function TipChoice({
	label,
	subLabel,
	selected,
	onPress,
}: {
	label: string;
	subLabel?: string;
	selected: boolean;
	onPress: () => void;
}) {
	return (
		<Pressable
			onPress={onPress}
			style={{
				flex: 1,
				minHeight: 72,
				borderRadius: 0,
				borderWidth: 1,
				borderColor: selected ? "#da0081" : "#E0E0E0",
				backgroundColor: selected ? "#FBECF5" : "#FFFFFF",
				paddingHorizontal: 10,
				paddingVertical: 12,
				justifyContent: "center",
			}}
		>
			<Text
				fontWeight="medium"
				className="text-uva"
				style={{ fontSize: 14, lineHeight: 18, textAlign: "left" }}
			>
				{label}
			</Text>
			{subLabel ? (
				<Text
					className="text-uva"
					style={{
						fontSize: 13,
						lineHeight: 18,
						marginTop: 2,
						textAlign: "left",
					}}
				>
					{subLabel}
				</Text>
			) : null}
		</Pressable>
	);
}

export default function BreBQrPayScreen() {
	const { key, name } = useLocalSearchParams<{ key: string; name: string }>();
	const findVictimByType = useVictimsStore((state) => state.findVictimByType);
	const { top } = useSafeAreaInsets();
	const { isKeyboardVisible, keyboardHeight } = useKeyboard();
	const { show } = useModal();
	const { withLoading } = useLoadingPromise();

	const [amount, setAmount] = useState("");
	const [tipOption, setTipOption] = useState<TipOption>(null);
	const [customTip, setCustomTip] = useState("");

	const baseAmount = parseMoney(amount);
	const tipAmount = useMemo(() => {
		if (tipOption === "10") return Math.round(baseAmount * 0.1);
		if (tipOption === "other") return parseMoney(customTip);
		return 0;
	}, [baseAmount, customTip, tipOption]);
	const total = baseAmount + tipAmount;

	const displayName = obfuscateName(name || "Negocio", true);
	const displayKey = formatBreBKey(key || "");

	const toggleTip = (option: Exclude<TipOption, null>) => {
		setTipOption((current) => (current === option ? null : option));
		if (option !== "other") setCustomTip("");
	};

	const handleTransfer = async () => {
		const victim = findVictimByType("key", key || "");
		if (!victim || victim.type !== "key") return;

		await withLoading(
			new Promise<void>((resolve) =>
				setTimeout(resolve, MUNDIAL_LOADING_MIN_MS),
			),
			MUNDIAL_LOADING_MIN_MS,
		);

		router.push(
			`/send/bre-b/animation?${new URLSearchParams({
				key: key || "",
				amount: String(total),
			}).toString()}`,
		);
	};

	const handleContinue = () => {
		show(
			<ConfirmSheet
				amount={total}
				phone={key || ""}
				type="bre-b"
				onTransfer={handleTransfer}
			/>,
		);
	};

	return (
		<View
			style={{
				paddingBottom: isKeyboardVisible ? keyboardHeight : undefined,
			}}
			className={cn("flex-1 bg-white justify-between")}
		>
			<ScrollView
				className="flex-1"
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
			>
				<View style={{ paddingTop: top }}>
					<View className="flex-row justify-between items-center px-2.5 py-2">
						<Pressable
							onPress={() => router.back()}
							className="size-8 justify-center"
						>
							<Arrow color="#200020" />
						</Pressable>
						<BreBLogo />
						<View className="size-8" />
					</View>

					<View className="px-4 pt-2 pb-4">
						<Text fontWeight="bold" className="text-[26px] text-uva leading-9">
							Paga
						</Text>

						<View className="flex-col gap-3 pt-4">
							<CustomInput
								value={displayName}
								label="Para"
								disabled
								mask="none"
							/>
							<CustomInput
								value={displayKey}
								label="Vas a enviar a la llave"
								disabled
								mask="bre-b"
							/>
							<CustomInput
								value={amount}
								label="¿Cuánto?"
								id="amount"
								mask="money"
								keyboardType="numeric"
								onValueChange={(_, value) => setAmount(value)}
							/>
						</View>

						<View className="pt-6">
							<Text fontWeight="bold" className="text-[16px] text-uva">
								Agrega una propina a tu pago
							</Text>
							<Text
								className="text-[#6e6e6e]"
								style={{ fontSize: 13, lineHeight: 18, marginTop: 4 }}
							>
								Si quieres, puedes dejar un aporte
							</Text>

							<View className="flex-row gap-2 pt-3">
								<TipChoice
									label="10%"
									subLabel={formatMoney(tipOption === "10" ? tipAmount : Math.round(baseAmount * 0.1)) || "$ 0"}
									selected={tipOption === "10"}
									onPress={() => toggleTip("10")}
								/>
								<TipChoice
									label="Otro valor"
									selected={tipOption === "other"}
									onPress={() => toggleTip("other")}
								/>
								<TipChoice
									label="Sin propina"
									selected={tipOption === "none"}
									onPress={() => toggleTip("none")}
								/>
							</View>

							{tipOption === "other" ? (
								<View className="pt-2">
									<CustomInput
										value={customTip}
										label="¿Cuánto?"
										id="customTip"
										mask="money"
										keyboardType="numeric"
										onValueChange={(_, value) => setCustomTip(value)}
									/>
								</View>
							) : null}
						</View>

						<Text
							fontWeight="medium"
							className="pt-6 pb-2 text-[16px] text-uva"
						>
							¿De dónde saldrá la plata?
						</Text>

						<View
							style={{
								borderWidth: 1,
								borderColor: "#E0E0E0",
								borderRadius: 4,
								marginTop: 24,
							}}
							className="flex-row items-center gap-3 p-2"
						>
							<Avaliable width={48} height={48} />
							<Text fontWeight="medium" className="text-uva text-[17px]">
								Disponible
							</Text>
						</View>
					</View>
				</View>
			</ScrollView>

			<FormFooter
				style={{
					borderTopWidth: 1,
					borderTopColor: "#E8E8E8",
				}}
			>
				<View className="flex-row items-center justify-between pb-4">
					<Text fontWeight="bold" className="text-[16px] text-uva">
						Total:
					</Text>
					<Text
						fontWeight="bold"
						className="text-orquidea"
						style={{ fontSize: 18 }}
					>
						{formatMoney(total) || "$ 0"}
					</Text>
				</View>

				<Button
					onPress={handleContinue}
					disabled={baseAmount <= 0}
					title="Continuar"
				/>
				<Pressable onPress={() => router.back()} className="items-center pt-4">
					<Text fontWeight="medium" className="text-orquidea text-[16px]">
						Salir
					</Text>
				</Pressable>
			</FormFooter>
		</View>
	);
}
