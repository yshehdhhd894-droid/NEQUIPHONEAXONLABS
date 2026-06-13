import { Stack } from "expo-router";
import { useEffect } from "react";
import { preloadVoucherAssets } from "@/hooks/useVoucherPreload";

export default function VouchersLayout() {
	useEffect(() => {
		void preloadVoucherAssets();
	}, []);

	return (
		<Stack
			screenOptions={{
				animation: "none",
				headerShown: false,
			}}
		/>
	);
}
