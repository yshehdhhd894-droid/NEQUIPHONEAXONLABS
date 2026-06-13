import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/basic/text";
import { Arrow } from "@/components/logos";
import { EmptyCaseMovement } from "@/components/logos/empty-cases";
import AddVictimSheet from "@/components/sheets/add-victim";
import EditVictimSheet from "@/components/sheets/edit-victim";
import { useModal } from "@/hooks/useModal";
import { useBottomInset } from "@/hooks/useBottomInset";
import { nequiCardShadow } from "@/libs/card-styles";
import { cn, formatPhone } from "@/libs/utils";
import {
	useVictimsStore,
	type Victim,
	type VictimType,
} from "@/store/useVictimsStore";

const TABS: Array<{ id: VictimType; label: string }> = [
	{ id: "phone", label: "Nequi" },
	{ id: "key", label: "Llaves" },
	{ id: "bancolombia", label: "Bancolombia" },
];

const ICON_MAP = {
	phone: "call-outline",
	key: "key-outline",
	bancolombia: "storefront-outline",
} as const;

export default function Victims() {
	const [selectedTab, setSelectedTab] = useState<VictimType>("phone");
	const { top } = useSafeAreaInsets();
	const fabBottom = useBottomInset(16);
	const { show } = useModal();
	const openedFromParams = useRef(false);
	const {
		tab,
		account,
		accountType,
		amount,
		returnTo,
	}: {
		tab?: VictimType;
		account?: string;
		accountType?: "ahorro" | "corriente";
		amount?: string;
		returnTo?: string;
	} = useLocalSearchParams();

	const dbVictims = useVictimsStore((state) => state.victims);

	const victims = useMemo(
		() => dbVictims.filter((victim) => victim.type === selectedTab),
		[dbVictims, selectedTab],
	);

	useEffect(() => {
		if (openedFromParams.current) return;
		if (tab !== "bancolombia" || !account) return;

		openedFromParams.current = true;
		setSelectedTab("bancolombia");
		show(
			<AddVictimSheet
				type="bancolombia"
				value={account}
				onSubmit={(victim) => {
					if (!victim || returnTo !== "/send/bancolombia") return;
					const params = new URLSearchParams({
						account: victim.value,
					});
					if (accountType) params.set("accountType", accountType);
					if (amount) params.set("amount", amount);
					router.replace(`${returnTo}?${params.toString()}`);
				}}
			/>,
		);
	}, [tab, account, accountType, amount, returnTo, show]);

	const openAddVictimSheet = useCallback(
		(type: VictimType = selectedTab) => {
			show(<AddVictimSheet type={type} />);
		},
		[selectedTab, show],
	);

	const handleAddVictim = useCallback(() => {
		openAddVictimSheet(selectedTab);
	}, [selectedTab, openAddVictimSheet]);

	const handleTabChange = useCallback((tab: VictimType) => {
		setSelectedTab(tab);
	}, []);

	return (
		<View className="flex-1 w-full bg-white">
			<View style={{ height: top }} className="bg-uva" />

			<Pressable
				onPress={handleAddVictim}
				style={{ bottom: fabBottom, right: 16 }}
				className="absolute flex items-center justify-center bg-orquidea size-16 rounded-[4px] z-50 active:bg-orquidea-button-pressed"
			>
				<Ionicons name="person-add-sharp" size={24} color="white" />
			</Pressable>

			<View>
				<Pressable onPress={() => router.back()} className="w-full p-2.5">
					<View className="size-8 justify-center">
						<Arrow color="#200020" />
					</View>
				</Pressable>

				<Text fontWeight="bold" className="text-uva text-[26px] px-4 pt-3">
					Victimas
				</Text>

				<TabBar selectedTab={selectedTab} onTabChange={handleTabChange} />
				<VictimsList
					victims={victims}
					selectedTab={selectedTab}
					onAddVictim={openAddVictimSheet}
				/>
			</View>
		</View>
	);
}

