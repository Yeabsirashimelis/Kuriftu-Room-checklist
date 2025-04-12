"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Define the form schema with Zod
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
  rememberMe: z.boolean().optional().default(false),
});

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the data to your API
      console.log(values);
      // Simulate API call
      const { data, error } = await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
          callbackURL: "/",
          rememberMe: false,
        },
        {
          onSuccess: (ctx) => {
            router.push("/");
          },
        }
      );
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Room Checklist Admin Sign-in</h2>
        </div>

        {/* Login Form */}
        <div className="mt-6 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="block text-sm font-medium"
                    >
                      Email address
                    </Label>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        className="w-full bg-transparent border-neutral-700 rounded"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label
                        htmlFor="password"
                        className="block text-sm font-medium"
                      >
                        Password
                      </Label>
                      <Link
                        href="#"
                        className="text-sm text-white hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        className="w-full bg-transparent border-neutral-700 rounded"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        id="remember"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-gray-500 data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                    </FormControl>
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
