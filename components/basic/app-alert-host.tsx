import { useEffect } from "react";
import { Modal, Pressable, View } from "react-native";
import Animated, {
	FadeInUp,
	FadeOutUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppAlertBanner } from "@/components/basic/app-alert-banner";
import Text from "@/components/basic/text";
import { APP_ALERT_BACKGROUND } from "@/libs/app-alert";
import { useAppAlertStore } from "@/store/useAppAlertStore";

const AUTO_DISMISS_MS = 5000;

export function AppAlertHost() {
	const insets = useSafeAreaInsets();
	const message = useAppAlertStore((s) => s.message);
	const variant = useAppAlertStore((s) => s.variant);
	const confirm = useAppAlertStore((s) => s.confirm);
	const hide = useAppAlertStore((s) => s.hide);
	const hideConfirm = useAppAlertStore((s) => s.hideConfirm);

	useEffect(() => {
		if (!message) return;
		const timer = setTimeout(hide, AUTO_DISMISS_MS);
		return () => clearTimeout(timer);
	}, [message, hide]);

	return (
		<>
			{message ? (
				<View
					pointerEvents="box-none"
					style={{
						position: "absolute",
						top: insets.top + 8,
						left: 12,
						right: 12,
						zIndex: 9999,
					}}
				>
					<Animated.View entering={FadeInUp.duration(220)} exiting={FadeOutUp.duration(180)}>
						<AppAlertBanner
							message={message}
							variant={variant}
							onDismiss={hide}
						/>
					</Animated.View>
				</View>
			) : null}

			<Modal
				visible={!!confirm}
				transparent
				animationType="fade"
				onRequestClose={hideConfirm}
			>
				<Pressable
					className="flex-1 items-center justify-center px-6"
					style={{ backgroundColor: "rgba(32, 0, 32, 0.72)" }}
					onPress={hideConfirm}
				>
					<Pressable
						className="w-full overflow-hidden rounded-[12px] bg-white"
						onPress={(e) => e.stopPropagation()}
					>
						<View
							style={{
								backgroundColor: APP_ALERT_BACKGROUND,
								paddingHorizontal: 16,
								paddingVertical: 14,
							}}
						>
							<Text fontWeight="semibold" className="text-[16px] text-[#1C1C1C]">
								{confirm?.title}
							</Text>
						</View>
						<View className="px-4 py-4">
							<Text className="text-[14px] leading-5 text-[#1C1C1C]">
								{confirm?.message}
							</Text>
							<View className="mt-5 flex-row justify-end gap-3">
								<Pressable
									onPress={hideConfirm}
									className="rounded-[4px] px-4 py-2.5"
								>
									<Text fontWeight="medium" className="text-[14px] text-[#200020]">
										{confirm?.cancelText ?? "Cancelar"}
									</Text>
								</Pressable>
								<Pressable
									onPress={() => {
										confirm?.onConfirm();
										hideConfirm();
									}}
									className="rounded-[4px] px-4 py-2.5"
									style={{ backgroundColor: APP_ALERT_BACKGROUND }}
								>
									<Text fontWeight="semibold" className="text-[14px] text-[#1C1C1C]">
										{confirm?.confirmText ?? "Confirmar"}
									</Text>
								</Pressable>
							</View>
						</View>
					</Pressable>
				</Pressable>
			</Modal>
		</>
	);
}