function TabBar({
	selectedTab,
	onTabChange,
}: {
	selectedTab: VictimType;
	onTabChange: (tab: VictimType) => void;
}) {
	return (
		<View className="flex-row justify-between gap-1 px-5 py-4">
			{TABS.map((tab) => (
				<TabButton
					key={tab.id}
					tab={tab}
					isSelected={selectedTab === tab.id}
					onPress={onTabChange}
				/>
			))}
		</View>
	);
}

const TabButton = ({
	tab,
	isSelected,
	onPress,
}: {
	tab: { id: VictimType; label: string };
	isSelected: boolean;
	onPress: (id: VictimType) => void;
}) => {
	const handlePress = useCallback(() => {
		onPress(tab.id);
	}, [onPress, tab.id]);

	return (
		<Pressable
			onPress={handlePress}
			className={cn(
				"flex-row gap-1 rounded-[4px] items-center justify-center flex-1 py-2",
				{
					"bg-orquidea": isSelected,
					"bg-white border-uva/50 border-[1px]": !isSelected,
				},
			)}
		>
			<Ionicons
				name={ICON_MAP[tab.id]}
				size={18}
				color={isSelected ? "white" : "black"}
			/>
			<Text className={cn(!isSelected && "text-uva")}>{tab.label}</Text>
		</Pressable>
	);
};

function VictimsList({
	victims,
	selectedTab,
	onAddVictim,
}: {
	victims: Victim[];
	selectedTab: VictimType;
	onAddVictim: (type: VictimType) => void;
}) {
	if (!victims.length) {
		return (
			<EmptyState
				selectedTab={selectedTab}
				onAddVictim={onAddVictim}
			/>
		);
	}

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{
				paddingBottom: 210,
				flexDirection: "column",
				gap: 12,
			}}
			keyboardShouldPersistTaps="handled"
			className="pt-1.5"
			alwaysBounceVertical={false}
			overScrollMode="never"
			bounces={false}
		>
			{victims.map((victim) => (
				<VictimCard key={victim.id} victim={victim} />
			))}
		</ScrollView>
	);
}

function EmptyState({
	selectedTab,
	onAddVictim,
}: {
	selectedTab: VictimType;
	onAddVictim: (type: VictimType) => void;
}) {
	return (
		<Pressable
			onPress={() => onAddVictim(selectedTab)}
			className="flex items-center justify-center h-[480px] py-8"
		>
			<EmptyCaseMovement />
			<View className="py-4 flex items-center px-6">
				<Text fontWeight="bold" className="text-uva text-[24px] text-center">
					No hay víctimas registradas
				</Text>
				<Text className="text-gray-600 text-center">
					Toca aquí o el botón + para agregar un contacto
				</Text>
			</View>
		</Pressable>
	);
}

function VictimCard({ victim }: { victim: Victim }) {
	const { show } = useModal();

	const handlePress = useCallback(() => {
		show(<EditVictimSheet victim={victim} />);
	}, [show, victim]);

	const displayValue = useMemo(() => {
		if (victim.type === "phone") {
			return formatPhone(victim.value);
		}
		return victim.value;
	}, [victim.type, victim.value]);

	return (
		<View className="px-5">
			<Pressable onPress={handlePress} style={victimCardStyles.card}>
				<View style={victimCardStyles.row}>
					<Ionicons name={ICON_MAP[victim.type]} size={24} color="#200020" />

					<View style={victimCardStyles.textWrap}>
						<Text
							fontWeight="medium"
							numberOfLines={1}
							className="text-uva text-[18px]"
						>
							{victim.name}
						</Text>
						<Text className="text-[#6e6e6e] text-[15px] leading-tight">
							{displayValue}
							{victim.type === "key" && ` - ${victim.bank}`}
						</Text>
					</View>
				</View>

				<Ionicons name="chevron-forward-outline" size={24} color="black" />
			</Pressable>
		</View>
	);
}

const victimCardStyles = StyleSheet.create({
	card: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 14,
		paddingLeft: 16,
		paddingRight: 20,
		borderRadius: 4,
		backgroundColor: "#FFFFFF",
		...nequiCardShadow,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		flex: 1,
		paddingRight: 8,
	},
	textWrap: {
		flex: 1,
		maxWidth: 240,
		paddingLeft: 8,
	},
});
