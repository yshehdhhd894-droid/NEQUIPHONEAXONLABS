import { router } from "expo-router";
import HomeFavoritesSection from "@/components/sections/home-favorites-section";
import HomeMiniBannerCarousel from "@/components/sections/home-mini-banner-carousel";
import HomeSuggestedSection from "@/components/sections/home-suggested-section";

/** Body del home en Cuenta de Ahorros (como Nequi real). */
export default function HomeSavingsBody({
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
					<HomeFavoritesSection variant="savings" />
					<HomeSuggestedSection
						variant="savings"
						onMoreServices={() => router.push("/home/services")}
					/>
				</>
			) : null}
		</>
	);
}
