import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { SendingAnimation } from "@/components/send/sending-animation";
import { queryClient } from "@/libs/api";
import { showAppAlert } from "@/libs/app-alert";
import { formatPersonName } from "@/libs/utils";
import { walletService } from "@/services/api.service";
import { useVictimsStore } from "@/store/useVictimsStore";

type SendFlow = "bre-b" | "nequi" | "p2p";

function PrebuiltTransactionAnimation({
	id,
	style = "1",
	feedback,
}: {
	id: string;
	style?: string;
	feedback?: string;
}) {
	const [done, setDone] = useState(false);

	useEffect(() => {
		if (!done) return;

		const timer = setTimeout(() => {
			const params = new URLSearchParams({ id, style });
			if (feedback === "1") params.set("feedback", "1");
			router.replace(`/vouchers/nequi?${params.toString()}`);
		}, 150);

		return () => clearTimeout(timer);
	}, [done, feedback, id, style]);

	if (done) return null;

	return <SendingAnimation onComplete={() => setDone(true)} />;
}

function TransferThenAnimate() {
	const { key, amount, mode, phone, name } = useLocalSearchParams<{
		key?: string;
		amount: string;
		mode?: SendFlow;
		phone?: string;
		name?: string;
	}>();
	const flow: SendFlow = mode ?? "bre-b";
	const findVictimByType = useVictimsStore((state) => state.findVictimByType);

	const transactionIdRef = useRef<string | null>(null);
	const animationDoneRef = useRef(false);
	const transferDoneRef = useRef(false);
	const startedRef = useRef(false);

	const goToVoucher = useCallback(() => {
		const id = transactionIdRef.current;
		if (!id) return;

		const params = new URLSearchParams({ id, style: "1" });
		if (flow === "bre-b") params.set("feedback", "1");

		router.replace(`/vouchers/nequi?${params.toString()}`);
	}, [flow]);

	const tryFinish = useCallback(() => {
		if (animationDoneRef.current && transferDoneRef.current) {
			goToVoucher();
		}
	}, [goToVoucher]);

	useEffect(() => {
		if (startedRef.current || !amount) return;

		const amountNumber = parseInt(amount, 10);
		if (!amountNumber) return;

		if (flow === "bre-b" && !key) return;
		if (flow === "nequi" && !phone) return;
		if (flow === "p2p" && !name) return;

		startedRef.current = true;

		const runTransfer = async () => {
			try {
				let transaction;

				if (flow === "bre-b") {
					const victim = findVictimByType("key", key!);
					if (!victim || victim.type !== "key") {
						showAppAlert("No encontramos la llave para enviar");
						router.back();
						return;
					}

					transaction = await walletService.transfer({
						type: "transfer.breb",
						bank: victim.bank,
						amount: amountNumber,
						name: formatPersonName(victim.name),
						phone: victim.value,
					});
				} else if (flow === "nequi") {
					const victim = findVictimByType("phone", phone!);
					if (!victim) {
						showAppAlert("No encontramos el contacto para enviar");
						router.back();
						return;
					}

					transaction = await walletService.transfer({
						type: "transfer",
						amount: amountNumber,
						name: victim.name,
						phone: victim.value,
					});
				} else {
					transaction = await walletService.transfer({
						type: "transfer.p2p",
						amount: amountNumber,
						name: name!,
					});
				}

				queryClient.setQueryData(
					["transaction", transaction.id],
					transaction,
				);

				transactionIdRef.current = transaction.id;
				transferDoneRef.current = true;
				tryFinish();
			} catch (error) {
				showAppAlert(
					error instanceof Error ? error.message : "Error al enviar",
				);
				router.back();
			}
		};

		void runTransfer();
	}, [amount, findVictimByType, flow, key, name, phone, tryFinish]);

	const handleSendingComplete = useCallback(() => {
		animationDoneRef.current = true;
		tryFinish();
	}, [tryFinish]);

	return <SendingAnimation onComplete={handleSendingComplete} />;
}

export default function BreBAnimation() {
	const { id, style, feedback } = useLocalSearchParams<{
		id?: string;
		style?: string;
		feedback?: string;
		key?: string;
		amount?: string;
		mode?: SendFlow;
		phone?: string;
		name?: string;
	}>();

	if (id) {
		return (
			<PrebuiltTransactionAnimation
				id={id}
				style={style ?? "1"}
				feedback={feedback}
			/>
		);
	}

	return <TransferThenAnimate />;
}
