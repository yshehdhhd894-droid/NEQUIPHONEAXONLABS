import { router, usePathname } from "expo-router";
import { type ReactElement, useMemo } from "react";
import { Pressable, View } from "react-native";
import type { SvgProps } from "react-native-svg";
import Text from "@/components/basic/text";
import {
	ClosetTab,
	ClosetTabSelected,
	HomeTab,
	HomeTabSelected,
	MovementsTab,
	MovementsTabSelected,
} from "@/components/logos/tabs";
import { useFooterLayoutMetrics } from "@/hooks/useFooterLayoutMetrics";
import { footerTabShadow } from "@/libs/card-styles";
import { cn } from "@/libs/utils";

export function NavigationTabs() {
	const pathname = usePathname();
	const footer = useFooterLayoutMetrics();
	const selectedTab = useMemo(() => {
		if (pathname.startsWith("/home/movements")) return "/home/movements";
		if (pathname.startsWith("/home/services")) return "/home/services";
		return "/home";
	}, [pathname]);

	return (
		<View
			className="bg-[#f4f5f8] flex-row"
			style={{
				flex: 1,
				width: "100%",
				height: footer.tabBarHeight,
				borderRadius: footer.tabRadius,
				padding: footer.tabInnerPadding,
				gap: footer.gap,
				...footerTabShadow,
			}}
		>
			{tabItems.map((tab) => (
				<Tab
					key={tab.href}
					href={tab.href}
					name={tab.name}
					selected={selectedTab === tab.href}
					icon={selectedTab === tab.href ? tab.selectedIcon : tab.defaultIcon}
					labelSize={footer.tabLabelSize}
					tabRadius={footer.tabRadius}
					iconSize={footer.tabIconSize}
				/>
			))}
		</View>
	);
}

function Tab({
	icon: Icon,
	selected,
	name,
	href,
	labelSize,
	tabRadius,
	iconSize,
}: TabProps) {
	return (
		<Pressable
			onPress={() => router.push(href)}
			className={cn(
				"items-center justify-center flex-1",
				selected && "bg-[#ece7f5]",
			)}
			style={{
				padding: 4,
				borderRadius: tabRadius,
			}}
		>
			<Icon width={iconSize} height={iconSize} />
			<Text
				fontWeight={selected ? "bold" : "medium"}
				className="text-black leading-none"
				style={{ fontSize: labelSize }}
			>
				{name}
			</Text>
		</Pressable>
	);
}

interface TabItem {
	name: string;
	href: string;
	defaultIcon: (props: SvgProps) => ReactElement;
	selectedIcon: (props: SvgProps) => ReactElement;
}

interface TabProps {
	icon: (props: SvgProps) => ReactElement;
	selected: boolean;
	name: string;
	href: string;
	labelSize: number;
	tabRadius: number;
	iconSize: number;
}

const tabItems: TabItem[] = [
	{
		name: "Inicio",
		href: "/home",
		defaultIcon: HomeTab,
		selectedIcon: HomeTabSelected,
	},
	{
		name: "Movimientos",
		href: "/home/movements",
		defaultIcon: MovementsTab,
		selectedIcon: MovementsTabSelected,
	},
	{
		name: "Servicios",
		href: "/home/services",
		defaultIcon: ClosetTab,
		selectedIcon: ClosetTabSelected,
	},
];
