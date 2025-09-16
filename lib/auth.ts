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
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
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
          //This is from resend.
          await sendEmailVerification(email, otp);
        } else {
          // Send the OTP for password reset
        }
      },
    }),
    nextCookies(),
  ], // make sure this is the last plugin in the array
});

async function sendEmailVerification(email: string, otp: string) {
  try {
    const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/send-email-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to send email verification: ${errorData.error || response.statusText}`
      );
    }

    const result = await response.json();
    console.log("Email verification sent successfully:", result);
  } catch (error) {
    console.error("Error sending email verification:", error);
    throw error;
  }
}
