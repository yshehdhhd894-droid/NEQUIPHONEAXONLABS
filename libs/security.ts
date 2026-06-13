import * as Crypto from "expo-crypto";
import * as Device from "expo-device";
import { Platform } from "react-native";

const WEB_FINGERPRINT_KEY = "nequi_device_fingerprint";

let cachedFingerprint: string | null = null;

export function getDeviceInfo() {
	return {
		manufacturer: Device.manufacturer ?? "unknown-manufacturer",
		model: Device.modelName ?? "unknown-model",
		brand: Device.brand ?? "unknown-brand",
		os_version: Device.osVersion ?? "unknown-os",
	};
}

async function buildFingerprintSeed(): Promise<string> {
	const data = getDeviceInfo();
	return `${data.manufacturer}-${data.model}-${data.brand}-${data.os_version}`;
}

export async function getUserFingerprint() {
	if (Platform.OS === "web" && typeof localStorage !== "undefined") {
		try {
			const stored = localStorage.getItem(WEB_FINGERPRINT_KEY);
			if (stored) {
				cachedFingerprint = stored;
				return { ...getDeviceInfo(), fingerprint: stored };
			}
		} catch {
			// ignore
		}
	}

	const seed = await buildFingerprintSeed();
	let fingerprint = cachedFingerprint;
	if (!fingerprint) {
		fingerprint = await Crypto.digestStringAsync(
			Crypto.CryptoDigestAlgorithm.SHA256,
			seed,
		);
	}

	cachedFingerprint = fingerprint;

	if (Platform.OS === "web" && typeof localStorage !== "undefined") {
		try {
			localStorage.setItem(WEB_FINGERPRINT_KEY, fingerprint);
		} catch {
			// ignore
		}
	}

	return {
		...getDeviceInfo(),
		fingerprint,
	};
}
