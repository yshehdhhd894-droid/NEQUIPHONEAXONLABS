import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect, router } from "expo-router";
import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	InteractionManager,
	Platform,
	Pressable,
	StyleSheet,
	View,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PhoneLoginInput from "@/components/basic/input";
import NequiSpinner from "@/components/basic/spinner";
import Text from "@/components/basic/text";
import Button from "@/components/button";
import DynamicPassword from "@/components/dynamic-password";
import { LoginFooter } from "@/components/login/login-footer";
import { LoginHelpButton } from "@/components/login/login-help-button";
import { LoginLogoSection } from "@/components/login/login-logo-section";
import { LoginPurpleLayout } from "@/components/login/login-purple-layout";
import { LoginReturningFooter } from "@/components/login/login-returning-footer";
import { IcoMoney } from "@/components/logos";
import { useAuthStore } from "@/hooks/useAuth";
import { useCreateUserFlow } from "@/hooks/useCreateUserFlow";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useLoginNavigationBar } from "@/hooks/useLoginNavigationBar";
import {
	getPhoneDraftSync,
	saveLastPhone,
	savePhoneDraft,
} from "@/libs/last-phone-storage";
import {
	CONNECTION_ERROR_MESSAGE,
	isConnectionError,
	showAppAlert,
} from "@/libs/app-alert";
import { cn, formatPhone } from "@/libs/utils";
import { userService } from "@/services/api.service";
import { useAppStore } from "@/store/useAppStore";

const AnimatedButton = Animated.createAnimatedComponent(Button);
const MIN_PHONE_LENGTH = 11;

export type PhoneLoginVariant = "guest" | "returning";

type Props = {
	variant: PhoneLoginVariant;
};

export function PhoneLoginScreen({ variant }: Props) {
	const enrollTourCompleted = useAppStore((s) => s.enrollTourCompleted);
	const isReturning = variant === "returning";

	useLoginNavigationBar();

	const { isKeyboardVisible } = useKeyboard();
	const getLastPhone = useAuthStore((state) => state.getLastPhone);
	const insets = useSafeAreaInsets();
	const { openCreateUserFlow } = useCreateUserFlow();

	const [value, setValue] = useState(() => {
		const draft = getPhoneDraftSync();
		return draft ? formatPhone(draft) : "";
	});
	const [showOverlay, setShowOverlay] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const isPhoneValid = useMemo(
		() => value.length > MIN_PHONE_LENGTH,
		[value.length],
	);

	const showError = useCallback((message: string) => {
		showAppAlert(
			isConnectionError(message) ? CONNECTION_ERROR_MESSAGE : message,
		);
	}, []);

	const handleSetPhoneValue = useCallback((next: SetStateAction<string>) => {
		setValue((prev) => {
			const resolved = typeof next === "function" ? next(prev) : next;
			savePhoneDraft(resolved);
			return resolved;
		});
	}, []);

	useEffect(() => {
		const task = InteractionManager.runAfterInteractions(() => {
			if (getPhoneDraftSync()) return;

			void getLastPhone().then((phone) => {
				if (phone) {
					setValue(formatPhone(phone));
				}
			});
		});
		return () => task.cancel();
	}, [getLastPhone]);

	useEffect(() => {
		if (Platform.OS !== "web" || typeof document === "undefined") return;

		const onHide = () => {
			if (document.visibilityState === "hidden") {
				savePhoneDraft(value);
			}
		};

		document.addEventListener("visibilitychange", onHide);
		return () => document.removeEventListener("visibilitychange", onHide);
	}, [value]);

	const handleLoginAccount = useCallback(async () => {
		if (!isPhoneValid) {
			showError(`Número de teléfono inválido (${value})`);
			return;
		}

		setIsLoading(true);

		try {
			const cleanPhone = value.replaceAll(" ", "");
			const exists = await userService.getPhone(cleanPhone);

			if (!exists) {
				showError("Número de telefono no registrado");
				return;
			}

			await saveLastPhone(cleanPhone);
			router.push(`/pin?phone=${cleanPhone}`);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Error de conexión";
			showError(message);
		} finally {
			setIsLoading(false);
		}
	}, [isPhoneValid, value, showError]);

	const handleToggleOverlay = useCallback(() => {
		setShowOverlay((prev) => !prev);
	}, []);

	if (!enrollTourCompleted) {
		return <Redirect href="/enroll-tour" />;
	}

	return (
		<LoginPurpleLayout>
			<OverlayView
				show={showOverlay}
				insets={insets}
				onToggle={handleToggleOverlay}
			/>

			<View
				style={[
					styles.screen,
					isKeyboardVisible && styles.screenKeyboard,
				]}
			>
				<View style={[styles.header, { marginTop: insets.top + 16 }]}>
					{isReturning ? (
						<DynamicPassword />
					) : (
						<View style={styles.headerSpacer} />
					)}
					<LoginHelpButton onPress={openCreateUserFlow} />
				</View>

				<LoginLogoSection />

				<BottomSection
					value={value}
					setValue={handleSetPhoneValue}
					isLoading={isLoading}
					onLogin={handleLoginAccount}
					showOverlay={showOverlay}
					onToggleOverlay={handleToggleOverlay}
					isReturning={isReturning}
				/>
			</View>
		</LoginPurpleLayout>
	);
}

