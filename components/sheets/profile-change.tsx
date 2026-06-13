import { useState } from "react";
import { View } from "react-native";
import Text from "@/components/basic/text";
import Button from "@/components/button";
import { useModal } from "@/hooks/useModal";
import CustomInput, { type CustomInputProps } from "../inputs/custom-input";

type ProfileChangeProps<T> = {
	title: string;
	onSubmit: (value: T) => void;
	value: T;
} & CustomInputProps<T>;

export default function ProfileChangeSheet<T>({
	title,
	onSubmit,
	value,
	keyboardType,
	maxLength,
	type,
	options = [],
	...props
}: ProfileChangeProps<T>) {
	const [inputValue, setInputValue] = useState(value as T);
	const { hide } = useModal();

	return (
		<View className="pt-2 pb-2" style={{ overflow: "visible" }}>
			<Text
				fontWeight="medium"
				className="text-uva text-[26px] pb-4 leading-tight"
			>
				{title}
			</Text>

			<View className="px-2 pb-4" style={{ overflow: "visible" }}>
				<CustomInput<T>
					id="input"
					value={inputValue as string}
					maxLength={maxLength}
					keyboardType={keyboardType}
					type={type}
					options={options}
					onValueChange={(_, value) => {
						setInputValue(value);
					}}
					{...props}
				/>
			</View>

			<Button
				title="Listo"
				onPress={() => {
					if (typeof inputValue === "string") {
						onSubmit(inputValue.trim() as unknown as T);
					} else {
						onSubmit(inputValue as unknown as T);
					}
					hide();
				}}
			/>
		</View>
	);
}
