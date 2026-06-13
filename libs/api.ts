import { QueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono/client";
import { hc } from "hono/client";
import { getApiUrl } from "./constants";
import type { ApiRoutes } from "./types";

export const queryClient = new QueryClient();

const client = hc<ApiRoutes>(getApiUrl(), {
	headers: () => ({
		"Content-Type": "application/json",
		Authorization: queryClient.getQueryData(["token"])
			? `Bearer ${queryClient.getQueryData(["token"])}`
			: "",
	}),
});

export const api = client.api.v2;

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
