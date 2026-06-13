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
	amount: z.string().min(1).transform(Number),
});

type Form = {
	amount: string | undefined;
};

export default function ChargeSheet({ info }: { info?: string }) {
	const [error, setError] = useState(false);

	const { withLoading } = useLoadingPromise();
	const { hide } = useModal();

	const [form, setForm] = useState<Form>({
		amount: undefined,
	});

	const handleSubmit = async () => {
		const result = calculateError(form);
		if (!result) return;

		await withLoading(
			walletService.deposit("Corresponsal Bancolombia", result.amount),
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
			<View className="pb-4">
				<Text fontWeight="bold" className="text-uva text-[20px]">
					Agrega plata a tu cuenta
				</Text>
				{info && <Text className="text-uva text-[16px]">{info}</Text>}
			</View>

			<View className="flex gap-3 mb-4">
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
