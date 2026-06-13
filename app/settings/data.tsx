import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/basic/text";
import { Arrow } from "@/components/logos";
import LevelPickerSheet from "@/components/sheets/level-picker";
import ProfileChangeSheet from "@/components/sheets/profile-change";
import { type AccountType, useAuthStore } from "@/hooks/useAuth";
import { useModal } from "@/hooks/useModal";
import { getAccountTypeLabel, ACCOUNT_TYPE_OPTIONS } from "@/libs/account-type";
import { userService } from "@/services/api.service";
import { nequiCardShadow } from "@/libs/card-styles";
import {
	BACKGROUND_LEVELS,
	useBackgroundStore,
} from "@/store/useBackgroundStore";

export default function Data() {
	const { top } = useSafeAreaInsets();
	const user = useAuthStore((state) => state.user);
	const level = useBackgroundStore((s) => s.level);
	const currentLevelInfo = BACKGROUND_LEVELS.find((l) => l.level === level);

	const { show } = useModal();
	if (!user) return null;

	return (
		<View className="flex-1 bg-white">
			<View style={{ height: top }} className="bg-uva" />

			<View>
				<Pressable onPress={() => router.back()} className="w-full p-2.5">
					<View className="size-8 justify-center">
						<Arrow color="#200020" />
					</View>
				</Pressable>

				<Text fontWeight="bold" className="text-uva text-[26px] p-4 pt-3">
					Ajustes
				</Text>
			</View>

			<View className="pt-1.5 flex gap-3">
				<SettingsCard
					title={user.name}
					subTitle="¿Cómo quieres que te digamos?"
					icon={<Ionicons name="text-outline" size={24} color="#200020" />}
					onPress={() =>
						show(
							<ProfileChangeSheet<string>
								title="¿Cómo quieres que te digamos?"
								label="Tu nombre de usuari@"
								type="text"
								value={user.name}
								onSubmit={userService.updateName}
							/>,
						)
					}
				/>

				<SettingsCard
					title={user?.phone}
					subTitle="Este es tu # de tu dispositivo"
					icon={
						<Ionicons name="phone-portrait-outline" size={24} color="#200020" />
					}
				/>

				<SettingsCard
					title={getAccountTypeLabel(user.accountType)}
					subTitle="Cambia tu tipo de cuenta"
					icon={<Ionicons name="wallet-outline" size={24} color="#200020" />}
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

				<SettingsCard
					title={currentLevelInfo?.label ?? "Normal"}
					subTitle="Cambia el fondo de pantalla de la app"
					icon={<Ionicons name="color-palette-outline" size={24} color="#da0081" />}
					onPress={() => show(<LevelPickerSheet />)}
				/>
			</View>
		</View>
	);
}

interface CardProps {
	title: string;
	subTitle: string;
	icon: React.ReactNode;
	onPress?: () => void;
}

function SettingsCard({ title, subTitle, icon, onPress }: CardProps) {
	return (
		<View className="px-5">
			<Pressable onPress={onPress} style={styles.card}>
				<View style={styles.cardRow}>
					{icon}

					<View style={styles.textWrap}>
						<Text fontWeight="medium" className="text-uva text-[18px]">
							{title}
						</Text>
						<Text className="text-[#6e6e6e] text-[15px] leading-tight">
							{subTitle}
						</Text>
					</View>
				</View>

				<Ionicons name="chevron-forward-outline" size={24} color="black" />
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
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
	cardRow: {
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
