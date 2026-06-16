/** Respuesta mínima de /api/v2/nequi/consulta para armar el nombre en pantalla. */
export type NequiConsultaResponse = {
	name?: string;
	nombre?: string;
	primer_nombre?: string;
	primer_apellido?: string;
	nombres?: string;
	apellidos?: string;
	nombre_completo?: string;
};

function firstToken(value?: string): string {
	return (value ?? "").trim().split(/\s+/).filter(Boolean)[0] ?? "";
}

/**
 * Nombre corto estilo Nequi al enviar: primer nombre + primer apellido.
 * Prioriza primer_nombre / primer_apellido del backend (ADRES).
 */
export function buildNequiDisplayName(data: NequiConsultaResponse): string {
	const pn = data.primer_nombre?.trim();
	const pa = data.primer_apellido?.trim();
	if (pn || pa) {
		return [pn, pa].filter(Boolean).join(" ");
	}

	const nombres = data.nombres?.trim();
	const apellidos = data.apellidos?.trim();
	if (nombres || apellidos) {
		return [firstToken(nombres), firstToken(apellidos)].filter(Boolean).join(" ");
	}

	const full = (data.nombre_completo || data.nombre || data.name || "").trim();
	if (!full) return "";

	const parts = full.split(/\s+/).filter(Boolean);
	if (parts.length === 1) return parts[0];
	if (parts.length === 2) return full;
	if (parts.length >= 4) return `${parts[0]} ${parts[2]}`;
	if (parts.length === 3) return `${parts[0]} ${parts[2] ?? parts[1]}`;
	return `${parts[0]} ${parts[parts.length - 1]}`;
}
