import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortenSource = (
  line: number,
  source?: string
): [string[], number, number] => {
  if (typeof source === "undefined") return [[], 0, 0];

  const sourceLines = source.split("\n");
  const lowerLimit = Math.max(0, line - 10);
  const upperLimit = Math.min(sourceLines.length, line + 10);
  const shortSource = sourceLines.slice(lowerLimit, upperLimit);

  return [shortSource, lowerLimit, upperLimit];
};
