"use client";

import { useState } from "react";
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
  buttonText,
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
    setError(null);
    if (password !== confirm) return setError("Passwords do not match");
    setLoading(true);
    try {

    const res = await supabase.auth.signUp({email, password})

      if (res.error !== null) {
        setError(res.error.message || 'Registration failed');
        setLoading(false);
        return;
      }

      const s = await supabase.auth.signInWithPassword({email, password})
      
      if (s.error !== null) {
        router.push('/login');
      } else {
        router.push('/my-filter');
      }
    } catch (err) {
      setError('Server error');
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
              <h1 className="text-3xl">CineScope</h1> - find your next watch
            </div>
          </a>
          <form onSubmit={onSubmit} className="min-w-sm  flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border-none px-6 py-8">
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
            <Input
              type="password"
              placeholder="Confirm Password"
              className="text-sm"
              required
              value={confirm}
              onChange={(e: any) => setConfirm(e.target.value)}
            />
            {error && <div className="text-destructive text-sm w-full">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : buttonText}
            </Button>
          </form>
          <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>{signupText}</p>
            <a
              href={signupUrl}
              className="text-primary font-medium hover:underline"
            >
              Login
            </a>
          </div>
        </div>
      </div>
  );
};

export default RegisterForm;