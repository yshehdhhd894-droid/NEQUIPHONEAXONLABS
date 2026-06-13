import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import z from "zod";
import Text from "@/components/basic/text";
import Button from "@/components/button";
import { FormFooter } from "@/components/form-footer";
import CustomInput from "@/components/inputs/custom-input";
import { AddContact, Arrow } from "@/components/logos";
import SelectContact from "@/components/select-contact";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useLoadingPromise } from "@/hooks/useLoading";
import { useZodFormValid } from "@/hooks/useZodFormValid";
import { showAppAlert } from "@/libs/app-alert";
import { cn } from "@/libs/utils";
import {
	sendAmountField,
	sendOptionalMessageField,
	sendPhoneField,
} from "@/libs/send-form-fields";
import { walletService } from "@/services/api.service";
import { useVictimsStore } from "@/store/useVictimsStore";

const { State: TextInputState } = TextInput;

const formSchema = z.object({
	message: sendOptionalMessageField,
	phone: sendPhoneField,
	amount: sendAmountField,
});

export default function RequestMoneyForm() {
	const currentlyFocusedField = TextInputState.currentlyFocusedInput();
	const [selectContact, setSelectContact] = useState(false);
	const { top } = useSafeAreaInsets();
	const findVictimByType = useVictimsStore((state) => state.findVictimByType);
	const { isKeyboardVisible, keyboardHeight } = useKeyboard();
	const { withLoading } = useLoadingPromise();

	const [form, setForm] = useState({
		phone: "",
		amount: "",
		message: undefined as string | undefined,
	});

	const isFormValid = useZodFormValid(formSchema, form);

	const handleTextChange = (id: string, text: string) => {
		setForm((prev) => ({ ...prev, [id]: text }));
	};

	const handlePress = async () => {
		currentlyFocusedField?.blur();

		const parsed = formSchema.safeParse(form);
		if (!parsed.success) return;

		const victim = findVictimByType("phone", parsed.data.phone);
		if (!victim) {
			showAppAlert(
				"Para poder agregar plata debes primero agregar este usuario",
			);
			return;
		}

		try {
			await withLoading(
				walletService.income(
					victim.name,
					parseInt(parsed.data.amount.replace(/\D/g, ""), 10),
				),
			);
			router.push("/home");
		} catch (error) {
			showAppAlert(
				error instanceof Error ? error.message : "Error al procesar",
			);
		}
	};

	return (
		<View
			style={{
				paddingBottom: isKeyboardVisible ? keyboardHeight : undefined,
			}}
			className={cn("flex-1 bg-white justify-between")}
		>
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
						Pide plata
					</Text>

					<View className="flex-col gap-3 pt-5">
						<CustomInput
							value={form.phone}
							label="¿A quién le vas a pedir plata?"
							keyboardType="numeric"
							mask="phone"
							id="phone"
							rightIcon={
								<Pressable onPress={() => setSelectContact(true)}>
									<AddContact />
								</Pressable>
							}
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
						<CustomInput
							value={form.message}
							id="message"
							label="Mensaje"
							onValueChange={handleTextChange}
							type="textarea"
						/>
					</View>
				</View>
			</View>

			{selectContact && (
				<SelectContact
					onPress={(vic) => {
						handleTextChange("phone", vic.value);
					}}
					onClose={() => setSelectContact(false)}
				/>
			)}

			<FormFooter>
				<Button onPress={handlePress} disabled={!isFormValid} title="Sigue" />
			</FormFooter>
		</View>
	);
}
