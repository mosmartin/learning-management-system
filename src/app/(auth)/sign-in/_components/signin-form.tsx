"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { GithubIcon, Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const router = useRouter();
  const [isGitHubPending, startGitHubTransition] = useTransition();
  const [isEmailPending, startEmailTransition] = useTransition();
  const [email, setEmail] = useState("");

  async function handleGitHubSignIn() {
    startGitHubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in successfully with GitHub! Redirecting...");
          },
          onError: () => {
            toast.error("Error signing in!");
          },
        },
      });
    });
  }

  async function handleEmailSignIn() {
    startEmailTransition(async () => {
      console.log("Sending email verification for:", email);
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Check your email for the sign-in link!");
            router.push(`/verify-request?email=${encodeURIComponent(email)}`);
          },
          onError: () => {
            toast.error("Failed to send sign-in link");
          },
        },
      });
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome back!</CardTitle>
        <CardDescription>
          Sign in with your GitHub or Email Account
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <Button
          className="w-full"
          variant={"outline"}
          size="lg"
          disabled={isGitHubPending}
          onClick={handleGitHubSignIn}
        >
          {isGitHubPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              <span>loading...</span>
            </>
          ) : (
            <>
              <GithubIcon className="mr-2 size-4" />
              Sign in with GitHub
            </>
          )}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="zoe@example.com"
              required
            />
          </div>

          <Button onClick={handleEmailSignIn} disabled={isEmailPending}>
            {isEmailPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="mr-2 size-4" />
                <span className="mr-2">Continue with Email</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
