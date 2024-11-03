import { queryForm } from "@/utilities/core/helpers";
import { generateRamdomAlphanumeric } from "../authentication/randomized-username";

export const getUnsafeUsername = (form: FormData): string => queryForm(form, "username");

export const safeUsername = async (form: FormData): Promise<string> => {
  const unsafeUsername = getUnsafeUsername(form);
  return typeof unsafeUsername === "string" && unsafeUsername.length > 1
    ? unsafeUsername
    : await generateRamdomAlphanumeric(32);
};
