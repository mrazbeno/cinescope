"use client";

import Link from "next/link";
import ThemeToggler from "../util/ThemeToggler";
import SessionStatus from "../auth/sessionStatus";
import { Separator } from "../ui/separator";

export default function HeaderBar() {
  return (
    <div className="flex w-full relative z-40 top-0 items-center justify-between min-h-[60px] p-4 gap-2 backdrop-blur-md">
      <Link href="/" className="text-lg md:text-2xl font-bold shrink-0">
        CineScope
      </Link>

      <div className="flex items-center gap-2 min-w-0">
        <ThemeToggler />
        <Separator orientation="vertical"/>
        <SessionStatus />
      </div>
    </div>
  );
}