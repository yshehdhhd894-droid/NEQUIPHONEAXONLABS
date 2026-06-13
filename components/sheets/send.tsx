import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import Text from "@/components/basic/text";
import { Bank, Keys, People, Send, TransfiYa } from "@/components/logos";
import { useBreBSendFlow } from "@/hooks/useBreBSendFlow";
import { useLoading } from "@/hooks/useLoading";
import { useModal } from "@/hooks/useModal";
import { nequiCardShadow } from "@/libs/card-styles";

export default function SendSheet() {
	const { autoShow } = useLoading();
	const { startBreBFlow } = useBreBSendFlow();

	return (
		<View className="pb-2">
			<Text fontWeight="bold" className="text-uva text-[26px] pb-4">
				Opciones para enviar
			</Text>

			<View style={styles.list}>
				<SheetCard
					icon={<People />}
					title="Nequi"
					href="/send/nequi"
					subTitle="A otro número de Nequi"
				/>

				<SheetCard
					icon={<Send />}
					title="Bancolombia"
					href="/send/bancolombia"
					preHandlePress={async () => {
						await autoShow(2000);
					}}
					subTitle="Cuenta ahorro o corriente"
				/>

				<SheetCard
					icon={<Keys />}
					title="Enviar con llaves de Bre-B"
					badge="Nuevo"
					onPress={startBreBFlow}
					subTitle="A otros bancos gratis y de una"
				/>

				<SheetCard
					icon={<Bank />}
					title="Otros Bancos"
					href="/send/bancos"
					subTitle="Envia más de 3 millones"
				/>

				<SheetCard
					icon={<TransfiYa />}
					title="Transfiya"
					onPress={startBreBFlow}
					subTitle="Evoluciona a Bre-B"
				/>
			</View>
		</View>
	);
}

interface CardProps {
	title: string;
	subTitle: string;
	icon: React.ReactNode;
	preHandlePress?: () => Promise<void>;
	href?: string;
	onPress?: () => void;
	badge?: string;
}

function SheetCard(props: CardProps) {
	const router = useRouter();
	const { hide } = useModal();

	const handlePress = async () => {
		hide();

		if (props?.preHandlePress) {
			await props.preHandlePress();
		}

		if (props.onPress) {
			props.onPress();
			return;
		}

		if (props.href) {
			router.push(props.href);
		}
	};

	return (
		<Pressable onPress={handlePress} style={styles.card}>
			{props.badge && (
				<View style={styles.badge}>
					<Text className="text-white" style={{ fontSize: 12 }}>
						{props.badge}
					</Text>
				</View>
			)}

			<View style={styles.cardContent}>
				{props.icon}

				<View style={styles.textWrap}>
					<Text
						fontWeight="medium"
						className="text-uva text-[18px] leading-none"
					>
						{props.title}
					</Text>
					<Text className="text-[#6e6e6e] text-[15px] leading-tight">
						{props.subTitle}
					</Text>
				</View>
			</View>

			<Ionicons name="chevron-forward-outline" size={24} color="black" />
		</Pressable>
	);
}

const styles = StyleSheet.create({
	list: {
		gap: 10,
	},
	card: {
		position: "relative",
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
	badge: {
		position: "absolute",
		top: 0,
		right: 8,
		backgroundColor: "#000000",
		borderRadius: 16,
		paddingHorizontal: 8,
		paddingVertical: 4,
		zIndex: 1,
	},
	cardContent: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		flex: 1,
		paddingRight: 8,
	},
	textWrap: {
		flex: 1,
		gap: 4,
	},
});
