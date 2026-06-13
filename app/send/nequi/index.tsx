import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import z from "zod";
import NequiSpinner from "@/components/basic/spinner";
import Text from "@/components/basic/text";
import Button from "@/components/button";
import CustomInput from "@/components/inputs/custom-input";
import { AddContact, Arrow } from "@/components/logos";
import { Avaliable } from "@/components/logos/pockets";
import SelectContact from "@/components/select-contact";
import { useAuthStore } from "@/hooks/useAuth";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useZodFormValid } from "@/hooks/useZodFormValid";
import { preloadVoucherAssets } from "@/hooks/useVoucherPreload";
import { showAppAlert } from "@/libs/app-alert";
import { disponibleCardStyle } from "@/libs/card-styles";
import { cn } from "@/libs/utils";
import { isFakeNequiPhone } from "@/libs/nequi-name-lookup";
import { resolveNequiVictimForPhone } from "@/libs/nequi-vip";
import { canUseVipNameLookup } from "@/libs/premium";
import {
	sendAmountField,
	sendOptionalMessageField,
	sendPhoneField,
} from "@/libs/send-form-fields";
import { usePremiumStore } from "@/store/usePremiumStore";
import { useVictimsStore } from "@/store/useVictimsStore";

const formSchema = z.object({
	message: sendOptionalMessageField,
	phone: sendPhoneField,
	amount: sendAmountField,
});

export default function SendNequiForm() {
	const [selectContact, setSelectContact] = useState(false);
	const [resolvingName, setResolvingName] = useState(false);

	useEffect(() => {
		void preloadVoucherAssets();
	}, []);

	const { phone } = useLocalSearchParams<{ phone: string }>();
	const { isKeyboardVisible, keyboardHeight } = useKeyboard();
	const findVictimByType = useVictimsStore((state) => state.findVictimByType);
	const addVictim = useVictimsStore((state) => state.addVictim);
	const user = useAuthStore((s) => s.user);
	const vipAutoNamesEnabled = usePremiumStore((s) => s.vipAutoNamesEnabled);
	const canUseVipNames = canUseVipNameLookup(user) && vipAutoNamesEnabled;

	const { top } = useSafeAreaInsets();

	const [form, setForm] = useState({
		phone: phone || "",
		amount: "",
		message: undefined as string | undefined,
	});

	const isFormValid = useZodFormValid(formSchema, form);

	const handleTextChange = (id: string, text: string) => {
		setForm((prev) => ({ ...prev, [id]: text }));
	};

	const goToConfirm = async () => {
		const parsed = formSchema.safeParse(form);
		if (!parsed.success) return;

		let victim = findVictimByType("phone", parsed.data.phone);

		if (!victim && canUseVipNames) {
			if (isFakeNequiPhone(parsed.data.phone)) {
				showAppAlert(
					"Para agregar números tuyos desactiva la función premium",
				);
				return;
			}

			setResolvingName(true);
			try {
				const resolved = await resolveNequiVictimForPhone(
					parsed.data.phone,
					(value) => findVictimByType("phone", value),
					addVictim,
				);
				if (resolved.found) {
					victim = findVictimByType("phone", parsed.data.phone);
				} else {
					showAppAlert(
						"No se encontró nombre para este número. Agrégalo en Víctimas o intenta más tarde.",
					);
					return;
				}
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: "No se pudo consultar el nombre VIP";
				showAppAlert(message);
				return;
			} finally {
				setResolvingName(false);
			}
		}

		if (!victim) {
			router.push("/settings/victims");
			return;
		}

		const params = new URLSearchParams({
			phone: parsed.data.phone,
			amount: parsed.data.amount,
		});
		if (parsed.data.message) {
			params.set("message", parsed.data.message);
		}

		router.push(`/send/nequi/confirm?${params.toString()}`);
	};

	return (
		<View
			style={{
				paddingBottom: isKeyboardVisible ? keyboardHeight : undefined,
			}}
			className={cn("flex-1 bg-white")}
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

						<Ionicons name="chevron-down-outline" size={28} color="#200020" />
					</View>

					<View className="px-4 pt-3 pb-4">
						<Text fontWeight="bold" className="text-[26px] text-uva leading-9">
							Envía plata
						</Text>

						<View className="flex-col gap-3 pt-5">
							<CustomInput
								value={form.phone}
								label="Cel"
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

						<View className="pt-6 pb-8">
							<Button
								onPress={goToConfirm}
								disabled={!isFormValid || resolvingName}
								title={resolvingName ? undefined : "Sigue"}
							>
								{resolvingName && <NequiSpinner />}
							</Button>
						</View>
					</View>
				</View>
			</ScrollView>

			{selectContact && (
				<SelectContact
					type="phone"
					onClose={() => setSelectContact(false)}
					onPress={(vic) => {
						handleTextChange("phone", vic.value);
					}}
				/>
			)}
		</View>
	);
}
