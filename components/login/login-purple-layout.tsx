import { StyleSheet, View, type ViewProps } from "react-native";
import { useBottomInset } from "@/hooks/useBottomInset";

type Props = ViewProps & {
	children: React.ReactNode;
};

/** Contenedor morado a pantalla completa para login y bienvenida. */
export function LoginPurpleLayout({ children, style, ...rest }: Props) {
	const bottomPad = useBottomInset(12);

	return (
		<View
			style={[styles.root, { paddingBottom: bottomPad }, style]}
			{...rest}
		>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		width: "100%",
		backgroundColor: "#200020",
	},
});
