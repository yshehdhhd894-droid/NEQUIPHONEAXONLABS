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
import { Arrow } from "@/components/logos";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useLoadingPromise } from "@/hooks/useLoading";
import { useZodFormValid } from "@/hooks/useZodFormValid";
import { cn } from "@/libs/utils";
import { parseSendAmount, sendAmountField } from "@/libs/send-form-fields";
import { walletService } from "@/services/api.service";

const { State: TextInputState } = TextInput;

const formSchema = z.object({
	where: z.enum(["atm", "bank"]),
	amount: sendAmountField,
});

export default function CashoutForm() {
	const currentlyFocusedField = TextInputState.currentlyFocusedInput();
	const { top } = useSafeAreaInsets();
	const { isKeyboardVisible, keyboardHeight } = useKeyboard();
	const { withLoading } = useLoadingPromise();

	const [form, setForm] = useState<{
		where?: "atm" | "bank";
		amount?: string;
	}>({
		where: undefined,
		amount: undefined,
	});

	const isFormValid = useZodFormValid(formSchema, form);

	const handleTextChange = (id: string, text: string) => {
		setForm((prev) => ({ ...prev, [id]: text }));
	};

	const handlePress = async () => {
		currentlyFocusedField?.blur();

		const parsed = formSchema.safeParse(form);
		if (!parsed.success) return;

		await withLoading(
			walletService.withdraw(
				parsed.data.where === "atm" ? "Cajero" : "Corresponsal",
				parseSendAmount(parsed.data.amount),
			),
		);

		router.push("/home");
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
						Saca plata
					</Text>

					<View className="flex-col gap-3 pt-5">
						<CustomInput
							value={form.where}
							id="where"
							label="¿Dónde vas a retirar la plata?"
							type="select"
							options={[
								{ label: "Cajero", value: "atm" },
								{ label: "Banco", value: "bank" },
							]}
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
				</View>
			</View>

			<FormFooter>
				<Button onPress={handlePress} disabled={!isFormValid} title="Sigue" />
			</FormFooter>
		</View>
	);
}
