import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	API_URL_CANDIDATES,
	API_URL_FALLBACK,
	CONFIG_BOOTSTRAP_URLS,
} from "./constants";
import { fetchWithTimeout } from "./fetch-timeout";

const CACHE_KEY = "@nequi_node/api_base_url";
const CACHE_TS_KEY = "@nequi_node/api_base_url_ts";
const PING_TIMEOUT_MS = 4_000;
const REMOTE_CONFIG_TIMEOUT_MS = 5_000;

let resolvedBaseUrl = API_URL_FALLBACK.replace(/\/$/, "");

export interface RemoteApiConfig {
	apiUrl: string;
	firebaseProjectId?: string;
	updatedAt?: string;
}

function normalizeUrl(url: string): string {
	return url.trim().replace(/\/$/, "");
}

function isValidApiUrl(url: string): boolean {
	return /^https?:\/\/.+/i.test(url);
}

const DEAD_EC2_HOST = "13.59.97.199";

function isStaleEc2Cache(url: string): boolean {
	return url.includes(DEAD_EC2_HOST);
}

function uniqueUrls(urls: Array<string | null | undefined>): string[] {
	const seen = new Set<string>();
	const out: string[] = [];
	for (const raw of urls) {
		if (!raw || !isValidApiUrl(raw)) continue;
		const url = normalizeUrl(raw);
		if (seen.has(url)) continue;
		seen.add(url);
		out.push(url);
	}
	return out;
}

async function readCache(): Promise<string | null> {
	const cached = await AsyncStorage.getItem(CACHE_KEY);
	if (!cached || !isValidApiUrl(cached)) return null;
	return normalizeUrl(cached);
}

async function writeCache(url: string): Promise<void> {
	await AsyncStorage.multiSet([
		[CACHE_KEY, url],
		[CACHE_TS_KEY, String(Date.now())],
	]);
}

async function pingApi(url: string): Promise<boolean> {
	try {
		const res = await fetchWithTimeout(
			`${url}/`,
			{ headers: { Accept: "application/json" } },
			PING_TIMEOUT_MS,
		);
		return res.ok;
	} catch {
		return false;
	}
}

async function fetchRemoteConfig(): Promise<string | null> {
	for (const bootstrapUrl of CONFIG_BOOTSTRAP_URLS) {
		try {
			const res = await fetchWithTimeout(
				bootstrapUrl,
				{ headers: { Accept: "application/json" } },
				REMOTE_CONFIG_TIMEOUT_MS,
			);
			if (!res.ok) continue;
			const data = (await res.json()) as RemoteApiConfig;
			if (!data?.apiUrl || !isValidApiUrl(data.apiUrl)) continue;
			return normalizeUrl(data.apiUrl);
		} catch {
			/* siguiente URL */
		}
	}
	return null;
}

async function pickWorkingUrl(candidates: string[]): Promise<string | null> {
	const checks = await Promise.all(
		candidates.map(async (url) => ({
			url,
			ok: await pingApi(url),
		})),
	);
	return checks.find((c) => c.ok)?.url ?? null;
}

export function getApiBaseUrl(): string {
	return resolvedBaseUrl;
}

export function setApiBaseUrl(url: string): void {
	resolvedBaseUrl = normalizeUrl(url);
}

export async function initApiConfig(): Promise<string> {
	const [cached, remote] = await Promise.all([readCache(), fetchRemoteConfig()]);
	const safeCache = cached && !isStaleEc2Cache(cached) ? cached : null;
	const candidates = uniqueUrls([
		remote,
		safeCache,
		...API_URL_CANDIDATES,
		API_URL_FALLBACK,
	]);

	const working = await pickWorkingUrl(candidates);
	if (working) {
		setApiBaseUrl(working);
		await writeCache(working);
		return working;
	}

	const fallback = remote ?? safeCache ?? API_URL_FALLBACK;
	setApiBaseUrl(fallback);
	if (!isStaleEc2Cache(fallback)) {
		await writeCache(fallback);
	}
	return fallback;
}

export async function refreshApiConfigInBackground(): Promise<void> {
	const remote = await fetchRemoteConfig();
	const candidates = uniqueUrls([remote, ...API_URL_CANDIDATES, resolvedBaseUrl]);
	const working = await pickWorkingUrl(candidates);
	if (!working || working === resolvedBaseUrl) return;
	setApiBaseUrl(working);
	await writeCache(working);
}
