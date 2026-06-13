import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import { LOGIN_COACHMARK_QR_XML } from "@/components/login/login-coachmark-svg";

/** Precarga el SVG del coachmark para que el overlay no congele al abrir. */
export function LoginCoachmarkPreloader() {
	return (
		<View
			pointerEvents="none"
			style={{
				position: "absolute",
				width: 1,
				height: 1,
				opacity: 0,
				overflow: "hidden",
			}}
		>
			<SvgXml xml={LOGIN_COACHMARK_QR_XML} width={1} height={1} />
		</View>
	);
}
