import { router } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/basic/text";
import Button from "@/components/button";
import CustomInput from "@/components/inputs/custom-input";
import { Arrow } from "@/components/logos";
import { FormFooter } from "@/components/form-footer";
import { useLoading } from "@/hooks/useLoading";
import { useModal } from "@/hooks/useModal";
import { showAppAlert } from "@/libs/app-alert";
import { navigateFromQrProfile } from "@/libs/qr-navigate";
import { parseScannedQr } from "@/libs/qr-handle";
import { useVictimsStore } from "@/store/useVictimsStore";

export default function QrManualScreen() {
	const { top } = useSafeAreaInsets();
	const [code, setCode] = useState("");
	const [loading, setLoading] = useState(false);

	const addVictim = useVictimsStore((state) => state.addVictim);
	const findVictim = useVictimsStore((state) => state.findVictimByType);
	const { autoShow } = useLoading();
	const { show } = useModal();

	const submit = async () => {
		if (!code.trim() || loading) return;
		setLoading(true);
		try {
			const info = parseScannedQr(code.trim());
			await navigateFromQrProfile(info, {
				addVictim,
				findVictim,
				showModal: show,
				autoShow,
			});
		} catch (error) {
			showAppAlert(
				error instanceof Error ? error.message : "Código QR inválido",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View className="flex-1 bg-white">
			<View style={{ height: top }} className="bg-uva" />
			<Pressable onPress={() => router.back()} className="px-4 pt-2 pb-1">
				<View className="size-8 justify-center">
					<Arrow color="#200020" />
				</View>
			</Pressable>

			<View className="px-4 pt-3 flex-1">
				<Text fontWeight="bold" className="text-[26px] text-uva">
					Ingresa el código
				</Text>
				<Text className="text-[#6e6e6e] text-[14px] pt-2 pb-6">
					Pega el contenido del QR si no puedes escanearlo
				</Text>

				<CustomInput
					value={code}
					id="code"
					label="Código QR"
					type="textarea"
					onValueChange={(_, value) => setCode(value)}
				/>
			</View>

			<FormFooter>
				<Button
					onPress={() => void submit()}
					disabled={!code.trim() || loading}
					title={loading ? "Procesando..." : "Continuar"}
				/>
			</FormFooter>
		</View>
	);
}
