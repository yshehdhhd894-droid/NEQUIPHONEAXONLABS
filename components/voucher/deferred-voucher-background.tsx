import { VoucherBackground } from "@/components/logos/voucher-background";

type DeferredVoucherBackgroundProps = {
	show?: boolean;
	height: number;
	width: number;
};

/** Fondo decorativo del comprobante (SVG). */
export function DeferredVoucherBackground({
	show = true,
	height,
	width,
}: DeferredVoucherBackgroundProps) {
	if (!show || height <= 0 || width <= 0) return null;

	return (
		<VoucherBackground
			height={height}
			width={width}
			preserveAspectRatio="xMinYMin slice"
			pointerEvents="none"
			renderToHardwareTextureAndroid
			shouldRasterizeIOS
		/>
	);
}
