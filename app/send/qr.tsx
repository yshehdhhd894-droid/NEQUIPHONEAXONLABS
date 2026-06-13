import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/basic/text";
import Button from "@/components/button";
import { QrScannerAction } from "@/components/send/qr-scanner-action";
import {
	IC_QR_CLOSE,
	IC_QR_CODE,
	IC_QR_FLASHLIGHT,
	IC_QR_GALLERY,
} from "@/components/send/qr-scanner-icons";
import { QrScannerOverlay } from "@/components/send/qr-scanner-overlay";
import { QrViewfinder } from "@/components/send/qr-viewfinder";
import { useLoading } from "@/hooks/useLoading";
import { useModal } from "@/hooks/useModal";
import { showAppAlert } from "@/libs/app-alert";
import { dp } from "@/libs/dp";
import { UVA_COLOR } from "@/libs/navigation-bar";
import { decodeQrFromImageUri } from "@/libs/qr-image-decode";
import { navigateFromQrProfile } from "@/libs/qr-navigate";
import { parseScannedQr } from "@/libs/qr-handle";
import { useVictimsStore } from "@/store/useVictimsStore";

export default function QrScannerScreen() {
	const [permission, requestPermission] = useCameraPermissions();
	const [torchEnabled, setTorchEnabled] = useState(false);
	const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });
	const scannedRef = useRef(false);

	const addVictim = useVictimsStore((state) => state.addVictim);
	const findVictim = useVictimsStore((state) => state.findVictimByType);

	const { bottom } = useSafeAreaInsets();
	const { autoShow } = useLoading();
	const { show } = useModal();

	const onPreviewLayout = useCallback((event: LayoutChangeEvent) => {
		const { width, height } = event.nativeEvent.layout;
		setPreviewSize({ width, height });
	}, []);

	const handleQrText = useCallback(
		async (raw: string) => {
			if (scannedRef.current || !raw?.trim()) return;
			scannedRef.current = true;

			try {
				const info = parseScannedQr(raw.trim());
				await navigateFromQrProfile(info, {
					addVictim,
					findVictim,
					showModal: show,
					autoShow,
				});
			} catch (error) {
				scannedRef.current = false;
				showAppAlert(
					error instanceof Error
						? error.message
						: "No pudimos leer este QR",
				);
			}
		},
		[addVictim, autoShow, findVictim, show],
	);

	const openGallery = useCallback(async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			quality: 1,
			allowsEditing: false,
		});

		if (result.canceled || !result.assets[0]?.uri) return;

		scannedRef.current = false;
		const asset = result.assets[0];
		const text = await decodeQrFromImageUri(asset.uri, {
			width: asset.width,
			height: asset.height,
		});

		if (!text) {
			showAppAlert("No se reconoció el QR");
			return;
		}

		await handleQrText(text);
	}, [handleQrText]);

	if (!permission) {
		return <View className="flex-1 bg-black" />;
	}

	return (
		<View className="flex-1 bg-black">
			<View
				style={{
					height: dp(50),
					backgroundColor: UVA_COLOR,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					paddingHorizontal: dp(16),
				}}
			>
				<Text
					fontWeight="bold"
					className="text-white"
					style={{ fontSize: dp(18) }}
				>
					Escanea QR
				</Text>
				<Pressable onPress={() => router.back()} hitSlop={12}>
					<SvgXml xml={IC_QR_CLOSE} width={dp(24)} height={dp(24)} />
				</Pressable>
			</View>

			{!permission.granted ? (
				<View className="flex-1 justify-center items-center px-6">
					<Text className="text-center text-[16px] text-white">
						Para escanear un código QR, debes permitir el acceso a la cámara.
					</Text>
					<Button
						onPress={requestPermission}
						className="mt-4"
						title="Dar permiso"
					/>
				</View>
			) : (
				<View className="flex-1" onLayout={onPreviewLayout}>
					<CameraView
						style={StyleSheet.absoluteFillObject}
						facing="back"
						enableTorch={torchEnabled}
						barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
						onBarcodeScanned={(result) => {
							if (!result.data) return;
							void handleQrText(result.data);
						}}
					/>

					{previewSize.width > 0 && previewSize.height > 0 ? (
						<>
							<QrScannerOverlay
								width={previewSize.width}
								height={previewSize.height}
							/>
							<QrViewfinder
								width={previewSize.width}
								height={previewSize.height}
							/>
						</>
					) : null}

					<Text
						fontWeight="bold"
						className="absolute self-center text-white"
						style={{
							top: dp(36),
							fontSize: dp(14),
							zIndex: 2,
							elevation: 2,
						}}
					>
						Paga o cambia por plata
					</Text>

					<View
						style={{
							position: "absolute",
							left: 0,
							right: 0,
							bottom: dp(30) + bottom,
							flexDirection: "row",
							justifyContent: "space-around",
							paddingHorizontal: dp(24),
							zIndex: 2,
							elevation: 2,
						}}
					>
						<QrScannerAction
							label="Código"
							iconXml={IC_QR_CODE}
							onPress={() => router.push("/send/qr-manual")}
						/>
						<QrScannerAction
							label="Linterna"
							iconXml={IC_QR_FLASHLIGHT}
							onPress={() => setTorchEnabled((v) => !v)}
						/>
						<QrScannerAction
							label="Imagen"
							iconXml={IC_QR_GALLERY}
							onPress={() => void openGallery()}
						/>
					</View>
				</View>
			)}
		</View>
	);
}
