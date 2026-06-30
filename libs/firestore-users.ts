import {
	collection,
	doc,
	getDoc,
	getDocs,
	limit,
	query,
	serverTimestamp,
	updateDoc,
	where,
} from "firebase/firestore";
import type { User } from "@/libs/api";
import { getDb } from "@/libs/firebase-app";
import type { FirestoreUserDoc } from "@/libs/firestore-types";
import { withTimeout } from "@/libs/with-timeout";

const USERS = "users";

function normalizePhone(raw: string): string {
	const digits = String(raw ?? "").replace(/\D/g, "");
	if (digits.length === 12 && digits.startsWith("57")) return digits.slice(2);
	if (digits.length > 10) return digits.slice(-10);
	return digits;
}

function docToUser(uid: string, data: FirestoreUserDoc): User {
	const name = data.name ?? data.nombre ?? "";
	const created = data.created_at?.toDate?.() ?? new Date();
	const updated = data.updated_at?.toDate?.() ?? created;
	const premiumUntil = data.premium_until?.toDate?.() ?? null;

	return {
		id: uid,
		name,
		phone: data.telefono,
		fingerprint: data.fingerprint ?? null,
		accountType: data.account_type ?? "low",
		biometricLogin: data.biometric_login ?? false,
		premium: data.premium ?? false,
		premiumUntil: premiumUntil?.toISOString() ?? null,
		createdAt: created.toISOString(),
		updatedAt: updated.toISOString(),
		premiumNamesFree: false,
		pin: "****",
	};
}

export async function firestorePhoneExists(phone: string): Promise<boolean> {
	const normalized = normalizePhone(phone);
	if (!normalized) return false;

	const db = getDb();
	const snap = await withTimeout(
		getDocs(
			query(
				collection(db, USERS),
				where("telefono", "==", normalized),
				limit(1),
			),
		),
	);

	return !snap.empty;
}

export type FirestoreLoginResult = {
	userId: string;
	user: User;
};

export async function firestoreLoginWithPhonePin(
	phone: string,
	pin: string,
): Promise<FirestoreLoginResult> {
	const normalized = normalizePhone(phone);
	if (!normalized || !pin) {
		throw new Error("Datos incompletos");
	}

	const db = getDb();
	const snap = await withTimeout(
		getDocs(
			query(
				collection(db, USERS),
				where("telefono", "==", normalized),
				limit(1),
			),
		),
	);

	if (snap.empty) {
		throw new Error("Usuario no encontrado");
	}

	const userDoc = snap.docs[0]!;
	const data = userDoc.data() as FirestoreUserDoc;

	if (data.banned) {
		throw new Error("Cuenta suspendida");
	}
	if (!data.Active) {
		throw new Error("Cuenta inactiva. Contacta al administrador.");
	}
	if (data.pin !== pin) {
		throw new Error("PIN incorrecto");
	}

	const user = docToUser(userDoc.id, data);
	return { userId: userDoc.id, user };
}

export async function firestoreGetUserProfile(userId: string): Promise<User> {
	const db = getDb();
	const snap = await withTimeout(getDoc(doc(db, USERS, userId)));
	if (!snap.exists()) {
		throw new Error("Usuario no encontrado");
	}
	return docToUser(snap.id, snap.data() as FirestoreUserDoc);
}

export async function firestoreUpdateUserName(
	userId: string,
	name: string,
): Promise<void> {
	const db = getDb();
	await updateDoc(doc(db, USERS, userId), {
		name,
		nombre: name,
		updated_at: serverTimestamp(),
	});
}

export async function firestoreUpdateUserPin(
	userId: string,
	newPin: string,
	currentPin: string,
): Promise<void> {
	const db = getDb();
	const snap = await withTimeout(getDoc(doc(db, USERS, userId)));
	if (!snap.exists()) throw new Error("Usuario no encontrado");
	const data = snap.data() as FirestoreUserDoc;
	if (data.pin !== currentPin) {
		throw new Error("PIN actual incorrecto");
	}
	await updateDoc(doc(db, USERS, userId), {
		pin: newPin,
		updated_at: serverTimestamp(),
	});
}

export async function firestoreUpdateBiometric(
	userId: string,
	enabled: boolean,
): Promise<void> {
	const db = getDb();
	await updateDoc(doc(db, USERS, userId), {
		biometric_login: enabled,
		updated_at: serverTimestamp(),
	});
}

export async function firestoreUpdateAccountType(
	userId: string,
	accountType: "low" | "savings",
): Promise<void> {
	const db = getDb();
	await updateDoc(doc(db, USERS, userId), {
		account_type: accountType,
		updated_at: serverTimestamp(),
	});
}
