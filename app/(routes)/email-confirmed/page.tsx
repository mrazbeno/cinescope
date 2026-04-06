import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { CircleCheck } from 'lucide-react';

export const metadata: Metadata = {
    title: "Email confirmed",
    description: "Your email has been confirmed successfully. You may now sign in to your account.",
    alternates: {
        canonical: "/email-confirmed",
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function EmailConfirmedPage() {
    return (
        <main className="flex min-h-[70vh] grow flex-col items-center justify-center px-6 text-center">
            <div className="w-full max-w-md space-y-4 rounded-xl border bg-background/10 p-6 backdrop-blur">
                <h1 className="text-2xl font-semibold text-green-400 flex flex-row gap-2 items-center justify-center"><CircleCheck /> Email confirmed</h1>

                <p className="text-sm text-muted-foreground">
                    Your email address has been verified successfully.
                </p>

                <p className="text-sm text-muted-foreground">
                    You have been automatically signed in to your account.
                </p>

                <div className="flex flex-col gap-2 pt-2">
                    <Button asChild>
                        <Link href="/my-filter">Go to account</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            </div>
        </main>
    );
}