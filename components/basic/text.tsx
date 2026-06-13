import { Text as NativeText, StyleSheet } from "react-native";
import { MAX_FONT_SCALE_MULTIPLIER } from "@/libs/layout-scale";
import { cn } from "@/libs/utils";

export type FontWeight =
	| "light"
	| "regular"
	| "medium"
	| "bold"
	| "semibold"
	| "extrabold";
export interface TextProps extends React.ComponentProps<typeof NativeText> {
	/** @default "regular" */
	fontWeight?: FontWeight;
}

const fontFamily = {
	light: "ManropeLight",
	regular: "ManropeRegular",
	medium: "ManropeMedium",
	bold: "ManropeBold",
	semibold: "ManropeSemiBold",
	extrabold: "ManropeExtraBold",
};

export default function Text(props: TextProps) {
	const flattenedStyle = (StyleSheet.flatten(props?.style) || {}) as object;

	return (
		<NativeText
			{...props}
			maxFontSizeMultiplier={
				props.maxFontSizeMultiplier ?? MAX_FONT_SCALE_MULTIPLIER
			}
			style={{
				fontFamily: fontFamily[props.fontWeight || "regular"],
				...flattenedStyle,
			}}
			className={cn("text-[#f4f5f8]", props.className)}
		/>
	);
}
