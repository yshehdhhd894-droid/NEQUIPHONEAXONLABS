import clsx, { type ClassValue } from "clsx";
import {
	differenceInCalendarDays,
	format,
	isToday,
	isYesterday,
} from "date-fns";
import { es } from "date-fns/locale";
import { twMerge } from "tailwind-merge";
import type { Transaction } from "@/libs/api";

export const cn = (...inputs: Array<ClassValue>) => {
	return twMerge(clsx(inputs));
};

export function formatCurrencyDisplay(value: number) {
	return new Intl.NumberFormat("es-CO", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})
		.format(value)
		.split(",");
}

// format money -> $ 20.000,00
export const formatMoney = (
	value: string | number,
	decimals = false,
): string => {
	const numbers =
		typeof value === "string"
			? value.replace(/\D/g, "")
			: value.toString().replace(/\D/g, "");
	if (numbers === "") return "";

	const amount = parseInt(numbers, 10);

	if (decimals) {
		return `$ ${amount.toLocaleString("es-CO", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})}`;
	}

	return `$ ${amount.toLocaleString("es-CO")}`;
};

// format phone -> 300 000 0000
export const formatPhone = (value: string): string => {
	const numbers = value.replace(/\D/g, "");
	if (numbers.length === 0) return "";

	if (numbers.length <= 3) return numbers;
	if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
	return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 10)}`;
};

/** Nombre persona: Dagoberto Cardenas (primera mayúscula por palabra). */
export function formatPersonName(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
		.join(" ");
}

/** Llave Bre-B: teléfono formateado o texto tal cual (correo, documento, etc.). */
export function formatBreBKey(value: string): string {
	const trimmed = value.trim();
	if (/^\d[\d\s-]*$/.test(trimmed)) {
		return formatPhone(trimmed);
	}
	return trimmed;
}

// format date -> 15 de noviembre de 2025 a las 04:52 p. m.
export const formatDate = (value: string | number): string => {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "—";
	}
	return format(date, "d 'de' MMMM 'de' yyyy 'a las' h:mm a", { locale: es });
};

const NEQUI_REFERENCE = /^M\d{8}$/;

/** Referencia visible en comprobante: M + 8 dígitos (ej. M25044414). */
export function formatTransactionReference(id: string): string {
	if (NEQUI_REFERENCE.test(id)) return id;
	const hex = id.replace(/-/g, "");
	const num = Number.parseInt(hex.slice(0, 12), 16) % 100_000_000;
	return `M${String(num).padStart(8, "0")}`;
}

// random number -> template: N=0-9 n=1-9
export const randomNumber = (template: string): string => {
	return template.replace(/N|n/g, (match) => {
		if (match === "N") {
			return Math.floor(Math.random() * 10).toString();
		} else {
			return (Math.floor(Math.random() * 9) + 1).toString();
		}
	});
};

export function groupTransactions(transactions: Array<Transaction>) {
	const today = new Date();

	const getDateLabel = (timestamp: number | string) => {
		const date = new Date(timestamp);
		const diffDays = differenceInCalendarDays(today, date);

		if (isToday(date)) return "Hoy";
		if (isYesterday(date)) return "Ayer";

		if (diffDays >= 2 && diffDays <= 6) {
			return format(date, "EEEE", { locale: es });
		}

		return format(date, "d 'De' MMMM 'De' yyyy", { locale: es });
	};

	const groupByDate = (items: Transaction[]) => {
		const map = new Map<string, Transaction[]>();

		for (const tx of items) {
			const date = new Date(tx.date);
			const key = format(date, "yyyy-MM-dd");
			if (!map.has(key)) map.set(key, []);
			map.get(key)!.push(tx);
		}

		return Array.from(map.entries())
			.sort(([a], [b]) => {
				const dateA = new Date(a);
				const dateB = new Date(b);
				return dateB.getTime() - dateA.getTime();
			})
			.map(([_, txs]) => ({
				date: getDateLabel(txs[0].date),
				transactions: txs,
			}));
	};

	const todayList = transactions.filter((t) => isToday(new Date(t.date)));
	const allList = transactions.filter((t) => !isToday(new Date(t.date)));

	return {
		today: groupByDate(todayList),
		all: groupByDate(allList),
	};
}
