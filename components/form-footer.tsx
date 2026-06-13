import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { useFormFooterBottomPadding } from "@/hooks/useBottomInset";
import { useKeyboard } from "@/hooks/useKeyboard";

type FormFooterProps = {
	children: ReactNode;
	style?: StyleProp<ViewStyle>;
};

export function FormFooter({ children, style }: FormFooterProps) {
	const { isKeyboardVisible } = useKeyboard();
	const safeBottom = useFormFooterBottomPadding();

	return (
		<View
			style={[
				{
					paddingHorizontal: 20,
					paddingTop: 20,
					paddingBottom: isKeyboardVisible ? 16 : safeBottom,
				},
				style,
			]}
		>
			{children}
		</View>
	);
}
