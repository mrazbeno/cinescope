"use client"

import Link from "next/link";
import ThemeToggler from "../util/ThemeToggler";
import SessionStatus from "../auth/sessionStatus";

export default function HeaderBar() {
    return (
        <div className="flex w-full sticky z-40 top-0 items-center justify-between p-4 backdrop-blur-md">
            <Link href="/" className="text-lg md:text-2xl font-bold">CineScope</Link>
            <ThemeToggler />
            <SessionStatus />
        </div>
    );
}
