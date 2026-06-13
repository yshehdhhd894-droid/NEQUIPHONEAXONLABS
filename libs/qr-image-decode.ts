import {
	BinaryBitmap,
	DecodeHintType,
	GlobalHistogramBinarizer,
	HybridBinarizer,
	MultiFormatReader,
	RGBLuminanceSource,
} from "@zxing/library";
import { scanFromURLAsync } from "expo-camera";
import {
	manipulateAsync,
	SaveFormat,
	type Action,
} from "expo-image-manipulator";
import jpeg from "jpeg-js";
import { isValidPaymentQrPayload } from "@/libs/qr-payload";

const ZxingReader = new MultiFormatReader();
ZxingReader.setHints(
	new Map([
		[DecodeHintType.POSSIBLE_FORMATS, ["QR_CODE"]],
		[DecodeHintType.TRY_HARDER, true],
		[DecodeHintType.CHARACTER_SET, "UTF-8"],
	]),
);

const TARGET_WIDTH = 1800;
const ZxingFallbackTimeoutMs = 15_000;

/** Recortes típicos de foto de QR físico Bancolombia (tarjeta / letrero). */
const GALLERY_PHOTO_CROPS = [
	{ originX: 0.12, originY: 0.28, width: 0.86, height: 0.58 },
	{ originX: 0.18, originY: 0.32, width: 0.82, height: 0.55 },
	{ originX: 0.08, originY: 0.25, width: 0.9, height: 0.62 },
] as const;

type RgbaImage = {
	data: Uint8Array;
	width: number;
	height: number;
};

type ImageSize = { width: number; height: number };

type NormalizedCrop = {
	originX: number;
	originY: number;
	width: number;
	height: number;
};

function base64ToBytes(base64: string): Uint8Array {
	const binary = globalThis.atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}

function rgbaToLuminance(
	rgba: Uint8Array,
	width: number,
	height: number,
): Uint8ClampedArray {
	const luminance = new Uint8ClampedArray(width * height);
	for (let i = 0, j = 0; i < rgba.length; i += 4, j++) {
		luminance[j] =
			Math.floor((rgba[i] + rgba[i + 1] * 2 + rgba[i + 2]) / 4) & 0xff;
	}
	return luminance;
}

function enhanceForQr(rgba: Uint8Array): Uint8Array {
	const out = new Uint8Array(rgba.length);
	const contrast = 1.4;
	const translate = (-0.5 * contrast + 0.5) * 255;

	for (let i = 0; i < rgba.length; i += 4) {
		const gray = (rgba[i] + rgba[i + 1] * 2 + rgba[i + 2]) / 4;
		const value = Math.max(
			0,
			Math.min(255, Math.round(gray * contrast + translate)),
		);
		out[i] = value;
		out[i + 1] = value;
		out[i + 2] = value;
		out[i + 3] = 255;
	}
	return out;
}

function decodeLuminance(
	luminance: Uint8ClampedArray,
	width: number,
	height: number,
): string | null {
	const source = new RGBLuminanceSource(luminance, width, height);

	const tryHybrid = (src: RGBLuminanceSource) => {
		try {
			const bitmap = new BinaryBitmap(new HybridBinarizer(src));
			const text = ZxingReader.decodeWithState(bitmap).getText()?.trim();
			if (text) return text;
		} catch {
			/* try next */
		} finally {
			ZxingReader.reset();
		}
		return null;
	};

	const tryGlobal = (src: RGBLuminanceSource) => {
		try {
			const bitmap = new BinaryBitmap(new GlobalHistogramBinarizer(src));
			const text = ZxingReader.decodeWithState(bitmap).getText()?.trim();
			if (text) return text;
		} catch {
			/* try next */
		} finally {
			ZxingReader.reset();
		}
		return null;
	};

	return (
		tryHybrid(source) ??
		tryHybrid(source.invert()) ??
		tryGlobal(source) ??
		tryGlobal(source.invert())
	);
}

function decodeOnce(image: RgbaImage): string | null {
	const text = decodeLuminance(
		rgbaToLuminance(image.data, image.width, image.height),
		image.width,
		image.height,
	);
	return text && isValidPaymentQrPayload(text) ? text : null;
}

function cropRgba(
	image: RgbaImage,
	x: number,
	y: number,
	width: number,
	height: number,
): RgbaImage {
	const data = new Uint8Array(width * height * 4);
	for (let row = 0; row < height; row++) {
		const srcStart = ((y + row) * image.width + x) * 4;
		const dstStart = row * width * 4;
		data.set(
			image.data.subarray(srcStart, srcStart + width * 4),
			dstStart,
		);
	}
	return { data, width, height };
}

