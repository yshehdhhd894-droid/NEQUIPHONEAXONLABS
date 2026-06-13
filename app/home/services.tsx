import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/basic/text";
import { ServicesStoreBanner } from "@/components/services/services-store-banner";

interface CategoryItem {
	id: string;
	title: string;
	icon: keyof typeof Ionicons.glyphMap;
	badge?: string;
}

export default function Services() {
	const [searchQuery, setSearchQuery] = useState("");
	const { top } = useSafeAreaInsets();
	const categories: CategoryItem[] = [
		{ id: "1", title: "Celulares y paquetes", icon: "phone-portrait-outline" },
		{ id: "2", title: "Donaciones", icon: "happy-outline" },
		{ id: "3", title: "Entretenimiento", icon: "film-outline" },
		{ id: "4", title: "Finanzas", icon: "wallet-outline" },
		{ id: "5", title: "Negocios Nequi", icon: "storefront-outline" },
		{ id: "6", title: "Seguridad y salud", icon: "heart-outline" },
		{ id: "7", title: "Servicios públicos", icon: "home-outline" },
		{
			id: "8",
			title: "Tienda virtual",
			icon: "cart-outline",
			badge: "Compra y Recibe plata",
		},
		{ id: "9", title: "Transporte y viajes", icon: "bus-outline" },
	];

	return (
		<ScrollView
			style={{ marginTop: top, backgroundColor: "#FFFFFF" }}
			showsVerticalScrollIndicator={false}
			alwaysBounceVertical={false}
			overScrollMode="never"
			bounces={false}
			contentContainerStyle={{ paddingBottom: 0, flexGrow: 0 }}
		>
			<View className="px-2 pt-2">
				{/* Header */}
				<Text
					fontWeight="bold"
					className="text-[26px] text-uva mb-3 mt-[2.15rem]"
				>
					Servicios
				</Text>

				{/* Search Bar */}
				<View className="w-full mb-4 relative">
					<Ionicons
						style={{
							position: "absolute",
							top: 9,
							left: 12,
							zIndex: 10,
						}}
						name="search-outline"
						size={22}
						color="#666"
					/>
					<TextInput
						className="bg-[#f5f5f5] rounded-[4px] py-3 pl-12 pr-4"
						style={{ fontSize: 14 }}
						placeholder="¿Qué empresa necesitas?"
						placeholderTextColor="#999"
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>

				{/* Mis pagos inscritos */}
				<View
					className="bg-white rounded-[4px] p-4 mb-4 flex-row items-center justify-between shadow-sm"
					style={{
						shadowColor: "#200020",
						shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 0.4,
						shadowRadius: 4,
						elevation: 8,
					}}
				>
					<View className="flex-row items-center">
						<Ionicons
							name="receipt-outline"
							size={24}
							color="black"
							className="mr-3"
						/>
						<Text fontWeight="semibold" className="text-lg text-uva">
							Mis pagos inscritos
						</Text>
					</View>
					<Ionicons name="chevron-forward" size={24} color="#666" />
				</View>

				{/* Categories Header */}
				<View className="flex-row items-center mb-7 mx-2">
					<Ionicons
						name="grid"
						size={18}
						color="#200020"
						style={{ marginRight: 8 }}
					/>
					<Text fontWeight="semibold" className="text-xl text-uva">
						Categorías
					</Text>
				</View>

				{/* Categories Grid */}
				<View className="flex-row flex-wrap justify-between mb-4">
					{categories.map((category) => (
						<View
							key={category.id}
							className="bg-white rounded-[4px] p-3 py-4 mb-2 relative flex-row items-center gap-2"
							style={{
								width: "49%",
								shadowColor: "#200020",
								shadowOffset: { width: 0, height: 1 },
								shadowOpacity: 0.3,
								shadowRadius: 4,
								elevation: 3,
							}}
						>
							{category.badge && (
								<View className="absolute top-0.5 right-0.5 bg-[#44d6e6] rounded-full px-2 py-0.5 z-10">
									<Text fontWeight="semibold" className="text-xs text-black">
										{category.badge}
									</Text>
								</View>
							)}
							<Ionicons name={category.icon} size={32} color="#da0081" />
							<Text
								fontWeight="medium"
								className="text-base text-uva leading-tight flex-1"
								style={{ flexShrink: 1 }}
							>
								{category.title}
							</Text>
						</View>
					))}
				</View>

				<ServicesStoreBanner />
			</View>
		</ScrollView>
	);
}
