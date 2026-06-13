import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";

export const UVA_COLOR = "#200020";

async function applyNavBar(backgroundColor: string, buttonStyle: "light" | "dark") {
	if (Platform.OS !== "android") return;
	await NavigationBar.setBackgroundColorAsync(backgroundColor);
	await NavigationBar.setButtonStyleAsync(buttonStyle);
	await NavigationBar.setBorderColorAsync(backgroundColor);
}

/** Fase morada del splash y login — barra e iconos morados/claros. */
export async function setSystemNavBarPurple() {
	await applyNavBar(UVA_COLOR, "light");
}

/** Alias login. */
export const setSystemNavBarLogin = setSystemNavBarPurple;

/** Animación Lottie sobre blanco — barra del sistema negra, iconos claros. */
export async function setSystemNavBarBlack() {
	await applyNavBar("#000000", "light");
}

/** @deprecated Usar setSystemNavBarBlack en splash Lottie. */
export const setSystemNavBarDarkButtons = setSystemNavBarBlack;

/** Home y pantallas con fondo blanco. */
export async function setSystemNavBarDefault() {
	await applyNavBar("#FFFFFF", "dark");
}
