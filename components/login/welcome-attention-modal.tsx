import { Modal, Pressable, StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";
import Text from "@/components/basic/text";
import { WELCOME_ATTENTION_THUMB_XML } from "@/components/login/welcome-attention-thumb-svg";
import { WELCOME_ATTENTION_MESSAGE } from "@/libs/constants";

const ORQUIDEA = "#DA0081";
const UVA = "#200020";
const OVERLAY = "rgba(32, 0, 32, 0.72)";

type Props = {
	visible: boolean;
	onConfirm: () => void;
	onNeverShowAgain: () => void;
};

export function WelcomeAttentionModal({
	visible,
	onConfirm,
	onNeverShowAgain,
}: Props) {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onConfirm}
		>
			<View style={[StyleSheet.absoluteFillObject, styles.overlay]}>
				<View style={styles.cardShell}>
					<View style={styles.cardContent}>
						<View style={styles.iconWrap}>
							<SvgXml xml={WELCOME_ATTENTION_THUMB_XML} width={88} height={88} />
						</View>

						<Text
							fontWeight="bold"
							className="text-[22px] text-center"
							style={{ color: UVA }}
						>
							Atención
						</Text>

						<Text
							className="text-[15px] leading-[22px] text-center mt-3 px-1"
							style={{ color: "#6e6e6e" }}
						>
							{WELCOME_ATTENTION_MESSAGE}
						</Text>

						<Pressable
							onPress={onConfirm}
							style={styles.primaryButton}
						>
							<Text
								fontWeight="medium"
								className="text-[16px]"
								style={{ color: "#FFFFFF" }}
							>
								Entendido
							</Text>
						</Pressable>

						<Pressable
							onPress={onNeverShowAgain}
							style={styles.neverAgainButton}
						>
							<Text
								fontWeight="medium"
								className="text-[15px] underline"
								style={{ color: UVA }}
							>
								No volver a mostrar
							</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		backgroundColor: OVERLAY,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 28,
	},
	cardShell: {
		width: "100%",
		maxWidth: 340,
		borderRadius: 0,
		backgroundColor: "#FFFFFF",
		overflow: "hidden",
		elevation: 0,
		shadowOpacity: 0,
	},
	cardContent: {
		paddingHorizontal: 24,
		paddingTop: 28,
		paddingBottom: 20,
		alignItems: "center",
	},
	iconWrap: {
		marginBottom: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	primaryButton: {
		width: "100%",
		height: 48,
		marginTop: 24,
		borderRadius: 6,
		backgroundColor: ORQUIDEA,
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
	},
	neverAgainButton: {
		marginTop: 16,
		paddingVertical: 8,
		alignItems: "center",
	},
});
