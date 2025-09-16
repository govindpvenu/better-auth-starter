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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Password } from "@/components/password";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { OTPForm } from "./OTPForm";
import { Stage } from "@/types/authTypes";
import Link from "next/link";
import { GitHubAuth } from "./GitHubAuth";
import { GoogleAuth } from "./GoogleAuth";

const formSchema = z
  .object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    email: z.email(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirm_password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"], // 👈 error will show up at confirm_password field
  });

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<Stage>({ stage: "sign-up", email: "" });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "test",
      email: "test@test.com",
      password: "12345678",
      confirm_password: "12345678",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    const { email, password, name } = values;

    const { data, error } = await authClient.signUp.email(
      {
        email, // user email address
        password, // user password -> min 8 characters by default
        name, // user display name
        callbackURL: "/", // A URL to redirect to after the user verifies their email (optional)
      },
      {
        onRequest: (ctx) => {
          //show loading
          setIsLoading(true);
        },
        onSuccess: async (ctx) => {
          setStage({ stage: "email-verification", email: email });
          setIsLoading(false);
          await authClient.emailOtp.sendVerificationOtp({
            email: email,
            type: "sign-in",
          });
        },
        onError: (ctx) => {
          // display the error messagsendVerificationOtpe
          toast.error(ctx.error.message);
          setIsLoading(false);
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
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              You need an account to get started
            </p>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input
                        type={"text"}
                        value={field.value}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val);
                        }}
                        required
                        placeholder="Enter your Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-3">
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
            </div>

            <div className="grid gap-3">
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
            </div>

            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Confirm Password *</FormLabel>
                    <FormControl>
                      <Password
                        {...field}
                        required
                        placeholder="Confirm Password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button disabled={isLoading} className="rounded-lg" size="sm">
              {isLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Sign Up"
              )}
            </Button>

            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-background text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>
            <GitHubAuth />
            <GoogleAuth />
          </div>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline underline-offset-4">
              Log in
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
