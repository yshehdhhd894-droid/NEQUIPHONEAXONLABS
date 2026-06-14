import Ionicons from "@expo/vector-icons/Ionicons";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	Animated,
	Platform,
	Pressable,
	StyleSheet,
	TextInput,
	type TextInputProps,
	View,
} from "react-native";
import Text from "@/components/basic/text";
import SelectSheet from "@/components/sheets/select";
import { useModal } from "@/hooks/useModal";
import { cn, formatMoney, formatPhone } from "@/libs/utils";

export type MaskType = "money" | "phone" | "none" | "bre-b";
export type InputType = "text" | "textarea" | "select" | "sheet-select";

interface SelectOption<T> {
	label: string;
	value: T;
}

const applyMask = (value: string, mask: MaskType): string => {
	switch (mask) {
		case "money":
			return formatMoney(value);
		case "phone":
			return formatPhone(value);
		case "bre-b":
			return value.startsWith("3") && value.length === 10
				? formatPhone(value)
				: value;
		default:
			return value;
	}
};

const removeMask = (value: string, mask: MaskType): string => {
	switch (mask) {
		case "money":
			return value.replace(/[$\s,.]/g, "");
		case "phone":
		case "bre-b":
			return value.startsWith("3") && value.length === 10
				? value.replace(/\s/g, "")
				: mask === "phone"
					? value.replace(/\s/g, "")
					: value;
		default:
			return value;
	}
};

const ANIMATION_CONFIG = {
	duration: 150,
	useNativeDriver: false,
};

const webInputReset =
	Platform.OS === "web"
		? ({
				outlineStyle: "none",
				borderWidth: 0,
				appearance: "none",
				WebkitAppearance: "none",
				margin: 0,
				boxSizing: "border-box",
			} as const)
		: {};

