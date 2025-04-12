"use client";

import type React from "react";

import Link from "next/link";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginBackground from "@/components/ui/blue-pattern-background";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SigninForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const { data, error } = await authClient.signIn.email(
        {
          email: values.email, // Correct the destructuring here
          password: values.password,
        },
        {
          onRequest: (ctx) => {
            console.log(ctx);
          },
          onSuccess: () => {
            router.push("/");
            console.log("logged in successfully");
            toast.success("Admin signed successfully");
          },
          onError: (ctx) => {
            console.log(ctx);
            toast.error(ctx.error.message);
          },
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background with SVG waves */}
      <LoginBackground />

      {/* Login card */}
      <div className="w-full max-w-[480px] bg-white rounded-3xl p-8 space-y-6 shadow-xl z-10">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Login to Account
          </h1>
          <p className="text-muted-foreground">
            Please enter your email and password to continue
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="new-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••"
                        className="h-12 bg-muted/50 border-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember Password
              </label>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#4F6EF7] text-white rounded-lg font-medium hover:bg-[#4F6EF7]/90 transition-colors"
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
}
