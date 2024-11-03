// biome-ignore lint/suspicious/noControlCharactersInRegex: Purposeful to check for malicious email addresses.
export const emailRegex =
  /^(?:[A-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]{2,}(?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
const USERNAME_CONSTRAINTS = {
  minLength: 6,
  maxLength: 20,
  allowedPattern: /^[a-zA-Z0-9_]+$/,
};
export const emailValidation = (email: unknown): boolean => {
  return typeof email === "string" ? emailRegex.test(email) : false;
};
const invalidLength = (length: number, max: number) =>
  `Your username must be ${length} characters long. You entered a username that was ${max}.`;

export const usernameValidation = (username: unknown): boolean | string | null => {
  if (typeof username !== "string") return null;
  const length = username.length;
  const { minLength, maxLength, allowedPattern } = USERNAME_CONSTRAINTS;
  if (length < minLength) return invalidLength(length, minLength);
  if (length > maxLength) return invalidLength(length, maxLength);
  if (allowedPattern.test(username)) return "Your username can only contain letters, numbers, and underscores.";
  return true;
};