function CustomInput<T>({
	id,
	value,
	keyboardType,
	label,
	onValueChange,
	onFieldFocus,
	rightIcon,
	disabled = false,
	mask = "none",
	type = "text",
	options = [],
	...props
}: CustomInputProps<T>) {
	const [isOpen, setIsOpen] = useState(false);
	const inputRef = useRef<TextInput>(null);
	const floatingLabelAnimation = useRef(
		new Animated.Value(value ? 1 : 0),
	).current;
	const { show } = useModal();

	const displayValue = useMemo(
		() => (value ? applyMask(String(value), mask) : ""),
		[value, mask],
	);

	const handleFocus = useCallback(() => {
		onFieldFocus?.();
		Animated.timing(floatingLabelAnimation, {
			toValue: 1,
			...ANIMATION_CONFIG,
		}).start();
	}, [floatingLabelAnimation, onFieldFocus]);

	const handleBlur = useCallback(() => {
		if (!value || String(value).trim() === "") {
			Animated.timing(floatingLabelAnimation, {
				toValue: 0,
				...ANIMATION_CONFIG,
			}).start();
		}
	}, [value, floatingLabelAnimation]);

	const idleTop = type === "textarea" ? 26 : 28;

	const floatingLabelStyle = useMemo(
		() => ({
			top: floatingLabelAnimation.interpolate({
				inputRange: [0, 1],
				outputRange: [idleTop, 6],
			}),
			fontSize: floatingLabelAnimation.interpolate({
				inputRange: [0, 1],
				outputRange: [15, 12],
			}),
			color: floatingLabelAnimation.interpolate({
				inputRange: [0, 1],
				outputRange: ["#200020", "#da0081"],
			}),
		}),
		[floatingLabelAnimation, idleTop],
	);

	const selectedOption = useMemo(
		() => options.find((opt) => opt.value === value),
		[options, value],
	);

	const focusInput = useCallback(() => {
		if (disabled) return;
		inputRef.current?.focus();
	}, [disabled]);

	const handleSheetPress = useCallback(() => {
		if (disabled) return;
		handleFocus();

		show(
			<SelectSheet<T>
				options={options as Array<{ label: string; value: T }>}
				title="Tipo de cuenta"
				onSubmit={(selectedValue) => {
					if (id && onValueChange) {
						onValueChange(id, selectedValue);
						handleBlur();
					}
				}}
			/>,
		);
	}, [disabled, handleFocus, show, options, id, onValueChange, handleBlur]);

	const handleSelectPress = useCallback(() => {
		if (disabled) return;
		setIsOpen((prev) => {
			if (!prev) {
				handleFocus();
			} else {
				handleBlur();
			}
			return !prev;
		});
	}, [disabled, handleFocus, handleBlur]);

	const handleOptionPress = useCallback(
		(option: SelectOption<T>) => {
			if (props.onChangeText) {
				props.onChangeText(option.value as string);
			}

			if (onValueChange && id) {
				onValueChange(id, option.value as T);
			}

			setIsOpen(false);
		},
		[props.onChangeText, onValueChange, id],
	);

	const handleTextChange = useCallback(
		(text: string) => {
			const rawValue = removeMask(text, mask);

			if (mask === "phone" && rawValue.length > 10) {
				return;
			}

			if (props.onChangeText) {
				props.onChangeText(rawValue);
			}

			if (onValueChange && id) {
				onValueChange(id, rawValue as T);
			}
		},
		[mask, props.onChangeText, onValueChange, id],
	);

	useEffect(() => {
		if (value && String(value).trim() !== "") {
			handleFocus();
		} else {
			handleBlur();
		}
	}, [value, handleFocus, handleBlur]);

	const renderFloatingLabel = (extraStyle?: object) => (
		<Animated.Text
			pointerEvents="none"
			style={[styles.floatingLabel, floatingLabelStyle, extraStyle]}
		>
			{label}
		</Animated.Text>
	);

	if (type === "sheet-select") {
		return (
			<View style={styles.wrap}>
				{renderFloatingLabel(disabled ? { color: "#a7a5a6" } : undefined)}

				<Pressable
					onPress={handleSheetPress}
					disabled={disabled}
					style={[styles.field, disabled && styles.fieldDisabled]}
				>
					<View pointerEvents="none" style={styles.fieldValueWrap}>
						<Text
							fontWeight="medium"
							style={[
								styles.fieldValueText,
								disabled && styles.fieldValueDisabled,
							]}
						>
							{selectedOption?.label || ""}
						</Text>
					</View>
					<Ionicons
						name="chevron-forward"
						size={20}
						color={disabled ? "#6b7280" : "#200020"}
					/>
				</Pressable>
			</View>
		);
	}

	if (type === "select") {
		return (
			<View style={styles.wrap}>
				{isOpen ? (
					<View style={styles.selectMenu}>
						{options.map((option, index) => (
							<Pressable
								key={option.value as string}
								onPress={() => handleOptionPress(option)}
								style={[
									styles.selectOption,
									index !== options.length - 1 && styles.selectOptionBorder,
								]}
							>
								<Text
									fontWeight="medium"
									style={{
										color: value === option.value ? "#da0081" : "#200020",
										fontSize: 16,
										lineHeight: 22,
										fontFamily: "ManropeMedium",
									}}
								>
									{option.label}
								</Text>
							</Pressable>
						))}
					</View>
				) : null}

				<View style={styles.relativeWrap}>
					{renderFloatingLabel(disabled ? { color: "#a7a5a6" } : undefined)}

					<Pressable
						onPress={handleSelectPress}
						disabled={disabled}
						style={[styles.field, disabled && styles.fieldDisabled]}
					>
						<View pointerEvents="none" style={styles.fieldValueWrap}>
							<Text
								fontWeight="medium"
								style={[
									styles.fieldValueText,
									disabled && styles.fieldValueDisabled,
								]}
							>
								{selectedOption?.label || ""}
							</Text>
						</View>
						<Ionicons
							name={isOpen ? "chevron-up" : "chevron-down"}
							size={20}
							color={disabled ? "#6b7280" : "#200020"}
						/>
					</Pressable>
				</View>
			</View>
		);
	}

	return (
		<Pressable
			onPress={focusInput}
			disabled={disabled}
			style={styles.wrap}
			accessibilityRole="none"
		>
			{renderFloatingLabel(disabled ? { color: "#a7a5a6" } : undefined)}

			{rightIcon ? (
				<View style={styles.rightIcon} pointerEvents="box-none">
					{rightIcon}
				</View>
			) : null}

			<TextInput
				ref={inputRef}
				value={displayValue}
				keyboardType={mask === "phone" ? "numeric" : keyboardType || "default"}
				cursorColor="#200020"
				editable={!disabled}
				style={[
					styles.textInput,
					type === "textarea" ? styles.textarea : styles.singleLine,
					rightIcon ? styles.textInputWithIcon : null,
					disabled && styles.disabledInput,
					webInputReset,
				]}
				multiline={type === "textarea"}
				numberOfLines={type === "textarea" ? 4 : 1}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onChangeText={handleTextChange}
				placeholder=""
				underlineColorAndroid="transparent"
				{...props}
			/>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	wrap: {
		width: "100%",
		borderRadius: 4,
		position: "relative",
	},
	relativeWrap: {
		position: "relative",
	},
	floatingLabel: {
		position: "absolute",
		zIndex: 2,
		left: 24,
		right: 14,
		fontFamily: "ManropeMedium",
		lineHeight: 18,
	},
	field: {
		backgroundColor: "#fcf6fa",
		borderRadius: 4,
		paddingTop: 20,
		paddingLeft: 24,
		paddingRight: 14,
		paddingBottom: 8,
		minHeight: 58,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "100%",
	},
	fieldDisabled: {
		opacity: 0.95,
	},
	fieldValueWrap: {
		flex: 1,
		paddingTop: 6,
		paddingBottom: 2,
		paddingRight: 8,
		justifyContent: "center",
	},
	fieldValueText: {
		color: "#200020",
		fontSize: 18,
		lineHeight: 24,
		fontFamily: "ManropeMedium",
	},
	fieldValueDisabled: {
		color: "#a7a5a6",
	},
	selectMenu: {
		backgroundColor: "#fcf6fa",
		borderWidth: 1,
		borderColor: "#e5e7eb",
		borderRadius: 4,
		marginBottom: 8,
		overflow: "hidden",
	},
	selectOption: {
		paddingLeft: 24,
		paddingRight: 14,
		paddingVertical: 14,
	},
	selectOptionBorder: {
		borderBottomWidth: 1,
		borderBottomColor: "#f3f4f6",
	},
	textInput: {
		backgroundColor: "#fcf6fa",
		color: "#200020",
		borderRadius: 4,
		paddingTop: 28,
		paddingLeft: 24,
		paddingRight: 14,
		paddingBottom: 10,
		fontSize: 18,
		lineHeight: 24,
		width: "100%",
		fontFamily: "ManropeMedium",
		includeFontPadding: false,
		textAlignVertical: "center",
	},
	singleLine: {
		minHeight: 58,
	},
	textarea: {
		minHeight: 120,
		height: 120,
		textAlignVertical: "top",
		paddingTop: 18,
		paddingBottom: 12,
	},
	textInputWithIcon: {
		paddingRight: 52,
	},
	disabledInput: {
		color: "#a7a5a6",
	},
	rightIcon: {
		position: "absolute",
		right: 16,
		top: 18,
		zIndex: 3,
	},
});

export default memo(CustomInput) as typeof CustomInput;

export type CustomInputProps<T> = {
	onValueChange?: (id: string, text: T) => void;
	onFieldFocus?: () => void;
	label: string;
	rightIcon?: React.ReactNode;
	disabled?: boolean;
	mask?: MaskType;
	type?: InputType;
	options?: SelectOption<T>[];
} & TextInputProps;
