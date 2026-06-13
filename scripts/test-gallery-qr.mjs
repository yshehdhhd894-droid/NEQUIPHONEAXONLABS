#!/usr/bin/env node
/**
 * Prueba local del decode de galería contra image.png (temporal).
 * Uso: node scripts/test-gallery-qr.mjs [ruta-imagen]
 */
import fs from "node:fs";
import { PNG } from "pngjs";
import {
	BinaryBitmap,
	DecodeHintType,
	GlobalHistogramBinarizer,
	HybridBinarizer,
	MultiFormatReader,
	RGBLuminanceSource,
} from "@zxing/library";

const imagePath =
	process.argv[2] || new URL("../image.png", import.meta.url).pathname;

const GALLERY_PHOTO_CROPS = [
	{ originX: 0.12, originY: 0.28, width: 0.86, height: 0.58 },
	{ originX: 0.18, originY: 0.32, width: 0.82, height: 0.55 },
	{ originX: 0.08, originY: 0.25, width: 0.9, height: 0.62 },
];

function isValidPaymentQrPayload(text) {
	const value = text.trim();
	if (!value) return false;
	if (value.startsWith("000201")) return true;
	if (/^https?:\/\//i.test(value)) return true;
	if (/CO\.COM\.(RBM|CRB|RED)/i.test(value)) return true;
	if (/BANCOLOMBIA|Bre-?B/i.test(value)) return true;
	if (/^\d{1,12}$/.test(value)) return false;
	return false;
}

function toPixelCrop(crop, size) {
	const originX = Math.max(0, Math.floor(size.width * crop.originX));
	const originY = Math.max(0, Math.floor(size.height * crop.originY));
	const width = Math.min(
		size.width - originX,
		Math.max(1, Math.floor(size.width * crop.width)),
	);
	const height = Math.min(
		size.height - originY,
		Math.max(1, Math.floor(size.height * crop.height)),
	);
	return { originX, originY, width, height };
}

function cropRgba(image, x, y, width, height) {
	const data = new Uint8Array(width * height * 4);
	for (let row = 0; row < height; row++) {
		const srcStart = ((y + row) * image.width + x) * 4;
		data.set(
			image.data.subarray(srcStart, srcStart + width * 4),
			row * width * 4,
		);
	}
	return { data, width, height };
}

function scaleRgba(image, factor) {
	const width = Math.round(image.width * factor);
	const height = Math.round(image.height * factor);
	const data = new Uint8Array(width * height * 4);
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const sx = Math.min(image.width - 1, Math.floor(x / factor));
			const sy = Math.min(image.height - 1, Math.floor(y / factor));
			const src = (sy * image.width + sx) * 4;
			const dst = (y * width + x) * 4;
			data[dst] = image.data[src];
			data[dst + 1] = image.data[src + 1];
			data[dst + 2] = image.data[src + 2];
			data[dst + 3] = 255;
		}
	}
	return { data, width, height };
}

const reader = new MultiFormatReader();
reader.setHints(
	new Map([
		[DecodeHintType.POSSIBLE_FORMATS, ["QR_CODE"]],
		[DecodeHintType.TRY_HARDER, true],
		[DecodeHintType.CHARACTER_SET, "UTF-8"],
	]),
);

function decodeOnce(image) {
	const luminance = new Uint8ClampedArray(image.width * image.height);
	for (let i = 0, j = 0; i < image.data.length; i += 4, j++) {
		luminance[j] =
			((image.data[i] + image.data[i + 1] * 2 + image.data[i + 2]) / 4) | 0;
	}
	const source = new RGBLuminanceSource(luminance, image.width, image.height);
	for (const src of [source, source.invert()]) {
		for (const B of [HybridBinarizer, GlobalHistogramBinarizer]) {
			try {
				const text = reader
					.decodeWithState(new BinaryBitmap(new B(src)))
					.getText()
					?.trim();
				if (text && isValidPaymentQrPayload(text)) return text;
			} catch {
				/* next */
			} finally {
				reader.reset();
			}
		}
	}
	return null;
}

const png = PNG.sync.read(fs.readFileSync(imagePath));
const size = { width: png.width, height: png.height };
const base = { data: png.data, width: png.width, height: png.height };

console.log("Imagen:", imagePath, `${size.width}x${size.height}`);

let decoded = null;
for (const preset of GALLERY_PHOTO_CROPS) {
	const crop = toPixelCrop(preset, size);
	for (const factor of [1, 2, 3]) {
		let image = cropRgba(
			base,
			crop.originX,
			crop.originY,
			crop.width,
			crop.height,
		);
		if (factor > 1) image = scaleRgba(image, factor);
		const text = decodeOnce(image);
		if (text) {
			decoded = text;
			console.log(
				"OK preset",
				preset,
				`x${factor}`,
				"llave incluye 0090400087:",
				text.includes("0090400087"),
			);
			break;
		}
	}
	if (decoded) break;
}

if (!decoded) {
	console.error("FALLÓ: no se decodificó QR válido");
	process.exit(1);
}

console.log("Payload:", decoded.slice(0, 120), "...");
process.exit(0);
