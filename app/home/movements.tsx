import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { memo, useCallback, useMemo, useState } from "react";
import {
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	TextInput,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/basic/text";
import { EmptyCaseMovement } from "@/components/logos/empty-cases";
import { type Transaction, transactionString } from "@/libs/api";
import { cn, formatCurrencyDisplay, groupTransactions } from "@/libs/utils";
import { showAppConfirm } from "@/libs/app-alert";
import { movementItemShadow } from "@/libs/card-styles";
import { walletService } from "@/services/api.service";
import { useHomeContentBottomPadding } from "@/hooks/useBottomInset";

const POSITIVE_TYPES = ["deposit", "income"];
const NAVIGABLE_TYPES = ["transfer", "income", "withdraw", "deposit"];

const searchStyles = StyleSheet.create({
	wrap: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fbf7fb",
		borderRadius: 8,
		paddingHorizontal: 12,
		minHeight: 52,
	},
	icon: {
		opacity: 0.6,
	},
	input: {
		flex: 1,
		fontSize: 18,
		lineHeight: 24,
		paddingLeft: 8,
		paddingRight: 4,
		paddingVertical: 14,
		color: "#200020",
		backgroundColor: "transparent",
		fontFamily: "ManropeRegular",
		...(Platform.OS === "web"
			? ({
					outlineStyle: "none",
					borderWidth: 0,
					boxSizing: "border-box",
				} as const)
			: {}),
	},
});

const itemStyles = StyleSheet.create({
	card: {
		borderRadius: 6,
		backgroundColor: "#FFFFFF",
		...movementItemShadow,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 20,
		paddingHorizontal: 8,
		borderRadius: 6,
	},
});

export default function Movements() {
	const [selectedTab, setSelectedTab] = useState<"today" | "all">("today");
	const [searchQuery, setSearchQuery] = useState("");
	const { top } = useSafeAreaInsets();
	const bottomPadding = useHomeContentBottomPadding(16);
	const { data } = useQuery({
		queryKey: ["transactions"],
		queryFn: () => walletService.getWallet(),
	});

	const dbTransactions = data?.transactions || [];

	const filteredTransactions = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		if (!query) return dbTransactions;

		return dbTransactions.filter(
			(transaction) =>
				transaction.name.toLowerCase().includes(query) ||
				transaction.type.toLowerCase().includes(query),
		);
	}, [dbTransactions, searchQuery]);

	const transactions = useMemo(
		() => groupTransactions(filteredTransactions),
		[filteredTransactions],
	);

	const handlePressTransaction = useCallback((id: string) => {
		router.push(`/vouchers/nequi?id=${id}&style=2`);
	}, []);

	const handleTabPress = useCallback((tab: "today" | "all") => {
		setSelectedTab(tab);
	}, []);

	const currentTransactions = transactions[selectedTab] || [];
	const hasTransactions = currentTransactions.length > 0;

	return (
		<View style={{ marginTop: top, flex: 1 }} className="pt-2">
			<Text fontWeight="bold" className="text-uva text-[18px] px-[30px]">
				Movimientos
			</Text>

			<View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
				<View style={searchStyles.wrap}>
					<Ionicons
						style={searchStyles.icon}
						name="search-outline"
						size={24}
						color="#200020"
					/>
					<TextInput
						style={searchStyles.input}
						placeholder="Busca"
						placeholderTextColor="#767577"
						value={searchQuery}
						onChangeText={setSearchQuery}
						returnKeyType="search"
						autoCorrect={false}
						autoCapitalize="none"
					/>
				</View>
			</View>

			{/* Bar */}
			<View className="bg-[#ece7f5] my-4 h-[1px] w-full" />

			{/* Tabs */}
			<View className="flex-row gap-4 justify-between mx-[18px]">
				<Pressable
					onPress={() => handleTabPress("today")}
					className={cn("rounded-lg items-center justify-center flex-1 py-2", {
						"bg-orquidea": selectedTab === "today",
						"bg-white border-uva/50 border-[1px]": selectedTab !== "today",
					})}
				>
					<Text className={cn(selectedTab !== "today" && "text-uva")}>Hoy</Text>
				</Pressable>

				<Pressable
					onPress={() => handleTabPress("all")}
					className={cn("rounded-lg items-center justify-center flex-1 py-2", {
						"bg-orquidea": selectedTab === "all",
						"bg-white border-uva/50 border-[1px]": selectedTab !== "all",
					})}
				>
					<Text className={cn(selectedTab !== "all" && "text-uva")}>
						Más Movimientos
					</Text>
				</Pressable>
			</View>

			{/* Movements */}
			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: bottomPadding,
					paddingTop: 4,
				}}
				keyboardShouldPersistTaps="handled"
			>
				{hasTransactions ? (
					currentTransactions.map((day) => (
						<DayGroup
							key={day.date.toString()}
							day={day}
							onDeleteTransaction={walletService.deleteTransactionById}
							onPressTransaction={handlePressTransaction}
						/>
					))
				) : (
					<View className="flex items-center justify-center gap-4 pt-[130px]">
						<EmptyCaseMovement />
						<Text
							fontWeight="semibold"
							style={{ color: "#200020", fontSize: 22 }}
						>
							No hay movimientos registrados
						</Text>
					</View>
				)}
			</ScrollView>
		</View>
	);
}

