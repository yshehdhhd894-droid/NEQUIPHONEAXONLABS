import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { LOGIN_COACHMARK_QR_XML } from "@/components/login/login-coachmark-svg";
import { useBottomInset } from "@/hooks/useBottomInset";
import { useAppLayoutDimensions } from "@/libs/app-layout-dimensions";

/** Igual que coachmark-qr.organism.scss de Nequi real. */
const OVERLAY_COLOR = "rgba(32, 0, 32, 0.9)";
const IMG_MARGIN_RIGHT = 32;
const IMG_PADDING_V = 18;
const IMG_PADDING_H = 48;
const SVG_WIDTH = 220;
const SVG_HEIGHT = 135;

type Props = {
	visible: boolean;
	onClose: () => void;
};

export function LoginCheckPaymentCoachmark({ visible, onClose }: Props) {
	const insets = useSafeAreaInsets();
	const bottomInset = useBottomInset(12);
	const { width: screenWidth } = useAppLayoutDimensions();
	const imgWidth = screenWidth - IMG_PADDING_H - IMG_MARGIN_RIGHT;
	const imgHeight = (imgWidth * SVG_HEIGHT) / SVG_WIDTH;

	if (!visible) return null;

	return (
		<View
			style={[StyleSheet.absoluteFillObject, styles.root]}
			pointerEvents="auto"
			accessibilityViewIsModal
		>
			<Pressable
				style={[StyleSheet.absoluteFillObject, styles.backdrop]}
				onPress={() => {}}
				accessibilityRole="none"
				accessibilityLabel="Tutorial de comprobar pago"
			/>

			<Pressable
				onPress={onClose}
				hitSlop={16}
				style={[styles.closeButton, { top: insets.top + 8, right: 16 }]}
				accessibilityRole="button"
				accessibilityLabel="Cerrar"
			>
				<Ionicons name="close-outline" size={28} color="#FFFFFF" />
			</Pressable>

			<View
				pointerEvents="none"
				style={[
					styles.footer,
					{
						paddingBottom: bottomInset + 36,
						paddingLeft: IMG_PADDING_H,
						paddingRight: IMG_MARGIN_RIGHT,
						paddingTop: IMG_PADDING_V,
					},
				]}
			>
				<SvgXml
					xml={LOGIN_COACHMARK_QR_XML}
					width={imgWidth}
					height={imgHeight}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		zIndex: 99999,
		elevation: 99999,
	},
	backdrop: {
		backgroundColor: OVERLAY_COLOR,
	},
	closeButton: {
		position: "absolute",
		zIndex: 2,
		padding: 4,
	},
	footer: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		alignItems: "flex-start",
		justifyContent: "flex-end",
	},
});
