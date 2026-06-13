import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, View } from "react-native";
import Text from "@/components/basic/text";
import {
	APP_ALERT_BACKGROUND,
	APP_ALERT_SUCCESS_BACKGROUND,
	APP_ALERT_SUCCESS_ICON_CIRCLE,
	APP_ALERT_TEXT,
} from "@/libs/app-alert";
import type { AppAlertVariant } from "@/store/useAppAlertStore";

type Props = {
	message: string;
	variant?: AppAlertVariant;
	onDismiss?: () => void;
	className?: string;
};

export function AppAlertBanner({
	message,
	variant = "error",
	onDismiss,
	className,
}: Props) {
	const isSuccess = variant === "success";

	return (
		<Pressable
			onPress={onDismiss}
			className={className}
			style={{
				backgroundColor: isSuccess
					? APP_ALERT_SUCCESS_BACKGROUND
					: APP_ALERT_BACKGROUND,
				borderRadius: 12,
				paddingHorizontal: 14,
				paddingVertical: 12,
				flexDirection: "row",
				alignItems: "center",
				gap: 10,
			}}
		>
			<View
				style={{
					width: 24,
					height: 24,
					alignItems: "center",
					justifyContent: "center",
					borderRadius: 12,
					backgroundColor: isSuccess ? APP_ALERT_SUCCESS_ICON_CIRCLE : "transparent",
				}}
			>
				<Ionicons
					name={isSuccess ? "checkmark" : "warning"}
					size={isSuccess ? 18 : 22}
					color={isSuccess ? APP_ALERT_TEXT : "#FFFFFF"}
				/>
			</View>
			<Text
				fontWeight="medium"
				style={{
					flex: 1,
					color: APP_ALERT_TEXT,
					fontSize: 14,
					lineHeight: 20,
				}}
			>
				{message}
			</Text>
		</Pressable>
	);
}
