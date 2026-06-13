import { router } from "expo-router";
import { Pressable, View } from "react-native";
import Text from "@/components/basic/text";
import { Avaliable } from "@/components/logos/pockets";
import { useModal } from "@/hooks/useModal";
import { formatBreBKey, formatMoney, formatPhone } from "@/libs/utils";
import { useVictimsStore } from "@/store/useVictimsStore";

interface ConfirmSheetProps {
	phone: string;
	amount: number;
	onTransfer: () => void;
	type?: "nequi" | "bre-b";
}

const sheetConfig = {
	nequi: {
		victimType: "phone" as const,
		title: "Confirma el número",
		destinationLabel: "Al número de celular:",
	},
	"bre-b": {
		victimType: "key" as const,
		title: "Confirma el envío",
		destinationLabel: "A la llave",
	},
} as const;

export default function ConfirmSheet({
	phone,
	amount,
	onTransfer,
	type = "nequi",
}: ConfirmSheetProps) {
	const findVictimByType = useVictimsStore((state) => state.findVictimByType);
	const findVictimByValue = useVictimsStore((state) => state.findVictimByValue);
	const config = sheetConfig[type];

	const victim =
		findVictimByType(config.victimType, phone) ??
		(type === "bre-b" ? findVictimByValue(phone) : undefined);

	const { hide } = useModal();

	if (!victim?.name) {
		return (
			<View className="pb-10 pt-2">
				<Text fontWeight="bold" className="text-uva text-[26px] pb-4">
					{config.title}
				</Text>
				<Text className="text-uva text-[16px] mb-6">
					No encontramos esta llave en tus contactos. Regístrala primero.
				</Text>
				<Pressable
					style={{ padding: 14 }}
					onPress={() => {
						hide();
						router.push("/settings/victims");
					}}
					className="bg-orquidea flex items-center justify-center rounded-[4px]"
				>
					<Text className="text-[16px]">Ir a contactos</Text>
				</Pressable>
			</View>
		);
	}

	const destinationValue =
		type === "bre-b" ? formatBreBKey(phone) : formatPhone(phone);

	return (
		<View className="pb-10 pt-2">
			<Text fontWeight="bold" className="text-uva text-[26px] pb-4">
				{config.title}
			</Text>

			<View className="flex gap-3">
				<View className="flex gap-0.5">
					<Text fontWeight="medium" style={{ color: "#da0081", fontSize: 16 }}>
						Vas a enviar a:
					</Text>
					<Text fontWeight="regular" className="text-uva text-[16px]">
						{obfuscateName(victim.name, true)}
					</Text>
				</View>

				<View className="flex gap-0.5">
					<Text fontWeight="medium" style={{ color: "#da0081", fontSize: 16 }}>
						{config.destinationLabel}
					</Text>
					<Text fontWeight="regular" className="text-uva text-[16px]">
						{destinationValue}
					</Text>
				</View>

				{type === "bre-b" && victim.type === "key" && (
					<View className="flex gap-0.5">
						<Text
							fontWeight="medium"
							style={{ color: "#da0081", fontSize: 16 }}
						>
							Banco destino
						</Text>
						<Text fontWeight="regular" className="text-uva text-[16px]">
							{victim.bank || "Desconocido"}
						</Text>
					</View>
				)}

				<View className="flex gap-0.5">
					<Text fontWeight="medium" style={{ color: "#da0081", fontSize: 16 }}>
						¿Cuánto?
					</Text>
					<Text fontWeight="regular" className="text-uva text-[16px]">
						{formatMoney(amount)}
					</Text>
				</View>
			</View>

			<Text
				fontWeight="medium"
				style={{ fontSize: 16, paddingBottom: 10, paddingTop: 12 }}
				className="text-[#6e6e6e]"
			>
				La plata saldrá de:
			</Text>

			<View
				style={{ borderWidth: 0.5, borderColor: "#0000001f" }}
				className="w-full flex-row items-center gap-4 rounded-[4px] p-2"
			>
				<Avaliable width={32} height={32} />
				<Text fontWeight="medium" className="text-uva text-[17px]">
					Disponible
				</Text>
			</View>

			<View style={{ paddingTop: 20 }} className="flex gap-4">
				<Pressable
					style={{ padding: 14 }}
					onPress={() => {
						hide();
						setTimeout(() => onTransfer(), 280);
					}}
					className="bg-orquidea flex items-center justify-center rounded-[4px] active:bg-orquidea-button-pressed"
				>
					<Text className="text-[16px]">
						{type === "bre-b" ? "Enviar" : "Confirma"}
					</Text>
				</Pressable>

				<Pressable
					style={{ padding: 14 }}
					className="bg-white border border-uva flex items-center justify-center rounded-[4px] active:bg-uva-button-pressed group"
					onPress={hide}
				>
					<Text
						fontWeight="medium"
						className="text-[16px] text-uva group-active:text-white"
					>
						Corrige algo
					</Text>
				</Pressable>
			</View>
		</View>
	);
}

export function obfuscateName(name: string, full = false) {
	const words = name
		.trim()
		.split(/\s+/)
		.filter((w) => w.length >= 2)
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

	if (full) return words.map((w) => obf(w)).join(" ");

	if (words.length === 4) return `${obf(words[0])} ${obf(words[2])}`;
	if (words.length === 3) return `${obf(words[0])} ${obf(words[1])}`;
	if (words.length === 2) return `${obf(words[0])} ${obf(words[1])}`;
	if (words.length === 1) return obf(words[0]);

	return words.map((w) => obf(w)).join(" ");
}

const obf = (w: string) => w.slice(0, 3) + "*".repeat(Math.max(w.length - 3, 0));
