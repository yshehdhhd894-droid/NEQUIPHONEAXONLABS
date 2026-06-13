import { PhoneLoginScreen } from "@/components/login/phone-login-screen";

/** Primera vez: sin clave dinámica, footer "Comprobar un pago". */
export default function GuestLoginScreen() {
	return <PhoneLoginScreen variant="guest" />;
}
