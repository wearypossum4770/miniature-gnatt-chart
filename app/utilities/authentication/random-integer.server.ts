import { safeNumber } from "@/utilities/authentication/config";

export const serverSafeInteger = async (maximum?: unknown): Promise<number> => {
  "use server";
  const { randomInt } = await import("node:crypto");
  return randomInt(safeNumber(maximum));
};

export const serverSafeIntegerArray = async (buffer: Uint8Array): Promise<Uint8Array> => {
  "use server";
  const { getRandomValues } = await import("node:crypto");
  return getRandomValues(buffer);
};
