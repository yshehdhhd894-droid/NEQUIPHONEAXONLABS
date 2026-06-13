import { router } from "expo-router";
import HomeFavoritesSection from "@/components/sections/home-favorites-section";
import HomeMiniBannerCarousel from "@/components/sections/home-mini-banner-carousel";
import HomeSuggestedSection from "@/components/sections/home-suggested-section";

/** Body del home en Depósito Bajo Monto (Nequi normal). */
export default function HomeNormalBody({
	showBanner = true,
	showSections = true,
}: {
	showBanner?: boolean;
	showSections?: boolean;
}) {
	return (
		<>
			{showBanner ? <HomeMiniBannerCarousel /> : null}
			{showSections ? (
				<>
					<HomeFavoritesSection variant="normal" />
					<HomeSuggestedSection
						variant="normal"
						onMoreServices={() => router.push("/home/services")}
					/>
				</>
			) : null}
		</>
	);
}
