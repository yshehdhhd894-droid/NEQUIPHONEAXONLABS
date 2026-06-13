import Ionicons from "@expo/vector-icons/Ionicons";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/basic/text";
import { DiamondIcon } from "@/components/logos/diamond";
import { Arrow } from "@/components/logos";
import { NequiSwitch } from "@/components/settings/nequi-switch";
import ProfileChangeSheet from "@/components/sheets/profile-change";
import { type AccountType, useAuthStore } from "@/hooks/useAuth";
import { useModal } from "@/hooks/useModal";
import { useBottomInset } from "@/hooks/useBottomInset";
import { getAccountTypeLabel, ACCOUNT_TYPE_OPTIONS } from "@/libs/account-type";
import { canUseVipNameLookup } from "@/libs/premium";
import { TELEGRAM } from "@/libs/constants";
import { nequiCardShadow } from "@/libs/card-styles";
import { userService } from "@/services/api.service";
import { usePremiumStore } from "@/store/usePremiumStore";

export default function TuNequiSettings() {
	const { top } = useSafeAreaInsets();
	const bottomInset = useBottomInset(24);
	const { show } = useModal();
	const user = useAuthStore((state) => state.user);
	const vipAutoNamesEnabled = usePremiumStore((s) => s.vipAutoNamesEnabled);
	const setVipAutoNamesEnabled = usePremiumStore(
		(s) => s.setVipAutoNamesEnabled,
	);

	if (!user) return null;

	const canLookupNames = canUseVipNameLookup(user);

	return (
		<View className="flex-1 w-full bg-white" style={{ paddingTop: top }}>
			<Pressable onPress={() => router.back()} className="px-4 pt-2 pb-1">
				<View className="size-8 justify-center">
					<Arrow color="#200020" />
				</View>
			</Pressable>

			<Text fontWeight="bold" className="text-uva text-[26px] px-4 pt-2 pb-4">
				Tu Nequi
			</Text>

			<ScrollView
				className="flex-1"
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
			>
				<SettingsCard
					title={getAccountTypeLabel(user.accountType)}
					subTitle="Cambia entre Depósito Bajo Monto y Cuenta de ahorros"
					icon={<Ionicons name="rocket-outline" size={24} color="#200020" />}
					onPress={() =>
						show(
							<ProfileChangeSheet<AccountType>
								title="¿Qué tipo de cuenta deseas?"
								onSubmit={userService.setAccountType}
								label="Tipo de cuenta"
								type="select"
								value={user.accountType}
								options={ACCOUNT_TYPE_OPTIONS}
							/>,
						)
					}
				/>

				<VipSettingsCard
					title="Buscar nombres VIP"
					subTitle={
						canLookupNames
							? "Nombres automáticos en envíos Nequi a Nequi."
							: "Función premium no disponible en tu cuenta."
					}
					icon={
						<DiamondIcon
							width={24}
							height={24}
							color={canLookupNames ? "#200020" : "#9e9e9e"}
						/>
					}
					value={canLookupNames && vipAutoNamesEnabled}
					disabled={!canLookupNames}
					onValueChange={setVipAutoNamesEnabled}
				/>

				<SettingsCard
					title="Victimas"
					subTitle="Administra las victimas registradas o agrega nuevas"
					icon={
						<Ionicons name="person-add-outline" size={24} color="#200020" />
					}
					href="/settings/victims"
				/>

				<SettingsCard
					title="Telegram"
					subTitle="Grupo donde podrás comunicarte con el equipo"
					icon={<Ionicons name="earth-outline" size={24} color="#200020" />}
					onPress={() => Linking.openURL(TELEGRAM)}
				/>
			</ScrollView>

			<View style={{ height: bottomInset }} />
		</View>
	);
}

interface VipCardProps {
	title: string;
	subTitle: string;
	icon: React.ReactNode;
	value: boolean;
	disabled?: boolean;
	onValueChange: (value: boolean) => void;
}

function VipSettingsCard({
	title,
	subTitle,
	icon,
	value,
	disabled = false,
	onValueChange,
}: VipCardProps) {
	return (
		<View style={[styles.vipCard, disabled && styles.vipCardDisabled]}>
			<View style={styles.vipCardRow}>
				<View style={styles.vipIconWrap}>{icon}</View>

				<View style={styles.vipTextWrap}>
					<Text
						fontWeight="medium"
						className="text-[18px]"
						style={{ color: disabled ? "#9e9e9e" : "#200020" }}
					>
						{title}
					</Text>
					<Text
						className="text-[14px] leading-[18px] mt-0.5"
						style={{ color: disabled ? "#b0b0b0" : "#6e6e6e" }}
					>
						{subTitle}
					</Text>
				</View>

				<View style={styles.vipSwitchWrap}>
					<NequiSwitch
						value={value}
						disabled={disabled}
						onValueChange={onValueChange}
					/>
				</View>
			</View>
		</View>
	);
}

interface CardProps {
	title: string;
	subTitle: string;
	icon: React.ReactNode;
	href?: string;
	onPress?: () => void;
}

function SettingsCard({ title, subTitle, icon, href, onPress }: CardProps) {
	const handlePress = () => {
		if (onPress) {
			onPress();
			return;
		}

		if (href) {
			router.push(href);
		}
	};

	return (
		<Pressable onPress={handlePress} style={styles.card}>
			<View style={styles.cardRow}>
				<View style={styles.iconWrap}>{icon}</View>

				<View style={styles.textWrap}>
					<Text fontWeight="medium" className="text-uva text-[18px]">
						{title}
					</Text>
					<Text className="text-[#6e6e6e] text-[15px] leading-[20px] mt-0.5">
						{subTitle}
					</Text>
				</View>

				<Ionicons
					name="chevron-forward-outline"
					size={22}
					color="#200020"
					style={styles.chevron}
				/>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	list: {
		paddingHorizontal: 20,
		paddingBottom: 24,
		gap: 14,
	},
	card: {
		backgroundColor: "#FFFFFF",
		borderRadius: 4,
		paddingTop: 16,
		paddingBottom: 14,
		paddingHorizontal: 16,
		...nequiCardShadow,
	},
	cardRow: {
		flexDirection: "row",
		alignItems: "flex-start",
	},
	iconWrap: {
		width: 28,
		marginTop: 2,
		alignItems: "center",
	},
	textWrap: {
		flex: 1,
		paddingLeft: 12,
		paddingRight: 8,
	},
	chevron: {
		marginTop: 6,
	},
	vipCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 4,
		paddingVertical: 12,
		paddingHorizontal: 16,
		...nequiCardShadow,
	},
	vipCardRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	vipIconWrap: {
		width: 24,
		height: 24,
		alignItems: "center",
		justifyContent: "center",
	},
	vipTextWrap: {
		flex: 1,
		paddingLeft: 12,
		paddingRight: 10,
	},
	vipSwitchWrap: {
		justifyContent: "center",
	},
	vipCardDisabled: {
		opacity: 0.72,
	},
});
