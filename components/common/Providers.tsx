"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { AuthProvider } from "../auth/authProvider"
import { TooltipProvider } from "../ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <AuthProvider>
        <TooltipProvider>
       
            {children}
        
        </TooltipProvider>
      </AuthProvider>
    </NextThemesProvider>
  )
}
