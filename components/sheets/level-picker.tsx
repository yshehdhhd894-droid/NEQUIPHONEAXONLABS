import { Pressable, View } from "react-native";
import Text from "@/components/basic/text";
import { useModal } from "@/hooks/useModal";
import {
	type BackgroundLevel,
	BACKGROUND_LEVELS,
	useBackgroundStore,
} from "@/store/useBackgroundStore";

export default function LevelPickerSheet() {
	const currentLevel = useBackgroundStore((s) => s.level);
	const setLevel = useBackgroundStore((s) => s.setLevel);
	const { hide } = useModal();

	return (
		<View className="pt-2 pb-2" style={{ overflow: "visible" }}>
			<Text
				fontWeight="medium"
				className="text-uva text-[26px] pb-4 leading-tight"
			>
				Fondo de pantalla
			</Text>
			<Text className="text-[#6e6e6e] text-[15px] pb-4">
				Selecciona el fondo que más te guste
			</Text>

			<View className="gap-2">
				{BACKGROUND_LEVELS.map((item) => {
					const isSelected = currentLevel === item.level;
					return (
						<Pressable
							key={item.level}
							onPress={() => {
								setLevel(item.level);
								hide();
							}}
							className={`flex-row items-center py-3.5 px-4 rounded-[4px] ${
								isSelected
									? "bg-orquidea"
									: "bg-[#ece7f5]"
							}`}
						>
							<View
								className="size-6 rounded-full mr-3 border border-uva/30"
								style={{ backgroundColor: item.bgColor }}
							/>
							<Text
								fontWeight="medium"
								className={`text-[18px] ${
									isSelected ? "text-white" : "text-uva"
								}`}
							>
								{item.label}
							</Text>
							{isSelected && (
								<View className="ml-auto">
									<Text className="text-white text-[14px]">✓</Text>
								</View>
							)}
						</Pressable>
					);
				})}
			</View>
		</View>
	);
}
