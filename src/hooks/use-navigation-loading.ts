"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useLoading } from "@/components/providers/loading-provider"

export function useNavigationLoading() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { setIsLoading, setLoadingMessage } = useLoading()

  useEffect(() => {
    // Show loading on route change
    setIsLoading(true)
    setLoadingMessage("Loading page...")

    // Hide loading after a short delay to allow content to render
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [pathname, searchParams, setIsLoading, setLoadingMessage])
}

export function usePageTransition() {
  const { setIsLoading, setLoadingMessage } = useLoading()

  const startTransition = (message = "Loading...") => {
    setIsLoading(true)
    setLoadingMessage(message)
  }

  const endTransition = () => {
    setIsLoading(false)
  }

  return { startTransition, endTransition }
} 