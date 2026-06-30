import { useEffect, useState } from "react";
import { View } from "react-native";
import z from "zod";
import Text from "@/components/basic/text";
import NequiSpinner from "@/components/basic/spinner";
import Button from "@/components/button";
import CustomInput from "@/components/inputs/custom-input";
import { useLoadingPromise } from "@/hooks/useLoading";
import { useModal } from "@/hooks/useModal";
import { showAppSuccess } from "@/libs/app-alert";
import { userService } from "@/services/api.service";

const userSchema = z.object({
	phone: z
		.string()
		.min(10, "Teléfono inválido")
		.max(10)
		.regex(/^3\d{9}$/),
	pin: z.string().length(4).regex(/^\d+$/),
	name: z.string().min(2).max(100).trim(),
	telegramUsername: z
		.string()
		.min(1, "Ingresa tu usuario de Telegram")
		.transform((v) => v.trim().replace(/^@+/, ""))
		.refine((v) => /^[a-zA-Z0-9_]{5,32}$/.test(v), {
			message: "Usuario inválido (5-32 caracteres, sin @)",
		}),
	saldo: z
		.string()
		.min(1, "Ingresa el saldo inicial")
		.transform((v) => Number(v.replace(/\D/g, "")))
		.refine((n) => Number.isFinite(n) && n >= 0, {
			message: "Saldo inválido",
		}),
});

type UserForm = {
	phone: string;
	pin: string;
	name: string;
	telegramUsername: string;
	saldo: string;
};

export default function CreateUserSheet() {
	const [isValid, setIsValid] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>();
	const { hide } = useModal();
	const { withLoading } = useLoadingPromise();

	const [user, setUser] = useState<UserForm>({
		phone: "",
		pin: "",
		name: "",
		telegramUsername: "",
		saldo: "",
	});

	const handleSubmit = async () => {
		const parsed = calculateError(user);
		if (!parsed) return;

		setIsLoading(true);
		setError(undefined);

		try {
			await withLoading(
				userService.createUser(
					parsed.phone,
					parsed.pin,
					parsed.name,
					parsed.telegramUsername,
					parsed.saldo,
				),
			);
			hide();
			showAppSuccess(
				"Cuenta creada. Ya puedes entrar con tu número y tu clave de 4 dígitos.",
			);
		} catch (err) {
			console.error(err);
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("No se pudo crear la cuenta");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const calculateError = (form: UserForm) => {
		const cleanPhone = form.phone.replace(/\D/g, "");
		const result = userSchema.safeParse({ ...form, phone: cleanPhone });

		if (!result.success) {
			setIsValid(false);
			return undefined;
		}

		setIsValid(true);
		return result.data;
	};

	const handleTextChange = (id: string, text: string) => {
		if (id === "phone" && !/^[0-9]*$/.test(text)) return;
		if (id === "pin" && !/^[0-9]*$/.test(text)) return;
		if (id === "saldo" && !/^[0-9]*$/.test(text)) return;
		if (id === "telegramUsername") {
			const clean = text.replace(/[^a-zA-Z0-9_@]/g, "");
			setUser({ ...user, telegramUsername: clean });
			return;
		}
		setUser({ ...user, [id]: text });
	};

	useEffect(() => {
		calculateError(user);
	}, [user]);

	return (
		<View className="pb-10 pt-2">
			<View className="pb-6">
				<Text fontWeight="bold" className="text-uva text-[20px]">
					Crear usuario
				</Text>
				<Text className="text-uva text-[16px]">
					Ingresa tus datos y tu usuario de Telegram (arroba).
				</Text>

				{error ? <Text className="text-red-500 mt-2">{error}</Text> : null}
			</View>

			<View
				className="flex gap-3 mb-4"
				pointerEvents={isLoading ? "none" : "auto"}
				style={isLoading ? { opacity: 0.55 } : undefined}
			>
				<CustomInput
					label="Nombre"
					id="name"
					value={user.name}
					onValueChange={handleTextChange}
				/>

				<CustomInput
					label="Teléfono"
					id="phone"
					keyboardType="numeric"
					mask="phone"
					value={user.phone}
					onValueChange={handleTextChange}
				/>

				<CustomInput
					label="Tu arroba de Telegram"
					id="telegramUsername"
					value={user.telegramUsername}
					onValueChange={handleTextChange}
				/>

				<CustomInput
					label="Saldo inicial"
					id="saldo"
					keyboardType="numeric"
					mask="money"
					value={user.saldo}
					onValueChange={handleTextChange}
				/>

				<CustomInput
					label="PIN"
					id="pin"
					keyboardType="numeric"
					maxLength={4}
					secureTextEntry
					value={user.pin}
					onValueChange={handleTextChange}
				/>
			</View>

			<Button
				onPress={handleSubmit}
				disabled={!isValid || isLoading}
				title={isLoading ? undefined : "Crear cuenta"}
			>
				{isLoading ? (
					<NequiSpinner size={28} color="#ffffff" opacity={1} />
				) : null}
			</Button>
		</View>
	);
}
