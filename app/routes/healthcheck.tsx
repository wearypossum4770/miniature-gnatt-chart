import { type LoaderFunctionArgs, json } from "@remix-run/node";

import { prisma } from "~/db.server";

export type HealthCheckRecord = Record<string, boolean>;
export type HealthCheck = Promise<HealthCheckRecord>;
export type HealthCheckList = HealthCheckRecord[];
const outgoing = (url: string | URL) =>
	new Request(new URL(url), {
		method: "HEAD",
	});

export const checkDatabaseConnection = () => {};

export const checkNetworkConnection = ({ url }: Request, host: string) =>
	new Promise((resolve, reject) =>
		fetch(outgoing(new URL("/", `${new URL(url).protocol}//${host}`)))
			.then(() => resolve({ checkNetworkConnection: true }))
			.catch(() => reject({ checkNetworkConnection: false })),
	);
export const checkOutgoingConnection = async (): HealthCheck =>
	new Promise((resolve, reject) =>
		fetch(outgoing("https://example.com/"))
			.then(() => resolve({ checkOutgoingConnection: true }))
			.catch(() => reject({ checkOutgoingConnection: false })),
	);
export const checkDatabaseQuery = async (): HealthCheck =>
	new Promise((resolve, reject) =>
		prisma.user
			.count()
			.then(() => resolve({ checkDatabaseQuery: true }))
			.catch(() => reject({ checkDatabaseQuery: false })),
	);
export const purposefulErrorResponse = () => {
	throw new Response("ERROR: Purposeful response, nothing is wrong. You may proceede.", {
		status: 500,
	});
};
const getHostName = ({ headers }: Request) => headers.get("X-Forwarded-Host") ?? headers.get("host");
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const host = getHostName(request);

	return new Promise((resolve, reject) => {
		Promise.all([checkDatabaseQuery(), checkNetworkConnection(request, host ?? ""), checkOutgoingConnection()])
			.then((resp) => resp && resolve(json(resp.reduce((a: HealthCheckRecord, b) => Object.assign(a, b), {}))))
			.catch((error) => {
				console.log("healthcheck ❌", { error });
				return reject(new Response("ERROR", { status: 500 }));
			});
	});
};
