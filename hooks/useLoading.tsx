import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useRef,
	useState,
} from "react";
import { Platform, TextInput } from "react-native";
import { MundialLoadingOverlay } from "@/components/loading/mundial-loading-overlay";

function blurFocusedInput(): void {
	if (Platform.OS === "web") return;
	try {
		const textInputState = (
			TextInput as typeof TextInput & {
				State?: {
					currentlyFocusedInput?: () => { blur?: () => void } | null;
				};
			}
		).State;
		textInputState?.currentlyFocusedInput?.()?.blur?.();
	} catch {
		// TextInputState no disponible en web
	}
}

const LoadingContext = createContext<{
	show: () => void;
	hide: () => Promise<void>;
	autoShow: (time: number, customOffset?: number) => Promise<unknown>;
} | null>(null);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
	const [visible, setVisible] = useState(false);
	const [isHiding, setIsHiding] = useState(false);
	const [loadingKey, setLoadingKey] = useState(0);
	const hideResolveRef = useRef<(() => void) | null>(null);

	const handleHide = useCallback((): Promise<void> => {
		return new Promise((resolve) => {
			hideResolveRef.current = resolve;
			setIsHiding(true);
		});
	}, []);

	const handleShow = () => {
		setIsHiding(false);
		setLoadingKey((key) => key + 1);
		setVisible(true);
		blurFocusedInput();
	};

	const handleFinish = useCallback(() => {
		setVisible(false);
		setIsHiding(false);
		hideResolveRef.current?.();
		hideResolveRef.current = null;
	}, []);

	return (
		<LoadingContext.Provider
			value={{
				show: handleShow,
				hide: handleHide,
				autoShow: async (time: number, customOffset: number = 750) => {
					handleShow();
					await new Promise((resolve) => setTimeout(resolve, time));
					await handleHide();
					await new Promise((resolve) => setTimeout(resolve, customOffset));
				},
			}}
		>
			{children}
			{visible && (
				<MundialLoadingOverlay
					key={loadingKey}
					isHiding={isHiding}
					onFinish={handleFinish}
				/>
			)}
		</LoadingContext.Provider>
	);
}

export function useLoading() {
	const context = useContext(LoadingContext);
	if (!context)
		throw new Error("useLoading debe usarse dentro de un <LoadingProvider>");
	return context;
}

export function useLoadingPromise() {
	const { show, hide } = useLoading();

	async function withLoading<T>(
		promise: Promise<T>,
		minMs?: number,
	): Promise<T> {
		show();
		const start = Date.now();
		try {
			return await promise;
		} finally {
			if (minMs) {
				const remaining = Math.max(0, minMs - (Date.now() - start));
				await new Promise((resolve) => setTimeout(resolve, remaining));
			}
			await hide();
		}
	}

	return { withLoading };
}
