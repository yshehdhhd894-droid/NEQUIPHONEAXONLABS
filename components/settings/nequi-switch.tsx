import { Pressable, View } from "react-native";

type Props = {
	value: boolean;
	onValueChange: (value: boolean) => void;
	disabled?: boolean;
};

export function NequiSwitch({ value, onValueChange, disabled }: Props) {
	return (
		<Pressable
			onPress={() => !disabled && onValueChange(!value)}
			disabled={disabled}
			style={{
				width: 56,
				height: 28,
				borderRadius: 4,
				backgroundColor: value ? "#da0081" : "#646464",
				justifyContent: "center",
				paddingHorizontal: 4,
				opacity: disabled ? 0.5 : 1,
			}}
		>
			<View
				style={{
					width: 20,
					height: 20,
					borderRadius: 3,
					backgroundColor: "#FFFFFF",
					alignSelf: value ? "flex-end" : "flex-start",
				}}
			/>
		</Pressable>
	);
}
