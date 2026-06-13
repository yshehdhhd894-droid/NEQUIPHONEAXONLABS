import { useEffect, useState } from "react";
import { View } from "react-native";
import z from "zod";
import Text from "@/components/basic/text";
import Button from "@/components/button";
import CustomInput from "@/components/inputs/custom-input";
import { useModal } from "@/hooks/useModal";
import { useVictimsStore } from "@/store/useVictimsStore";

const victimSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("phone"),
		name: z.string().min(2).max(100).trim(),
		value: z.string().startsWith("3").length(10).regex(/^\d+$/),
	}),
	z.object({
		type: z.literal("bancolombia"),
		name: z.string().min(2).max(100).trim(),
		value: z.string().length(11).regex(/^\d+$/),
	}),
	z.object({
		type: z.literal("key"),
		name: z.string().min(2).max(100).trim(),
		value: z.string().min(1),
		bank: z.string().min(1),
	}),
]);

const formSettings = {
	phone: {
		keyboardType: "numeric",
		placeholder: "Número de teléfono",
		mask: "phone",
	},
	bancolombia: {
		keyboardType: "numeric",
		placeholder: "Número de cuenta",
		mask: undefined,
	},
	key: {
		keyboardType: "default",
		placeholder: "Escribe la llave",
		mask: undefined,
	},
} as const;

export type Victim = z.infer<typeof victimSchema>;
type VictimForm = {
	name: string;
	type: "phone" | "key" | "bancolombia" | undefined;
	value: string;
	bank?: string;
};

export default function AddVictimSheet({
	onSubmit,
	...defaultForm
}: Partial<VictimForm> & { onSubmit?: (victim: Victim) => void }) {
	const [error, setError] = useState(false);
	const { hide } = useModal();

	const { addVictim } = useVictimsStore();
	const [victim, setVictim] = useState<VictimForm>({
		name: "",
		type: undefined,
		value: "",
		...defaultForm,
	});

	const handleSubmit = async () => {
		const result = calculateError(victim);
		if (!result) return;

		hide();
		addVictim(result);

		if (onSubmit) onSubmit(result);
	};

	const calculateError = (form: VictimForm) => {
		const result = victimSchema.safeParse(form);

		setError(Boolean(result.error));
		return result.data;
	};

	const handleTextChange = (id: string, text: string) => {
		if (id === "value" && victim.type === "phone" && !/^[0-9]*$/.test(text))
			return;
		setVictim({ ...victim, [id]: text });
	};

	useEffect(() => {
		calculateError(victim);
	}, [victim]);

	return (
		<View className="pb-10 pt-2">
			<Text fontWeight="bold" className="text-uva text-[20px] pb-4">
				Agrega un nuevo contacto
			</Text>

			<View className="flex gap-3 mb-4">
				<CustomInput
					label="Nombre"
					id="name"
					value={victim.name}
					onValueChange={handleTextChange}
				/>

				{!defaultForm.type && (
					<CustomInput
						id="type"
						label="Tipo de victima"
						type="select"
						value={victim.type}
						options={[
							{ label: "Nequi", value: "phone" },
							{ label: "Llave", value: "key" },
							{ label: "Bancolombia", value: "bancolombia" },
						]}
						onValueChange={handleTextChange}
					/>
				)}

				{victim.type && (
					<CustomInput
						id="value"
						label={formSettings[victim.type].placeholder}
						keyboardType={formSettings[victim.type].keyboardType}
						mask={formSettings[victim.type].mask}
						maxLength={victim.type === "bancolombia" ? 11 : undefined}
						value={victim.value}
						onValueChange={handleTextChange}
					/>
				)}

				{victim.type === "key" && (
					<CustomInput
						id="bank"
						label="Banco"
						value={victim.bank}
						onValueChange={handleTextChange}
					/>
				)}
			</View>

			<Button onPress={handleSubmit} disabled={error} title="Guardar" />
		</View>
	);
}
