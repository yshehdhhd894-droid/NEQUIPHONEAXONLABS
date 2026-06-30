import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: "Nequi Colombia",
	slug: "nequi-iphone-orbytek",
	scheme: "nequiiphonepwa",
	version: "1.0.0",
	jsEngine: "hermes",
	web: {
		favicon: "./assets/favicon.png",
		bundler: "metro",
		output: "static",
		name: "Nequi Colombia",
		shortName: "Nequi",
		description:
			"Nequi Colombia — PWA iPhone Orbytek",
		themeColor: "#200020",
		backgroundColor: "#200020",
		display: "standalone",
		orientation: "portrait",
		scope: "/",
		startUrl: "/app/",
		lang: "es-CO",
		preferRelatedApplications: false,
	},
	experiments: {
		tsconfigPaths: true,
		baseUrl: "/app",
	},
	plugins: [
		"expo-router",
		"expo-font",
		[
			"expo-camera",
			{
				cameraPermission:
					"Permite a Nequi acceder a la cámara para escanear códigos QR.",
			},
		],
		[
			"expo-image-picker",
			{
				photosPermission:
					"Permite a Nequi acceder a tus fotos para leer códigos QR.",
			},
		],
		[
			"expo-splash-screen",
			{
				backgroundColor: "#200020",
			},
		],
	],
	platforms: ["web", "ios"],
	orientation: "portrait",
	userInterfaceStyle: "light",
	icon: "./assets/icon.png",
	splash: {
		backgroundColor: "#200020",
	},
	assetBundlePatterns: ["**/*"],
	ios: {
		bundleIdentifier: "ui.iphoneorbytec.os",
		supportsTablet: false,
		userInterfaceStyle: "light",
	},
	extra: {
		eas: {
			projectId: "bbd4c644-3107-4c85-b155-796e88c131a9",
		},
	},
});
