import { Pressable, View } from "react-native";
import { SvgXml } from "react-native-svg";
import Text from "@/components/basic/text";
import { dp } from "@/libs/dp";

type Props = {
	label: string;
	iconXml: string;
	onPress: () => void;
	disabled?: boolean;
};

/** Botón inferior del escáner — bg_round_btn.xml (#200020, 40dp, radius 4dp). */
export function QrScannerAction({
	label,
	iconXml,
	onPress,
	disabled,
}: Props) {
	const size = dp(40);
	const radius = dp(4);
	const iconSize = dp(20);

	return (
		<Pressable
			onPress={onPress}
			disabled={disabled}
			className="items-center opacity-100 disabled:opacity-50"
			style={{ gap: dp(4) }}
		>
			<View
				style={{
					width: size,
					height: size,
					borderRadius: radius,
					backgroundColor: "#200020",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<SvgXml xml={iconXml} width={iconSize} height={iconSize} />
			</View>
			<Text
				className="text-white"
				style={{ fontSize: dp(10), fontFamily: "ManropeRegular" }}
			>
				{label}
			</Text>
		</Pressable>
	);
}
