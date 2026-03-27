import { z } from "zod";

export const env = () =>
  z
    .object({
      NEXT_PUBLIC_BASE_URL: z.string().url().default("https://vietcod"),
      NEXT_PUBLIC_C15T_MODE: z.enum(["c15t", "offline"]).nullable().optional(),
      NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:8000"),
      NEXT_PUBLIC_BACKEND_URL: z
        .string()
        .url()
        .default("https://api.vietcod.com"),
    })
    .parse(process.env);
