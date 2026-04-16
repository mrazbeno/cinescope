import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirm sign up",
  description: "Check your email to verify your account and confirm your sign up.",
  alternates: {
    canonical: "/verify-email",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-[70vh] grow flex-col items-center justify-center px-6 text-center">
      <div className="w-full max-w-md rounded-xl border p-6 space-y-4 bg-background/10 backdrop-blur">
        <h1 className="text-2xl font-semibold">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          Your account was created successfully. Please verify your email address
          before signing in.
        </p>
        <p className="text-sm text-muted-foreground">
          If you do not see the message, check your spam folder.
        </p>

        <div className="flex flex-col gap-2 pt-2">
          <Button asChild>
            <Link href="/sign-in">Go to sign in</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}