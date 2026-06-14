import { ScrollViewStyleReset } from "expo-router/html";

/** HTML raíz de la PWA: español Colombia, sin traducción automática del navegador. */
export default function Root({ children }: { children: React.ReactNode }) {
	return (
		<html lang="es-CO" translate="no" className="notranslate">
			<head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
				/>
				<meta name="theme-color" content="#200020" />
				<meta
					name="apple-mobile-web-app-status-bar-style"
					content="black-translucent"
				/>
				<meta httpEquiv="Content-Language" content="es-CO" />
				<meta name="google" content="notranslate" />
				<meta name="googlebot" content="notranslate" />
				<ScrollViewStyleReset />
			</head>
			<body translate="no" className="notranslate">
				{children}
			</body>
		</html>
	);
}
