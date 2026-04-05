"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseBrowser";

export interface RegisterFormProps {
  heading?: string;
  buttonText?: string;
  signupText?: string;
  signupUrl?: string;
}

const RegisterForm = ({
  heading,
  buttonText = "Create account",
  signupText,
  signupUrl,
}: RegisterFormProps) => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (loading) return;

    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await supabase.auth.signUp({ email, password });

      if (res.error) {
        setError(res.error.message || "Registration failed");
        return;
      }

      router.push("/verify-email");
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="flex flex-row items-center gap-2">
          <h1 className="text-3xl">CineScope</h1> - find your next watch
        </div>

        <form
          onSubmit={onSubmit}
          className="relative min-w-sm flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border-none px-6 py-8"
          aria-busy={loading}
        >
          <fieldset
            disabled={loading}
            className="flex w-full flex-col items-center gap-y-4 disabled:opacity-70"
          >
            {heading && <h1 className="text-xl font-semibold">{heading}</h1>}

            <Input
              type="email"
              placeholder="Email"
              className="text-sm"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              className="text-sm"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Confirm Password"
              className="text-sm"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            {error && <div className="w-full text-sm text-destructive">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : buttonText}
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
              Login
            </Link>
          ) : (
            <span className="font-medium text-primary">Login</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;