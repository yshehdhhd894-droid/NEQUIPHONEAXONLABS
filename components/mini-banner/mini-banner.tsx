import { LinearGradient } from "expo-linear-gradient";
import { memo, useMemo } from "react";
import {
	Image,
	Pressable,
	StyleSheet,
	View,
	type ImageSourcePropType,
} from "react-native";
import Text from "@/components/basic/text";
import {
	BANNER_BORDERS,
	BANNER_GRADIENTS,
	type BannerColor,
	type BannerType,
} from "@/libs/mini-banner-config";

/** Referencia Nequi descompilado: 390×140, radius 8px. */
const BANNER_REF_WIDTH = 390;
const BANNER_REF_HEIGHT = 140;

type Props = {
	title: string;
	description: string;
	linkText: string;
	image: ImageSourcePropType;
	bannerColor: BannerColor;
	typeBanner?: BannerType;
	width: number;
	onPress?: () => void;
};

/** Réplica responsive de `app-mini-banner` — escala automática por ancho. */
function MiniBanner({
	title,
	description,
	linkText,
	image,
	bannerColor,
	typeBanner = "filled",
	width,
	onPress,
}: Props) {
	const layout = useMemo(() => {
		const ratio = width / BANNER_REF_WIDTH;
		const clamped = Math.min(Math.max(ratio, 0.82), 1.14);
		return {
			height: Math.round((width * BANNER_REF_HEIGHT) / BANNER_REF_WIDTH),
			borderRadius: Math.round(8 * clamped),
			fontSize: Math.round(14 * clamped),
			hPad: Math.round(16 * clamped),
			vPad: Math.round(16 * clamped),
			gap: Math.round(6 * clamped),
			linkPadH: Math.round(12 * clamped),
			linkPadV: Math.round(4 * clamped),
			linkRadius: Math.round(4 * clamped),
			imageMax: Math.round(135 * clamped),
		};
	}, [width]);

	const gradient = BANNER_GRADIENTS[bannerColor];
	const isGuanabana = bannerColor === "guanabana";
	const textColor = isGuanabana ? "#200020" : "#ffffff";
	const linkBg = isGuanabana ? "#200020" : "#ffffff";
	const linkColor = isGuanabana ? "#ffffff" : "#200020";
	const isFilled = typeBanner === "filled";
	const textPadding = isFilled
		? {
				paddingVertical: layout.vPad,
				paddingLeft: layout.hPad,
				paddingRight: 0,
			}
		: {
				paddingVertical: Math.round(layout.vPad * 1.5),
				paddingLeft: layout.hPad,
				paddingRight: Math.round(layout.hPad * 0.75),
			};

	return (
		<Pressable
			onPress={onPress}
			style={[
				styles.root,
				{
					width,
					height: layout.height,
					borderRadius: layout.borderRadius,
					borderWidth: isFilled ? 1.5 : 0,
					borderColor: isFilled ? BANNER_BORDERS[bannerColor] : "transparent",
				},
			]}
		>
			<LinearGradient
				colors={gradient.colors}
				start={gradient.start}
				end={gradient.end}
				style={[
					StyleSheet.absoluteFillObject,
					{ borderRadius: layout.borderRadius },
				]}
			/>

			<View style={[styles.row, textPadding]}>
				<View style={styles.textCol}>
					<View style={styles.bodyText}>
						<Text
							fontWeight="bold"
							numberOfLines={3}
							style={{
								fontFamily: "ManropeBold",
								fontSize: layout.fontSize,
								lineHeight: layout.fontSize * 1.25,
								color: textColor,
								includeFontPadding: false,
							}}
						>
							{title}
						</Text>
						<Text
							fontWeight="medium"
							numberOfLines={3}
							style={{
								fontFamily: "ManropeMedium",
								fontSize: layout.fontSize,
								lineHeight: layout.fontSize * 1.125,
								color: textColor,
								marginTop: layout.gap,
								includeFontPadding: false,
							}}
						>
							{description}
						</Text>
					</View>
					<View
						style={{
							alignSelf: "flex-start",
							backgroundColor: linkBg,
							marginTop: layout.gap,
							paddingHorizontal: layout.linkPadH,
							paddingVertical: layout.linkPadV,
							borderRadius: layout.linkRadius,
						}}
					>
						<Text
							fontWeight="medium"
							style={{
								fontFamily: "ManropeMedium",
								fontSize: layout.fontSize,
								lineHeight: layout.fontSize * 1.25,
								color: linkColor,
								includeFontPadding: false,
							}}
						>
							{linkText}
						</Text>
					</View>
				</View>

				<View style={styles.imageCol}>
					<Image
						source={image}
						resizeMode="contain"
						style={{
							width: "100%",
							height: "100%",
							maxWidth: layout.imageMax,
							maxHeight: layout.imageMax,
						}}
					/>
				</View>
			</View>
		</Pressable>
	);
}

export default memo(MiniBanner);

const styles = StyleSheet.create({
	root: {
		overflow: "hidden",
	},
	row: {
		flex: 1,
		flexDirection: "row",
		alignItems: "stretch",
	},
	textCol: {
		flex: 0.6,
		justifyContent: "center",
		minWidth: 0,
	},
	bodyText: {
		gap: 0,
	},
	imageCol: {
		flex: 0.4,
		justifyContent: "flex-end",
		alignItems: "center",
		minWidth: 0,
	},
});
