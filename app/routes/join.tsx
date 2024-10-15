import signupFormFields from "@/fixtures/form-fields/signup-join.json";
import { generateRamdomAlphanumeric } from "@/utilities/authentication/randomized-username.client";
import { queryForm } from "@/utilities/core/helpers";
import { type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) =>
	(await getUserId(request)) ? redirect("/") : json({});

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const email = queryForm(formData, "email");
	const password = queryForm(formData, "password");
	const unsafeUsername = queryForm(formData, "username");
	const firstName = queryForm(formData, "firstName");
	const middleName = queryForm(formData, "middleName");
	const lastName = queryForm(formData, "lastName");
	const username =
		typeof unsafeUsername === "string" && unsafeUsername.length > 1 ? unsafeUsername : generateRamdomAlphanumeric(32);
	const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

	const errors = {
		email: email || null,
		password: password || null,
		username: username || null,
		firstName: firstName || null,
		middleName: middleName || null,
		lastName: lastName || null,
	};
	if (!validateEmail(email)) {
		return json({ errors: { email: "Email is invalid", password: null } }, { status: 400 });
	}

	if (typeof password !== "string" || password.length === 0) {
		return json({ errors: { email: null, password: "Password is required" } }, { status: 400 });
	}

	if (password.length < 8) {
		return json({ errors: { email: null, password: "Password is too short" } }, { status: 400 });
	}

	const existingUser = await getUserByEmail(email);
	if (existingUser) {
		return json(
			{
				errors: {
					email: "A user already exists with this email",
					password: null,
				},
			},
			{ status: 400 },
		);
	}

	const { id } = await createUser({ email, password, firstName, middleName, lastName, username });
	return createUserSession({
		redirectTo,
		remember: false,
		request,
		userId: id ?? "",
	});
};

export const meta: MetaFunction = () => [{ title: "Sign Up" }];

const Join = () => {
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get("redirectTo") ?? undefined;
	const actionData = useActionData<typeof action>();

	const setrandomizeUsername = () => {
		const username = document.getElementById("username") as HTMLInputElement | null;
		if (username) {
			username.value = generateRamdomAlphanumeric(30);
		}
	};

	return (
		<Form method="post">
			{signupFormFields.map(
				({ id, label, ariaDescribedby, helpText, events, ariaInvalid, autoComplete, name, required, type }) => (
					<div key={id} className="form-group">
						<label htmlFor={id}>{label}</label>
						<input
							id={id}
							aria-describedby={ariaDescribedby}
							aria-invalid={ariaInvalid}
							autoComplete={autoComplete}
							name={name}
							onChange={(events as string[]).includes("change") ? setrandomizeUsername : undefined}
							required={required}
							type={type}
						/>
						<div id={`${id}-help-text`}>{helpText}</div>
						<div id={ariaDescribedby}>{actionData?.errors?.email}</div>
					</div>
				),
			)}

			<input type="hidden" name="redirectTo" value={redirectTo} />
			<button type="submit">Create Account</button>
			<div>
				<div>
					Already have an account?
					<Link
						to={{
							pathname: "/login",
							search: searchParams.toString(),
						}}
					>
						Log in
					</Link>
				</div>
			</div>
		</Form>
	);
};
export default Join;
