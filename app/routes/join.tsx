import signupFormFields from "@/fixtures/form-fields/signup-join.json";
import { generateRamdomAlphanumeric } from "@/utilities/authentication/randomized-username";
import { safeUsername } from "@/utilities/validations/username-validator";
import { queryForm, isFieldHidden } from "@/utilities/core/helpers";
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
  const firstName = queryForm(formData, "firstName");
  const middleName = queryForm(formData, "middleName");
  const lastName = queryForm(formData, "lastName");
  const username = await safeUsername(formData);
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
    Object.assign(errors, { email: "Email is invalid" });
    return json({ errors }, { status: 400 });
  }

  if (typeof password !== "string" || password.length === 0) {
    Object.assign(errors, { password: "Password is required" });
    return json({ errors }, { status: 400 });
  }

  if (password.length < 8) {
    Object.assign(errors, { password: "Password is too short" });
    return json({ errors }, { status: 400 });
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    Object.assign(errors, { email: "A user already exists with this email" });
    return json({ errors }, { status: 400 });
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

  const setrandomizeUsername = async () => {
    const username = document.getElementById("username") as HTMLInputElement | null;
    if (username) {
      username.value = await generateRamdomAlphanumeric(30);
    }
  };

  return (
    <Form method="post" className="signup-form form-page">
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
            <div id={`${id}-help-text`} data-dom-hidden={isFieldHidden(helpText)}>
              {helpText || "nothing here"}
            </div>
            <div id={ariaDescribedby} data-dom-hidden={isFieldHidden(actionData?.errors, name)}>
              {actionData?.errors?.email}
            </div>
          </div>
        ),
      )}

      <input type="hidden" name="redirectTo" value={redirectTo} />
      <button type="submit">Create Account</button>
      <footer>
        Already have an account?
        <Link
          to={{
            pathname: "/login",
            search: searchParams.toString(),
          }}
        >
          Log in
        </Link>
      </footer>
    </Form>
  );
};
export default Join;
