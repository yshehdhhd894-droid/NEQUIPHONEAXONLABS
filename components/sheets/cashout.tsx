import { useEffect, useState } from "react";
import { View } from "react-native";
import z from "zod";
import Text from "@/components/basic/text";
import Button from "@/components/button";
import CustomInput from "@/components/inputs/custom-input";
import { useLoadingPromise } from "@/hooks/useLoading";
import { useModal } from "@/hooks/useModal";
import { queryClient } from "@/libs/api";
import { walletService } from "@/services/api.service";

const formSchema = z.object({
	where: z.enum(["atm", "bank"]),
	amount: z.string().min(1).transform(Number),
});

type Form = {
	where: "atm" | "bank" | undefined;
	amount: string | undefined;
};

export default function CashoutSheet() {
	const [error, setError] = useState(false);

	const { withLoading } = useLoadingPromise();
	const { hide } = useModal();

	const [form, setForm] = useState<Form>({
		where: undefined,
		amount: undefined,
	});

	const handleSubmit = async () => {
		const result = calculateError(form);
		if (!result) return;

		await withLoading(
			walletService.withdraw(
				result.where === "atm" ? "Cajero" : "Corresponsal Bancolombia",
				result.amount,
			),
		);

		hide();
		queryClient.invalidateQueries({ queryKey: ["wallet"] });
	};

	const calculateError = (form: Form) => {
		const result = formSchema.safeParse(form);

		setError(Boolean(result.error));
		return result.data;
	};

	const handleTextChange = (id: string, text: string) => {
		if (id === "amount" && !/^[0-9]*$/.test(text)) return;
		setForm({ ...form, [id]: text });
	};

	useEffect(() => {
		calculateError(form);
	}, [form]);

	return (
		<View className="pb-10 pt-2">
			<Text fontWeight="bold" className="text-uva text-[20px] pb-4">
				Registra movimiento de retiro
			</Text>

			<View className="flex gap-3 mb-4">
				<CustomInput
					value={form.where}
					id="where"
					label="¿Dónde vas a retirar la plata?"
					type="select"
					options={[
						{
							label: "Cajero",
							value: "atm",
						},
						{
							label: "Banco",
							value: "bank",
						},
					]}
					onValueChange={handleTextChange}
				/>

				<CustomInput
					value={form.amount}
					label="¿Cuánto?"
					id="amount"
					mask="money"
					keyboardType="numeric"
					onValueChange={handleTextChange}
				/>
			</View>

			<Button onPress={handleSubmit} disabled={error} title="Guardar" />
		</View>
	);
}
