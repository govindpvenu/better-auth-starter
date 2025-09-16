"use client";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Password } from "@/components/password";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Stage } from "@/types/authTypes";
import { OTPForm } from "./OTPForm";
import Link from "next/link";

const formSchema = z.object({
  email: z.email(),
  password: z.string(),
  remember_me: z.boolean().optional(),
});

export function SignInForm() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>({ stage: "sign-in", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "test@test.com",
      password: "12345678",
      remember_me: true,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    const { email, password, remember_me } = values;

    const { data, error } = await authClient.signIn.email(
      {
        email, // user email address
        password, // user password -> min 8 characters by default
        callbackURL: "/", // A URL to redirect to after the user verifies their email (optional)
        rememberMe: remember_me || false, //Remember me
      },
      {
        onRequest: (ctx) => {
          //show loading
          setIsLoading(true);
        },
        onSuccess: async (ctx) => {
          //redirect to the dashboard or sign in page
        },

        onError: async (ctx) => {
          setIsLoading(false);
          console.log("CTX:", ctx);
          if (ctx.error.code === "EMAIL_NOT_VERIFIED") {
            console.log("EMAIL_NOT_VERIFIED");
            await authClient.emailOtp.sendVerificationOtp({
              email: email,
              type: "sign-in",
            });
            setStage({ stage: "email-verification", email: email });
          } else {
            toast.error(ctx.error.message);
          }
        },
      }
    );

    console.log("data:", data, "error:", error);
  }

  if (stage.stage === "email-verification") {
    return <OTPForm stage={stage} />;
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-2 border"
        >
          <h1 className="mt-6 font-extrabold text-3xl tracking-tight">
            Sign In
          </h1>
          <p className="tracking-wide text-muted-foreground mb-6 text-wrap text-sm">
            Sign in to your account to continue
          </p>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type={"email"}
                    value={field.value}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val);
                    }}
                    required
                    placeholder="Enter your Email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password *</FormLabel>
                <FormControl>
                  <Password {...field} required placeholder="Password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="remember_me"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    Remember me
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <div className="mt-4 flex justify-between text-center">
            <span className="text-sm">
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </span>

            <span className="text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="underline">
                Sign up
              </Link>
            </span>
          </div>

          <div className="flex justify-end items-center w-full pt-3">
            <Button disabled={isLoading} className="rounded-lg" size="sm">
              {isLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
