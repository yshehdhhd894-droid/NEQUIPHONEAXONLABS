import * as LocalAuthentication from "expo-local-authentication";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomInset } from "@/hooks/useBottomInset";
import Text from "@/components/basic/text";
import { Arrow, Fingerprint, PinBackspace } from "@/components/logos";
import { useAuthStore } from "@/hooks/useAuth";
import { useLoadingPromise } from "@/hooks/useLoading";
import { useLoginNavigationBar } from "@/hooks/useLoginNavigationBar";
import {
	CONNECTION_ERROR_MESSAGE,
	isConnectionError,
	showAppAlert,
} from "@/libs/app-alert";
import { useAppStore } from "@/store/useAppStore";

const keypad = [
	["1", "2", "3"],
	["4", "5", "6"],
	["7", "8", "9"],
	["$", "0", "backspace"],
] as const;

type KeypadKey = (typeof keypad)[number][number];
const MAX_PIN_ATTEMPTS = 4;

export default function Pin() {
	useLoginNavigationBar();
	const { top } = useSafeAreaInsets();
	const bottomPad = useBottomInset(20);
	const [currentPin, setCurrentPin] = useState<string[]>([]);
	const [attemptsLeft, setAttemptsLeft] = useState(MAX_PIN_ATTEMPTS);
	const { phone } = useLocalSearchParams<{ phone: string }>();

	const { withLoading } = useLoadingPromise();

	const { user, login, isLoading, getSavedCredentials, clearError } =
		useAuthStore();
	const markEverLoggedIn = useAppStore((s) => s.markEverLoggedIn);
	const hasEverLoggedIn = useAppStore((s) => s.hasEverLoggedIn);
	const biometricLogin = user?.biometricLogin ?? false;

	const goBackToLogin = () => {
		router.replace(hasEverLoggedIn ? "/login-logueado" : "/login");
	};

	const showWrongPinAlert = (remaining: number) => {
		if (remaining > 0) {
			showAppAlert(
				`¡Ups! Esa no es tu clave, tranqui, tienes ${remaining} intentos más.`,
			);
			return;
		}

		showAppAlert(
			"¡Ups! Se agotaron tus intentos, vuelve a intentar más tarde.",
		);
	};

	useEffect(() => {
		if (biometricLogin) {
			handleLoginByBiometrics();
		}

		return () => {
			setCurrentPin([]);
		};
	}, [biometricLogin]);

	const handleKeyPress = async (key: KeypadKey) => {
		clearError();

		if (key === "backspace") {
			if (currentPin.length > 0) {
				setCurrentPin((prev) => prev.slice(0, -1));
			}
			return;
		}

		if (key === "$" && biometricLogin) {
			return handleLoginByBiometrics();
		}

		if (key === "$") {
			return;
		}

		if (Number.isNaN(Number(key))) {
			return;
		}

		if (currentPin.length >= 4) return;

		const newPin = [...currentPin, key];
		setCurrentPin(newPin);

		if (newPin.length === 4) {
			await handlePinLogin(newPin.join(""));
		}
	};

	const handlePinLogin = async (pin: string) => {
		try {
			const result = await withLoading(login(phone, pin), 3000);

			if (result.success) {
				markEverLoggedIn();
				setCurrentPin([]);
				setAttemptsLeft(MAX_PIN_ATTEMPTS);
				router.replace("/home");
				return;
			}

			setCurrentPin([]);
			const message = result.error || "PIN incorrecto. Intenta nuevamente.";

			if (isConnectionError(message)) {
				showAppAlert(CONNECTION_ERROR_MESSAGE);
				return;
			}

			if (message.toLowerCase().includes("pin incorrecto")) {
				const remaining = attemptsLeft - 1;
				setAttemptsLeft(remaining);
				showWrongPinAlert(remaining);
				return;
			}

			showAppAlert(message);
		} catch (_) {
			setCurrentPin([]);
			showAppAlert(CONNECTION_ERROR_MESSAGE);
		}
	};

	const handleLoginByBiometrics = async () => {
		if (!biometricLogin) return;

		const credentials = await getSavedCredentials();
		if (!credentials) return;

		try {
			const result = await LocalAuthentication.authenticateAsync({
				biometricsSecurityLevel: "strong",
				promptMessage: "Autenticación de Huellas",
				promptSubtitle: "Confirma la huella digital para continuar",
			});

			if (!result.success) {
				return;
			}

			const loginResult = await withLoading(
				login(credentials.phone, credentials.pin),
				3000,
			);

			if (loginResult.success) {
				markEverLoggedIn();
				router.replace("/home");
				return;
			}

			const message = loginResult.error || "";
			showAppAlert(
				isConnectionError(message)
					? CONNECTION_ERROR_MESSAGE
					: "Error al iniciar sesión con biométricos, prueba ingresando el PIN manualmente",
			);
		} catch (error) {
			console.error("Error biometric login:", error);
			showAppAlert("Error al autenticar con biométricos");
		}
	};

	return (
		<View
			className="flex-1 justify-between bg-uva"
			style={{ paddingTop: top, paddingBottom: bottomPad }}
		>
			<View className="w-full px-4 pt-2">
				<Pressable
					onPress={goBackToLogin}
					className="size-8 justify-center"
				>
					<Arrow />
				</Pressable>

				<Text fontWeight="semibold" className="text-[26px] px-2 pt-3 text-white">
					Escribe tu clave
				</Text>

				<View className="pt-10 pb-6 flex-row justify-center gap-4">
					{Array.from({ length: 4 }).map((_, index) => (
						<View
							key={index}
							className="bg-[#ebe7f5] size-12 rounded-[4px] items-center justify-center"
						>
							{currentPin[index] ? (
								<Text
									fontWeight="bold"
									style={{ color: "#da0081", fontSize: 36 }}
								>
									*
								</Text>
							) : null}
						</View>
					))}
				</View>

				<View className="w-full items-center px-6">
					<Text className="text-center text-[14px] text-white leading-5">
						No dudamos que seas tú...{"\n"}Pero es mejor confirmar ;)
					</Text>
				</View>
			</View>

			<View className="w-full items-center">
				<View className="pb-8">
					{keypad.map((row, rowIndex) => (
						<View key={rowIndex} className="flex-row gap-[52px] mt-2.5">
							{row.map((key) => (
								<KeypadButton
									key={key}
									keyValue={key}
									biometricLogin={biometricLogin}
									disabled={isLoading}
									onPress={() => handleKeyPress(key)}
								/>
							))}
						</View>
					))}
				</View>

				<Pressable
					disabled={isLoading}
					className="self-center rounded-[4px] border border-white px-4 py-3 active:bg-white"
				>
					{({ pressed }) => (
						<Text
							numberOfLines={1}
							fontWeight="medium"
							className="text-[14px]"
							style={{ color: pressed ? "#200020" : "#FFFFFF" }}
						>
							Olvidé mi clave
						</Text>
					)}
				</Pressable>
			</View>
		</View>
	);
}

function KeypadButton({
	keyValue,
	biometricLogin,
	disabled,
	onPress,
}: {
	keyValue: KeypadKey;
	biometricLogin: boolean;
	disabled: boolean;
	onPress: () => void;
}) {
	if (keyValue === "backspace") {
		return (
			<Pressable
				onPress={onPress}
				disabled={disabled}
				className="h-[50px] w-[50px] items-center justify-center rounded-[4px] active:bg-[#4d334d]"
			>
				<PinBackspace size={28} xColor="#200020" />
			</Pressable>
		);
	}

	if (keyValue === "$") {
		return (
			<Pressable
				onPress={onPress}
				disabled={disabled}
				className="h-[50px] w-[50px] items-center justify-center rounded-[4px] active:bg-[#4d334d]"
			>
				<View className="h-7 w-7">
					{biometricLogin ? <Fingerprint className="h-7 w-7" /> : null}
				</View>
			</Pressable>
		);
	}

	return (
		<Pressable
			onPress={onPress}
			disabled={disabled}
			className="h-[50px] w-[50px] items-center justify-center rounded-[4px] active:bg-[#4d334d]"
		>
			<Text className="text-[35px] font-medium text-white">{keyValue}</Text>
		</Pressable>
	);
}
