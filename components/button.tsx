import { cva, type VariantProps } from "class-variance-authority";
import { useRouter } from "expo-router";
import { Pressable, type StyleProp, View, type ViewStyle } from "react-native";
import Text from "@/components/basic/text";
import { cn } from "@/libs/utils";

const buttonStyles = cva(
	"h-[48px] items-center justify-center rounded-[4px] active:opacity-80 disabled:opacity-50",
	{
		variants: {
			variant: {
				primary: "bg-orquidea active:bg-orquidea-button-pressed",
				secondary: "bg-gray-200 active:bg-gray-300",
				danger: "bg-red-500 active:bg-red-600",
				info: "bg-[#4376ff] active:bg-blue-600",
			},
			size: {
				md: "h-[48px] px-4",
				sm: "h-[40px] px-3",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "md",
		},
	},
);

interface ButtonProps {
	title?: string;
	icon?: React.ReactNode;
	className?: string;
	viewClassName?: string;
	children?: React.ReactNode;
	disabled?: boolean;
	onPress?: () => void;
	href?: string;
	variant?: VariantProps<typeof buttonStyles>["variant"];
	size?: "md" | "sm";
	style?: StyleProp<ViewStyle>;
	viewStyle?: StyleProp<ViewStyle>;
}

export default function Button(props: ButtonProps) {
	const router = useRouter();

	const handlePress = () => {
		if (props.disabled) return;
		if (props.href) router.push(props.href);
		if (props.onPress) props.onPress();
	};

	return (
		<Pressable
			onPress={handlePress}
			disabled={props.disabled}
			accessibilityState={{ disabled: Boolean(props.disabled) }}
			className={cn(
				buttonStyles({ variant: props.variant, size: props.size }),
				props.disabled && "opacity-50",
				props.className,
			)}
			style={[props.style, props.disabled && { pointerEvents: "none" as const }]}
		>
			<View className={cn(props.viewClassName)} style={props.viewStyle}>
				{props.icon}
				{props.title && (
					<Text
						disabled={props.disabled}
						className="text-[16px] disabled:text-white"
						fontWeight="medium"
					>
						{props.title}
					</Text>
				)}
				{props.children}
			</View>
		</Pressable>
	);
}
