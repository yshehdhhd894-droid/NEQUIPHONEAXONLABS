interface TransferBaseInput {
	name: string;
	phone: string;
	amount: number;
	date?: number;
	message?: string;
}

interface TransferP2PInput extends Omit<TransferBaseInput, "phone"> {
	type: "transfer.p2p";
}

interface TransferBREBInput extends Omit<TransferBaseInput, "phone"> {
	type: "transfer.breb";
	bank: string;
	phone: string;
}

interface TransferBankInput extends TransferBaseInput {
	type: "transfer.bank";
	accountType: "ahorro" | "corriente";
}

interface TransferSimpleInput extends TransferBaseInput {
	type: "transfer";
}

export type TransferInput =
	| TransferP2PInput
	| TransferBankInput
	| TransferBREBInput
	| TransferSimpleInput;
