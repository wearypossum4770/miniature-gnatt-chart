export const clientSafeInteger = (buffer: Uint8Array): number => {
  "use client";
  return clientSafeIntegerArray(buffer).at(0) ?? 0;
};
export const clientSafeIntegerArray = (buffer: Uint8Array) => {
  "use client";
  return crypto.getRandomValues(buffer);
};
