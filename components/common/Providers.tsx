"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { AuthProvider } from "../auth/authProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "../ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {

  const [client] = React.useState(() => new QueryClient());

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
          <QueryClientProvider client={client}>
            {children}
          </QueryClientProvider>
        </TooltipProvider>
      </AuthProvider>
    </NextThemesProvider>
  )
}
