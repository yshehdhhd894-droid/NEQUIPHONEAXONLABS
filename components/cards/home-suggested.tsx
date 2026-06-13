import type { ReactElement } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import type { SvgProps } from "react-native-svg";
import Text from "@/components/basic/text";
import {
	FAVORITE_BOX_SIZE,
	FAVORITE_ICON_SIZE,
	FAVORITE_ITEM_WIDTH,
	type FavoriteCardContent,
	ServiceCard,
} from "@/components/cards/home-favorites";

interface SuggestedCardProps {
	content: FavoriteCardContent;
	onPress?: () => void;
	name: string;
	itemWidth?: number;
}

/** @deprecated Usar ServiceCard / HomeSuggestedSection. */
export function SuggestedCard(props: SuggestedCardProps) {
	return (
		<ServiceCard
			name={props.name}
			content={props.content}
			onPress={props.onPress}
			itemWidth={props.itemWidth}
		/>
	);
}

/** Compat legacy: tarjetas solo con SVG. */
export function SuggestedCardSvg(props: {
	element: (props: SvgProps) => ReactElement;
	name: string;
	onPress?: () => void;
	boxed?: boolean;
	iconSize?: number;
	itemWidth?: number;
}) {
	return (
		<SuggestedCard
			name={props.name}
			onPress={props.onPress}
			itemWidth={props.itemWidth}
			content={{
				kind: "svg",
				element: props.element,
				width: props.iconSize ?? FAVORITE_ICON_SIZE,
				height: props.iconSize ?? FAVORITE_ICON_SIZE,
			}}
		/>
	);
}

export {
	FAVORITE_BOX_SIZE,
	FAVORITE_ICON_SIZE,
	FAVORITE_ITEM_WIDTH,
};

const _legacyStyles = StyleSheet.create({
	cardBox: {
		borderRadius: 0,
		borderWidth: 1,
		borderColor: "#d9d9d9",
		width: FAVORITE_BOX_SIZE,
		height: FAVORITE_BOX_SIZE,
	},
});

/** @deprecated */
export function SuggestedCardLegacy(props: {
	element: (props: SvgProps) => ReactElement;
	onPress?: () => void;
	name: string;
	boxed?: boolean;
	iconSize?: number;
}) {
	const size = props.iconSize ?? FAVORITE_ICON_SIZE;
	return (
		<Pressable onPress={props?.onPress} className="flex items-center gap-2">
			{props.boxed ? (
				<View
					style={_legacyStyles.cardBox}
					className="bg-white items-center justify-center"
				>
					<props.element width={size} height={size} />
				</View>
			) : (
				<View
					style={{ width: FAVORITE_BOX_SIZE, height: FAVORITE_BOX_SIZE }}
					className="items-center justify-center"
				>
					<props.element width={size} height={size} />
				</View>
			)}
			<Text
				fontWeight="regular"
				className="text-uva text-[13px] text-center leading-[15px]"
				style={{ width: FAVORITE_ITEM_WIDTH }}
			>
				{props.name}
			</Text>
		</Pressable>
	);
}
