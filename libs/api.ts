import { QueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono/client";
import { hc } from "hono/client";
import { getApiBaseUrl } from "./api-config";
import { fetchWithTimeout } from "./fetch-timeout";
import { API_URL_FALLBACK } from "./constants";
import type { ApiRoutes } from "./types";

export const queryClient = new QueryClient();

function createHonoClient(baseUrl: string) {
	return hc<ApiRoutes>(baseUrl, {
		fetch: (input, init) => fetchWithTimeout(input, init, 15_000),
		headers: () => ({
			"Content-Type": "application/json",
			Authorization: queryClient.getQueryData(["token"])
				? `Bearer ${queryClient.getQueryData(["token"])}`
				: "",
		}),
	});
}

const typeRef = hc<ApiRoutes>(API_URL_FALLBACK);
type ApiV2 = typeof typeRef.api.v2;

let liveClient = createHonoClient(API_URL_FALLBACK);

export function configureApiClient(baseUrl: string): void {
	const normalized = baseUrl.replace(/\/$/, "");
	liveClient = createHonoClient(normalized);
}

export const api: ApiV2 = new Proxy({} as ApiV2, {
	get(_target, prop) {
		return liveClient.api.v2[prop as keyof ApiV2];
	},
});

export function typeFetcher<T extends (...args: any[]) => any>(fn: T) {
	return async (arg: InferRequestType<T>) => {
		const res = await fn(arg);
		return (await res.json()) as InferResponseType<T>;
	};
}

export type Wallet = InferResponseType<typeof api.wallet.$get, 200>["wallet"];
export type User = InferResponseType<typeof api.user.profile.$get, 200>["user"];

export type Transaction = InferResponseType<
	(typeof api.wallet.transaction)[":id"]["$get"],
	200
>["transaction"];

export type TransactionType = Transaction["type"];

export const transactionString: Record<TransactionType, string> = {
	deposit: "Recarga en",
	withdraw: "Retiro en",
	income: "De",
	transfer: "Para",
	"transfer.bank": "Envio a Bancolombia",
	"transfer.p2p": "Pago en",
	"transfer.breb": "ENVÍO BRE-B",
};
