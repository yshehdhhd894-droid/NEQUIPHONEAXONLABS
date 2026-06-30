import { queryClient } from "@/libs/api";

type TokenReader = () => string | null | undefined;

let readTokenFromStore: TokenReader | null = null;

/** Enlaza el store de auth para leer el JWT si React Query aún no lo tiene. */
export function bindAuthTokenStore(reader: TokenReader): void {
	readTokenFromStore = reader;
}

export function getAuthToken(): string | null {
	const cached = queryClient.getQueryData<string>(["token"]);
	if (typeof cached === "string" && cached.trim()) {
		return cached.trim();
	}

	const fromStore = readTokenFromStore?.();
	if (typeof fromStore === "string" && fromStore.trim()) {
		const token = fromStore.trim();
		queryClient.setQueryData(["token"], token);
		return token;
	}

	return null;
}

export function syncAuthToken(token: string | null | undefined): void {
	if (token?.trim()) {
		queryClient.setQueryData(["token"], token.trim());
		return;
	}
	queryClient.removeQueries({ queryKey: ["token"] });
}
