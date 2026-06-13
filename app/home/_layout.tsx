import { Slot, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { setSystemNavBarDefault } from "@/libs/navigation-bar";
import { NavigationTabs } from "@/components/footer";
import { ActionModal } from "@/components/footer/action-modal";
import { FloatingActionButton } from "@/components/footer/floating-buttons";
import { useBottomInset } from "@/hooks/useBottomInset";
import { useFooterLayoutMetrics } from "@/hooks/useFooterLayoutMetrics";
import { useModal } from "@/hooks/useModal";

export default function TabsLayout() {
	const [openModal, setOpenModal] = useState(false);
	const { visible: sheetOpen } = useModal();
	const { top } = useSafeAreaInsets();
	const bottomInset = useBottomInset();
	const footer = useFooterLayoutMetrics();
	const footerHidden = openModal || sheetOpen;

	useFocusEffect(
		useCallback(() => {
			void setSystemNavBarDefault();
		}, []),
	);

	const handleFloatingButtonPress = () => {
		setOpenModal(!openModal);
	};

	return (
		<View className="bg-white flex-1">
			<View
				className="flex-1"
				style={{ paddingBottom: footer.footerHeight + bottomInset }}
			>
				<HeaderDesign topInset={top} />
			</View>

			<ActionModal
				isOpen={openModal}
				topInset={top}
				setOpenModal={setOpenModal}
			/>

			<View
				className="flex-row absolute left-0 right-0 justify-between items-center"
				style={{
					bottom: 0,
					paddingBottom: bottomInset,
					paddingTop: footer.paddingY,
					paddingHorizontal: footer.horizontalPadding,
					gap: footer.gap,
					zIndex: 100,
				}}
			>
				<View
					style={{
						flex: 1,
						minWidth: 0,
						opacity: footerHidden ? 0 : 1,
						pointerEvents: footerHidden ? "none" : "auto",
					}}
				>
					<NavigationTabs />
				</View>
				<FloatingActionButton
					isOpen={openModal}
					onPress={handleFloatingButtonPress}
				/>
			</View>
		</View>
	);
}

function HeaderDesign({ topInset }: { topInset: number }) {
	return (
		<View className="flex-1 overflow-visible">
			<View
				className="absolute top-0 left-0 bg-uva w-full"
				style={{ height: topInset }}
			/>
			<Slot />
		</View>
	);
}
