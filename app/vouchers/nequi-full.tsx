import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { Link, router, useLocalSearchParams } from "expo-router";
import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/basic/text";
import Button from "@/components/button";
import { MundialFeedbackOverlay } from "@/components/loading/mundial-feedback-overlay";
import { Arrow, RedemptionLogo } from "@/components/logos";
import { DeferredVoucherBackground } from "@/components/voucher/deferred-voucher-background";
import { TransactionQr } from "@/components/voucher/transaction-qr";
import { useDeferredVoucherGraphics } from "@/hooks/useDeferredVoucherGraphics";
import { useVoucherScrollBottomPadding } from "@/hooks/useBottomInset";
import {
	ZigzagBorderBottom,
	ZigzagBorderTop,
} from "@/components/voucher/zigzag-border";
import { useAuthStore } from "@/hooks/useAuth";
import type { Transaction, TransactionType } from "@/libs/api";
import { queryClient } from "@/libs/api";
import {
	formatDate,
	formatMoney,
	formatPersonName,
	formatPhone,
	formatTransactionReference,
} from "@/libs/utils";
import { MUNDIAL_VOUCHER_PAINT_MS } from "@/libs/mundial-timing";
import { walletService } from "@/services/api.service";
import { useVictimsStore } from "@/store/useVictimsStore";

type VoucherStyle = "1" | "2";

const VOUCHER_ESTIMATED_HEIGHT = 520;

function resolveVoucherStyle(
	style: string | string[] | undefined,
): VoucherStyle {
	const raw = Array.isArray(style) ? style[0] : style;
	return raw === "2" ? "2" : "1";
}

