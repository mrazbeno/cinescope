"use client";

import Link from "next/link";
import { useAuth } from "./authProvider";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseBrowser";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SessionStatus() {
  const auth = useAuth();
  const router = useRouter();

  async function logout() {
    const res = await supabase.auth.signOut();

    if (res.error !== null) {
      toast.error(res.error.message);
      return;
    }

    router.refresh()
  }

  return (
    <>
      {auth.session === null ? (
        <div className="flex h-full justify-center items-center gap-2 flex-row">
          <Link className="hover:underline hover:cursor-pointer text-sm" href="/sign-in">
            Sign In
          </Link>
          <div className="pointer-events-none">/</div>
          <Link className="hover:underline hover:cursor-pointer text-sm" href="/sign-up">
            Sign Up
          </Link>
        </div>
      ) : (
        <div className="flex flex-row items-center justify-center gap-2 min-w-0">
          <Link href="/my-filter" className="min-w-0">
            <Button variant={"outline"} className="flex flex-row gap-2 justify-center items-center min-w-0">
              <User className="shrink-0" />
              <b className="hidden sm:inline truncate max-w-32">
                {auth.user?.email?.split("@")[0]}
              </b>
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="default" variant="destructive">
                <LogOut />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No</AlertDialogCancel>
                <AlertDialogAction onClick={() => { logout(); }}>
                  Yes
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </>
  );
}