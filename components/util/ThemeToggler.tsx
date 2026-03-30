"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ThemeToggler() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === "dark" ? "light" : "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSwitchChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="flex items-center gap-2">
      <Label aria-labelledby="theme_switch" htmlFor="theme_switch">

        <Sun className="text-yellow-400" />
      </Label>
      <Switch
        title="Dark theme toggle switch"
        name="Theme switcher"
        id="theme_switch"
        checked={theme === "dark"}
        onCheckedChange={handleSwitchChange}
      />
      <Label aria-labelledby="theme_switch" htmlFor="theme_switch">

        <Moon className="text-blue-500" />
      </Label>
    </div>
  );
}