export default function NequiVoucherFull() {
	const { width } = Dimensions.get("window");
	const params = useLocalSearchParams<{
		id: string;
		style?: string | string[];
		feedback?: string | string[];
	}>();
	const id = Array.isArray(params.id) ? params.id[0] : params.id;
	const voucherStyle = resolveVoucherStyle(params.style);
	const showBreBFeedback =
		(Array.isArray(params.feedback) ? params.feedback[0] : params.feedback) ===
		"1";

	const user = useAuthStore((state) => state.user);
	const findVictimByValue = useVictimsStore((state) => state.findVictimByValue);
	const scrollBottom = useVoucherScrollBottomPadding();

	const [displayAd, setDisplayAd] = useState(false);
	const [feedbackVisible, setFeedbackVisible] = useState(false);
	const [layoutReady, setLayoutReady] = useState(false);
	const [contentHeight, setContentHeight] = useState(VOUCHER_ESTIMATED_HEIGHT);
	const layoutMeasured = useRef(false);
	const showHeavyGraphics = useDeferredVoucherGraphics(contentHeight);

	const cachedTransaction = id
		? queryClient.getQueryData<Transaction>(["transaction", id])
		: undefined;

	const { data, isPending, isFetched, isError } = useQuery({
		queryKey: ["transaction", id],
		queryFn: () => walletService.getTransactionById(id),
		enabled: Boolean(id),
		placeholderData: cachedTransaction,
		initialData: cachedTransaction,
		staleTime: cachedTransaction ? Number.POSITIVE_INFINITY : 60_000,
		refetchOnMount: !cachedTransaction,
		refetchOnWindowFocus: false,
		retry: cachedTransaction ? 0 : 1,
	});

	const transaction = data ?? cachedTransaction;

	const voucherReady =
		showBreBFeedback &&
		Boolean(transaction) &&
		transaction.type === "transfer.breb" &&
		!isPending &&
		layoutReady;

	useEffect(() => {
		if (!voucherReady) return;
		const timer = setTimeout(
			() => setFeedbackVisible(true),
			MUNDIAL_VOUCHER_PAINT_MS,
		);
		return () => clearTimeout(timer);
	}, [voucherReady]);

	if (!id) {
		return (
			<View style={{ backgroundColor: "#fbf7fb" }} className="flex-1">
				<Header />
			</View>
		);
	}

	if (!transaction && isFetched && !isPending && isError) {
		return (
			<View style={{ backgroundColor: "#fbf7fb" }} className="flex-1">
				<Header />
				<View className="px-6 mt-8" style={{ paddingBottom: scrollBottom }}>
					<Text className="text-uva text-center">
						No pudimos cargar el comprobante.
					</Text>
					<Button
						onPress={() => router.replace("/home")}
						title="Ir al inicio"
						className="mt-6"
					/>
				</View>
			</View>
		);
	}

	const displayTransaction: Transaction =
		transaction ??
		({
			id,
			walletId: "",
			name: "",
			type: "transfer",
			amount: 0,
			date: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		} as Transaction);

	const voucherWidth = width - 28;
	const backgroundHeight = Math.min(contentHeight, 720);
	const showQRCode =
		displayTransaction.type !== "deposit" &&
		displayTransaction.type !== "withdraw";

	return (
		<View style={{ backgroundColor: "#fbf7fb" }} className="flex-1">
			<Header />

			{displayAd && <ChargebackAd setDisplayAd={setDisplayAd} />}

			<ScrollView
				showsVerticalScrollIndicator={false}
				bounces={false}
				alwaysBounceVertical={false}
				overScrollMode="never"
				clipToPadding={false}
				contentContainerStyle={{
					paddingBottom: scrollBottom,
					overflow: "visible",
				}}
			>
				<View
					className="mx-4"
					style={{ marginTop: 8, overflow: "visible" }}
				>
					<View
						className="bg-white relative"
						style={{
							overflow: "visible",
							minHeight: VOUCHER_ESTIMATED_HEIGHT,
							paddingTop: 8,
						}}
					>
						<ZigzagBorderTop width={voucherWidth} />

						<View
							className="px-6 pt-[2.4rem] pb-8"
							onLayout={(event) => {
								const { height } = event.nativeEvent.layout;
								if (height <= 0) return;
								if (!layoutMeasured.current) {
									layoutMeasured.current = true;
									setContentHeight(height);
								}
								setLayoutReady(true);
							}}
						>
						<View className="absolute bottom-0 left-0 right-0">
							<DeferredVoucherBackground
								show={showHeavyGraphics}
								height={backgroundHeight}
								width={voucherWidth}
							/>
						</View>

						<TransactionStatus type={displayTransaction.type} />
						<Divider width={width} />

						{showQRCode && (
							<QRCodeSection
								setDisplayAd={setDisplayAd}
								transactionId={displayTransaction.id}
							/>
						)}

						<View className="flex gap-[0.81rem] pt-[1.5rem] -ml-[0.3rem]">
							<TransactionDetails
								transaction={displayTransaction}
								userPhone={user?.phone ?? ""}
								findVictimByValue={findVictimByValue}
							/>
						</View>

						<ActionButtons
							transactionType={displayTransaction.type}
							style={voucherStyle}
						/>
					</View>

						<ZigzagBorderBottom width={voucherWidth} />
					</View>
				</View>
			</ScrollView>

			{feedbackVisible &&
				showBreBFeedback &&
				displayTransaction.type === "transfer.breb" && (
					<MundialFeedbackOverlay onFinish={() => setFeedbackVisible(false)} />
				)}
		</View>
	);
}

const ChargebackAd = ({
	setDisplayAd,
}: {
	setDisplayAd: Dispatch<SetStateAction<boolean>>;
}) => {
	return (
		<View className="absolute top-0 justify-center items-center flex-1 bg-uva-button-pressed/90 h-full w-full z-50">
			<View className="bg-white w-[85%] p-4 py-6 rounded-[4px]">
				<View className="items-center mb-4">
					<RedemptionLogo />
				</View>

				<View>
					<Text
						fontWeight="bold"
						className="text-uva text-[22px] leading-none text-center"
					>
						Tu envío no fue exitoso.
					</Text>
					<Text
						fontWeight="bold"
						className="text-uva text-[22px] leading-tight text-center"
					>
						Devolveremos tu plata
					</Text>
				</View>

				<Text className="text-[#6e6e6e] text-[16px] mb-7 mt-3 text-center px-4">
					Hicimos el descuento de tu plata pero te lo devolveremos en minutos.
					Podrás verificar la devolución en tus movimientos.
				</Text>

				<Button onPress={() => setDisplayAd(false)} title="Regresar" />
			</View>
		</View>
	);
};

function recipientDisplayName(
	transaction: Transaction,
	findVictimByValue?: (value: string) => { name: string } | undefined,
): string {
	if (transaction.type === "transfer.breb" && transaction.phone) {
		const victim = findVictimByValue?.(transaction.phone);
		if (victim?.name) {
			return formatPersonName(victim.name);
		}
	}

	const name = formatPersonName(transaction.name?.trim() ?? "");
	if (!name) return "—";
	return name;
}

