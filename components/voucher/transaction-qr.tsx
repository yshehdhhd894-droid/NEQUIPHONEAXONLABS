import { useEffect, useMemo, useState } from "react";
import { View, type ViewStyle } from "react-native";
import { NequiQrLogoMark } from "@/components/voucher/nequi-qr-logo";
import {
	getPreloadedVoucherQr,
	preloadVoucherAssets,
} from "@/hooks/useVoucherPreload";
import { voucherQrValue } from "@/libs/base64";

/** QR + marco menta + halo verde suave (como detalle del movimiento oficial). */
const QR_SIZE = 116;
const QR_PADDING = 5;
const QR_BORDER_WIDTH = 1;
const QR_BORDER_COLOR = "#9EDFC4";
const QR_GREEN_HALO = 2;
const QR_GREEN_BASE = "rgba(17, 218, 122, 0.22)";
const QR_FRAME_SIZE = QR_SIZE + QR_PADDING * 2 + QR_BORDER_WIDTH * 2;
const QR_OUTER_SIZE = QR_FRAME_SIZE + QR_GREEN_HALO * 2;
const QR_LOGO_CIRCLE_SIZE = 28;
const QR_LOGO_CIRCLE_BORDER = "#E0E0E0";

type TransactionQrProps = {
	transactionId: string | undefined;
	containerStyle?: ViewStyle;
	enabled?: boolean;
};

/** QR del comprobante — borde menta separado del QR + halo verde exterior. */
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

	const frameStyle = {
		width: QR_FRAME_SIZE,
		height: QR_FRAME_SIZE,
		backgroundColor: "#FFFFFF" as const,
		borderWidth: QR_BORDER_WIDTH,
		borderColor: QR_BORDER_COLOR,
		borderRadius: 0,
		padding: QR_PADDING,
		alignItems: "center" as const,
		justifyContent: "center" as const,
	};

	const logoCircleStyle = {
		position: "absolute" as const,
		width: QR_LOGO_CIRCLE_SIZE,
		height: QR_LOGO_CIRCLE_SIZE,
		borderRadius: QR_LOGO_CIRCLE_SIZE / 2,
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: QR_LOGO_CIRCLE_BORDER,
		alignItems: "center" as const,
		justifyContent: "center" as const,
	};

	return (
		<View
			className="items-center justify-center"
			style={[{ marginBottom: 10 }, containerStyle]}
		>
			<View
				style={{
					width: QR_OUTER_SIZE,
					height: QR_OUTER_SIZE,
					borderRadius: 4,
					backgroundColor: QR_GREEN_BASE,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<View style={frameStyle}>
					{ready && QrCode ? (
						<QrCode
							size={QR_SIZE}
							value={value}
							backgroundColor="#FFFFFF"
							color="#200020"
						/>
					) : (
						<View style={{ width: QR_SIZE, height: QR_SIZE }} />
					)}
					<View style={logoCircleStyle}>
						<NequiQrLogoMark width={18} height={14} />
					</View>
				</View>
			</View>
		</View>
	);
}
