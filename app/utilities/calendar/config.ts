import { isDateValid, safeDateOrTimestamp } from "@/utilities/core/type-safety";
import { InvalidDateException } from "@/utilities/index";

export const generateTimestamp = Date.now;

export const isWithinExpirationDate = (date: unknown): boolean => {
	if (!isDateValid(date)) throw new InvalidDateException(date);
	return safeDateOrTimestamp(date).getTime() < generateTimestamp();
};
