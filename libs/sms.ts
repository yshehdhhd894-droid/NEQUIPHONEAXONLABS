import * as SMS from "expo-sms";

interface EnviarSMSParams {
	numero?: string;
	monto: string | number;
	nombre: string;
}

export async function enviarComprobanteSMS({
	numero,
	monto,
	nombre,
}: EnviarSMSParams) {
	const disponible = await SMS.isAvailableAsync();

	if (!disponible) return;

	const fecha = new Date().toLocaleString("es-CO", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

	const mensaje =
		`💜 Transferencia Nequi\n\n` +
		`Monto: $${Number(monto).toLocaleString("es-CO")}\n` +
		`Enviado por: ${nombre}\n` +
		`Fecha: ${fecha}\n\n` +
		`Descarga Nequi y recibe tu plata al instante.`;

	await SMS.sendSMSAsync(numero ? [numero] : [], mensaje);
}
