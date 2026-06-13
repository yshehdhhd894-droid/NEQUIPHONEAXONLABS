import { useEffect, useState } from "react";
import { View } from "react-native";
import z from "zod";
import Text from "@/components/basic/text";
import Button from "@/components/button";
import CustomInput from "@/components/inputs/custom-input";
import { useModal } from "@/hooks/useModal";
import { showAppConfirm } from "@/libs/app-alert";
import { useVictimsStore, type Victim } from "@/store/useVictimsStore";

const victimSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("phone"),
		name: z.string().min(2).max(100),
		value: z.string().length(10).regex(/^\d+$/),
	}),
	z.object({
		type: z.literal("bancolombia"),
		name: z.string().min(2).max(100),
		value: z.string().length(11).regex(/^\d+$/),
	}),
	z.object({
		type: z.literal("key"),
		name: z.string().min(2).max(100),
		value: z.string().min(3).max(10),
		bank: z.string().min(3),
	}),
]);

const formSettings = {
	phone: {
		keyboardType: "numeric",
		placeholder: "Número de teléfono",
		mask: "phone",
	},
	key: {
		keyboardType: "default",
		placeholder: "Llave",
		mask: undefined,
	},
	bancolombia: {
		keyboardType: "default",
		placeholder: "Número de cuenta",
		mask: undefined,
	},
} as const;

type VictimForm = {
	name: string;
	type: "phone" | "key" | "bancolombia" | undefined;
	value: string;
	bank?: string;
};

interface EditVictimSheetProps {
	victim: Victim;
}

export default function EditVictimSheet({ victim }: EditVictimSheetProps) {
	const [error, setError] = useState(false);
	const { hide } = useModal();

	const { updateVictim, deleteVictim } = useVictimsStore();
	const [victimForm, setVictimForm] = useState<VictimForm>({
		name: victim.name,
		type: victim.type,
		value: victim.value,
		bank: victim.type === "key" ? victim.bank : undefined,
	});

	const handleUpdate = async () => {
		const result = calculateError(victimForm);
		if (!result) return;

		hide();
		updateVictim(victim.id, result);
	};

	const handleDelete = () => {
		showAppConfirm({
			title: "Confirmar eliminación",
			message: `¿Estás seguro de que quieres eliminar a ${victim.name}?`,
			cancelText: "Cancelar",
			confirmText: "Eliminar",
			onConfirm: () => {
				hide();
				deleteVictim(victim.id);
			},
		});
	};

	const calculateError = (form: VictimForm) => {
		const result = victimSchema.safeParse(form);

		setError(Boolean(result.error));
		return result.data;
	};

	const handleTextChange = (id: string, text: string) => {
		if (id === "value" && victimForm.type === "phone" && !/^[0-9]*$/.test(text))
			return;
		setVictimForm({ ...victimForm, [id]: text });
	};

	useEffect(() => {
		calculateError(victimForm);
	}, [victimForm]);

	return (
		<View className="pb-10 pt-2">
			<Text fontWeight="bold" className="text-uva text-[20px] pb-4">
				Editar contacto
			</Text>

			<View className="flex gap-3 mb-4">
				<CustomInput
					label="Nombre"
					id="name"
					value={victimForm.name}
					onValueChange={handleTextChange}
				/>

				<CustomInput
					id="type"
					label="Tipo de victima"
					type="select"
					disabled
					value={victimForm.type}
					options={[
						{ label: "Nequi", value: "phone" },
						{ label: "Llave", value: "key" },
						{ label: "Bancolombia", value: "bancolombia" },
					]}
					onValueChange={handleTextChange}
				/>

				{victimForm.type && (
					<CustomInput
						id="value"
						label={formSettings[victimForm.type].placeholder}
						keyboardType={formSettings[victimForm.type].keyboardType}
						mask={formSettings[victimForm.type].mask}
						maxLength={victimForm.type === "bancolombia" ? 11 : undefined}
						value={victimForm.value}
						onValueChange={handleTextChange}
					/>
				)}

				{victimForm.type === "key" && (
					<CustomInput
						id="bank"
						label="Banco"
						value={victimForm.bank}
						onValueChange={handleTextChange}
					/>
				)}
			</View>

			<View className="flex gap-3">
				<Button onPress={handleUpdate} disabled={error} title="Actualizar" />
				<Button
					onPress={handleDelete}
					title="Eliminar"
					className="bg-black/70"
				/>
			</View>
		</View>
	);
}
