import { useEffect, useMemo, useState } from "react";
import { View, type ViewStyle } from "react-native";
import { NequiQrLogoMark } from "@/components/voucher/nequi-qr-logo";
import {
	getPreloadedVoucherQr,
	preloadVoucherAssets,
} from "@/hooks/useVoucherPreload";
import { voucherQrValue } from "@/libs/base64";

/**
 * Marco QR — HTML (.check--container--qr__animation + .qr__container + #qr-code).
 * QR: negro puro, ecl M, logo N en círculo blanco centrado (APK Nequi real).
 */
const EM = 16;
const QR_OUTER_SIZE = Math.round(8.5 * EM); // 136
const QR_GREEN_PADDING = Math.round(0.25 * EM); // 4
const QR_OUTER_RADIUS = Math.round(0.25 * EM); // 4
const QR_INNER_RADIUS = 4;
const QR_GREEN_BG = "rgba(17, 218, 122, 0.3)"; // --positive-30
const QR_INNER_SIZE = QR_OUTER_SIZE - QR_GREEN_PADDING * 2; // 128
const QR_DRAW_SIZE = QR_INNER_SIZE - Math.round(0.15 * EM) * 2; // 122
const QR_LOGO_CIRCLE = Math.round(2.15 * EM); // ~34
const QR_LOGO_MARK_W = 20;
const QR_LOGO_MARK_H = 16;

type TransactionQrProps = {
	transactionId: string | undefined;
	containerStyle?: ViewStyle;
	enabled?: boolean;
};

/** QR del comprobante — diseño APK / HTML original. */
export function TransactionQr({
	transactionId,
	containerStyle,
	enabled = true,
}: TransactionQrProps) {
	const value = useMemo(() => voucherQrValue(transactionId), [transactionId]);
	const [QrCode, setQrCode] = useState(getPreloadedVoucherQr);
	const ready = Boolean(QrCode);

	useEffect(() => {
		if (!enabled || QrCode || !value) return;
		let cancelled = false;
		preloadVoucherAssets().then(() => {
			if (!cancelled) setQrCode(getPreloadedVoucherQr);
		});
		return () => {
			cancelled = true;
		};
	}, [enabled, QrCode, value]);

	if (!value) {
		return <View style={{ width: QR_OUTER_SIZE, height: QR_OUTER_SIZE }} />;
	}

	return (
		<View
			className="items-center justify-center"
			style={[{ marginBottom: 10 }, containerStyle]}
		>
			<View
				style={{
					width: QR_OUTER_SIZE,
					height: QR_OUTER_SIZE,
					borderRadius: QR_OUTER_RADIUS,
					backgroundColor: QR_GREEN_BG,
					padding: QR_GREEN_PADDING,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<View
					style={{
						width: QR_INNER_SIZE,
						height: QR_INNER_SIZE,
						backgroundColor: "#FFFFFF",
						borderRadius: QR_INNER_RADIUS,
						alignItems: "center",
						justifyContent: "center",
						overflow: "hidden",
					}}
				>
					{ready && QrCode ? (
						<QrCode
							size={QR_DRAW_SIZE}
							value={value}
							backgroundColor="#FFFFFF"
							color="#000000"
							ecl="M"
							quietZone={0}
						/>
					) : (
						<View style={{ width: QR_DRAW_SIZE, height: QR_DRAW_SIZE }} />
					)}
					<View
						pointerEvents="none"
						style={{
							position: "absolute",
							width: QR_LOGO_CIRCLE,
							height: QR_LOGO_CIRCLE,
							borderRadius: QR_LOGO_CIRCLE / 2,
							backgroundColor: "#FFFFFF",
							alignItems: "center",
							justifyContent: "center",
							shadowColor: "#000000",
							shadowOpacity: 0.04,
							shadowRadius: 1,
							shadowOffset: { width: 0, height: 0 },
							elevation: 1,
						}}
					>
						<NequiQrLogoMark width={QR_LOGO_MARK_W} height={QR_LOGO_MARK_H} />
					</View>
				</View>
			</View>
		</View>
	);
}
