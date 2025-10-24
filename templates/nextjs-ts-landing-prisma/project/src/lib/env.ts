import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  BETTER_AUTH_URL: z.url(),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.email(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  // Cloudflare R2 variables
  CLOUDFLARE_ACCESS_KEY: z.string().min(1).optional(),
  CLOUDFLARE_SECRET_KEY: z.string().min(1).optional(),
  CLOUDFLARE_ENDPOINT: z.url().optional(),
  CLOUDFLARE_BUCKET: z.string().min(1).optional(),
  CLOUDFLARE_ACCOUNT_ID: z.string().min(1).optional(),
  CLOUDFLARE_PUBLIC_URL: z.url().optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);

      console.error("❌ Invalid environment variables:");
      missingVars.forEach((err) => console.error(`  - ${err}`));

      process.exit(1);
    }

    throw error;
  }
}

export const env = validateEnv();

// Helper to check if we're in development
export const isDevelopment = env.NODE_ENV === "development";

export const isProduction = env.NODE_ENV === "production";
