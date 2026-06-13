import { TouchableOpacity, View } from "react-native";
import Text from "@/components/basic/text";
import { BancolombiaLogo, TicketIcon } from "@/components/logos";

type Props = {
	hideCheckPayment?: boolean;
};

export function LoginFooter({ hideCheckPayment }: Props) {
	return (
		<View className="py-9 px-1">
			<View className="flex-row items-center justify-between">
				{hideCheckPayment ? (
					<View
						className="flex-row items-center gap-2 pl-3 opacity-0"
						pointerEvents="none"
					>
						<TicketIcon size={26} />
						<Text className="text-[18px]">Comprobar un pago</Text>
					</View>
				) : (
					<TouchableOpacity className="flex-row items-center gap-2 pl-3">
						<TicketIcon size={26} />
						<Text className="text-[18px]">Comprobar un pago</Text>
					</TouchableOpacity>
				)}

				<BancolombiaLogo width={48} height={24} />
			</View>
		</View>
	);
}
