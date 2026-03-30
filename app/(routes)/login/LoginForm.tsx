"use client";

import { useState } from "react";
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
  buttonText,
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
    setLoading(true);
    setError(null);
    try {

      const res = await supabase.auth.signInWithPassword({ email, password })

      if (res && (res as any).error) {
        setError((res as any).error || "Invalid credentials");
      } else {
        // successful sign in
        router.push("/my-filter");
      }
    } catch (err) {
      setError("Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex h-full items-center justify-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-6 justify-center">
          <a href="#">
            <div className="flex flex-row items-center gap-2">
              <h1 className="text-3xl">CineScope</h1> - Find your next watch
            </div>
          </a>
          <form onSubmit={onLoginAttempt} className="min-w-sm flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border-none px-6 py-8 ">
            {heading && <h1 className="text-xl font-semibold">{heading}</h1>}
            <Input
              type="email"
              placeholder="Email"
              className="text-sm"
              required
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              className="text-sm"
              required
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />
            {error && <div className="text-destructive text-sm w-full">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : buttonText}
            </Button>
          </form>
          <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>{signupText}</p>
            <a
              href={signupUrl}
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
  );
};

export default LoginForm;
