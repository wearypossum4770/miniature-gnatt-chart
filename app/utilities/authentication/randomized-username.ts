import { CHALLENGE_LENGTH, USERNAME_LENGTH } from "@/utilities/index";
import { serverSafeIntegerArray } from "@/utilities/authentication/random-integer.server";
import { clientSafeIntegerArray } from "@/utilities/authentication/random-integer.client";
// biome-ignore format: the array should not be formatted
// prettier-ignore
const cache = String.fromCharCode.apply(
  null,
  [
    48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73,
    74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98,
    99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113,
    114, 115, 116, 117, 118, 119, 120, 121, 122,
  ],
);

export const randomlyFillBytes = (buffer: Uint8Array): Promise<Uint8Array> =>
  new Promise((success, failure) => {
    try {
      if (typeof window === "undefined" && typeof document === "undefined") {
        return success(serverSafeIntegerArray(buffer));
      }
      return success(clientSafeIntegerArray(buffer));
    } catch (error) {
      return failure(error);
    }
  });

export const generateArrayBuffer = (length?: number): Uint8Array =>
  new Uint8Array(typeof length === "number" && length < CHALLENGE_LENGTH ? length : USERNAME_LENGTH);

export const generateRamdomAlphanumeric = async (length: number): Promise<string> => {
  const buffer = generateArrayBuffer(length);
  randomlyFillBytes(buffer);
  return Array.from(buffer).reduce<string>((a, b) => a + cache[b % cache.length], "");
};
