import type { ReactNode } from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/basic/text";
import Button from "@/components/button";
import { FormFooter } from "@/components/form-footer";
import { Arrow } from "@/components/logos";
import { EmptyCaseMovement } from "@/components/logos/empty-cases";
import Ionicons from "@expo/vector-icons/Ionicons";

function HighlightText({
	prefix,
	highlight,
	suffix,
}: {
	prefix: string;
	highlight: string;
	suffix: string;
}) {
	return (
		<Text fontWeight="bold" className="text-uva" style={{ fontSize: 16, lineHeight: 22 }}>
			{prefix}
			<Text style={{ color: "#da0081" }}>{highlight}</Text>
			{suffix}
		</Text>
	);
}

function InfoRow({
	icon,
	title,
	subtitle,
}: {
	icon: ReactNode;
	title: ReactNode;
	subtitle: string;
}) {
	return (
		<View className="flex-row items-start gap-3">
			{icon}
			<View className="flex-1">
				{title}
				<Text className="text-[#8A8A8A]" style={{ fontSize: 14, lineHeight: 20, marginTop: 6 }}>
					{subtitle}
				</Text>
			</View>
		</View>
	);
}

export default function BancosWhenArrivesScreen() {
	const { top } = useSafeAreaInsets();

	return (
		<View className="flex-1 bg-white justify-between">
			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 24 }}
			>
				<View style={{ paddingTop: top + 8, paddingHorizontal: 24 }}>
					<Pressable
						onPress={() => router.back()}
						className="size-8 justify-center mb-4"
					>
						<Arrow color="#200020" />
					</Pressable>

					<View className="items-center py-2">
						<EmptyCaseMovement width={280} height={280} />
					</View>

					<Text
						fontWeight="bold"
						className="text-uva text-center"
						style={{ fontSize: 22, lineHeight: 28, marginBottom: 24 }}
					>
						¿Cuándo llega la plata?
					</Text>

					<InfoRow
						icon={
							<Ionicons name="time-outline" size={44} color="#da0081" />
						}
						title={
							<HighlightText
								prefix="Si envías entre "
								highlight="lunes y jueves"
								suffix=", llegará al siguiente día"
							/>
						}
						subtitle="Si el día siguiente es festivo, llegará el siguiente día hábil."
					/>

					<View style={{ marginTop: 20 }}>
						<InfoRow
							icon={
								<Ionicons name="calendar-outline" size={44} color="#da0081" />
							}
							title={
								<HighlightText
									prefix="Si envías entre "
									highlight="viernes y domingo"
									suffix=", llega el lunes"
								/>
							}
							subtitle="Si el lunes es festivo, llega el martes."
						/>
					</View>
				</View>
			</ScrollView>

			<FormFooter style={{ paddingHorizontal: 24 }}>
				<Button
					title="Continuar"
					onPress={() => router.push("/send/bancos/form")}
				/>
			</FormFooter>
		</View>
	);
}
