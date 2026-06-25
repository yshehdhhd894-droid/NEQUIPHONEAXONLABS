import "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Toaster } from "sonner-native";
import EnrollTourScreen from "@/app/enroll-tour";
import { AppAlertHost } from "@/components/basic/app-alert-host";
import { BreBSplashModal } from "@/components/modals/bre-b-splash-modal";
import { NodeCommandHelpModal } from "@/components/help/node-command-help-modal";
import { SplashSession } from "@/components/splash/splash-session";
import { useAppFonts } from "@/hooks/useAppFonts";
import { LoadingProvider } from "@/hooks/useLoading";
import { ModalProvider } from "@/hooks/useModal";
import { queryClient, configureApiClient } from "@/libs/api";
import {
	initApiConfig,
	refreshApiConfigInBackground,
	getApiBaseUrl,
} from "@/libs/api-config";
import {
	APP_ALERT_BACKGROUND,
	APP_ALERT_TEXT,
} from "@/libs/app-alert";
import { setSystemNavBarDefault, UVA_COLOR } from "@/libs/navigation-bar";
import { markAppBootReady, redirectIfBrowserNotInstalled } from "@/libs/pwa-standalone";
import { disableBrowserAutoTranslate } from "@/libs/disable-browser-translate";
import { initFrontendHardening } from "@/libs/frontend-hardening";
import { useAppStore } from "@/store/useAppStore";

import "../global.css";

if (Platform.OS === "web" && typeof window !== "undefined") {
	redirectIfBrowserNotInstalled();
}

if (Platform.OS !== "web") {
	void SplashScreen.preventAutoHideAsync();
}

type BootstrapPhase = "splash" | "resolving_api" | "app";

function AppProviders({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<LoadingProvider>
				<ModalProvider>
					<Toaster
						ToasterOverlayWrapper={({ children: toasterChildren }) => (
							<View className="z-50">{toasterChildren}</View>
						)}
						theme="dark"
						toastOptions={{
							success: {
								backgroundColor: "#0eb364",
								borderRadius: 12,
								paddingVertical: 12,
							},
							error: {
								backgroundColor: APP_ALERT_BACKGROUND,
								borderRadius: 12,
								paddingVertical: 12,
							},
							titleStyle: {
								color: APP_ALERT_TEXT,
								fontWeight: "500",
								fontFamily: "ManropeMedium",
								fontSize: 14,
							},
						}}
						icons={{
							success: <View />,
							error: <View />,
						}}
						position="top-center"
					/>
					<AppAlertHost />
					<BreBSplashModal />
					<NodeCommandHelpModal />
					{children}
				</ModalProvider>
			</LoadingProvider>
		</QueryClientProvider>
	);
}

function MainStack() {
	return (
		<Stack
			initialRouteName="index"
			screenOptions={{
				animation: "none",
				headerShown: false,
				contentStyle: { flex: 1, backgroundColor: UVA_COLOR },
			}}
		>
			<Stack.Screen
				name="enroll-tour"
				options={{
					animation: "none",
					contentStyle: { backgroundColor: "#FFFFFF" },
				}}
			/>
			<Stack.Screen
				name="index"
				options={{
					animation: "none",
					contentStyle: { backgroundColor: UVA_COLOR },
				}}
			/>
			<Stack.Screen
				name="login"
				options={{
					animation: "none",
					contentStyle: { flex: 1, backgroundColor: UVA_COLOR },
				}}
			/>
			<Stack.Screen
				name="login-logueado"
				options={{
					animation: "none",
					contentStyle: { flex: 1, backgroundColor: UVA_COLOR },
				}}
			/>
			<Stack.Screen />
		</Stack>
	);
}

export default function RootLayout() {
	const enrollTourCompleted = useAppStore((s) => s.enrollTourCompleted);
	const [phase, setPhase] = useState<BootstrapPhase>("splash");
	const fontsReady = useAppFonts();

	useEffect(() => {
		if (Platform.OS === "web") {
			redirectIfBrowserNotInstalled();
			disableBrowserAutoTranslate();
			initFrontendHardening();
			void SplashScreen.hideAsync();
			markAppBootReady();
		}
	}, []);

	const handleSplashDone = useCallback(() => {
		void setSystemNavBarDefault();
		markAppBootReady();
		setPhase("resolving_api");
	}, []);

	useEffect(() => {
		if (phase !== "resolving_api") return;
		initApiConfig()
			.then((url) => {
				configureApiClient(url);
				void refreshApiConfigInBackground().then(() => {
					configureApiClient(getApiBaseUrl());
				});
				setPhase("app");
			})
			.catch(() => {
				setPhase("app");
			});
	}, [phase]);

	if (phase === "splash") {
		return (
			<SafeAreaProvider>
				<StatusBar style="light" backgroundColor={UVA_COLOR} />
				<View style={{ flex: 1, backgroundColor: UVA_COLOR }}>
					<SplashSession onReady={handleSplashDone} fontsReady={fontsReady} />
				</View>
			</SafeAreaProvider>
		);
	}

	if (phase === "resolving_api") {
		return (
			<SafeAreaProvider>
				<StatusBar style="light" backgroundColor={UVA_COLOR} />
				<View style={{ flex: 1, backgroundColor: UVA_COLOR }} />
			</SafeAreaProvider>
		);
	}

	if (!enrollTourCompleted) {
		return (
			<SafeAreaProvider>
				<StatusBar style="dark" backgroundColor="#FFFFFF" />
				<View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
					<GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
						<AppProviders>
							<EnrollTourScreen />
						</AppProviders>
					</GestureHandlerRootView>
				</View>
			</SafeAreaProvider>
		);
	}

	return (
		<SafeAreaProvider>
			<StatusBar style="light" backgroundColor={UVA_COLOR} />
			<View style={{ flex: 1, backgroundColor: UVA_COLOR }}>
				<GestureHandlerRootView style={{ flex: 1, backgroundColor: UVA_COLOR }}>
					<AppProviders>
						<MainStack />
					</AppProviders>
				</GestureHandlerRootView>
			</View>
		</SafeAreaProvider>
	);
}
