import { z } from "zod";

/** Cel colombiano Nequi: 10 dígitos empezando por 3. */
export const sendPhoneField = z
	.string()
	.regex(/^3\d{9}$/, "Número de celular inválido");

/** Monto con al menos un dígito y mayor a 0. */
export const sendAmountField = z.string().refine(
	(value) => {
		const digits = value.replace(/\D/g, "");
		return digits.length > 0 && parseInt(digits, 10) > 0;
	},
	{ message: "Monto inválido" },
);

/** Mensaje opcional; vacío no bloquea el envío. */
export const sendOptionalMessageField = z.preprocess(
	(value) =>
		typeof value === "string" && value.trim() === "" ? undefined : value,
	z.string().min(3).trim().optional(),
);

export function parseSendAmount(value: string) {
	return parseInt(value.replace(/\D/g, "") || "0", 10);
}
