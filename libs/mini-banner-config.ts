import type { ImageSourcePropType } from "react-native";

/** Colores del original `ColorBanner` en app-mini-banner. */
export type BannerColor = "uva" | "caribe" | "guanabana" | "dark";

/** Tipos del original: `filled` | `frame`. */
export type BannerType = "filled" | "frame";

export type MiniBannerItem = {
	id: string;
	title: string;
	description: string;
	linkText: string;
	image: ImageSourcePropType;
	bannerColor: BannerColor;
	typeBanner: BannerType;
};

/** Tarjetillas del home — mismas que Android / Nequi original. */
export const HOME_MINI_BANNERS: MiniBannerItem[] = [
	{
		id: "credits",
		title: "Créditos en Nequi",
		description: "Conoce las opciones que tenemos para ti",
		linkText: "Hazlo aquí",
		image: require("@/assets/mini-banner/credits.png"),
		bannerColor: "uva",
		typeBanner: "filled",
	},
	{
		id: "business",
		title: "App Nequi Negocios",
		description: "Cobra fácil, visualiza tus pagos y vende más",
		linkText: "Registrarme",
		image: require("@/assets/mini-banner/business.png"),
		bannerColor: "caribe",
		typeBanner: "filled",
	},
	{
		id: "foreign-currency",
		title: "Plata de otros países",
		description: "Rápido y seguro directo a tu Nequi",
		linkText: "Conocer más",
		image: require("@/assets/mini-banner/foreign-currency.png"),
		bannerColor: "guanabana",
		typeBanner: "filled",
	},
];

/** Gradientes de _nequi-colors.scss (descompilado). */
export const BANNER_GRADIENTS: Record<
	BannerColor,
	{ colors: [string, string]; start: { x: number; y: number }; end: { x: number; y: number } }
> = {
	uva: {
		colors: ["#81008a", "#200020"],
		start: { x: 0.05, y: 1 },
		end: { x: 0.95, y: 0 },
	},
	caribe: {
		colors: ["#9cc5fd", "#25569a"],
		start: { x: 0.05, y: 1 },
		end: { x: 0.95, y: 0 },
	},
	guanabana: {
		colors: ["#ece7f5", "#d0cadb"],
		start: { x: 0, y: 0.5 },
		end: { x: 1, y: 0.5 },
	},
	dark: {
		colors: ["#1a001a", "#912c91"],
		start: { x: 0.05, y: 1 },
		end: { x: 0.95, y: 0 },
	},
};

export const BANNER_BORDERS: Record<BannerColor, string> = {
	uva: "#e9e5e9",
	caribe: "#eff6ff",
	guanabana: "#ece7f5",
	dark: "#2b0d2b",
};
