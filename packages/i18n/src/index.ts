import { routing } from "./routing";

export type Locale = (typeof routing.locales)[number];

export * from "next-intl";
export * from "next-intl/server";
export * from "./config";
export * from "./utils";
