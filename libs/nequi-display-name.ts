/** Respuesta mínima de /api/v2/nequi/consulta para armar el nombre en pantalla. */
export type NequiConsultaResponse = {
	name?: string;
	primer_nombre?: string;
	primer_apellido?: string;
	nombres?: string;
	apellidos?: string;
	nombre_completo?: string;
};

/**
 * Nombre corto estilo Nequi al enviar: primer nombre + primer apellido.
 * Prioriza campos explícitos del backend; si faltan, deduce del nombre completo.
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
		const firstNombre = nombres?.split(/\s+/).filter(Boolean)[0] ?? "";
		const firstApellido = apellidos?.split(/\s+/).filter(Boolean)[0] ?? "";
		return [firstNombre, firstApellido].filter(Boolean).join(" ");
	}

	const full = (data.nombre_completo || data.name || "").trim();
	if (!full) return "";

	const parts = full.split(/\s+/).filter(Boolean);
	if (parts.length <= 2) return full;

	const mid = Math.ceil(parts.length / 2);
	return `${parts[0]} ${parts[mid]}`;
}
