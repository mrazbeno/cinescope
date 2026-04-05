"use client"

import Link from "next/link";
import { useAuth } from "./authProvider";
import { User } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseBrowser";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SessionStatus() {

    const auth = useAuth()
    const router = useRouter();

    async function logout() {
        const res = await supabase.auth.signOut()

        if (res.error !== null) {
            toast.error(res.error.message)
            return;
        }

        router.push("/")
    }

    return (
        <>
            {auth.session === null ? (
                <div className="flex h-full justify-center items-center gap-2 flex-row">

                    <Link className="hover:underline hover:cursor-pointer" href="/login">Login</Link>
                    <div className="pointer-events-none">/</div>
                    <Link className="hover:underline hover:cursor-pointer" href="/register">Register</Link>
                </div>

            ) : (
                <div className="flex flex-row items-center justify-center gap-2">

                    <Link href="/my-filter">
                        <div className="flex flex-row gap-2 justify-center items-center">
                            <User />
                            <b>{auth.user?.email?.split("@")[0]}</b>

                        </div>
                    </Link>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size={"sm"} className="grow" variant={"destructive"}>
                                <LogOut />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>No</AlertDialogCancel>
                                <AlertDialogAction onClick={e => { logout() }}>Yes</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}
        </>
    );
}
