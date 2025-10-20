"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const LogoutButton = () => {
  return (
    <Button onClick={() => authClient.signOut()} variant="destructive">
      Logout
    </Button>
  );
};
