export type User = {
    id: string;
    githubId: number;
    githubUsername: string;
    displayName: string;
    avatarUrl: string | null;
}

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export function getApiBaseUrl() {
    // Must stay in sync with `next.config.ts`; :3000 is the Next.js dev server,
    // so defaulting there would send API calls to a route that does not exist.
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
}

export function getGitHubLoginUrl() {
    // Relative so the browser stays on the frontend origin (localhost:3000).
    // The registration id must match `spring.security.oauth2.client.registration.github`
    // in the backend, i.e. "github" (not "login").
    return "/oauth2/authorization/github"
}

async function parseError(res: Response): Promise<string> {
    try {
        const data = await res.json();
        return data.message ?? data.error ?? res.statusText;
    } catch {
        return res.statusText || "Request failed";
    }
}

// Without a timeout a hung request leaves the UI stuck in a loading state
// forever, because the promise never settles.
const REQUEST_TIMEOUT_MS = 10_000;

export async function apiFetch<T>(
    path: string,
    init?: RequestInit
): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const res = await fetch(`${getApiBaseUrl()}${path}`, {
            ...init,
            signal: controller.signal,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...(init?.headers ?? {}),
            }
        });

        if (!res.ok) {
            throw new ApiError(res.status, await parseError(res));
        }

        if (res.status === 204) {
            return undefined as T;
        }

        return res.json() as Promise<T>;
    } catch (error) {
        // The timeout aborts the request; surface it as a normal ApiError so
        // callers can fail fast instead of spinning forever.
        if (controller.signal.aborted && !(error instanceof ApiError)) {
            throw new ApiError(408, "The request timed out. Please try again.");
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

export const api = {
    me: () => apiFetch<User>("/api/auth/me"),
    logout: () => apiFetch<User>("/api/auth/logout", {
        method: "POST",
    }),
}