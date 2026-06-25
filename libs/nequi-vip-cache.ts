import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@nequi_vip_name_cache";
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

type CacheStore = Record<string, { name: string; ts: number }>;

let memory: CacheStore | null = null;

async function loadStore(): Promise<CacheStore> {
	if (memory) return memory;
	try {
		const raw = await AsyncStorage.getItem(STORAGE_KEY);
		memory = raw ? (JSON.parse(raw) as CacheStore) : {};
	} catch {
		memory = {};
	}
	return memory;
}

async function persistStore(store: CacheStore): Promise<void> {
	memory = store;
	try {
		await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store));
	} catch {
		/* ignore */
	}
}

export async function getCachedVipName(phone: string): Promise<string | null> {
	const clean = phone.replace(/\D/g, "");
	if (clean.length !== 10) return null;
	const store = await loadStore();
	const hit = store[clean];
	if (!hit?.name) return null;
	if (Date.now() - hit.ts > TTL_MS) {
		delete store[clean];
		void persistStore(store);
		return null;
	}
	return hit.name;
}

export async function setCachedVipName(phone: string, name: string): Promise<void> {
	const clean = phone.replace(/\D/g, "");
	const trimmed = name.trim();
	if (clean.length !== 10 || !trimmed) return;
	const store = await loadStore();
	store[clean] = { name: trimmed, ts: Date.now() };
	await persistStore(store);
}
