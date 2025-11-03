"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LoadingState = "idle" | "email" | "github" | "google";

export function LoginForm() {
  const router = useRouter();
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoadingState("email");
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push("/");
          toast.success("Logged in successfully!");
        },
        onError: ctx => {
          toast.error(`Login failed: ${ctx.error.message}`);
        },
      }
    );
    setLoadingState("idle");
  };

  const handleGithubLogin = async () => {
    setLoadingState("github");
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    } catch (error) {
      toast.error("GitHub login failed. Please try again.");
      console.error("GitHub login error:", error);
    } finally {
      setLoadingState("idle");
    }
  };

  const handleGoogleLogin = async () => {
    setLoadingState("google");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      toast.error("Google login failed. Please try again.");
      console.error("Google login error:", error);
    } finally {
      setLoadingState("idle");
    }
  };

  const isLoading = loadingState !== "idle";

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="">Welcome Back</CardTitle>
          <CardDescription>Login to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    variant={"outline"}
                    className="w-full"
                    type="button"
                    disabled={isLoading}
                    onClick={handleGithubLogin}
                  >
                    {loadingState === "github" ? (
                      <>
                        <Spinner className="size-4" />
                        Signing in with GitHub...
                      </>
                    ) : (
                      <>
                        <Image
                          src="/logos/github.svg"
                          alt="Github"
                          width={20}
                          height={20}
                        />
                        Continue with Github
                      </>
                    )}
                  </Button>
                  <Button
                    variant={"outline"}
                    className="w-full"
                    type="button"
                    disabled={isLoading}
                    onClick={handleGoogleLogin}
                  >
                    {loadingState === "google" ? (
                      <>
                        <Spinner className="size-4" />
                        Signing in with Google...
                      </>
                    ) : (
                      <>
                        <Image
                          src="/logos/google.svg"
                          alt="Google"
                          width={20}
                          height={20}
                        />
                        Continue with Google
                      </>
                    )}
                  </Button>
                </div>
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="JohnDoe@gmail.com"
                            {...field}
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
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {loadingState === "email" ? (
                      <>
                        <Spinner className="size-4" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don't have an account?{" "}
                  <Link href="/signup" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
