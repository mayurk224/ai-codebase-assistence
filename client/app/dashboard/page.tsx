'use client'
import { useCurrentUser, useLogout } from '@/hooks/use-auth'
import { ApiError } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const DashboardPage = () => {
  const router = useRouter()
  const { data: user, isPending, isError, error, refetch } = useCurrentUser()
  const logout = useLogout()

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
    <main className="min-h-screen bg-muted/40 p-6">
      <section className="mx-auto w-full max-w-2xl rounded-xl border bg-card p-6 shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={`${user.displayName || user.githubUsername}'s GitHub avatar`}
                width={72}
                height={72}
                className="size-[72px] rounded-full object-cover"
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex size-[72px] items-center justify-center rounded-full bg-muted text-2xl font-semibold"
              >
                {user.githubUsername.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-xl font-semibold">
                {user.displayName || user.githubUsername}
              </h1>
              <p className="text-sm text-muted-foreground">@{user.githubUsername}</p>
            </div>
          </div>
          <Button onClick={() => logout.mutate()} disabled={logout.isPending}>
            {logout.isPending ? 'Logging out...' : 'Log out'}
          </Button>
        </header>
        {logout.isError && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            We couldn&apos;t log you out. Please try again.
          </p>
        )}
      </section>
    </main>
  )
}

export default DashboardPage
