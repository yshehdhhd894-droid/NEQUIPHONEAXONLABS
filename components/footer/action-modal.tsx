import { router } from "expo-router";
import { type Dispatch, type ReactElement, useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withTiming,
} from "react-native-reanimated";
import type { SvgProps } from "react-native-svg";
import Text from "@/components/basic/text";
import {
	CashIn,
	Cashout,
	QRCode,
	Request,
	Send,
	Services,
} from "@/components/logos/use-money";
import CashoutSheet from "@/components/sheets/cashout";
import ChargeSheet from "@/components/sheets/charge";
import SendSheet from "@/components/sheets/send";
import { useBottomInset } from "@/hooks/useBottomInset";
import { useFooterLayoutMetrics } from "@/hooks/useFooterLayoutMetrics";
import { useModal } from "@/hooks/useModal";

export function ActionModal({
	isOpen,
	topInset,
	setOpenModal,
}: ActionModalProps) {
	if (!isOpen) return null;

	return (
		<View
			style={{ marginTop: topInset }}
			className="absolute z-10 w-full h-full bg-white/95"
		>
			<ActionsList setOpenModal={setOpenModal} actions={actions} />
		</View>
	);
}

function ActionsList({ actions, setOpenModal }: ActionsListProps) {
	const bottomInset = useBottomInset();
	const footer = useFooterLayoutMetrics();
	const bottom = footer.footerHeight + bottomInset + footer.actionBottomExtra;
	return (
		<View
			className="z-20 absolute flex items-end"
			style={{
				bottom,
				right: footer.horizontalPadding,
				gap: footer.actionGap,
			}}
		>
			{actions.map((action, index) => (
				<ActionItemComponent
					key={`${action.title}-${index}`}
					{...action}
					setOpenModal={setOpenModal}
					delay={(actions.length - index) * 25}
				/>
			))}
		</View>
	);
}

type ActionItemComponentProps = ActionItem & {
	setOpenModal: Dispatch<boolean>;
	delay: number;
};

function ActionItemComponent(props: ActionItemComponentProps) {
	const footer = useFooterLayoutMetrics();
	const opacity = useSharedValue(0);
	const translateY = useSharedValue(20);

	const { hide, show } = useModal();

	useEffect(() => {
		opacity.value = withDelay(props.delay, withTiming(1, { duration: 250 }));
		translateY.value = withDelay(props.delay, withTiming(0, { duration: 250 }));
	}, [props.delay]);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
		transform: [{ translateY: translateY.value }],
	}));

	const handlePressItem = async () => {
		props.setOpenModal(false);
		await new Promise((resolve) => setTimeout(resolve, 200));

		if (props.href) {
			router.push(props.href);
		} else if (props.onPress) {
			props.onPress(hide, show);
		}
	};

	return (
		<Animated.View style={animatedStyle}>
			<Pressable
				onPress={handlePressItem}
				className="flex-row items-center justify-center gap-4"
			>
				<Text
					fontWeight="medium"
					className="text-uva"
					style={{ fontSize: footer.actionLabelSize }}
				>
					{props.title}
				</Text>
				{<props.icon />}
			</Pressable>
		</Animated.View>
	);
}

interface ActionModalProps {
	isOpen: boolean;
	setOpenModal: Dispatch<boolean>;
	topInset: number;
}

interface ActionsListProps {
	actions: ActionItem[];
	setOpenModal: Dispatch<boolean>;
}

interface ActionItem {
	title: string;
	icon: (props: SvgProps) => ReactElement;
	href?: string;
	onPress?: (
		hide: () => void,
		show: (content: React.ReactNode) => void,
	) => void;
}

const actions: ActionItem[] = [
	{ title: "+ Servicios", icon: Services, href: "/home/services" },
	{
		title: "Saca",
		icon: Cashout,
		onPress: (_, show) => show(<CashoutSheet />),
	},
	{ title: "Pide", icon: Request, href: "/send/request" },
	{
		title: "Envía",
		icon: Send,
		onPress: (_, show) => show(<SendSheet />),
	},
	{ title: "Código QR", icon: QRCode, href: "/send/qr" },
	{
		title: "Recarga Nequi",
		icon: CashIn,
		onPress: (_, show) => show(<ChargeSheet />),
	},
];
