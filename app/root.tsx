import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";

import formStyle from "@/styles/forms.css";
import mainStyle from "@/styles/main.css";
import modalStyles from "@/styles/modals.css";
import navigationStyle from "@/styles/navigation.css";
import tableStyle from "@/styles/table.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: formStyle },
	...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];
export const loader = async ({ request }: LoaderFunctionArgs) => {
	return json({ ok: true });
};

export default function App() {
	return (
		<html lang="en" className="h-full">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="h-full">
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