function rotateRgba90(image: RgbaImage): RgbaImage {
	const { width, height, data } = image;
	const rotated = new Uint8Array(data.length);
	const newWidth = height;
	const newHeight = width;

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const srcIndex = (y * width + x) * 4;
			const dstX = height - 1 - y;
			const dstY = x;
			const dstIndex = (dstY * newWidth + dstX) * 4;
			rotated[dstIndex] = data[srcIndex];
			rotated[dstIndex + 1] = data[srcIndex + 1];
			rotated[dstIndex + 2] = data[srcIndex + 2];
			rotated[dstIndex + 3] = data[srcIndex + 3];
		}
	}

	return { data: rotated, width: newWidth, height: newHeight };
}

function rotateRgbaAll(image: RgbaImage): RgbaImage[] {
	const r90 = rotateRgba90(image);
	const r180 = rotateRgba90(r90);
	const r270 = rotateRgba90(r180);
	return [image, r90, r180, r270];
}

function decodeRotationsAndTiles(image: RgbaImage): string | null {
	for (const rotated of rotateRgbaAll(image)) {
		const rotatedText = decodeOnce(rotated);
		if (rotatedText) return rotatedText;

		const { width: w, height: h } = rotated;
		for (const scale of [0.8, 0.6]) {
			const cw = Math.max(50, Math.floor(w * scale));
			const ch = Math.max(50, Math.floor(h * scale));
			const x = Math.max(0, Math.floor((w - cw) / 2));
			const y = Math.max(0, Math.floor((h - ch) / 2));
			const centerText = decodeOnce(cropRgba(rotated, x, y, cw, ch));
			if (centerText) return centerText;
		}

		const cw = Math.max(50, Math.floor(w * 0.6));
		const ch = Math.max(50, Math.floor(h * 0.6));
		const xs = [Math.max(0, Math.floor((w - cw) / 2)), Math.max(0, w - cw)];
		const ys = [Math.max(0, Math.floor((h - ch) / 2)), Math.max(0, h - ch)];

		for (const y of ys) {
			for (const x of xs) {
				const tileW = Math.min(cw, w - x);
				const tileH = Math.min(ch, h - y);
				if (tileW < 50 || tileH < 50) continue;
				const tileText = decodeOnce(cropRgba(rotated, x, y, tileW, tileH));
				if (tileText) return tileText;
			}
		}
	}

	return null;
}

function decodeBitmapForQr(image: RgbaImage): string | null {
	return (
		decodeRotationsAndTiles(image) ??
		decodeRotationsAndTiles({
			...image,
			data: enhanceForQr(image.data),
		})
	);
}

