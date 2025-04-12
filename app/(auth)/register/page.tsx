"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
const formSchema = z
  .object({
    organizationName: z
      .string()
      .min(1, { message: "Organization name is required." })
      .min(2, { message: "Organization name must be at least 2 characters." }),
    adminName: z
      .string()
      .min(1, { message: "Admin name is required." })
      .min(2, { message: "Admin name must be at least 2 characters." }),
    adminEmail: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(1, { message: "Password is required." })
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password." })
      .min(8, { message: "Password must be at least 8 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const RegisterPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
      adminName: "",
      adminEmail: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the data to your API
      console.log(values);
      // Simulate API call
      const { data, error } = await authClient.signUp.email(
        {
          email: values.adminEmail,
          password: values.password,
          name: values.adminName,
          organizationName: values.organizationName,
          callbackURL: "/",
        },
        {
          onSuccess: (ctx) => {
            router.push("/");
          },
        }
      );
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-white min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 ">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="h-8 w-8" />
            <h1 className="text-2xl font-semibold">EduAdmin</h1>
          </div>
          <h2 className="text-2xl font-bold">Room Checklist system</h2>
        </div>

        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-slate-300">
                      Organization Name
                    </Label>
                    <FormControl>
                      <Input
                        placeholder="Example Org"
                        className="border-neutral-700 rounded-md h-10 px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adminName"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-slate-300">
                      Admin Name
                    </Label>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        className="border-neutral-700 rounded-md h-10 px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adminEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-slate-300">
                      Admin Email
                    </Label>
                    <FormControl>
                      <Input
                        placeholder="example@gmail.com"
                        className="border-neutral-700 rounded-md h-10 px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
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
                  <FormItem className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-slate-300">
                      Password
                    </Label>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="border-neutral-700 rounded-md h-10 px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-slate-300">
                      Confirm Password
                    </Label>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="border-neutral-700 rounded-md h-10 px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full hover:bg-muted-foreground h-10 mt-2 font-medium bg-white text-neutral-900"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register Organization"}
              </Button>
            </form>
          </Form>

          <p className="text-muted-foreground text-sm text-center mt-3">
            Already have an account?{" "}
            <Link className="text-white" href="/sign-in">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
