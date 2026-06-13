import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Switch, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import z from "zod";
import Text from "@/components/basic/text";
import Button from "@/components/button";
import { FormFooter } from "@/components/form-footer";
import CustomInput from "@/components/inputs/custom-input";
import { Arrow } from "@/components/logos";
import { Avaliable } from "@/components/logos/pockets";
import {
	ACCOUNT_TYPES,
	COLOMBIAN_BANKS,
	DOCUMENT_TYPES,
} from "@/data/bancos-options";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useZodFormValid } from "@/hooks/useZodFormValid";
import { disponibleCardStyle } from "@/libs/card-styles";
import { sendAmountField } from "@/libs/send-form-fields";
import { cn } from "@/libs/utils";

const formSchema = z.object({
	recipientName: z.string().min(3).trim(),
	documentType: z.string().min(1),
	documentNumber: z.string().min(5).trim(),
	bank: z.string().min(1),
	accountType: z.enum(["ahorro", "corriente"]),
	accountNumber: z.string().min(5).regex(/^\d+$/),
	amount: sendAmountField,
});

export default function BancosSendFormScreen() {
	const { isKeyboardVisible, keyboardHeight } = useKeyboard();
	const [rememberFavorite, setRememberFavorite] = useState(false);
	const { top } = useSafeAreaInsets();

	const [form, setForm] = useState({
		recipientName: "",
		documentType: "",
		documentNumber: "",
		bank: "",
		accountType: null as "ahorro" | "corriente" | null,
		accountNumber: "",
		amount: "",
	});

	const isFormValid = useZodFormValid(formSchema, form);

	const handleTextChange = (id: string, text: string) => {
		setForm((prev) => ({ ...prev, [id]: text }));
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
					<View className="flex-row items-center justify-between px-4 py-2">
						<Pressable
							onPress={() => router.back()}
							className="size-8 justify-center"
						>
							<Arrow color="#200020" />
						</Pressable>

						<View className="flex-row items-center gap-2">
							<Pressable className="size-8 items-center justify-center">
								<Ionicons name="star-outline" size={26} color="#200020" />
							</Pressable>
							<Pressable className="size-8 items-center justify-center">
								<Ionicons name="chevron-down-outline" size={26} color="#200020" />
							</Pressable>
						</View>
					</View>

					<View className="px-6 pb-4">
						<Text fontWeight="bold" className="text-[24px] text-uva mb-6">
							Envía a bancos
						</Text>

						<View className="flex-col gap-3">
							<CustomInput
								value={form.recipientName}
								label="Nombre de quien recibe"
								id="recipientName"
								onValueChange={handleTextChange}
							/>

							<CustomInput
								value={form.documentType}
								label="Tipo de documento"
								id="documentType"
								type="sheet-select"
								options={[...DOCUMENT_TYPES]}
								onValueChange={handleTextChange}
							/>

							<CustomInput
								value={form.documentNumber}
								label="Documento de esa persona CC/NIT"
								id="documentNumber"
								keyboardType="default"
								onValueChange={handleTextChange}
							/>

							<CustomInput
								value={form.bank}
								label="Banco"
								id="bank"
								type="sheet-select"
								options={[...COLOMBIAN_BANKS]}
								onValueChange={handleTextChange}
							/>

							<CustomInput
								value={form.accountType as unknown as string}
								label="Tipo de cuenta"
								id="accountType"
								type="sheet-select"
								options={[...ACCOUNT_TYPES]}
								onValueChange={handleTextChange}
							/>

							<CustomInput
								value={form.accountNumber}
								label="Número de cuenta"
								id="accountNumber"
								keyboardType="numeric"
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

						<View className="mt-4 mb-6 flex-row items-center justify-between">
							<View className="flex-row items-center gap-3">
								<Ionicons name="star-outline" size={24} color="#200020" />
								<Text fontWeight="medium" className="text-uva text-[16px]">
									Recordar en favoritos
								</Text>
							</View>
							<Switch
								value={rememberFavorite}
								onValueChange={setRememberFavorite}
								trackColor={{ false: "#646464", true: "#da0081" }}
								thumbColor="#ffffff"
							/>
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
									<Avaliable width={48} height={48} />
									<Text fontWeight="medium" className="text-uva text-[17px]">
										Disponible
									</Text>
								</View>
							</View>
							<Ionicons name="chevron-forward-outline" size={24} color="#200020" />
						</View>
					</View>
				</View>
			</ScrollView>

			<FormFooter style={{ paddingHorizontal: 24 }}>
				<Button
					title="Listo"
					disabled={!isFormValid}
					onPress={() => {
						const parsed = formSchema.safeParse(form);
						if (!parsed.success) return;
						const data = parsed.data;

						const params = new URLSearchParams({
							recipientName: data.recipientName,
							documentType: data.documentType,
							documentNumber: data.documentNumber,
							bank: data.bank,
							accountType: data.accountType,
							accountNumber: data.accountNumber,
							amount: data.amount.replace(/\D/g, ""),
						});
						router.push(`/send/bancos/confirm?${params.toString()}`);
					}}
				/>
			</FormFooter>
		</View>
	);
}
