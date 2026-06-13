import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity, View } from "react-native";
import Text from "@/components/basic/text";
import { BancolombiaLogo } from "@/components/logos";

export function LoginReturningFooter() {
	return (
		<View className="py-9 px-1">
			<View className="flex-row items-center justify-between">
				<TouchableOpacity className="flex-row items-center gap-2 pl-3">
					<Ionicons name="phone-portrait-outline" size={18} color="#FFFFFF" />
					<Text fontWeight="medium" style={{ fontSize: 14, lineHeight: 18 }}>
						¿Cambiaste tu cel?
					</Text>
				</TouchableOpacity>

				<BancolombiaLogo width={48} height={24} />
			</View>
		</View>
	);
}
