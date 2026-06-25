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
} from "@/libs/constants";
import { useAppStore } from "@/store/useAppStore";

const NODE_RUN_LOGO = require("@/assets/noderun.png");

const TELEGRAM_BLUE = "#0088CC";
const UVA = "#200020";
const OVERLAY = "rgba(32, 0, 32, 0.78)";
const LOGO_SIZE = 104;

export function NodeCommandHelpModal() {
	const visible = useAppStore((s) => s.nodeCommandHelpVisible);
	const close = useAppStore((s) => s.closeNodeCommandHelp);

	const openTelegram = (url: string) => {
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
								source={NODE_RUN_LOGO}
								style={styles.logoImage}
								resizeMode="cover"
							/>
						</View>

						<Text style={styles.title}>[𝕹𝖔𝖉𝖊 𝕮𝖔𝖒𝖒𝖆𝖓𝖉]</Text>

						<Text style={styles.message}>{NODE_COMMAND_HELP_MESSAGE}</Text>

						<Text style={styles.sectionLabel}>Creadores</Text>

						<View style={styles.telegramList}>
							{NODE_COMMAND_CREATORS.map((creator, index) => (
								<TouchableOpacity
									key={creator.label}
									activeOpacity={0.86}
									onPress={() => openTelegram(creator.telegramUrl)}
									style={[
										styles.telegramButton,
										index > 0 && styles.telegramButtonGap,
									]}
									accessibilityRole="link"
									accessibilityLabel={`Contactar a ${creator.label} en Telegram`}
								>
									<View style={styles.telegramButtonInner}>
										<View style={styles.telegramIconBadge}>
											<FontAwesome5
												name="telegram-plane"
												size={16}
												color="#FFFFFF"
											/>
										</View>
										<Text style={styles.telegramLabel}>{creator.label}</Text>
									</View>
								</TouchableOpacity>
							))}
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
	telegramList: {
		alignSelf: "stretch",
	},
	telegramButton: {
		alignSelf: "stretch",
		height: 48,
		backgroundColor: TELEGRAM_BLUE,
		borderRadius: 0,
		overflow: "hidden",
	},
	telegramButtonGap: {
		marginTop: 10,
	},
	telegramButtonInner: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 16,
	},
	telegramIconBadge: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: "rgba(255, 255, 255, 0.22)",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 10,
	},
	telegramLabel: {
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
