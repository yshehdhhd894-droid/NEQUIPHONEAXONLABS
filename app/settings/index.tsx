import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/basic/text";
import { Arrow } from "@/components/logos";
import { useAuthStore } from "@/hooks/useAuth";
import { useBottomInset } from "@/hooks/useBottomInset";
import { nequiCardShadow } from "@/libs/card-styles";

const PROFILE_PROGRESS = 0.78;

export default function Settings() {
	const { top } = useSafeAreaInsets();
	const bottomInset = useBottomInset(24);
	const user = useAuthStore((state) => state.user);

	if (!user) return null;

	return (
		<View className="flex-1 w-full bg-white" style={{ paddingTop: top }}>
			<Pressable onPress={() => router.back()} className="px-4 pt-2 pb-1">
				<View className="size-8 justify-center">
					<Arrow color="#200020" />
				</View>
			</Pressable>

			<Text fontWeight="bold" className="text-uva text-[26px] px-4 pt-2 pb-4">
				Ajustes
			</Text>

			<ScrollView
				className="flex-1"
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
			>
				<SettingsCard
					title="Tu Info"
					subTitle="Completa tus datos para que tengas Nequi a tu medida"
					icon={<Ionicons name="happy-outline" size={24} color="#200020" />}
					href="/settings/data"
					progress={PROFILE_PROGRESS}
				/>

				<SettingsCard
					title="Seguridad"
					subTitle="Info para proteger tu Nequi"
					icon={
						<Ionicons name="lock-closed-outline" size={24} color="#200020" />
					}
					href="/settings/security"
				/>

				<SettingsCard
					title="Tu Nequi"
					subTitle="Encuentra suscripciones y configuraciones de productos"
					icon={
						<Ionicons name="settings-outline" size={24} color="#200020" />
					}
					href="/settings/nequi"
				/>

				<SettingsCard
					title="Cerrar tu Nequi"
					subTitle="¡Esperamos que solo sea un hasta pronto!"
					icon={<Ionicons name="sad-outline" size={24} color="#200020" />}
				/>
			</ScrollView>

			<View style={{ height: bottomInset }} />
		</View>
	);
}

interface CardProps {
	title: string;
	subTitle: string;
	icon: React.ReactNode;
	href?: string;
	onPress?: () => void;
	progress?: number;
}

function SettingsCard({
	title,
	subTitle,
	icon,
	href,
	onPress,
	progress,
}: CardProps) {
	const handlePress = () => {
		if (onPress) {
			onPress();
			return;
		}

		if (href) {
			router.push(href);
		}
	};

	const progressWidth = progress
		? `${Math.min(Math.max(progress, 0), 1) * 100}%`
		: undefined;

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

			{progress !== undefined ? (
				<View style={styles.progressTrack}>
					<View style={[styles.progressFill, { width: progressWidth }]} />
				</View>
			) : null}
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
	progressTrack: {
		marginTop: 14,
		height: 10,
		borderRadius: 5,
		backgroundColor: "#E8E8E8",
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		borderRadius: 5,
		backgroundColor: "#da0081",
	},
});
