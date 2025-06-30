"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Signed out successfully!");
        },
      },
    });
  };

  return (
    <div>
      <h1>Welcome to the Learning Management System</h1>

      <ThemeToggle />

      {session ? (
        <>
          <p>Signed in as {session.user.name}</p>
          <Button onClick={handleSignOut}>Sign out</Button>
        </>
      ) : (
        <Button onClick={() => router.push("/sign-in")}>Sign in</Button>
      )}
    </div>
  );
}
