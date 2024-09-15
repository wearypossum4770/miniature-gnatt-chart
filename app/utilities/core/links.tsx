import formStyle from "@/styles/forms.css";
import mainStyle from "@/styles/main.css";
import modalStyles from "@/styles/modals.css";
import navigationStyle from "@/styles/navigation.css";
import tableStyle from "@/styles/table.css";

import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinkDescriptor, LinksFunction } from "@remix-run/node";

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

export const generateLinks: LinksFunction = ()  => [
	{crossOrigin: "anonymous", rel: "stylesheet", href: mainStyle},
	{crossOrigin: "anonymous", rel: "stylesheet", href: modalStyles},
	{crossOrigin: "anonymous", rel: "stylesheet", href: tableStyle},
	{crossOrigin: "anonymous", rel: "stylesheet", href: navigationStyle},
	{crossOrigin: "anonymous", rel: "stylesheet", href: formStyle},
	...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  ];
	  
	
	