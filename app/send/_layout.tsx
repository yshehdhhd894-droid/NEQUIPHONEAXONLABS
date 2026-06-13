import { Stack } from "expo-router";

export default function SendLayout() {
	return (
		<Stack
			screenOptions={{
				animation: "ios_from_right",
				headerShown: false,
			}}
		>
			<Stack.Screen name="nequi/index" />
			<Stack.Screen
				name="nequi/confirm"
				options={{ animation: "none" }}
			/>
			<Stack.Screen
				name="bre-b/animation"
				options={{ animation: "none" }}
			/>
			<Stack.Screen />
		</Stack>
	);
}
