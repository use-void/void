import { auth, toNextJsHandler } from "@void/auth";

export const { GET, POST } = toNextJsHandler(auth);