const getTransactionStatus = (type: TransactionType) => {
	const isOutgoing = type.startsWith("transfer") || type === "withdraw";
	const color = isOutgoing ? "#ff3e60" : "#11da7a";
	const icon = isOutgoing
		? "arrow-down-circle-outline"
		: "arrow-up-circle-outline";

	let label = "Envío Recibido";
	if (type === "transfer.p2p") label = "Pago Realizado";
	else if (type.startsWith("transfer")) label = "Envío Realizado";
	else if (type === "withdraw") label = "Movimiento realizado";
	else if (type === "deposit") label = "Depósito Realizado";

	return { color, icon, label };
};

const Header = () => {
	const { top } = useSafeAreaInsets();

	return (
		<>
			<View style={{ height: top }} className="bg-uva" />
			<View className="flex-row items-center justify-between gap-2 px-3 pt-2 pb-4">
				<View className="flex-row items-center gap-4">
					<Pressable
						onPress={() => router.push("/home")}
						className="size-8 justify-center"
					>
						<Arrow color="#200020" />
					</Pressable>

					<Text fontWeight="bold" className="text-[18px] text-uva">
						Detalle del movimiento
					</Text>
				</View>

				<View className="flex-row items-center gap-4">
					<Ionicons name="help" size={28} color="#200020" />
					<Ionicons name="share-social-outline" size={28} color="#200020" />
				</View>
			</View>
		</>
	);
};

const Divider = ({ width }: { width: number }) => (
	<View className="flex-row items-center justify-center my-[1.2rem]">
		{Array.from({ length: Math.floor(width - 28 - 48) / 4 }).map((_, i) => (
			<View
				key={i}
				style={{
					width: 2,
					height: 2,
					backgroundColor: "#d1d1d1",
					marginHorizontal: 1,
				}}
			/>
		))}
	</View>
);

const TransactionStatus = ({ type }: { type: TransactionType }) => {
	const { color, icon, label } = getTransactionStatus(type);

	return (
		<View className="flex-row gap-1 items-center">
			<Ionicons name={icon as "help-circle-outline"} size={17} color={color} />
			<Text style={{ color, fontSize: 17 }}>{label}</Text>
		</View>
	);
};

const QRCodeSection = ({
	transactionId,
	setDisplayAd,
}: {
	transactionId: string;
	setDisplayAd: Dispatch<SetStateAction<boolean>>;
}) => (
	<>
		<Pressable
			onLongPress={() => setDisplayAd(true)}
			className="mt-[0.25rem]"
		>
			<TransactionQr transactionId={transactionId} />
		</Pressable>

		<View className="flex-row pl-1 gap-2 pt-[1.3rem]">
			<Ionicons name="information-circle-outline" size={16} color="#4A4A4A" />
			<Text
				fontWeight="light"
				style={{ color: "#4A4A4A", fontSize: 13 }}
				className="leading-[0.9rem] max-w-[90%]"
			>
				¡Escanea este QR con Nequi para verificar tu envio al instante!
			</Text>
		</View>
	</>
);

const TransactionValue = ({
	name,
	value,
}: {
	name: string;
	value: string | number | undefined | null;
}) => (
	<View className="flex pb-[0.1rem]">
		<Text fontWeight="regular" style={{ color: "#464646", fontSize: 15 }}>
			{name}
		</Text>
		<Text fontWeight="medium" style={{ color: "#200020", fontSize: 15 }}>
			{value == null || value === "" ? "—" : String(value)}
		</Text>
	</View>
);