const TransactionItem = memo(
	({
		transaction,
		onDelete,
		onPress,
	}: {
		transaction: Transaction;
		onDelete: (id: string) => void;
		onPress: (id: string, type: string) => void;
	}) => {
		const positive = POSITIVE_TYPES.includes(transaction.type);
		const [amountInteger, amountDecimal] = formatCurrencyDisplay(
			transaction.amount,
		);

		const handleLongPress = useCallback(() => {
			showAppConfirm({
				title: "¿Estás seguro?",
				message: "Esto borrará este movimiento y no podrás recuperarlo.",
				confirmText: "Borrar",
				cancelText: "Cancelar",
				onConfirm: () => onDelete(transaction.id),
			});
		}, [transaction.id, onDelete]);

		const handlePress = useCallback(() => {
			if (
				transaction.type.startsWith("transfer") ||
				NAVIGABLE_TYPES.includes(transaction.type)
			) {
				onPress(transaction.id, transaction.type);
			}
		}, [transaction.id, transaction.type, onPress]);

		return (
			<View style={itemStyles.card}>
				<Pressable
					onLongPress={handleLongPress}
					onPress={handlePress}
					style={itemStyles.row}
					android_ripple={{ color: "rgba(32, 0, 32, 0.06)" }}
				>
				<Ionicons
					name={
						positive ? "arrow-up-circle-outline" : "arrow-down-circle-outline"
					}
					color={positive ? "#0eb364" : "#d93552"}
					style={{ marginLeft: 4, marginRight: 7 }}
					size={20}
				/>

				<View className="flex-1 flex-row justify-between items-center">
					<View>
						<Text
							fontWeight="medium"
							className="text-uva uppercase text-[12px]"
						>
							{transaction.name}
						</Text>
						<Text fontWeight="regular" className="text-uva text-[12px]">
							{transactionString[transaction.type]}
						</Text>
					</View>

					<View className="flex-row items-center">
						<Text
							fontWeight="semibold"
							style={{ color: positive ? "#0eb364" : "#d93552" }}
							className="mr-1 text-[14px] text-uva"
						>
							$
						</Text>
						<Text
							fontWeight="semibold"
							style={{ color: positive ? "#0eb364" : "#d93552" }}
						>
							{amountInteger}
						</Text>
						<Text
							fontWeight="semibold"
							style={{ color: positive ? "#0eb364" : "#d93552" }}
							className="text-[10px] mt-[3.5px]"
						>
							,{amountDecimal}
						</Text>
					</View>
				</View>
			</Pressable>
			</View>
		);
	},
);

TransactionItem.displayName = "TransactionItem";

const DayGroup = memo(
	({
		day,
		onDeleteTransaction,
		onPressTransaction,
	}: {
		day: {
			date: string;
			transactions: Transaction[];
		};
		onDeleteTransaction: (id: string) => void;
		onPressTransaction: (id: string, type: string) => void;
	}) => (
		<View className="mx-[18px] py-2" style={{ overflow: "visible" }}>
			<Text className="text-uva text-[16px] capitalize">{day.date}</Text>

			<View
				className="flex-col gap-4"
				style={{ paddingTop: 9, overflow: "visible" }}
			>
				{day.transactions.map((transaction) => (
					<TransactionItem
						key={transaction.id}
						transaction={transaction}
						onDelete={onDeleteTransaction}
						onPress={onPressTransaction}
					/>
				))}
			</View>
		</View>
	),
);

DayGroup.displayName = "DayGroup";
