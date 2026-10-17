'use client'
import { useCurrentUser } from '@/hooks/use-auth'
import { ApiError } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const DashboardPage = () => {
  const router = useRouter()
  const { data: user, isPending, isError, error, refetch } = useCurrentUser()

  // A rejected / expired session cannot be recovered in place, so send the
  // visitor back to sign in instead of showing an empty profile.
  const sessionExpired = error instanceof ApiError && error.status === 401

  useEffect(() => {
    if (sessionExpired) {
      router.replace('/login')
    }
  }, [sessionExpired, router])

  if (isPending) {
    return <div>Loading...</div>
  }

  if (sessionExpired) {
    return <div>Your session has expired. Redirecting to sign in...</div>
  }

  // Network failures and timeouts land here; surface them instead of silently
  // falling back to a placeholder that looks like a real profile.
  if (isError || !user) {
    return (
      <div>
        <p>We couldn&apos;t load your profile.</p>
        <Button variant="outline" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h1>Welcome, {user.githubUsername}</h1>
    </div>
  )
}

export default DashboardPage
