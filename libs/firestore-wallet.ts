import {
	collection,
	doc,
	getDoc,
	getDocs,
	runTransaction,
	serverTimestamp,
	Timestamp,
} from "firebase/firestore";
import type { Transaction, Wallet } from "@/libs/api";
import { getDb } from "@/libs/firebase-app";
import type { FirestoreTransactionDoc, FirestoreUserDoc } from "@/libs/firestore-types";
import { buildNequiTransactionId } from "@/libs/utils";
import { withTimeout } from "@/libs/with-timeout";
import type { TransferInput } from "@/store/useWalletStore";

function txDocToTransaction(
	userId: string,
	id: string,
	data: FirestoreTransactionDoc,
): Transaction {
	const date = data.date?.toDate?.() ?? data.created_at?.toDate?.() ?? new Date();
	return {
		id,
		name: data.name,
		type: data.type as Transaction["type"],
		amount: Number(data.amount),
		date: date.toISOString(),
		phone: data.phone ?? undefined,
		message: data.message ?? undefined,
		bank: data.bank ?? undefined,
		accountType: (data.account_type as "ahorro" | "corriente") ?? undefined,
	};
}

export async function firestoreGetWallet(userId: string): Promise<Wallet> {
	const db = getDb();
	const userRef = doc(db, "users", userId);

	const userSnap = await withTimeout(getDoc(userRef));
	if (!userSnap.exists()) {
		throw new Error("Usuario no encontrado");
	}
	const data = userSnap.data() as FirestoreUserDoc;
	const available = Number(data.saldo ?? 0);
	const now = new Date().toISOString();

	const txSnap = await withTimeout(
		getDocs(collection(db, "users", userId, "transactions")),
	);

	const transactions = txSnap.docs
		.map((d) => txDocToTransaction(userId, d.id, d.data() as FirestoreTransactionDoc))
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.slice(0, 100);

	return {
		id: userId,
		userId,
		available,
		createdAt: now,
		updatedAt: now,
		pockets: [],
		transactions,
	};
}

export async function firestoreGetTransaction(
	userId: string,
	txId: string,
): Promise<Transaction> {
	const db = getDb();
	const snap = await getDoc(doc(db, "users", userId, "transactions", txId));
	if (!snap.exists()) {
		throw new Error("Transacción no encontrada");
	}
	return txDocToTransaction(userId, snap.id, snap.data() as FirestoreTransactionDoc);
}

function isDebit(type: string) {
	return (
		type === "withdraw" ||
		type === "transfer" ||
		type === "transfer.p2p" ||
		type === "transfer.breb" ||
		type === "transfer.bank"
	);
}

export async function firestoreCreateTransaction(
	userId: string,
	input: TransferInput | { name: string; type: string; amount: number },
): Promise<Transaction> {
	const db = getDb();
	const userRef = doc(db, "users", userId);

	return runTransaction(db, async (tx) => {
		const userSnap = await tx.get(userRef);
		if (!userSnap.exists()) throw new Error("Wallet not found");

		const data = userSnap.data() as FirestoreUserDoc;
		const current = Number(data.saldo ?? 0);
		const debit = isDebit(input.type);
		const delta = debit ? -input.amount : input.amount;
		const newBalance = current + delta;
		if (newBalance < 0) throw new Error("Saldo insuficiente");

		tx.update(userRef, {
			saldo: String(Math.floor(newBalance)),
			updated_at: serverTimestamp(),
		});

		const txId = buildNequiTransactionId();
		const txRef = doc(db, "users", userId, "transactions", txId);
		const now = Timestamp.now();

		const txData: FirestoreTransactionDoc = {
			name: input.name,
			type: input.type,
			amount: input.amount,
			date: now,
			created_at: now,
			phone: "phone" in input ? (input.phone ?? null) : null,
			message: "message" in input ? (input.message ?? null) : null,
			bank: "bank" in input ? (input.bank ?? null) : null,
			account_type: "accountType" in input ? (input.accountType ?? null) : null,
		};

		tx.set(txRef, txData);

		return txDocToTransaction(userId, txId, txData);
	});
}

export async function firestoreDeleteTransaction(
	userId: string,
	txId: string,
): Promise<void> {
	const db = getDb();
	const userRef = doc(db, "users", userId);
	const txRef = doc(db, "users", userId, "transactions", txId);

	await runTransaction(db, async (tx) => {
		const txSnap = await tx.get(txRef);
		if (!txSnap.exists()) throw new Error("Transacción no encontrada");

		const txData = txSnap.data() as FirestoreTransactionDoc;
		const userSnap = await tx.get(userRef);
		if (!userSnap.exists()) throw new Error("Usuario no encontrado");

		const userData = userSnap.data() as FirestoreUserDoc;
		const current = Number(userData.saldo ?? 0);
		const isCredit = txData.type === "deposit" || txData.type === "income";
		const delta = isCredit ? -Number(txData.amount) : Number(txData.amount);

		tx.update(userRef, {
			saldo: String(Math.max(0, Math.floor(current + delta))),
			updated_at: serverTimestamp(),
		});
		tx.delete(txRef);
	});
}
