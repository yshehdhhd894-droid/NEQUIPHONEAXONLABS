import type React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaskedTextInput } from "react-native-mask-text";

interface InputProps {
	type: "phone";
	value: string;
	setValue: React.Dispatch<string>;
}

export default function PhoneLoginInput({ setValue, type, value }: InputProps) {
	const handleChange = (text: string) => {
		if (!text.startsWith("3") && text) return;
		setValue(text);
	};

	return (
		<View className="mb-[4px]" style={styles.item}>
			{type === "phone" && (
				<>
					<Text style={styles.code}>+57</Text>
					<Text style={styles.division}>|</Text>
				</>
			)}

			<MaskedTextInput
				mask="999 999 9999"
				value={value}
				onChangeText={handleChange}
				keyboardType="numeric"
				placeholder="Ingresa tu cel"
				placeholderTextColor="white"
				style={styles.input}
				autoCapitalize="none"
				autoCorrect={false}
				autoComplete="off"
				underlineColorAndroid="transparent"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	item: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#4d334d",
		borderRadius: 4,
		minHeight: 54,
	},
	code: {
		fontSize: 14,
		color: "#f1bfda",
		padding: 10,
	},
	division: {
		color: "#200020",
		fontSize: 25,
		fontFamily: "ManropeRegular",
	},
	input: {
		flex: 1,
		fontSize: 16,
		color: "white",
		padding: 10,
		fontFamily: "ManropeMedium",
		outlineStyle: "none",
	},
});
