import { useCallback } from "react";
import CreateUserSheet from "@/components/sheets/create-user";
import SignupTelegramGate from "@/components/sheets/signup-telegram-gate";
import { useModal } from "@/hooks/useModal";
import { useAppStore } from "@/store/useAppStore";

export function useCreateUserFlow() {
	const { show, hide } = useModal();
	const signupTelegramGateCompleted = useAppStore(
		(s) => s.signupTelegramGateCompleted,
	);
	const completeSignupTelegramGate = useAppStore(
		(s) => s.completeSignupTelegramGate,
	);

	const openCreateUserForm = useCallback(() => {
		show(<CreateUserSheet />);
	}, [show]);

	const openCreateUserFlow = useCallback(() => {
		if (signupTelegramGateCompleted) {
			openCreateUserForm();
			return;
		}

		show(
			<SignupTelegramGate
				onContinue={() => {
					completeSignupTelegramGate();
					hide();
					setTimeout(() => {
						openCreateUserForm();
					}, 320);
				}}
			/>,
		);
	}, [
		completeSignupTelegramGate,
		hide,
		openCreateUserForm,
		show,
		signupTelegramGateCompleted,
	]);

	return { openCreateUserFlow };
}
