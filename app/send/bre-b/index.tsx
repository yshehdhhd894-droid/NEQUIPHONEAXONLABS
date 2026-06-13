import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import z from "zod";
import Text from "@/components/basic/text";
import Button from "@/components/button";
import { FormFooter } from "@/components/form-footer";
import CustomInput from "@/components/inputs/custom-input";
import { AddContact, Arrow, BreBLogo } from "@/components/logos";
import { Avaliable } from "@/components/logos/pockets";
import SelectContact from "@/components/select-contact";
import ConfirmSheet from "@/components/sheets/confirm";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useLoadingPromise } from "@/hooks/useLoading";
import { useModal } from "@/hooks/useModal";
import { useZodFormValid } from "@/hooks/useZodFormValid";
import { MUNDIAL_LOADING_MIN_MS } from "@/libs/mundial-timing";
import { cn } from "@/libs/utils";
import {
	sendAmountField,
	sendOptionalMessageField,
} from "@/libs/send-form-fields";
import { useVictimsStore } from "@/store/useVictimsStore";

const formSchema = z.object({
	message: sendOptionalMessageField,
	key: z.string().trim().min(1, "Llave requerida"),
	amount: sendAmountField,
});

export default function BreBSendForm() {
	const [selectContact, setSelectContact] = useState(false);
	const { isKeyboardVisible, keyboardHeight } = useKeyboard();

	const { key, name } = useLocalSearchParams<{ key: string; name: string }>();
	const findVictimByType = useVictimsStore((state) => state.findVictimByType);

	const { top } = useSafeAreaInsets();
	const { show } = useModal();
	const { withLoading } = useLoadingPromise();

	const [form, setForm] = useState({
		key: key || "",
		amount: "",
		message: undefined as string | undefined,
	});

	const isFormValid = useZodFormValid(formSchema, form);

	const handleTextChange = (id: string, text: string) => {
		setForm((prev) => ({ ...prev, [id]: text }));
	};

	const handleTransfer = async () => {
		const victim = findVictimByType("key", form.key);
		if (!victim || victim.type !== "key") return;

		await withLoading(
			new Promise<void>((resolve) =>
				setTimeout(resolve, MUNDIAL_LOADING_MIN_MS),
			),
			MUNDIAL_LOADING_MIN_MS,
		);

		router.push(
			`/send/bre-b/animation?${new URLSearchParams({
				key: form.key,
				amount: form.amount,
			}).toString()}`,
		);
	};

	const handleContinue = () => {
		const parsed = formSchema.safeParse(form);
		if (!parsed.success) return;

		show(
			<ConfirmSheet
				amount={parseInt(parsed.data.amount.replace(/\D/g, ""), 10)}
				phone={parsed.data.key}
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

					<View className="px-4 pt-3 pb-4">
						<Text fontWeight="bold" className="text-[26px] text-uva leading-9">
							¿A quién le vas a enviar plata?
						</Text>
						<Text className="text-[16px] text-uva mt-6 leading-[22px]">
							Con llaves de Bre-B, tu plata llega inmediatamente.
						</Text>

						<View className="flex-col gap-3 pt-5">
							{key ? (
								<>
									<CustomInput
										value={name}
										label="Vas a enviar plata al negocio"
										disabled
										mask="bre-b"
									/>

									<CustomInput
										value={form.key}
										label="Vas a enviar plata al la llave"
										disabled
										mask="bre-b"
									/>
								</>
							) : (
								<View>
									<CustomInput
										value={form.key}
										label="Escribe la llave para enviar"
										mask="bre-b"
										keyboardType="default"
										id="key"
										rightIcon={
											<Pressable onPress={() => setSelectContact(true)}>
												<AddContact />
											</Pressable>
										}
										onValueChange={handleTextChange}
									/>
									<Text
										style={{ fontSize: 13 }}
										className="text-[#6e6e6e] pt-2 leading-[18px]"
									>
										Escribe la llave donde enviarás: celular, correo, documento o
										usuario alfanumérico.
									</Text>
								</View>
							)}
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

						<View
							style={{
								borderWidth: 1,
								borderColor: "#E0E0E0",
								borderRadius: 4,
								marginTop: 24,
							}}
							className="p-3"
						>
							<Text
								fontWeight="medium"
								className="pb-2 text-[16px] text-uva"
							>
								¿De dónde saldrá la plata?
							</Text>
							<View className="flex-row items-center gap-3">
								<Avaliable width={48} height={48} />
								<Text fontWeight="medium" className="text-uva text-[17px]">
									Disponible
								</Text>
							</View>
						</View>
					</View>
				</View>
			</ScrollView>

			{selectContact && (
				<SelectContact
					type="key"
					onClose={() => setSelectContact(false)}
					onPress={(vic) => {
						handleTextChange("key", vic.value);
					}}
				/>
			)}

			<FormFooter>
				<Button onPress={handleContinue} disabled={!isFormValid} title="Continuar" />
				<Pressable onPress={() => router.back()} className="items-center pt-4">
					<Text fontWeight="medium" className="text-orquidea text-[16px]">
						Salir
					</Text>
				</Pressable>
			</FormFooter>
		</View>
	);
}
