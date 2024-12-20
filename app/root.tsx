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
  return json({ ok: true });
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
  console.log(String.prototype.toWellFormed, "String.prototype.toWellFormed");
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
            {navigationLinks.map(({ to, label, id }) => (
              <li key={id} id={`main-navigaton-link-${id}`}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="root-main">
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts crossOrigin="anonymous" />
        <LiveReload />
      </body>
    </html>
  );
}