interface OverlayViewProps {
	show: boolean;
	insets: { bottom: number };
	onToggle: () => void;
}

function OverlayView({ show, insets, onToggle }: OverlayViewProps) {
	if (!show) return null;

	return (
		<Pressable style={styles.overlayRoot} onPress={() => {}}>
			<View
				style={[
					styles.overlayBackdrop,
					{ paddingBottom: insets.bottom + 120 },
				]}
			/>

			<View
				style={[styles.overlayActions, { bottom: insets.bottom + 142 }]}
			>
				<View style={styles.overlayRow}>
					<Text fontWeight="medium" className="text-[17px]">
						Comprobar un pago
					</Text>
					<AnimatedButton
						className="w-12 h-12"
						variant="primary"
						viewClassName="p-2 size-12 flex justify-center items-center"
						icon={<Ionicons name="ticket-outline" size={24} color="white" />}
					/>
				</View>
				<View style={styles.overlayRow}>
					<Text fontWeight="medium" className="text-[17px]">
						Usar QR
					</Text>
					<AnimatedButton
						className="w-12 h-12"
						variant="primary"
						viewClassName="p-2 size-12 flex justify-center items-center"
						icon={<Ionicons name="qr-code-outline" size={24} color="white" />}
					/>
				</View>
			</View>

			<View style={[styles.overlayFab, { bottom: insets.bottom + 71 }]}>
				<PressableButton
					isLoading={false}
					onToggle={onToggle}
					showOverlay={true}
				/>
			</View>
		</Pressable>
	);
}

interface BottomSectionProps {
	value: string;
	setValue: Dispatch<SetStateAction<string>>;
	isLoading: boolean;
	onLogin: () => void;
	showOverlay: boolean;
	onToggleOverlay: () => void;
	isReturning: boolean;
}

function BottomSection({
	value,
	setValue,
	isLoading,
	onLogin,
	showOverlay,
	onToggleOverlay,
	isReturning,
}: BottomSectionProps) {
	return (
		<View style={styles.bottom}>
			<View style={styles.form}>
				<PhoneLoginInput type="phone" setValue={setValue} value={value} />

				<View style={styles.loginRow}>
					<Button
						className="flex-1"
						onPress={onLogin}
						disabled={isLoading}
						title={isLoading ? undefined : "Entra"}
					>
						{isLoading && <NequiSpinner />}
					</Button>

					<View style={showOverlay ? styles.hidden : undefined}>
						<PressableButton
							isLoading={isLoading}
							onToggle={onToggleOverlay}
							showOverlay={showOverlay}
						/>
					</View>
				</View>
			</View>

			{isReturning ? <LoginReturningFooter /> : <LoginFooter />}
		</View>
	);
}

interface PressableButtonProps {
	isLoading: boolean;
	onToggle: () => void;
	showOverlay: boolean;
}

function PressableButton({
	onToggle,
	isLoading,
	showOverlay,
}: PressableButtonProps) {
	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	const triggerAnimation = useCallback(() => {
		scale.value = withTiming(1.1, { duration: 120 }, () => {
			scale.value = withTiming(1, { duration: 120 });
		});
	}, [scale]);

	const handlePress = useCallback(() => {
		triggerAnimation();
		onToggle();
	}, [triggerAnimation, onToggle]);

	return (
		<AnimatedButton
			onPress={handlePress}
			disabled={isLoading}
			className="w-14"
			variant={showOverlay ? "secondary" : "primary"}
			style={animatedStyle}
			viewClassName={cn("size-12 p-2", isLoading && "opacity-50")}
			icon={
				showOverlay ? (
					<Ionicons name="close" size={28} color="black" />
				) : (
					<IcoMoney />
				)
			}
		/>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		width: "100%",
		paddingHorizontal: 16,
		justifyContent: "space-between",
	},
	screenKeyboard: {
		maxHeight: "74%",
	},
	header: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	headerSpacer: {
		flex: 1,
	},
	bottom: {
		width: "100%",
	},
	form: {
		width: "100%",
		gap: 16,
	},
	loginRow: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	hidden: {
		opacity: 0,
	},
	overlayRoot: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 10,
	},
	overlayBackdrop: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "#200020",
	},
	overlayActions: {
		position: "absolute",
		right: 16,
		gap: 20,
		alignItems: "flex-end",
	},
	overlayRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
	},
	overlayFab: {
		position: "absolute",
		right: 16,
	},
});
