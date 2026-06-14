import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import Text from "@/components/basic/text";
import { NEQUI_TOAST_INFO_SVG } from "@/components/send/nequi-toast-info-svg";

/** --alert-notification en Nequi real */
const BANNER_BG = "#46d5e8";
const TEXT_COLOR = "#200020";

export function NequiAmountInfoBanner() {
	return (
		<View
			style={{
				backgroundColor: BANNER_BG,
				borderRadius: 8,
				flexDirection: "row",
				alignItems: "center",
				paddingTop: 12,
				paddingBottom: 12,
				paddingRight: 8,
				minHeight: 82,
			}}
		>
			<View
				style={{
					width: 35,
					height: 35,
					marginLeft: 12,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<SvgXml xml={NEQUI_TOAST_INFO_SVG} width={32} height={32} />
			</View>

			<View style={{ flex: 1, marginLeft: 8, paddingRight: 4 }}>
				<Text
					style={{
						color: TEXT_COLOR,
						fontSize: 14,
						lineHeight: 20,
					}}
				>
					Revisa bien esta info, porque si le envias la plata a la persona
					incorrecta en Nequi no podremos recuperarla.
				</Text>
			</View>
		</View>
	);
}
