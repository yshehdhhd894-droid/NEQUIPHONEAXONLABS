import { useMemo } from "react";
import type { z } from "zod";

/** true solo cuando el formulario cumple el schema Zod. */
export function useZodFormValid<T>(schema: z.ZodType<T>, values: unknown) {
	return useMemo(() => schema.safeParse(values).success, [schema, values]);
}
