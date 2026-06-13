/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./app/**/*.{js,ts,tsx}",
		"./components/**/*.{js,ts,tsx}",
		"./hooks/**/*.{js,ts,tsx}",
		"./screens/**/*.{js,ts,tsx}",
	],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				// uva
				uva: "#200020",
				"uva-button-pressed": "#130013",
				"uva-modal-background": "#200020e6",
				"uva-disabled": "#2b0d2b",

				/** Etiquetas secundarias home (favoritos / sugeridos) — como Nequi original */
				"home-label": "#6e6e6e",
				"home-section": "#525252",

				// orquídea
				orquidea: "#da0081",
				"orquidea-button-pressed": "#bc0b7d",
				"orquidea-title-bot": "#a9186e",
				"orquidea-alert-background": "#da0081d9",

				guanabana: "#ece7f5",
				"alert-banner": "#FF585F",
			},
		},
		fontFamily: {
			sans: ["ManropeRegular"],
			light: ["ManropeLight"],
			regular: ["ManropeRegular"],
			medium: ["ManropeMedium"],
			semibold: ["ManropeSemiBold"],
			bold: ["ManropeBold"],
			extrabold: ["ManropeExtraBold"],
		},
	},
	plugins: [],
};
