import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";
import { authSchema } from "@/db/schemas";
import { emailOTP } from "better-auth/plugins/email-otp";
import { sendEmail } from "@/actions/sendEmail";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: {
      ...authSchema,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  plugins: [
    emailOTP({
      sendVerificationOnSignUp: false,
      disableSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`Sending OTP: ${otp}, to ${email},for ${type}`);
        if (type === "sign-in") {
          await sendEmail({ email, otp });
        } else if (type === "email-verification") {
          // Send the OTP for email verification
        } else {
          // Send the OTP for password reset
        }
      },
    }),
    nextCookies(),
  ], // make sure this is the last plugin in the array
});
