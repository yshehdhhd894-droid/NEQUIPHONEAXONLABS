import { type ViewProps } from "react-native";
import { View } from "react-native";
import { useBackgroundStore, BACKGROUND_LEVELS } from "@/store/useBackgroundStore";
import { BackgroundLayer } from "./background-layer";

type BackgroundViewProps = ViewProps & {
	className?: string;
};

export function BackgroundView({
	className = "",
	style,
	children,
	...props
}: BackgroundViewProps) {
	const level = useBackgroundStore((s) => s.level);
	const isNormal = level === 0;
	const info = BACKGROUND_LEVELS.find((l) => l.level === level);

	return (
		<View
			className={`flex-1 w-full ${isNormal ? "bg-white" : ""} ${className}`}
			style={style}
			{...props}
		>
			{!isNormal && <BackgroundLayer level={level} />}
			{children}
		</View>
	);
}
