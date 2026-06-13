import * as Linking from "expo-linking";
import { router } from "expo-router";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import Text from "@/components/basic/text";
import { BreBKeyCombined } from "@/components/logos";
import { useLoadingPromise } from "@/hooks/useLoading";
import { TELEGRAM } from "@/libs/constants";
import { MUNDIAL_LOADING_MIN_MS } from "@/libs/mundial-timing";
import { useBreBSplashStore } from "@/store/useBreBSplashStore";

export function BreBSplashModal() {
	const visible = useBreBSplashStore((s) => s.visible);
	const close = useBreBSplashStore((s) => s.close);
	const { withLoading } = useLoadingPromise();

	const handleSend = async () => {
		close();
		await withLoading(
			new Promise<void>((resolve) =>
				setTimeout(resolve, MUNDIAL_LOADING_MIN_MS),
			),
			MUNDIAL_LOADING_MIN_MS,
		);
		router.push("/send/bre-b");
	};

	const handleRegister = () => {
		close();
		void Linking.openURL(TELEGRAM);
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={close}
		>
			<Pressable style={styles.backdrop} onPress={close}>
				<Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
					<View style={styles.iconWrap}>
						<BreBKeyCombined width={88} height={89} />
					</View>

					<Text
						fontWeight="bold"
						className="text-uva text-[18px] text-center leading-6 px-2"
					>
						Registra tus llaves en Bre-B y recibe plata al instante
					</Text>

					<Text className="text-[#6e6e6e] text-[15px] text-center leading-[22px] mt-3 px-1">
						Registra tus llaves ahora para recibir plata de otros bancos, sin
						costo ni demoras
					</Text>

					<View style={styles.actions}>
						<Pressable onPress={handleSend} style={styles.primaryButton}>
							<Text fontWeight="medium" className="text-white text-[16px]">
								Enviar
							</Text>
						</Pressable>

						<Pressable onPress={handleRegister} style={styles.secondaryButton}>
							<Text fontWeight="medium" className="text-uva text-[16px]">
								Registrar
							</Text>
						</Pressable>
					</View>
				</Pressable>
			</Pressable>
		</Modal>
	);
}

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: "rgba(32, 0, 32, 0.72)",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 28,
	},
	card: {
		width: "100%",
		maxWidth: 340,
		backgroundColor: "#FFFFFF",
		borderRadius: 8,
		paddingHorizontal: 24,
		paddingTop: 28,
		paddingBottom: 24,
		alignItems: "center",
	},
	iconWrap: {
		marginBottom: 20,
	},
	actions: {
		width: "100%",
		marginTop: 24,
		gap: 12,
	},
	primaryButton: {
		height: 48,
		borderRadius: 4,
		backgroundColor: "#da0081",
		alignItems: "center",
		justifyContent: "center",
	},
	secondaryButton: {
		height: 48,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: "#200020",
		backgroundColor: "#FFFFFF",
		alignItems: "center",
		justifyContent: "center",
	},
});
