import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Text from "@/components/basic/text";
import {
	type FavoriteCardContent,
	ServiceCard,
} from "@/components/cards/home-favorites";
import { useHomeLayoutMetrics } from "@/hooks/useHomeLayoutMetrics";
import AddCardSheet from "@/components/sheets/add-card";
import { useModal } from "@/hooks/useModal";
import {
	AddCircle,
	Credits,
	CreditCard,
	MyBusiness,
	Paypal,
} from "../service-logos";

type FavoriteItem = {
	name: string;
	content: FavoriteCardContent;
	itemWidth?: number;
	onPress?: () => void;
};

const TIGO_LOGO = require("@/assets/tigo.png");

function useSavingsItems(m: ReturnType<typeof useHomeLayoutMetrics>): FavoriteItem[] {
	return useMemo(
		() => [
			{
				name: "App Nequi Negocios",
				content: { kind: "svg", element: MyBusiness },
				itemWidth: m.wideItemWidth,
			},
			{
				name: "Tigo",
				content: {
					kind: "image",
					source: TIGO_LOGO,
					width: m.scale(42),
					height: m.scale(30),
				},
			},
			{
				name: "Paypal",
				content: { kind: "svg", element: Paypal },
			},
			{
				name: "Créditos",
				content: { kind: "svg", element: Credits },
			},
		],
		[m],
	);
}

type HomeFavoritesSectionProps = {
	variant: "savings" | "normal";
};

export default function HomeFavoritesSection({
	variant,
}: HomeFavoritesSectionProps) {
	const m = useHomeLayoutMetrics();
	const { show } = useModal();
	const openAdd = useCallback(() => show(<AddCardSheet />), [show]);
	const savingsItems = useSavingsItems(m);

	const items = useMemo(
		() => [
			...savingsItems,
			{
				name: "Tarjeta",
				content: { kind: "svg", element: CreditCard },
			},
			{
				name: "Agrega",
				content: { kind: "svg", element: AddCircle },
				onPress: openAdd,
			},
		],
		[savingsItems, openAdd],
	);

	return (
		<View id={variant === "savings" ? "favorites-savings" : "favorites"}>
			<View
				className="flex-row justify-between items-center mt-3"
				style={{ paddingHorizontal: m.sectionPaddingH }}
			>
				<View className="flex-row items-center gap-1.5">
					<Ionicons
						name="heart-outline"
						size={m.sectionHeaderIconSize}
						color="#525252"
					/>
					<Text
						fontWeight="medium"
						className="text-home-section"
						style={{
							fontSize: m.sectionFontSize,
							fontFamily: "ManropeMedium",
						}}
					>
						Tus favoritos
					</Text>
				</View>
				<Pressable onPress={openAdd} hitSlop={8}>
					<Ionicons
						name="create-outline"
						size={m.sectionEditIconSize}
						color="#200020"
					/>
				</Pressable>
			</View>

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
						key={item.name}
						name={item.name}
						content={item.content}
						itemWidth={item.itemWidth}
						onPress={item.onPress}
					/>
				))}
			</ScrollView>
		</View>
	);
}
