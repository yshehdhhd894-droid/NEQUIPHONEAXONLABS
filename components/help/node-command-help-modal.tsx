import { FontAwesome5 } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import {
	Image,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {
	NODE_COMMAND_CREATORS,
	NODE_COMMAND_HELP_MESSAGE,
	ORGANIZATION_NAME,
	WHATSAPP_URL,
} from "@/libs/constants";
import { useAppStore } from "@/store/useAppStore";

const ORG_LOGO = require("@/assets/orbytek.png");

const TELEGRAM_BLUE = "#0088CC";
const WHATSAPP_GREEN = "#25D366";
const UVA = "#200020";
const OVERLAY = "rgba(32, 0, 32, 0.78)";
const LOGO_SIZE = 104;

export function NodeCommandHelpModal() {
	const visible = useAppStore((s) => s.nodeCommandHelpVisible);
	const close = useAppStore((s) => s.closeNodeCommandHelp);

	const openUrl = (url: string) => {
		void Linking.openURL(url);
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={close}
			statusBarTranslucent
		>
			<View style={[StyleSheet.absoluteFillObject, styles.overlay]}>
				<View style={styles.cardShell}>
					<View style={styles.cardContent}>
						<View style={styles.logoSquare}>
							<Image
								source={ORG_LOGO}
								style={styles.logoImage}
								resizeMode="cover"
							/>
						</View>

						<Text style={styles.title}>{ORGANIZATION_NAME}</Text>

						<Text style={styles.message}>{NODE_COMMAND_HELP_MESSAGE}</Text>

						<Text style={styles.sectionLabel}>Creador</Text>

						<View style={styles.contactList}>
							{NODE_COMMAND_CREATORS.map((creator, index) => (
								<TouchableOpacity
									key={creator.label}
									activeOpacity={0.86}
									onPress={() => openUrl(creator.telegramUrl)}
									style={[
										styles.telegramButton,
										index > 0 && styles.contactButtonGap,
									]}
									accessibilityRole="link"
									accessibilityLabel={`Contactar a ${creator.label} en Telegram`}
								>
									<View style={styles.contactButtonInner}>
										<View style={styles.contactIconBadge}>
											<FontAwesome5
												name="telegram-plane"
												size={16}
												color="#FFFFFF"
											/>
										</View>
										<Text style={styles.contactLabel}>{creator.label}</Text>
									</View>
								</TouchableOpacity>
							))}

							<TouchableOpacity
								activeOpacity={0.86}
								onPress={() => openUrl(WHATSAPP_URL)}
								style={[styles.whatsappButton, styles.contactButtonGap]}
								accessibilityRole="link"
								accessibilityLabel="Contactar por WhatsApp"
							>
								<View style={styles.contactButtonInner}>
									<View style={styles.contactIconBadge}>
										<FontAwesome5 name="whatsapp" size={18} color="#FFFFFF" brand />
									</View>
									<Text style={styles.contactLabel}>WhatsApp</Text>
								</View>
							</TouchableOpacity>
						</View>

						<Pressable onPress={close} style={styles.closeButton}>
							<Text style={styles.closeLabel}>Cerrar</Text>
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
	},
	cardContent: {
		paddingHorizontal: 24,
		paddingTop: 28,
		paddingBottom: 22,
		alignItems: "stretch",
	},
	logoSquare: {
		width: LOGO_SIZE,
		height: LOGO_SIZE,
		borderRadius: 0,
		backgroundColor: "#ece7f5",
		borderWidth: 1,
		borderColor: "#d0cadb",
		overflow: "hidden",
		marginBottom: 16,
		alignSelf: "center",
	},
	logoImage: {
		width: LOGO_SIZE,
		height: LOGO_SIZE,
	},
	title: {
		fontFamily: "ManropeBold",
		fontSize: 20,
		lineHeight: 26,
		color: UVA,
		textAlign: "center",
	},
	message: {
		fontFamily: "ManropeRegular",
		fontSize: 15,
		lineHeight: 22,
		color: "#6e6e6e",
		textAlign: "center",
		marginTop: 12,
		paddingHorizontal: 4,
	},
	sectionLabel: {
		fontFamily: "ManropeSemiBold",
		fontSize: 14,
		color: UVA,
		marginTop: 20,
		marginBottom: 12,
	},
	contactList: {
		alignSelf: "stretch",
	},
	telegramButton: {
		alignSelf: "stretch",
		height: 48,
		backgroundColor: TELEGRAM_BLUE,
		borderRadius: 0,
		overflow: "hidden",
	},
	whatsappButton: {
		alignSelf: "stretch",
		height: 48,
		backgroundColor: WHATSAPP_GREEN,
		borderRadius: 0,
		overflow: "hidden",
	},
	contactButtonGap: {
		marginTop: 10,
	},
	contactButtonInner: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 16,
	},
	contactIconBadge: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: "rgba(255, 255, 255, 0.22)",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 10,
	},
	contactLabel: {
		fontFamily: "ManropeSemiBold",
		fontSize: 15,
		lineHeight: 20,
		color: "#FFFFFF",
		letterSpacing: 0.6,
		includeFontPadding: false,
	},
	closeButton: {
		marginTop: 18,
		alignSelf: "stretch",
		height: 44,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#f4f0f7",
		borderWidth: 1,
		borderColor: "#d0cadb",
	},
	closeLabel: {
		fontFamily: "ManropeMedium",
		fontSize: 15,
		color: UVA,
	},
});
