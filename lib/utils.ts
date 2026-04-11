import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function flattenObject(
  obj: Record<string, any>,
  parentKey = "",
  res: Record<string, any> = {}
): Record<string, any> {
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === "") continue;

    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === "object" && !(value instanceof Date)) {
      flattenObject(value, newKey, res);
    } else {
      res[newKey] =
        value instanceof Date ? value.toISOString().split("T")[0] : value;
    }
  }

  return res;
}

export async function buildQueryString(
  params: Record<string, any>
): Promise<URLSearchParams> {
  return new URLSearchParams(
    Object.entries(await params).flatMap(([key, value]) =>
      Array.isArray(value) ? value.map((v) => [key, v]) : value ? [[key, value]] : []
    )
  );
}