import { Redirect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { LoginCheckPaymentCoachmark } from "@/components/login/login-check-payment-coachmark";
import { LoginCoachmarkPreloader } from "@/components/login/login-coachmark-preloader";
import { LoginPurpleLayout } from "@/components/login/login-purple-layout";
import { WelcomeAttentionModal } from "@/components/login/welcome-attention-modal";
import { WelcomeLoginSelection } from "@/components/login/welcome-login-selection";
import { useLoginNavigationBar } from "@/hooks/useLoginNavigationBar";
import { useWelcomeAttentionModal } from "@/hooks/useWelcomeAttentionModal";
import { setSystemNavBarLogin } from "@/libs/navigation-bar";
import { useAppStore } from "@/store/useAppStore";

export default function WelcomeLoginScreen() {
	const [storeReady, setStoreReady] = useState(
		() => useAppStore.persist.hasHydrated(),
	);
	const enrollTourCompleted = useAppStore((s) => s.enrollTourCompleted);
	const hasEverLoggedIn = useAppStore((s) => s.hasEverLoggedIn);
	const pendingLoginCoachmark = useAppStore(
		(s) => s.pendingLoginCheckPaymentCoachmark,
	);
	const dismissLoginCheckPaymentCoachmark = useAppStore(
		(s) => s.dismissLoginCheckPaymentCoachmark,
	);

	useLoginNavigationBar();

	useEffect(() => {
		if (useAppStore.persist.hasHydrated()) {
			setStoreReady(true);
			return;
		}
		return useAppStore.persist.onFinishHydration(() => {
			setStoreReady(true);
		});
	}, []);

	useEffect(() => {
		if (enrollTourCompleted) {
			void setSystemNavBarLogin();
		}
	}, [enrollTourCompleted]);

	const showLoginCoachmark =
		enrollTourCompleted && pendingLoginCoachmark;

	const {
		showWelcomeAttention,
		onConfirm: handleWelcomeConfirm,
		onNeverShowAgain: handleNeverShowWelcomeAgain,
	} = useWelcomeAttentionModal(showLoginCoachmark);

	const handleCoachmarkClose = useCallback(() => {
		dismissLoginCheckPaymentCoachmark();
	}, [dismissLoginCheckPaymentCoachmark]);

	if (!storeReady) {
		return <View style={styles.content} />;
	}

	if (!enrollTourCompleted) {
		return <Redirect href="/enroll-tour" />;
	}

	if (hasEverLoggedIn) {
		return <Redirect href="/login-logueado" />;
	}

	return (
		<LoginPurpleLayout>
			{showLoginCoachmark ? <LoginCoachmarkPreloader /> : null}
			<LoginCheckPaymentCoachmark
				visible={showLoginCoachmark}
				onClose={handleCoachmarkClose}
			/>
			<WelcomeAttentionModal
				visible={showWelcomeAttention}
				onConfirm={handleWelcomeConfirm}
				onNeverShowAgain={handleNeverShowWelcomeAgain}
			/>

			<View
				style={styles.content}
				pointerEvents={
					showLoginCoachmark || showWelcomeAttention ? "none" : "auto"
				}
			>
				<WelcomeLoginSelection
					hideFooterCheckPayment={showLoginCoachmark}
				/>
			</View>
		</LoginPurpleLayout>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		width: "100%",
	},
});
