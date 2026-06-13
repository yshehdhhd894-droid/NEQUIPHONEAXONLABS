import { StyleSheet, View } from "react-native";
import { NequiLogoWhite } from "@/components/logos";

export function LoginLogoSection() {
	return (
		<View style={styles.wrap}>
			<View style={styles.logoBox}>
				<NequiLogoWhite />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	logoBox: {
		width: "100%",
		height: 75.3,
	},
});