function toPixelCrop(
	crop: NormalizedCrop,
	size: ImageSize,
): NormalizedCrop {
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

/** Detecta banda del QR en fotos de tarjeta (pico de filas claras en zona superior). */
function detectPhotoQrCrop(size: ImageSize, rgba: RgbaImage): NormalizedCrop | null {
	const { width, height, data } = rgba;
	const rowFrac = new Float32Array(height);

	for (let y = 0; y < height; y++) {
		let bright = 0;
		for (let x = 0; x < width; x++) {
			const i = (y * width + x) * 4;
			if ((data[i] + data[i + 1] * 2 + data[i + 2]) / 4 > 175) bright++;
		}
		rowFrac[y] = bright / width;
	}

	let peakY = Math.floor(height * 0.3);
	let peakVal = 0;
	const scanStart = Math.floor(height * 0.22);
	const scanEnd = Math.floor(height * 0.58);
	for (let y = scanStart; y < scanEnd; y++) {
		if (rowFrac[y] > peakVal) {
			peakVal = rowFrac[y];
			peakY = y;
		}
	}
	if (peakVal < 0.45) return null;

	let y0 = peakY;
	let y1 = peakY;
	while (y0 > scanStart && rowFrac[y0 - 1] >= 0.28) y0--;
	while (y1 < Math.floor(height * 0.72) && rowFrac[y1 + 1] >= 0.28) y1++;

	const bandHeight = y1 - y0 + 1;
	if (bandHeight < Math.floor(height * 0.12)) return null;

	const localCol = new Float32Array(width);
	for (let y = y0; y <= y1; y++) {
		for (let x = 0; x < width; x++) {
			const i = (y * width + x) * 4;
			if ((data[i] + data[i + 1] * 2 + data[i + 2]) / 4 > 175) localCol[x]++;
		}
	}
	for (let x = 0; x < width; x++) localCol[x] /= bandHeight;

	let x0 = 0;
	let x1 = width - 1;
	while (x0 < width && localCol[x0] < 0.18) x0++;
	while (x1 > x0 && localCol[x1] < 0.18) x1--;

	const cropWidth = x1 - x0 + 1;
	const cropHeight = y1 - y0 + 1;
	if (cropWidth < width * 0.25 || cropHeight < height * 0.12) return null;

	const pad = Math.floor(Math.min(cropWidth, cropHeight) * 0.03);
	return {
		originX: Math.max(0, x0 - pad),
		originY: Math.max(0, y0 - pad),
		width: Math.min(width, cropWidth + pad * 2),
		height: Math.min(height, cropHeight + pad * 2),
	};
}

function cropActions(crop: NormalizedCrop): Action[] {
	return [
		{
			crop: {
				originX: crop.originX,
				originY: crop.originY,
				width: crop.width,
				height: crop.height,
			},
		},
	];
}

function buildGalleryActions(
	crop?: NormalizedCrop,
	upscale = 1,
): Action[] {
	const actions: Action[] = [];
	if (crop) actions.push(...cropActions(crop));
	if (upscale > 1 && crop) {
		actions.push({
			resize: {
				width: Math.max(1, Math.round(crop.width * upscale)),
				height: Math.max(1, Math.round(crop.height * upscale)),
			},
		});
	}
	return actions;
}

async function loadRgbaFromUri(
	uri: string,
	extraActions: Action[] = [],
): Promise<RgbaImage | null> {
	const image = await manipulateAsync(
		uri,
		extraActions.length ? extraActions : [{ resize: { width: TARGET_WIDTH } }],
		{
			base64: true,
			format: SaveFormat.JPEG,
			compress: 1,
		},
	);
	if (!image.base64) return null;

	const decoded = jpeg.decode(base64ToBytes(image.base64), { useTArray: true });
	return {
		data: decoded.data as Uint8Array,
		width: decoded.width,
		height: decoded.height,
	};
}

async function renderGalleryVariant(
	uri: string,
	crop?: NormalizedCrop,
	upscale = 1,
): Promise<string | null> {
	const actions = buildGalleryActions(crop, upscale);
	try {
		const result = await manipulateAsync(uri, actions, { compress: 1 });
		return result.uri;
	} catch {
		return null;
	}
}

async function decodeWithMlKit(uri: string): Promise<string | null> {
	try {
		const results = await scanFromURLAsync(uri, ["qr"]);
		const text = results[0]?.data?.trim();
		return text && isValidPaymentQrPayload(text) ? text : null;
	} catch {
		return null;
	}
}

async function buildGalleryScanPlans(
	uri: string,
	size: ImageSize,
): Promise<Array<{ crop?: NormalizedCrop; upscale: number }>> {
	const preview = await loadRgbaFromUri(uri);
	const detected = preview
		? detectPhotoQrCrop(
				{ width: preview.width, height: preview.height },
				preview,
			)
		: null;

	const pixelCrops = [
		...GALLERY_PHOTO_CROPS.map((crop) => toPixelCrop(crop, size)),
		...(detected ? [detected] : []),
	];

	// preset2 x2 es el más fiable en fotos de tarjeta Bancolombia.
	const plans: Array<{ crop?: NormalizedCrop; upscale: number }> = [];
	if (pixelCrops[1]) plans.push({ crop: pixelCrops[1], upscale: 2 });
	plans.push({ upscale: 2 });
	for (const crop of pixelCrops) {
		for (const upscale of [1, 2, 3]) {
			const exists = plans.some(
				(p) => p.crop === crop && p.upscale === upscale,
			);
			if (!exists) plans.push({ crop, upscale });
		}
	}
	plans.push({ upscale: 1 });
	return plans;
}

async function decodeGalleryWithMlKit(
	uri: string,
	size?: ImageSize,
): Promise<string | null> {
	const direct = await decodeWithMlKit(uri);
	if (direct) return direct;

	if (!size?.width || !size?.height) return null;

	const plans = await buildGalleryScanPlans(uri, size);
	for (const plan of plans) {
		const variant = await renderGalleryVariant(uri, plan.crop, plan.upscale);
		if (!variant) continue;
		const text = await decodeWithMlKit(variant);
		if (text) return text;
	}
	return null;
}

async function decodeGalleryWithZxing(
	uri: string,
	size?: ImageSize,
): Promise<string | null> {
	if (!size?.width || !size?.height) {
		const base = await loadRgbaFromUri(uri);
		return base ? decodeBitmapForQr(base) : null;
	}

	const plans = await buildGalleryScanPlans(uri, size);
	for (const plan of plans) {
		const actions = buildGalleryActions(plan.crop, plan.upscale);
		const rgba = await loadRgbaFromUri(uri, actions);
		const text = rgba ? decodeBitmapForQr(rgba) : null;
		if (text) return text;
	}

	const fallback = await loadRgbaFromUri(uri);
	return fallback ? decodeBitmapForQr(fallback) : null;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			reject(new Error("QR gallery decode timeout"));
		}, ms);
		promise
			.then((value) => {
				clearTimeout(timer);
				resolve(value);
			})
			.catch((error) => {
				clearTimeout(timer);
				reject(error);
			});
	});
}

/** Decodifica QR desde galería al instante (ML Kit, sin esperas). */
export async function decodeQrFromImageUri(
	uri: string,
	size?: ImageSize,
): Promise<string | null> {
	const direct = await decodeWithMlKit(uri);
	if (direct) return direct;

	if (!size?.width || !size?.height) return null;

	const quickCrop = toPixelCrop(GALLERY_PHOTO_CROPS[1], size);
	const variant = await renderGalleryVariant(uri, quickCrop, 2);
	if (variant) {
		const cropped = await decodeWithMlKit(variant);
		if (cropped) return cropped;
	}

	return null;
}
