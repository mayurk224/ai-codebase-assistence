'use client'

import { Spinner } from '@/components/ui/spinner'
import { useCurrentUser } from '@/hooks/use-auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

// Where the app surfaces failed sign-in attempts. Kept in sync with the
// backend OAuth2 failure handler (SecurityConfig#oauth2FailureHandler).
const OAUTH_ERROR_PATH = '/login?error=oauth_failed'

/**
 * Only allow same-origin, path-relative targets so a crafted `?next=` value
 * cannot turn the callback into an open redirect.
 */
function resolveNextPath(next: string | null): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return '/dashboard'
  }
  return next
}

function CallbackLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner className="size-8" />
      <span className="sr-only">Completing sign-in, please wait.</span>
    </div>
  )
}

function CallbackContent() {
  const router = useRouter()
  const params = useSearchParams()

  const next = resolveNextPath(params.get('next'))
  const providerError = params.get('error')

  // The backend only redirects here after GitHub has established the session
  // cookie, so the hook verifies it via /api/auth/me and records the result.
  const { data: user, isPending, isError } = useCurrentUser()

  useEffect(() => {
    // The provider rejected the request (e.g. the user denied access), so there
    // is no session to verify.
    if (providerError) {
      router.replace(OAUTH_ERROR_PATH)
      return
    }

    if (isPending) return

    if (user) {
      router.replace(next)
      return
    }

    if (isError) {
      router.replace(OAUTH_ERROR_PATH)
    }
  }, [providerError, isPending, user, isError, next, router])

  return <CallbackLoading />
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackLoading />}>
      <CallbackContent />
    </Suspense>
  )
}
