import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import Text from "@/components/basic/text";
import { useBreBSendFlow } from "@/hooks/useBreBSendFlow";
import {
	type FavoriteCardContent,
	ServiceCard,
} from "@/components/cards/home-favorites";
import { useHomeLayoutMetrics } from "@/hooks/useHomeLayoutMetrics";
import {
	BreB,
	Goal,
	MoreServices,
	OtherCompanies,
	Saved,
	Wom,
} from "../service-logos";

type SuggestedItem = {
	name: string;
	content: FavoriteCardContent;
	itemWidth?: number;
	onPress?: () => void;
};

const WENIA_LOGO = require("@/assets/wenia.png");
const EXTERIOR_LOGO = require("@/assets/exterior.png");

type HomeSuggestedSectionProps = {
	variant: "savings" | "normal";
	onMoreServices?: () => void;
};

function useSuggestedItems() {
	const m = useHomeLayoutMetrics();

	return useMemo((): SuggestedItem[] => {
		const partOne: SuggestedItem[] = [
			{
				name: "Wenia",
				content: {
					kind: "image",
					source: WENIA_LOGO,
					width: m.iconSize,
					height: m.iconSize,
				},
			},
			{
				name: "Colchón",
				content: {
					kind: "svg",
					element: Saved,
					width: m.scale(36),
					height: m.scale(36),
				},
			},
			{
				name: "Otras empresas",
				content: {
					kind: "svg",
					element: OtherCompanies,
					width: m.scale(38),
					height: m.scale(36),
				},
				itemWidth: m.wideItemWidth,
			},
			{
				name: "WOM",
				content: {
					kind: "svg",
					element: Wom,
					width: m.scale(44),
					height: m.scale(19),
				},
			},
		];

		const partTwo: SuggestedItem[] = [
			{
				name: "Bre-B",
				content: {
					kind: "svg",
					element: BreB,
					width: m.scale(44),
					height: m.scale(13),
				},
			},
			{
				name: "Traer plata del exterior",
				content: {
					kind: "image",
					source: EXTERIOR_LOGO,
					width: m.scale(40),
					height: m.scale(40),
				},
				itemWidth: m.extraWideItemWidth,
			},
			{
				name: "Metas",
				content: {
					kind: "svg",
					element: Goal,
					width: m.scale(36),
					height: m.scale(36),
				},
			},
			{
				name: "Más servicios",
				content: {
					kind: "svg",
					element: MoreServices,
					width: m.scale(32),
					height: m.scale(32),
				},
				itemWidth: m.wideItemWidth,
			},
		];

		return [...partOne, ...partTwo];
	}, [m]);
}

export default function HomeSuggestedSection({
	variant,
	onMoreServices,
}: HomeSuggestedSectionProps) {
	const m = useHomeLayoutMetrics();
	const { startBreBFlow } = useBreBSendFlow();
	const baseItems = useSuggestedItems();
	const items = baseItems.map((item) => {
		if (item.name === "Más servicios" && onMoreServices) {
			return { ...item, onPress: onMoreServices };
		}

		if (item.name === "Bre-B") {
			return { ...item, onPress: startBreBFlow };
		}

		return item;
	});

	return (
		<View
			id={variant === "savings" ? "suggested-savings" : "sugguest"}
			className="mt-3 pb-3 overflow-visible"
		>
			<Text
				fontWeight="medium"
				className="text-home-section"
				style={{
					fontSize: m.sectionFontSize,
					fontFamily: "ManropeMedium",
					paddingHorizontal: m.sectionPaddingH,
				}}
			>
				Sugeridos Nequi
			</Text>

			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={{
					minHeight: m.rowMinHeight,
					flexGrow: 0,
					overflow: "visible",
				}}
				contentContainerStyle={{
					gap: m.itemGap,
					paddingHorizontal: m.sectionPaddingH,
					paddingRight: m.sectionPaddingRight,
					paddingBottom: m.sectionPaddingBottom,
					alignItems: "flex-start",
				}}
				className="mt-3"
			>
				{items.map((item) => (
					<ServiceCard
						key={`${item.name}-${item.content.kind}`}
						name={item.name}
						content={item.content}
						itemWidth={item.itemWidth ?? m.itemWidth}
						onPress={item.onPress}
					/>
				))}
			</ScrollView>
		</View>
	);
}
