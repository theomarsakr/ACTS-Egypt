import { en, type Dict } from "./en";
import { ar } from "./ar";

export type { Dict };
export * from "./routing";

export function getDict(lang: string): Dict {
  return lang === "ar" ? ar : en;
}
