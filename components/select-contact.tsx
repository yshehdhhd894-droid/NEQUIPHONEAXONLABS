import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/basic/text";
import { Arrow } from "@/components/logos";
import { formatPhone } from "@/libs/utils";
import {
	useVictimsStore,
	type Victim,
	type VictimType,
} from "@/store/useVictimsStore";

const { State: TextInputState } = TextInput;

interface Props {
	onClose: () => void;
	onPress: (victim: Victim) => void;
	type?: VictimType;
}

export default function SelectContact({ onClose, onPress, type }: Props) {
	const currentlyFocusedField = TextInputState.currentlyFocusedInput();
	const [searchQuery, setSearchQuery] = useState("");
	const { top } = useSafeAreaInsets();

	const scale = useSharedValue(0);
	const opacity = useSharedValue(0);

	const dbVictims = useVictimsStore((state) => state.victims);
	const victims = groupVictimsByFirstLetter(
		type ? dbVictims.filter((victim) => victim.type === type) : dbVictims,
	);

	useEffect(() => {
		currentlyFocusedField?.blur();

		scale.value = withTiming(1, {
			duration: 500 * 2,
			easing: Easing.out(Easing.exp),
		});
		opacity.value = withTiming(1, { duration: 500 });
	}, []);

	const overlayStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
		transform: [{ scale: scale.value }],
	}));

	const handlePress = (victim: Victim) => {
		onPress(victim);
		onClose();

		currentlyFocusedField?.focus();
	};

	return (
		<Animated.View
			style={[overlayStyle, { top }]}
			className="flex-1 absolute z-50 h-full w-full bg-white"
		>
			<View>
				<Pressable
					onPress={onClose}
					className="w-full p-2.5 items-center flex-row justify-between"
				>
					<View className="flex-row items-center gap-2">
						<View className="size-8 justify-center">
							<Arrow color="#200020" />
						</View>

						<Text fontWeight="bold" className="text-[18px] text-uva">
							Contactos
						</Text>
					</View>

					<Ionicons name="refresh-outline" size={26} color="#200020" />
				</Pressable>

				<View className="w-full pt-4" style={{ paddingHorizontal: 24 }}>
					<Ionicons
						style={{
							position: "absolute",
							marginTop: 23,
							marginLeft: 30,
							zIndex: 10,
							opacity: 0.6,
						}}
						name="search-outline"
						size={24}
						color="#200020"
					/>
					<TextInput
						className="bg-[#fbf7fb] rounded-[8px]"
						style={{ fontSize: 18, paddingLeft: 32 }}
						placeholder="Busca"
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>

				<ScrollView className="px-4">
					<View className="bg-[#ece7f5] my-4 h-[1px] w-full" />

					{Object.keys(victims).map((letter) => (
						<View key={letter} className="flex flex-col pb-4">
							<Text className="text-[14px] text-uva font-bold">{letter}</Text>
							{victims[letter].map((victim, index) => (
								<ContactItem
									key={victim.id}
									onPress={handlePress}
									victim={victim}
									colorIndex={
										Object.keys(victims)
											.slice(0, Object.keys(victims).indexOf(letter))
											.reduce(
												(acc, prevLetter) => acc + victims[prevLetter].length,
												0,
											) + index
									}
								/>
							))}
						</View>
					))}
				</ScrollView>
			</View>
		</Animated.View>
	);
}

interface ItemProps {
	victim: Victim;
	colorIndex: number;
	onPress: (victim: Victim) => void;
}

function ContactItem({ victim, colorIndex, onPress }: ItemProps) {
	return (
		<Pressable
			className="flex-row items-center py-2 px-4 gap-6"
			onPress={() => onPress(victim)}
		>
			<View
				style={{ backgroundColor: getColorByIndex(colorIndex) }}
				className="size-12 flex items-center justify-center rounded-[4px]"
			>
				<Text className="text-[16px]">
					{victim.name
						.split(" ")
						.map((w) => w[0])
						.slice(0, 2)}
				</Text>
			</View>

			<View className="flex h-[40px]">
				<Text className="text-[17px] text-uva">{victim.name}</Text>
				<Text className="text-[15px] text-uva leading-none">
					{formatPhone(victim.value)}
				</Text>
			</View>
		</Pressable>
	);
}

// Function to group victims by their first letter
function groupVictimsByFirstLetter(victims: Victim[]) {
	const grouped: { [key: string]: Victim[] } = {};

	victims.forEach((victim) => {
		const firstLetter = victim.name.charAt(0).toUpperCase();
		if (!grouped[firstLetter]) {
			grouped[firstLetter] = [];
		}
		grouped[firstLetter].push(victim);
	});

	// Sort the groups alphabetically
	const sortedGroups: { [key: string]: Victim[] } = {};
	Object.keys(grouped)
		.sort()
		.forEach((key) => {
			sortedGroups[key] = grouped[key];
		});

	return sortedGroups;
}

function getColorByIndex(index: number) {
	const colors = ["#da0081", "#dc410f", "#1e142c", "#5a9efb"];
	return colors[index % colors.length];
}
