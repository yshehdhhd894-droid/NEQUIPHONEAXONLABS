import { PhoneLoginScreen } from "@/components/login/phone-login-screen";
import { WelcomeAttentionModal } from "@/components/login/welcome-attention-modal";
import { useWelcomeAttentionModal } from "@/hooks/useWelcomeAttentionModal";
import { StyleSheet, View } from "react-native";

/** Usuario que ya inició sesión alguna vez: clave dinámica y teléfono guardado. */
export default function ReturningLoginScreen() {
	const {
		showWelcomeAttention,
		onConfirm,
		onNeverShowAgain,
	} = useWelcomeAttentionModal();

	return (
		<View style={styles.root}>
			<WelcomeAttentionModal
				visible={showWelcomeAttention}
				onConfirm={onConfirm}
				onNeverShowAgain={onNeverShowAgain}
			/>
			<View
				style={styles.content}
				pointerEvents={showWelcomeAttention ? "none" : "auto"}
			>
				<PhoneLoginScreen variant="returning" />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
	content: {
		flex: 1,
	},
});
