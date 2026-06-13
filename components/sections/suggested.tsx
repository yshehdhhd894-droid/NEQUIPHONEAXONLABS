import { router } from "expo-router";
import HomeSuggestedSection from "@/components/sections/home-suggested-section";

/** @deprecated Usar HomeSuggestedSection directamente. */
export default function Suggested() {
	return (
		<HomeSuggestedSection
			variant="normal"
			onMoreServices={() => router.push("/home/services")}
		/>
	);
}
