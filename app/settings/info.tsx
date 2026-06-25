import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { router } from "expo-router";
import { Image, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/basic/text";
import { Arrow } from "@/components/logos";
import { LeyendaAvatar, MissionDayIcon } from "@/components/logos/profile-icons";
import { BgNewProfile0 } from "@/components/background/svgs/new-profile-0";
import { BgNewProfile3 } from "@/components/background/svgs/new-profile-3";
import { BgNoData2026 } from "@/components/background/svgs/no-data2026";
import { BgPro } from "@/components/background/svgs/pro";
import { useAuthStore } from "@/hooks/useAuth";
import { useBackgroundStore, BACKGROUND_LEVELS } from "@/store/useBackgroundStore";
import { useAppStore } from "@/store/useAppStore";
import { DECOY_APP_VERSION } from "@/libs/decoy";
import { formatPhone } from "@/libs/utils";

const coolImage = require("@/assets/recursiaxon/cool.png");
const moneyImage = require("@/assets/recursiaxon/money.png");

const tazitatePng = require("@/assets/backgrounds/tazitate.png");

const svgMap: Record<number, React.FC<{ width: number; height: number }> | null> = {
	0: null,
	1: BgNewProfile0,
	2: BgNoData2026,
	3: null,
	4: BgNewProfile3,
	5: BgPro,
};

export default function Info() {
	const { top, bottom } = useSafeAreaInsets();
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);
	const openNodeCommandHelp = useAppStore((s) => s.openNodeCommandHelp);
	const level = useBackgroundStore((s) => s.level);
	const levelInfo = BACKGROUND_LEVELS.find((l) => l.level === level);
	const headerBg = level === 0 ? "" : (levelInfo?.bgColor ?? "#ece7f5");
	const AvatarSvg = svgMap[level];
	const displayName = user?.name ?? "usuario name";
	const displayPhone = user?.phone
		? formatPhone(user.phone)
		: "300 000 0000";
	const lastConnection = format(new Date(), "dd 'de' MMMM 'de' yyyy", {
		locale: es,
	});

	return (
		<View className="flex-1" style={{ paddingTop: top, backgroundColor: headerBg || "#ece7f5" }}>
			<View className="flex-row items-center justify-between px-4 pb-2">
				<Pressable onPress={() => router.back()} className="size-10 justify-center">
					<View className="size-8">
						<Arrow color="#200020" />
					</View>
				</Pressable>

				<Text fontWeight="bold" className="text-uva text-[18px]">
					Tu perfil
				</Text>

				<Pressable
					onPress={openNodeCommandHelp}
					className="size-10 items-center justify-center"
					accessibilityRole="button"
					accessibilityLabel="Ayuda"
				>
					<Ionicons name="help-circle-outline" size={26} color="#200020" />
				</Pressable>
			</View>

			<ScrollView
				className="flex-1"
				contentContainerClassName="px-5 items-center"
				contentContainerStyle={{ paddingBottom: bottom + 24 }}
				showsVerticalScrollIndicator={false}
			>
				<View className="items-center pt-2 pb-4 w-full">
					{level === 0 ? (
						<LeyendaAvatar width={120} height={121} />
					) : level === 3 ? (
						<Image source={tazitatePng} style={{ width: 120, height: 120, borderRadius: 60 }} resizeMode="cover" />
					) : AvatarSvg ? (
						<AvatarSvg width={120} height={120} />
					) : null}
					<Text fontWeight="bold" className="text-uva text-[22px] mt-3">
						{displayName}
					</Text>
					<Text className="text-uva text-[16px] mt-1 underline">
						{displayPhone}
					</Text>
				</View>

				<Pressable className="w-full max-w-[340px] bg-white rounded-[8px] overflow-hidden mb-3 shadow-sm">
					<View className="px-3.5 pt-2.5 pb-2">
						<Text className="text-[#6e6e6e] text-[13px]">Nivel actual</Text>
						<View className="flex-row items-center justify-between mt-0.5">
							<Text fontWeight="bold" className="text-uva text-[18px]">
								Leyenda
							</Text>
							<Ionicons name="chevron-forward" size={20} color="#200020" />
						</View>
						<Text className="text-[#6e6e6e] text-[13px] mt-1 leading-[18px] pr-6">
							Conoce más sobre los niveles que existen en Nequi
						</Text>
					</View>
					<View className="bg-[#d4f1f7] px-3 py-2">
						<Text className="text-[#00838f] text-[13px] text-center">
							¡Usa más Nequi y sube de nivel!
						</Text>
					</View>
				</Pressable>

				<View className="flex-row gap-2.5 mb-3 w-full max-w-[340px]">
					<Pressable className="flex-1 bg-white rounded-[8px] px-2.5 pt-2.5 pb-2.5">
						<Image
							source={coolImage}
							style={{ width: 58, height: 46 }}
							resizeMode="contain"
						/>
						<Text className="text-uva text-[12px] mt-2 leading-4">
							Inscribe el pago de tus facturas
						</Text>
					</Pressable>

					<Pressable
						onPress={() => router.push("/settings/money")}
						className="flex-1 bg-white rounded-[8px] px-2.5 pt-2.5 pb-2.5"
					>
						<Image
							source={moneyImage}
							style={{ width: 58, height: 46 }}
							resizeMode="contain"
						/>
						<Text className="text-uva text-[12px] mt-2 leading-4">
							Mira cómo está tu plata
						</Text>
					</Pressable>
				</View>

				<Pressable className="w-full max-w-[340px] bg-white rounded-[8px] px-3.5 py-3 flex-row items-center mb-3">
					<MissionDayIcon width={52} height={54} />
					<View className="flex-1 ml-3 pr-2">
						<Text fontWeight="bold" className="text-uva text-[16px]">
							Misión del día
						</Text>
						<Text className="text-[#6e6e6e] text-[13px] mt-1 leading-4">
							Cumple tu misión de hoy y gana una sorpresa.
						</Text>
					</View>
					<Ionicons name="chevron-forward" size={22} color="#200020" />
				</Pressable>

				<View className="gap-2 w-full max-w-[340px]">
					<MenuRow
						label="Ajustes"
						icon="settings-outline"
						href="/settings"
					/>
					<MenuRow
						label="Documentos y certificados"
						icon="document-text-outline"
						href="/home"
					/>
					<MenuRow
						label="Ayuda"
						icon="help-circle-outline"
						onPress={openNodeCommandHelp}
					/>
				</View>

				<Pressable
					onPress={async () => {
						await logout();
						router.replace("/login-logueado");
					}}
					className="w-full max-w-[340px] flex-row items-center gap-3 mt-6 py-2"
				>
					<Ionicons name="power-outline" size={22} color="#200020" />
					<Text fontWeight="medium" className="text-uva text-[16px]">
						Salir
					</Text>
				</Pressable>

				<View
					className="w-full max-w-[340px] mt-4 pt-4"
					style={{ borderTopWidth: 1, borderTopColor: "#200020" }}
				>
					<View className="flex-row justify-between items-end pt-3">
						<Text className="text-[#6e6e6e] text-[12px] leading-4 flex-1 pr-3">
							Última conexión{"\n"}
							{lastConnection}
						</Text>
						<Text
							fontWeight="bold"
							style={{ color: "#200020", fontSize: 12 }}
						>
							Versión {DECOY_APP_VERSION}
						</Text>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

interface MenuRowProps {
	label: string;
	icon: keyof typeof Ionicons.glyphMap;
	href?: string;
	onPress?: () => void;
}

function MenuRow({ label, icon, href, onPress }: MenuRowProps) {
	return (
		<Pressable
			onPress={onPress ?? (href ? () => router.push(href) : undefined)}
			className="bg-white rounded-[8px] px-3.5 py-3 flex-row items-center justify-between"
		>
			<View className="flex-row items-center gap-3">
				<Ionicons name={icon} size={22} color="#200020" />
				<Text fontWeight="medium" className="text-uva text-[16px]">
					{label}
				</Text>
			</View>
			<Ionicons name="chevron-forward" size={20} color="#200020" />
		</Pressable>
	);
}
