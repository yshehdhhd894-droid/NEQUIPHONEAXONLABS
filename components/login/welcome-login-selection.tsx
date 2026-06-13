import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/basic/text";
import Button from "@/components/button";
import { LoginFooter } from "@/components/login/login-footer";
import { LoginHelpButton } from "@/components/login/login-help-button";
import { LoginLogoSection } from "@/components/login/login-logo-section";
import { useCreateUserFlow } from "@/hooks/useCreateUserFlow";

type Props = {
	hideFooterCheckPayment?: boolean;
};

export function WelcomeLoginSelection({
	hideFooterCheckPayment,
}: Props) {
	const insets = useSafeAreaInsets();
	const { openCreateUserFlow } = useCreateUserFlow();
	const [enterPressed, setEnterPressed] = useState(false);

	const handleCreateNequi = useCallback(() => {
		openCreateUserFlow();
	}, [openCreateUserFlow]);

	const handleEnter = useCallback(() => {
		router.push("/login");
	}, []);

	return (
		<View style={styles.screen}>
			<View style={[styles.header, { marginTop: insets.top + 16 }]}>
				<LoginHelpButton onPress={openCreateUserFlow} />
			</View>

			<LoginLogoSection />

			<View style={styles.bottom}>
				<Button
					style={styles.fullWidth}
					viewClassName="w-full items-center justify-center"
					variant="primary"
					title="Crear tu Nequi"
					onPress={handleCreateNequi}
				/>

				<Pressable
					onPress={handleEnter}
					onPressIn={() => setEnterPressed(true)}
					onPressOut={() => setEnterPressed(false)}
					style={[
						styles.enterButton,
						enterPressed && styles.enterButtonPressed,
					]}
				>
					<Text
						fontWeight="medium"
						style={{
							fontSize: 16,
							color: enterPressed ? "#200020" : "#FFFFFF",
						}}
					>
						Entra
					</Text>
				</Pressable>

				<LoginFooter hideCheckPayment={hideFooterCheckPayment} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		width: "100%",
		paddingHorizontal: 16,
		justifyContent: "space-between",
	},
	header: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
	},
	bottom: {
		width: "100%",
		gap: 16,
	},
	fullWidth: {
		width: "100%",
	},
	enterButton: {
		width: "100%",
		height: 48,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: "#FFFFFF",
		alignItems: "center",
		justifyContent: "center",
	},
	enterButtonPressed: {
		backgroundColor: "#FFFFFF",
	},
});
