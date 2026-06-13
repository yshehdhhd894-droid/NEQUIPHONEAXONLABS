import { useCallback, useState } from "react";
import { Pressable, View } from "react-native";
import Text from "@/components/basic/text";
import { HelpCircle } from "@/components/logos";
import { cn } from "@/libs/utils";

type Props = {
	onPress?: () => void;
	className?: string;
};

export function LoginHelpButton({ onPress, className }: Props) {
	const [pressed, setPressed] = useState(false);

	const handlePressIn = useCallback(() => setPressed(true), []);
	const handlePressOut = useCallback(() => setPressed(false), []);

	return (
		<Pressable
			onPress={onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			className={cn(
				"rounded-[4px] px-4 flex-row items-center justify-center border border-white h-[39px]",
				pressed && "bg-white",
				className,
			)}
		>
			<View className="size-7 mr-[7.2px]">
				<HelpCircle color={pressed ? "#200020" : ""} />
			</View>
			<Text
				fontWeight="regular"
				className={cn("text-[17px]", pressed && "text-uva")}
			>
				Ayuda
			</Text>
		</Pressable>
	);
}
