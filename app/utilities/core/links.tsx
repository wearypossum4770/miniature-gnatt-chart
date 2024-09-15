import formStyle from "@/styles/forms.css";
import mainStyle from "@/styles/main.css";
import modalStyles from "@/styles/modals.css";
import navigationStyle from "@/styles/navigation.css";
import tableStyle from "@/styles/table.css";

import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinkDescriptor } from "@remix-run/node";

enum DocumentRelationship {
	Alternate = "alternate",
	Author = "author",
	Dns = "dns-prefetch",
	Help = "help",
	Icon = "icon",
	License = "license",
	Next = "next",
	Pingback = "pingback",
	Preconnect = "preconnect",
	Prefetch = "prefetch",
	Preload = "preload",
	Prerender = "prerender",
	Prev = "prev",
	Search = "search",
	Stylesheet = "stylesheet",
}

enum CrossOriginRequest {
	Anonymous = "anonymous",
	Credentials = "use-credentials",
}

enum ReferrerPolicy {
	Referrer = "no-referrer",
	WhenDowngrade = "no-referrer-when-downgrade",
	Origin = "origin",
	CrossOrigin = "origin-when-cross-origin",
	Unsafe = "unsafe-url",
}

type MediaLink = {
	href: string;
	rel: DocumentRelationship;
	hreflang?: string;
	crossOrigin?: CrossOriginRequest;
	media?: string;
	referrerPolicy?: ReferrerPolicy;
	sizes?: string;
	title?: string;
	type?: string;
};

export const generateLinks = (): Array<Record<string, unknown> | LinkDescriptor> =>
	[
		cssBundleHref ?? "",
		mainStyle,
		modalStyles,
		tableStyle,
		navigationStyle,
		formStyle,
	].reduce((a, href) =>
		Object.assign(a, {
			crossOrigin: CrossOriginRequest.Anonymous,
			rel: "stylesheet",
			href,
		}),[]
	);
