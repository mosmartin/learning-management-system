import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AUTH_GITHUB_CLIENT_ID: z.string().min(1, "GitHub Client ID is required"),
    AUTH_GITHUB_CLIENT_SECRET: z
      .string()
      .min(1, "GitHub Client Secret is required"),
    BETTER_AUTH_SECRET: z.string().min(1, "Better Auth Secret is required"),
    BETTER_AUTH_URL: z.string().url("Better Auth URL must be a valid URL"),
    DATABASE_URL: z.string().url("Database URL must be a valid URL"),
    RESEND_API_KEY: z
      .string()
      .min(1, "Resend API Key is required")
  },
  client: {},
  experimental__runtimeEnv: {},
});
