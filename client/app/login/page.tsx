'use client'

import { Spinner } from '@/components/ui/spinner'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect } from 'react'

import { cn } from "cn"
import { GalleryVerticalEnd } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { getGitHubLoginUrl } from '@/lib/api'
import { useCurrentUser } from '@/hooks/use-auth'

function LoginLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner className='size-8' />
    </div>
  )
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  oauth_failed: "We couldn't complete sign-in with GitHub. Please try again.",
}

const LoginContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const router = useRouter();
  const params = useSearchParams();
  const error = params.get("error");
  const next = params.get("next") || "/dashboard";
  const { data: user, isPending } = useCurrentUser();

  // An already-authenticated visitor should not see the sign-in form again.
  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  // Only the initial auth check may block the page. Once it settles, a missing
  // user simply means "not signed in", which is exactly when the form is shown.
  if (isPending || user) {
    return <LoginLoading />;
  }

  const errorMessage = error
    ? AUTH_ERROR_MESSAGES[error] ?? "Sign-in failed. Please try again."
    : null;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
            <FieldDescription>
              Don&apos;t have an account? <a href="#">Sign up</a>
            </FieldDescription>
          </div>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertTitle>Sign-in failed</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <Field className="grid gap-4">
            <Button variant="outline" type="button" onClick={() => { window.location.href = getGitHubLoginUrl() }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Login with GitHub
          </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )

}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginContent className={undefined}  />
        </div>
      </div>
    </Suspense>
  )
}


