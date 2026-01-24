import type { ReactNode } from "react"

export const mockUser = {
  id: "user_test123",
  firstName: "Test",
  lastName: "User",
  username: "testuser",
  imageUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=testuser",
  emailAddresses: [{ emailAddress: "test@example.com" }],
  primaryEmailAddress: { emailAddress: "test@example.com" },
  publicMetadata: {},
  unsafeMetadata: {},
}

export const mockSession = {
  id: "sess_test123",
  status: "active",
  lastActiveAt: new Date(),
  expireAt: new Date(Date.now() + 86_400_000),
}

let isSignedIn = false
let activeUser = mockUser

export const setMockAuthState = (signedIn: boolean, user = mockUser) => {
  isSignedIn = signedIn
  activeUser = user
}

export const resetMockAuthState = () => {
  isSignedIn = false
  activeUser = mockUser
}

export const useUser = () => ({
  isLoaded: true,
  isSignedIn,
  user: isSignedIn ? activeUser : null,
})

export const useAuth = () => ({
  isLoaded: true,
  isSignedIn,
  userId: isSignedIn ? activeUser.id : null,
  sessionId: isSignedIn ? mockSession.id : null,
  getToken: () => Promise.resolve(isSignedIn ? "mock-token" : null),
  signOut: () => {
    isSignedIn = false
    return Promise.resolve()
  },
})

export const useClerk = () => ({
  loaded: true,
  session: isSignedIn ? mockSession : null,
  user: isSignedIn ? activeUser : null,
  signOut: () => {
    isSignedIn = false
    return Promise.resolve()
  },
  openSignIn: () => undefined,
  openSignUp: () => undefined,
  openUserProfile: () => undefined,
})

export const useSession = () => ({
  isLoaded: true,
  isSignedIn,
  session: isSignedIn ? mockSession : null,
})

export const useSignIn = () => ({
  isLoaded: true,
  signIn: null,
  setActive: () => Promise.resolve(),
})

export const useSignUp = () => ({
  isLoaded: true,
  signUp: null,
  setActive: () => Promise.resolve(),
})

export const ClerkProvider = ({ children }: { children: ReactNode }) => children

export const ClerkLoading = ({ children }: { children: ReactNode }) =>
  children ? null : null

export const ClerkLoaded = ({ children }: { children: ReactNode }) => children

export const SignedIn = ({ children }: { children: ReactNode }) =>
  isSignedIn ? children : null

export const SignedOut = ({ children }: { children: ReactNode }) =>
  isSignedIn ? null : children

export const SignInButton = ({ children }: { children: ReactNode }) => (
  <div data-testid="clerk-sign-in-button">{children}</div>
)

export const SignUpButton = ({ children }: { children: ReactNode }) => (
  <div data-testid="clerk-sign-up-button">{children}</div>
)

export const SignOutButton = ({ children }: { children: ReactNode }) => (
  <div data-testid="clerk-sign-out-button">{children}</div>
)

export const UserButton = () => (
  <div data-testid="clerk-user-button">User Button</div>
)

export const RedirectToSignIn = () => (
  <div data-testid="clerk-redirect-sign-in">Redirecting...</div>
)

export const RedirectToSignUp = () => (
  <div data-testid="clerk-redirect-sign-up">Redirecting...</div>
)

export const auth = () => ({
  userId: isSignedIn ? activeUser.id : null,
  sessionId: isSignedIn ? mockSession.id : null,
  getToken: () => Promise.resolve(isSignedIn ? "mock-token" : null),
  protect: () => {
    if (!isSignedIn) {
      throw new Error("Unauthorized")
    }
    return Promise.resolve()
  },
})

export const fetchCurrentUser = () =>
  Promise.resolve(isSignedIn ? activeUser : null)

const ROUTE_PATTERN_CACHE = new Map<string, RegExp>()
const PARENTHESES_REGEX = /\(.*\)/

export const clerkMiddleware = (
  handler?: (
    authFn: ReturnType<typeof auth>,
    request: Request
  ) => Promise<Response> | Response
) => {
  return (request: Request) => {
    if (handler) {
      return Promise.resolve(handler(auth(), request))
    }
    return Promise.resolve(new Response("OK"))
  }
}

export const createRouteMatcher = (patterns: string[]) => {
  return (request: Request) => {
    const url = new URL(request.url)
    return patterns.some((pattern) => {
      let regex = ROUTE_PATTERN_CACHE.get(pattern)
      if (!regex) {
        regex = new RegExp(`^${pattern.replace(PARENTHESES_REGEX, ".*")}$`)
        ROUTE_PATTERN_CACHE.set(pattern, regex)
      }
      return regex.test(url.pathname)
    })
  }
}
