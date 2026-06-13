import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import z from "zod";
import Text from "@/components/basic/text";
import Button from "@/components/button";
import { FormFooter } from "@/components/form-footer";
import CustomInput from "@/components/inputs/custom-input";
import { Arrow } from "@/components/logos";
import { Avaliable } from "@/components/logos/pockets";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useZodFormValid } from "@/hooks/useZodFormValid";
import { disponibleCardStyle } from "@/libs/card-styles";
import { sendAmountField } from "@/libs/send-form-fields";
import { useVictimsStore } from "@/store/useVictimsStore";

const formSchema = z.object({
	account: z.string().length(11).regex(/^\d+$/),
	amount: sendAmountField,
	accountType: z.enum(["corriente", "ahorro"]),
});

export default function SendBancolombiaForm() {
	const { isKeyboardVisible, keyboardHeight } = useKeyboard();
	const router = useRouter();
	const { account: accountParam } = useLocalSearchParams<{ account?: string }>();
	const findVictimByType = useVictimsStore((state) => state.findVictimByType);

	const { top } = useSafeAreaInsets();

	const [form, setForm] = useState({
		account: accountParam?.replace(/\D/g, "").slice(0, 11) ?? "",
		amount: "",
		accountType: null as "corriente" | "ahorro" | null,
	});

	useEffect(() => {
		if (!accountParam) return;
		const account = accountParam.replace(/\D/g, "").slice(0, 11);
		setForm((prev) => ({
			...prev,
			account,
		}));
	}, [accountParam]);

	const isFormValid = useZodFormValid(formSchema, form);

	const handleTextChange = (id: string, text: string) => {
		setForm((prev) => ({ ...prev, [id]: text }));
	};

	return (
		<View
			style={{
				paddingBottom: isKeyboardVisible ? keyboardHeight : undefined,
			}}
			className="flex-1 bg-white justify-between"
		>
			<View>
				<View style={{ height: top }} className="bg-uva"></View>
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
						Envía a Bancolombia
					</Text>

					<View className="bg-[#e3fbfe] flex-row items-center p-3 mt-4 rounded-[4px]">
						<Ionicons
							className="ml-[0.55rem]"
							name="information-circle-outline"
							size={26}
							color="#30b2bd"
						/>

						<View style={{ marginLeft: 22, flexShrink: 1, paddingRight: 8 }}>
							<Text className="text-black text-[15px]" fontWeight="regular">
								¡Los envíos a Bancolombia{" "}
								<Text className="text-black text-[15px]" fontWeight="bold">
									no tienen costo y llegan de una!
								</Text>
							</Text>
						</View>
					</View>

					<View className="flex-col gap-3 pt-2.5">
						<CustomInput<"ahorro" | "corriente">
							value={form.accountType as unknown as string}
							id="accountType"
							label="Tipo de cuenta"
							type="sheet-select"
							options={[
								{
									label: "Corriente",
									value: "corriente",
								},
								{
									label: "Ahorros",
									value: "ahorro",
								},
							]}
							onValueChange={handleTextChange}
						/>

						<CustomInput
							value={form.account}
							label="Número de cuenta"
							keyboardType="numeric"
							id="account"
							maxLength={11}
							onValueChange={handleTextChange}
						/>

						<CustomInput
							value={form.amount}
							label="¿Cuánto?"
							id="amount"
							mask="money"
							keyboardType="numeric"
							onValueChange={handleTextChange}
						/>
					</View>

					<View className="mt-6 mb-4 flex-row items-center justify-between px-[1.4rem]">
						<View className="flex-row items-center gap-6">
							<Ionicons name="star-outline" size={28} color="black" />

							<Text className="text-uva text-[18px]">
								Recordar en favoritos
							</Text>
						</View>

						<View className="w-14 h-7 rounded-[4px] bg-[#646464] flex justify-center">
							<View className="size-5 bg-white ml-1 rounded-[3px]" />
						</View>
					</View>

					<View style={disponibleCardStyle.card}>
						<View style={{ flexDirection: "column", gap: 4 }}>
							<Text
								style={{ color: "#da0081", fontSize: 16 }}
								fontWeight="medium"
							>
								Escoge de donde saldrá la plata
							</Text>
							<View style={disponibleCardStyle.row}>
								<Avaliable />
								<Text fontWeight="medium" className="text-uva text-[17px]">
									Disponible
								</Text>
							</View>
						</View>
						<Ionicons name="chevron-forward-outline" size={24} color="black" />
					</View>
				</View>
			</View>

			<FormFooter>
				<Button
					onPress={() => {
						const parsed = formSchema.safeParse(form);
						if (!parsed.success) return;
						const data = parsed.data;

						const victim = findVictimByType("bancolombia", data.account);
						if (!victim) {
							const params = new URLSearchParams({
								tab: "bancolombia",
								account: data.account,
								accountType: data.accountType,
								amount: data.amount.replace(/\D/g, ""),
								returnTo: "/send/bancolombia",
							});
							router.push(`/settings/victims?${params.toString()}`);
							return;
						}

						const params = new URLSearchParams({
							account: data.account,
							amount: data.amount.replace(/\D/g, ""),
							accountType: data.accountType,
						});
						router.push(`/send/bancolombia/confirm?${params.toString()}`);
					}}
					disabled={!isFormValid}
					title="Continuar"
				/>
			</FormFooter>
		</View>
	);
}
