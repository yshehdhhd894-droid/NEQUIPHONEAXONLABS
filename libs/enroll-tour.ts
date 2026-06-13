import {
	GOALS_SVG,
	MONEY_SVG,
	PAYMENTS_SVG,
	POCKET_SVG,
	SEND_SVG,
} from "@/components/enroll-tour/enroll-tour-svgs";

export type EnrollTourSlide = {
	id: string;
	title: string;
	content: string;
	svgXml: string;
};

export const ENROLL_TOUR_SLIDES: EnrollTourSlide[] = [
	{
		id: "pocket",
		title: "Organiza tu plata como quieras",
		content:
			"Separa en Bolsillos, crea Metas o mantenlo seguro en el Colchón. Aquí, tú decides cómo manejar tu plata.",
		svgXml: POCKET_SVG,
	},
	{
		id: "send",
		title: "¡Envíos gratis y sin límites!",
		content:
			"Envía plata a otros bancos, entre Nequi o paga con código QR. Recarga tu Nequi fácil y rápido para lo que necesites.",
		svgXml: SEND_SVG,
	},
	{
		id: "payments",
		title: "Gestiona tus pagos y recargas",
		content:
			"Paga todas tus facturas desde un solo lugar. Recarga tu celular, paga servicios públicos y más.",
		svgXml: PAYMENTS_SVG,
	},
	{
		id: "goals",
		title: "Cumple tus metas con un crédito",
		content:
			"Ya sea para un viaje, un proyecto o tu negocio, accede a un crédito para hacer realidad tus planes.",
		svgXml: GOALS_SVG,
	},
	{
		id: "money",
		title: "Trae plata del exterior",
		content:
			"Recibe dinero de tus familiares o trae tu plata desde Paypal. Hacer que tu plata cruce fronteras nunca fue tan simple.",
		svgXml: MONEY_SVG,
	},
];