const TransferDetails = ({
	transaction,
	userPhone,
	findVictimByValue,
}: {
	transaction: Transaction;
	userPhone: string;
	findVictimByValue?: (value: string) => { name: string } | undefined;
}) => (
	<>
		<TransactionValue
			name={transaction.type === "transfer.p2p" ? "Pago en" : "Para"}
			value={recipientDisplayName(transaction, findVictimByValue)}
		/>

		{transaction.type === "transfer.breb" &&
			transaction.phone &&
			transaction.bank && (
				<>
					<TransactionValue name="Llave" value={transaction.phone} />
					<TransactionValue name="Banco destino" value={transaction.bank} />
					<TransactionValue name="Fecha" value={formatDate(transaction.date)} />
				</>
			)}

		<TransactionValue
			name="¿Cuánto?"
			value={formatMoney(transaction.amount ?? 0, true)}
		/>

		{(transaction.type === "transfer.bank" ||
			transaction.type === "transfer.p2p") && (
			<TransactionValue name="Fecha" value={formatDate(transaction.date)} />
		)}

		{transaction.type === "transfer" && transaction.phone && (
			<TransactionValue
				name="Número Nequi"
				value={formatPhone(transaction.phone)}
			/>
		)}

		{transaction.type === "transfer.bank" && (
			<>
				<TransactionValue name="Banco" value="Bancolombia" />
				{transaction.phone && (
					<TransactionValue name="Número de cuenta" value={transaction.phone} />
				)}
			</>
		)}

		{transaction.type === "transfer" && (
			<TransactionValue name="Fecha" value={formatDate(transaction.date)} />
		)}

		<TransactionValue
			name="Referencia"
			value={formatTransactionReference(transaction.id)}
		/>

		{transaction.type === "transfer.breb" && (
			<TransactionValue
				name="¿Desde dónde se hizo el envío?"
				value={formatPhone(userPhone)}
			/>
		)}

		<TransactionValue name="¿De dónde salió la plata?" value="Disponible" />
	</>
);

const IncomeDetails = ({ transaction }: { transaction: Transaction }) => (
	<>
		<TransactionValue name="De" value={transaction.name} />
		<TransactionValue
			name="¿Cuánto?"
			value={formatMoney(transaction.amount ?? 0, true)}
		/>
		<TransactionValue name="Fecha" value={formatDate(transaction.date)} />
		<TransactionValue
			name="Referencia"
			value={formatTransactionReference(transaction.id)}
		/>
	</>
);

const WithdrawDetails = ({ transaction }: { transaction: Transaction }) => (
	<>
		<TransactionValue name="Retiro en" value={transaction.name} />
		<TransactionValue
			name="¿Cuánto?"
			value={formatMoney(transaction.amount ?? 0, true)}
		/>
		<TransactionValue name="Fecha" value={formatDate(transaction.date)} />
		<TransactionValue
			name="Referencia"
			value={formatTransactionReference(transaction.id)}
		/>
		<TransactionValue name="¿De dónde salió la plata?" value="Disponible" />
	</>
);

const DepositDetails = ({ transaction }: { transaction: Transaction }) => (
	<>
		<TransactionValue name="Depósito en" value={transaction.name} />
		<TransactionValue
			name="¿Cuánto?"
			value={formatMoney(transaction.amount ?? 0, true)}
		/>
		<TransactionValue name="Fecha" value={formatDate(transaction.date)} />
		<TransactionValue
			name="Referencia"
			value={formatTransactionReference(transaction.id)}
		/>
	</>
);

const TransactionDetails = ({
	transaction,
	userPhone,
	findVictimByValue,
}: {
	transaction: Transaction;
	userPhone: string;
	findVictimByValue?: (value: string) => { name: string } | undefined;
}) => {
	if (transaction.type.startsWith("transfer")) {
		return (
			<TransferDetails
				transaction={transaction}
				userPhone={userPhone}
				findVictimByValue={findVictimByValue}
			/>
		);
	}

	if (transaction.type === "income") {
		return <IncomeDetails transaction={transaction} />;
	}

	if (transaction.type === "withdraw") {
		return <WithdrawDetails transaction={transaction} />;
	}

	if (transaction.type === "deposit") {
		return <DepositDetails transaction={transaction} />;
	}

	return null;
};

const ActionButtons = ({
	transactionType,
	style,
}: {
	transactionType: TransactionType;
	style: VoucherStyle;
}) => {
	const showActions =
		transactionType.startsWith("transfer") || transactionType === "withdraw";

	if (!showActions) return null;

	return (
		<View className="pt-[1.9rem] px-[0.55rem]">
			{transactionType === "transfer.p2p" && style !== "2" && (
				<Link href="/home" className="mt-2 mb-7">
					<Text
						fontWeight="medium"
						className="text-orquidea text-center text-[16px] underline"
					>
						¿Algún problema con este movimiento?
					</Text>
				</Link>
			)}

			{style === "1" ? (
				<Button onPress={() => router.replace("/home")} title="Listo" />
			) : (
				<Link href="/home">
					<Text
						fontWeight="medium"
						className="text-orquidea text-center text-[16px] underline"
					>
						¿Algún problema con este movimiento?
					</Text>
				</Link>
			)}
		</View>
	);
};
