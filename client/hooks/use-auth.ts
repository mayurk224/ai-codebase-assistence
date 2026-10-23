'use client'

import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import { useRouter } from "next/navigation";

export const AUTH_COOKIE = 'acs_auth_cookie'

export function setAuthCookie(authed: boolean) {
    if (typeof document === "undefined") return;
    if (authed) {
        document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    } else {
        document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    }
}

export function useCurrentUser() {
    return useQuery({
        queryKey: queryKeys.auth.me(),
        // A failed /api/auth/me means there is no valid session; retrying cannot
        // turn a 401 into a success and would only delay the redirect.
        retry: false,
        queryFn: async () => {
            try {
                const user = await api.me()
                setAuthCookie(true)
                return user
            } catch (error) {
                setAuthCookie(false)
                throw error
            }
        }
    })
}

export function useLogout() {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn: async () => {
            await api.logout()
        },
        onSuccess: async () => {
            // Stop an in-flight /me request before clearing its cached user. Otherwise
            // it can finish after logout and make the login page treat stale data as
            // an authenticated session.
            await queryClient.cancelQueries({ queryKey: queryKeys.auth.all })
            setAuthCookie(false)
            queryClient.setQueryData(queryKeys.auth.me(), null)
            router.replace('/login')
        }
    })
}