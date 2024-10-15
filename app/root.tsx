import navigationLinks from "@/fixtures/navigation-links.json";
import styleColors from "@/styles/colors.css";
import formStyle from "@/styles/forms.css";
import mainStyle from "@/styles/main.css";
import modalStyles from "@/styles/modals.css";
import navigationStyle from "@/styles/navigation.css";
import projectviewStyle from "@/styles/project-view.css";
import cssRest from "@/styles/reset.css";
import sidebarStyle from "@/styles/sidebar.css";
import tableStyle from "@/styles/table.css";
import { cssBundleHref } from "@remix-run/css-bundle";
import { type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node";
import { Link, Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";

// biome-ignore format: the array should not be formatted
// prettier-ignore
export const links = () => [
styleColors,
cssRest,
formStyle,
projectviewStyle,
sidebarStyle, 
cssBundleHref,
mainStyle,
modalStyles,
navigationStyle,
tableStyle,
].map(href=>({referrerPolicy: "no-referrer", crossOrigin: "anonymous",
  rel: "stylesheet", href}))

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const clientIp = request.headers.get("Fly-Client-IP");

	return json({ ok: true, clientIp });
};
export const meta: MetaFunction = () => [
	{
		charset: "utf-8",
		title: "Remix 💚 Prisma",
		keywords: ["docker-compose", "docker", "stack"],
		author: "Dev Team",
		viewport: "width=device-width,initial-scale=1",
	},
];
export default function App() {
	const data = useLoaderData<typeof loader>();

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				{/* <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://fonts.googleapis.com;" /> */}
				<Meta />
				<Links />
			</head>
			<body>
				<nav id="main-navigation-top-container" className="main-navigation-menu">
					<ul>
						{navigationLinks.map(({ to, label, id, meta }) => (
							<li key={id} id={`main-navigaton-link-${id}`}>
								<Link to={to}>{label}</Link>
							</li>
						))}
					</ul>
				</nav>
				<main className="root-main">
					<h1>{`Your ip address is ${data.clientIp}`}</h1>
					<Outlet />
				</main>
				<ScrollRestoration />
				<Scripts crossOrigin="anonymous" />
				<LiveReload />
			</body>
		</html>
	);
}
