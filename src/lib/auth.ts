import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { env } from "./env";
import { prisma } from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.AUTH_GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "Zozo eLearning Platform <onboarding@resend.dev>",
          to: [email],
          subject: "Zozo eLearning Platform - Email Verification",
          html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
        });
      },
    }),
  ],
});
