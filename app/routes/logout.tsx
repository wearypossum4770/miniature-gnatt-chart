import { type ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";

import { logout } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => logout(request);

export const loader = async () => json({ ok: true });

const LogoutPage = () => {
  const { ok } = useLoaderData<typeof loader>();
  useEffect(() => {
    const logoutForm = document.getElementById("logout-page-form");
    if (logoutForm && ok) logoutForm.click();
  }, [ok]);
  return (
    <Form action="/logout" method="post">
      <button
        type="submit"
        id="logout-page-form"
        className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
      >
        Logout
      </button>
    </Form>
  );
};

export default LogoutPage;
