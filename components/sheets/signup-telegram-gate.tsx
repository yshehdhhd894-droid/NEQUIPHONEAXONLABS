import * as Linking from "expo-linking";
import { Pressable, View } from "react-native";
import Text from "@/components/basic/text";
import { TELEGRAM_AXONDEVUI } from "@/libs/constants";

type Props = {
	onContinue: () => void;
};

export default function SignupTelegramGate({ onContinue }: Props) {
	const openTelegram = async () => {
		await Linking.openURL(TELEGRAM_AXONDEVUI);
		onContinue();
	};

	return (
		<View className="pb-10 pt-2">
			<View className="pb-6">
				<Text fontWeight="bold" className="text-uva text-[20px]">
					Crear cuenta
				</Text>
				<Text className="text-uva text-[16px] leading-[22px]">
					Para crear tu cuenta, escríbenos por Telegram y luego completa el
					formulario.
				</Text>
			</View>

			<Pressable
				onPress={openTelegram}
				className="h-[48px] w-full items-center justify-center rounded-[4px] bg-orquidea active:opacity-90"
			>
				<Text fontWeight="medium" style={{ fontSize: 16, color: "#FFFFFF" }}>
					Telegram
				</Text>
			</Pressable>
		</View>
	);
}
