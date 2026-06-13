import { View } from "react-native";
import { showAppAlert } from "@/libs/app-alert";
import Text from "@/components/basic/text";
import { ServiceCardSvg } from "@/components/cards/home-favorites";
import { AddCircle, CreditCard, Games, Keys, Pockets } from "../service-logos";

export default function AddCardSheet() {
	return (
		<View className="pb-10 pt-2">
			<View className="flex gap-2">
				<Text fontWeight="bold" className="text-uva text-[26px]">
					Favoritos
				</Text>
				<Text className="text-gray-500">
					Agrega, cambia o elimina tus favoritos para que siempre los tengas en
					el inicio.
				</Text>
			</View>

			<View className="px-6 py-4 flex-row justify-between">
				<ServiceCardSvg
					cross={() => showAppAlert("Development in progress")}
					name="Tarjeta"
					element={CreditCard}
				/>
				<ServiceCardSvg
					cross={() => showAppAlert("Development in progress")}
					onPress={() => {}}
					name="Juegos"
					element={Games}
				/>
				<ServiceCardSvg
					cross={() => showAppAlert("Development in progress")}
					onPress={() => {}}
					name="Bolsillos"
					element={Pockets}
				/>
			</View>

			<View className="px-6 py-2 flex-row justify-between">
				<ServiceCardSvg
					cross={() => showAppAlert("Development in progress")}
					onPress={() => {}}
					name="Tus llaves"
					element={Keys}
				/>
				<ServiceCardSvg name="Agrega" element={AddCircle} />
				<ServiceCardSvg name="Agrega" element={AddCircle} />
			</View>
		</View>
	);
}
