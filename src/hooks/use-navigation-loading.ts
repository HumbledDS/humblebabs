"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useLoading } from "@/components/providers/loading-provider"

export function useNavigationLoading() {
  // Disabled loading effects for instant navigation
  return
}

export function usePageTransition() {
  // Disabled loading effects for instant navigation
  const startTransition = (message = "Loading...") => {
    // No loading effect
  }

  const endTransition = () => {
    // No loading effect
  }

  return { startTransition, endTransition }
} 