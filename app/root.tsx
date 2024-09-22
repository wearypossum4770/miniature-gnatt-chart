import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Links, LiveReload, Meta, Link, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import navigationLinks from "@/fixtures/navigation-links.json";
import formStyle from "@/styles/forms.css";
import mainStyle from "@/styles/main.css";
import modalStyles from "@/styles/modals.css";
import navigationStyle from "@/styles/navigation.css";
import tableStyle from "@/styles/table.css";
import styleColors from "@/styles/colors.css";
import cssRest from "@/styles/reset.css";
// biome-ignore format: the array should not be formatted
// prettier-ignore
export const links: LinksFunction = (): any => [
styleColors,
cssRest,
formStyle,
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

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {/* <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://fonts.googleapis.com;" /> */}
        <Meta />
        <Links />
      </head>
      <body>
        <nav id="main-navigation-top-container" className="main-navigation-menu">
          <ul>
            {navigationLinks.map(({ to, label, id, meta }) => (
              <li key={id} id={`main-navigaton-link-${id}`}>
                <Link to={ to }>{label}</Link>
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
