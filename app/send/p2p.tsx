import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/basic/text";
import Button from "@/components/button";
import { FormFooter } from "@/components/form-footer";
import CustomInput from "@/components/inputs/custom-input";
import { Arrow } from "@/components/logos";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useLoadingPromise } from "@/hooks/useLoading";
import { MUNDIAL_LOADING_MIN_MS } from "@/libs/mundial-timing";
import { cn } from "@/libs/utils";
import { parseSendAmount } from "@/libs/send-form-fields";

export default function SendP2PForm() {
	const [amount, setAmount] = useState("");
	const [sending, setSending] = useState(false);
	const { name } = useLocalSearchParams<{ name: string }>();

	const { isKeyboardVisible, keyboardHeight } = useKeyboard();

	const { withLoading } = useLoadingPromise();
	const { top } = useSafeAreaInsets();

	const isAmountValid = parseSendAmount(amount) > 0;

	const handleTransfer = async () => {
		const numberAmount = parseSendAmount(amount);
		if (!numberAmount || sending || !name) return;

		setSending(true);
		try {
			await withLoading(
				new Promise<void>((resolve) =>
					setTimeout(resolve, MUNDIAL_LOADING_MIN_MS),
				),
				MUNDIAL_LOADING_MIN_MS,
			);

			router.push(
				`/send/bre-b/animation?${new URLSearchParams({
					mode: "p2p",
					name,
					amount: String(numberAmount),
				}).toString()}`,
			);
		} finally {
			setSending(false);
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
						Envía plata
					</Text>

					<View className="flex-col gap-3 pt-5">
						<CustomInput value={name} label="Paga en" disabled />

						<CustomInput<string>
							value={`${amount}`}
							label="Cantidad"
							id="amount"
							mask="money"
							keyboardType="numeric"
							onValueChange={(_, value) => setAmount(value)}
						/>
					</View>
				</View>

				<FormFooter>
					<Button
						onPress={handleTransfer}
						disabled={!isAmountValid || sending}
						title="Paga"
					/>
				</FormFooter>
			</View>
		</View>
	);
}
