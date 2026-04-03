'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

/**
 * Provider for Tanstack React Query client.
 * Manages the QueryClient instance and provides it to the application for server-state handling.
 */
export default function TanstackProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
