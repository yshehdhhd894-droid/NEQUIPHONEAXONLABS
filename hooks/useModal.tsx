import { usePathname } from "expo-router";
import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import {
	Dimensions,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useKeyboard } from "@/hooks/useKeyboard";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const ModalContext = createContext<{
	show: (content: React.ReactNode) => void;
	hide: () => void;
	visible: boolean;
} | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
	const [content, setContent] = useState<React.ReactNode>(null);
	const [visible, setVisible] = useState(false);
	const pathname = usePathname();

	const handleShow = useCallback((modalContent: React.ReactNode) => {
		setContent(modalContent);
		setVisible(true);
	}, []);

	const handleHide = useCallback(() => {
		setVisible(false);
		setTimeout(() => {
			setContent(null);
		}, 300);
	}, []);

	useEffect(() => {
		if (visible) {
			handleHide();
		}
	}, [pathname]);

	return (
		<ModalContext.Provider
			value={{
				show: handleShow,
				hide: handleHide,
				visible,
			}}
		>
			{children}
			<ModalOverlay visible={visible} content={content} onClose={handleHide} />
		</ModalContext.Provider>
	);
}

export function useModal() {
	const context = useContext(ModalContext);
	if (!context)
		throw new Error("useModal debe usarse dentro de un <ModalProvider>");
	return context;
}

export function ModalOverlay({
	visible,
	content,
	onClose,
}: {
	visible: boolean;
	content: React.ReactNode;
	onClose: () => void;
}) {
	const { bottom: safeBottom } = useSafeAreaInsets();
	const sheetBottomInset = safeBottom;
	const { isKeyboardVisible, keyboardHeight } = useKeyboard();
	const backdrop = useSharedValue(0);
	const sheet = useSharedValue(1);

	useEffect(() => {
		if (visible) {
			backdrop.value = withTiming(1, { duration: 200 });
			sheet.value = withTiming(0, {
				duration: 250,
				easing: Easing.out(Easing.exp),
			});
		} else {
			backdrop.value = withTiming(0, { duration: 200 });
			sheet.value = withTiming(1, {
				duration: 250,
				easing: Easing.in(Easing.exp),
			});
		}
	}, [visible]);

	const backdropStyle = useAnimatedStyle(() => ({
		opacity: backdrop.value,
	}));

	const sheetStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: sheet.value * 300 }],
		};
	});

	const keyboardFillHeight = isKeyboardVisible
		? keyboardHeight + sheetBottomInset
		: 0;

	const SheetContainer = Platform.OS === "ios" ? KeyboardAvoidingView : View;
	const sheetContainerProps =
		Platform.OS === "ios"
			? {
					behavior: "padding" as const,
					keyboardVerticalOffset: safeBottom,
				}
			: {};

	return (
		<Modal
			transparent
			visible={visible}
			animationType="none"
			onRequestClose={onClose}
			hardwareAccelerated
		>
			<View style={styles.root}>
				<Animated.View style={[styles.backdrop, backdropStyle]}>
					<Pressable style={{ flex: 1 }} onPress={onClose} />
				</Animated.View>

				{isKeyboardVisible ? (
					<View
						pointerEvents="none"
						style={[styles.keyboardBackdropFill, { height: keyboardHeight }]}
					/>
				) : null}

				<SheetContainer style={styles.keyboardView} {...sheetContainerProps}>
					<Animated.View
						style={[
							styles.sheet,
							sheetStyle,
							{
								paddingBottom: isKeyboardVisible ? 0 : sheetBottomInset,
							},
						]}
					>
						<View style={styles.handle} />
						<ScrollView
							keyboardShouldPersistTaps="handled"
							showsVerticalScrollIndicator={false}
							bounces={false}
							style={styles.scroll}
							contentContainerStyle={styles.content}
							nestedScrollEnabled
						>
							{content}
						</ScrollView>
						{keyboardFillHeight > 0 ? (
							<View
								style={[
									styles.keyboardSheetFill,
									{ height: keyboardFillHeight },
								]}
							/>
						) : null}
					</Animated.View>
				</SheetContainer>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		justifyContent: "flex-end",
	},
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	keyboardBackdropFill: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "#FFFFFF",
	},
	keyboardView: {
		justifyContent: "flex-end",
	},
	sheet: {
		backgroundColor: "#FFFFFF",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		maxHeight: SCREEN_HEIGHT * 0.9,
		overflow: "visible",
	},
	handle: {
		width: 40,
		height: 5,
		backgroundColor: "#ccc",
		borderRadius: 2,
		alignSelf: "center",
		marginTop: 16,
		marginBottom: 20,
	},
	scroll: {
		flexGrow: 0,
	},
	content: {
		paddingHorizontal: 16,
		paddingBottom: 0,
		overflow: "visible",
	},
	keyboardSheetFill: {
		backgroundColor: "#FFFFFF",
	},
});
