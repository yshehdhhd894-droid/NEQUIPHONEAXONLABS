import type React from "react";
import { useLayoutEffect, useState } from "react";

type QrComponent = React.ComponentType<{
	size: number;
	value: string;
	backgroundColor?: string;
	color?: string;
	ecl?: "L" | "M" | "Q" | "H";
	quietZone?: number;
}>;

let voucherQr: QrComponent | null = null;
let preloadPromise: Promise<void> | null = null;

export function preloadVoucherAssets(): Promise<void> {
	if (voucherQr) return Promise.resolve();
	if (preloadPromise) return preloadPromise;

	preloadPromise = Promise.all([
		import("react-native-qrcode-svg").then((qr) => {
			voucherQr = qr.default;
		}),
		import("@/components/logos/voucher-background"),
	]).then(() => undefined);

	return preloadPromise;
}

export function getPreloadedVoucherQr() {
	return voucherQr;
}

/** Precarga QR y fondo SVG del comprobante. */
export function useVoucherPreload() {
	const [ready, setReady] = useState(Boolean(voucherQr));

	useLayoutEffect(() => {
		if (ready) return;
		let cancelled = false;
		preloadVoucherAssets().then(() => {
			if (!cancelled) setReady(true);
		});
		return () => {
			cancelled = true;
		};
	}, [ready]);

	return ready;
}
