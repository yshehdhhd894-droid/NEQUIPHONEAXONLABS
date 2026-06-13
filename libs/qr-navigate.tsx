import type { ReactNode } from "react";
import { router } from "expo-router";
import AddVictimSheet from "@/components/sheets/add-victim";
import type { EmvCoProfile } from "@/libs/emvco";
import { useLoading } from "@/hooks/useLoading";

type NavigateQrOptions = {
	addVictim: (victim: {
		type: "phone" | "key";
		name: string;
		value: string;
		bank?: string;
	}) => void;
	findVictim: (
		type: "phone" | "key",
		value: string,
	) => { name: string } | undefined;
	showModal: (node: ReactNode) => void;
	autoShow: ReturnType<typeof useLoading>["autoShow"];
};

export async function navigateFromQrProfile(
	info: EmvCoProfile,
	opts: NavigateQrOptions,
) {
	const { addVictim, findVictim, showModal, autoShow } = opts;

	if (info.qrType === "P2P.NEQUI") {
		addVictim({
			type: "phone",
			name: info.name,
			value: info.key,
		});
		router.push("/home");
		await autoShow(2500, 0);
		return router.push(`/send/nequi?phone=${info.key}`);
	}

	if (info.qrType === "P2P.APP") {
		return router.push(`/send/p2p?name=${encodeURIComponent(info.name)}`);
	}

	if (info.qrType === "RBM") {
		const isBancolombia =
			/bancolombia/i.test(info.name) || /bancolombia/i.test(info.key);

		const victim = findVictim("key", info.key);
		if (!victim) {
			showModal(
				<AddVictimSheet
					type="key"
					name={info.name}
					value={info.key}
					bank={isBancolombia ? "Bancolombia" : undefined}
					onSubmit={async (victim) => {
						if (victim) {
							router.push("/home");
							await autoShow(2500, 0);
							return router.push(
								`/send/bre-b/pay?name=${encodeURIComponent(info.name)}&key=${info.key}`,
							);
						}
					}}
				/>,
			);
			return;
		}

		router.push("/home");
		await autoShow(2500, 0);
		return router.push(
			`/send/bre-b/pay?name=${encodeURIComponent(info.name)}&key=${info.key}`,
		);
	}
}
