import { Platform, StyleSheet } from "react-native";

const nativeShadow = {
	shadowColor: "#200020",
	shadowOffset: { width: 0, height: 4 },
	shadowOpacity: 0.12,
	shadowRadius: 10,
	elevation: 4,
} as const;

const webShadow =
	Platform.OS === "web"
		? ({ boxShadow: "0 4px 10px rgba(32, 0, 32, 0.12)" } as const)
		: {};

/** Sombra Nequi para tarjetas (settings, bottom sheets, listas). */
export const nequiCardShadow = {
	...nativeShadow,
	...webShadow,
} as const;

/** Sombra del footer (tabs): marca la barra sin halo oscuro excesivo. */
export const footerTabShadow = {
	shadowColor: "#200020",
	shadowOffset: { width: 0, height: -3 },
	shadowOpacity: 0.11,
	shadowRadius: 12,
	elevation: 5,
	...(Platform.OS === "web"
		? ({
				boxShadow:
					"0 -3px 10px rgba(32, 0, 32, 0.1), 0 0 1.75rem rgba(32, 0, 32, 0.09)",
			} as const)
		: {}),
} as const;

/** Separación suave entre contenido y zona del footer. */
export const footerAreaTopShadow = {
	...(Platform.OS === "web"
		? ({
				boxShadow: "0 -6px 16px rgba(32, 0, 32, 0.07)",
			} as const)
		: {
				shadowColor: "#200020",
				shadowOffset: { width: 0, height: -4 },
				shadowOpacity: 0.07,
				shadowRadius: 10,
				elevation: 3,
			}),
} as const;

/** Sombra original de filas en Movimientos (tailwind shadow-uva + spread -15px). */
export const movementItemShadow = {
	shadowColor: "#200020",
	shadowOffset: { width: 0, height: 5 },
	shadowOpacity: 0.18,
	shadowRadius: 5,
	elevation: 3,
	...(Platform.OS === "web"
		? ({ boxShadow: "0 5px 5px -15px rgba(32, 0, 32, 0.18)" } as const)
		: {}),
} as const;

export const disponibleCardStyle = StyleSheet.create({
	card: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderRadius: 4,
		backgroundColor: "#FFFFFF",
		paddingVertical: 12,
		paddingLeft: 16,
		paddingRight: 20,
		marginTop: 24,
		...nativeShadow,
		...webShadow,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
	},
});
