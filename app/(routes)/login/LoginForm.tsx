"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseBrowser";

export interface LoginFormProps {
  heading?: string;
  buttonText?: string;
  signupText?: string;
  signupUrl?: string;
}

const LoginForm = ({
  heading,
  buttonText = "Sign in",
  signupText,
  signupUrl,
}: LoginFormProps) => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onLoginAttempt = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await supabase.auth.signInWithPassword({ email, password });

      if (res.error) {
        setError(res.error.message || "Invalid credentials");
        return;
      }

      router.push("/my-filter");
    } catch {
      setError("Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="flex flex-row items-end gap-2">
          <h1 className="text-3xl">CineScope</h1> - Find your next watch
        </div>

        <form
          onSubmit={onLoginAttempt}
          className="relative min-w-sm flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border-none px-6 py-8"
          aria-busy={loading}
        >
          <fieldset
            disabled={loading}
            className="flex w-full flex-col items-center gap-y-4 disabled:opacity-70"
          >
            {heading && <h1 className="text-xl font-semibold">{heading}</h1>}

            <div className="w-full space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="text-sm"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby={error ? "login-form-error" : undefined}
              />
            </div>

            <div className="w-full space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="text-sm"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby={error ? "login-form-error" : undefined}
              />
            </div>

            {error && (
              <div
                id="login-form-error"
                className="w-full text-sm text-destructive"
                role="alert"
              >
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : buttonText}
            </Button>
          </fieldset>
        </form>

        <div className="flex justify-center gap-1 text-sm text-muted-foreground">
          <p>{signupText}</p>
          {signupUrl ? (
            <Link
              href={signupUrl}
              aria-disabled={loading}
              className={[
                "font-medium text-primary hover:underline",
                loading ? "pointer-events-none opacity-50" : "",
              ].join(" ")}
            >
              Sign up
            </Link>
          ) : (
            <span className="font-medium text-primary">Sign up</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;