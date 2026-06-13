import { Pressable, View } from "react-native";
import Text from "@/components/basic/text";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/libs/utils";

interface SelectSheetProps<T> {
	title: string;
	options: Array<{ label: string; value: T }>;
	onSubmit: (value: T) => void;
}

export default function SelectSheet<T>({
	title,
	onSubmit,
	options,
}: SelectSheetProps<T>) {
	const { hide } = useModal();

	const handleChange = (value: T) => {
		onSubmit(value);
		hide();
	};

	return (
		<View className="pb-[5rem] pt-8">
			<Text
				fontWeight="bold"
				className="text-uva text-[26px] pb-8 leading-tight"
			>
				{title}
			</Text>

			<View className="px-2 flex gap-2">
				{options.map((option, index) => (
					<Pressable
						key={option.value as string}
						onPress={() => handleChange(option.value)}
						className={cn(
							"relative py-3",
							index !== options.length - 1 &&
								"border-b-[0.5px] border-gray-200",
						)}
					>
						<Text fontWeight="medium" className="text-uva text-[16px] pb-2">
							{option.label}
						</Text>
					</Pressable>
				))}
			</View>
		</View>
	);
}
