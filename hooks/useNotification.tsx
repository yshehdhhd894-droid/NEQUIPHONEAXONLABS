import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { showAppAlert } from "@/libs/app-alert";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldPlaySound: true,
		shouldSetBadge: false,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
});

export function useNotifications() {
	useEffect(() => {
		registerForPushNotifications();
	}, []);

	const registerForPushNotifications = async () => {
		if (!Device.isDevice) return;

		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;

		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}

		if (finalStatus !== "granted") {
			showAppAlert("No se otorgaron permisos de notificaciones");
			return;
		}
	};

	const sendLocalNotification = async (
		title: string,
		body: string,
		data: Record<string, unknown> = {},
	) => {
		await Notifications.scheduleNotificationAsync({
			content: {
				title,
				body,
				data,
			},
			trigger: null,
		});
	};

	const scheduleNotification = async (
		title: string,
		body: string,
		seconds: number,
	) => {
		await Notifications.scheduleNotificationAsync({
			content: { title, body },
			trigger: {
				type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
				seconds,
			},
		});
	};

	return {
		sendLocalNotification,
		scheduleNotification,
	};
}
