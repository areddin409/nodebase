import { LoginForm } from "@/features/auth/components/login-form";
import { requireNoAuth } from "@/lib/auth-utils";
import React from "react";

const LoginPage = async () => {
  await requireNoAuth();
  return <LoginForm />;
};

export default LoginPage;
