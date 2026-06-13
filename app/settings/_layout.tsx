import { Stack } from "expo-router";

export default function SettingsLayout() {
	return (
		<Stack
			screenOptions={{
				animation: "slide_from_right",
				headerShown: false,
				contentStyle: { backgroundColor: "#200020" },
			}}
		>
			<Stack.Screen
				name="money"
				options={{
					animation: "slide_from_right",
					contentStyle: { backgroundColor: "#200020", flex: 1 },
				}}
			/>
			<Stack.Screen />
		</Stack>
	);
}
