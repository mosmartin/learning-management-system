"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function VerifyRequestPage() {
  const [otp, setOtp] = useState<string>("");
  const [isEmailPending, startEmailTransition] = useTransition();
  const params = useSearchParams();
  const email = params.get("email") as string;
  const router = useRouter();

  const handleOTPVerification = async () => {
    startEmailTransition(async () => {
      await authClient.signIn.emailOtp({
        email,
        otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verified successfully! Redirecting...");
            router.push("/");
          },
          onError: () => {
            toast.error("Failed to verify email.");
          },
        },
      });
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Please check Your Email</CardTitle>

        <CardDescription>
          We have sent a verification code to your email address. Please check
          your inbox and enter the code to verify your email.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4 space-y-2">
          <InputOTP
            value={otp}
            onChange={(value) => setOtp(value)}
            maxLength={6}
            className="flex justify-center gap-2"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>

            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <p className="text-sm text-muted-foreground">
            Enter the code to verify your email.
          </p>
        </div>

        <Button
          onClick={handleOTPVerification}
          disabled={isEmailPending || otp.length < 6}
          className="w-full mt-4"
        >
          {isEmailPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            "Verify Email"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
