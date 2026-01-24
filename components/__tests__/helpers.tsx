import { type RenderOptions, render } from "@testing-library/react"
import type { ReactElement, ReactNode } from "react"

interface MockAuthState {
  isSignedIn: boolean
  userId: string | null
  user: {
    id: string
    firstName: string
    lastName: string
    username: string
    imageUrl: string
  } | null
}

const defaultAuthState: MockAuthState = {
  isSignedIn: false,
  userId: null,
  user: null,
}

const signedInAuthState: MockAuthState = {
  isSignedIn: true,
  userId: "user_test123",
  user: {
    id: "user_test123",
    firstName: "Test",
    lastName: "User",
    username: "testuser",
    imageUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=testuser",
  },
}

interface AllProvidersProps {
  children: ReactNode
  authState?: MockAuthState
}

function AllProviders({
  children,
  authState = defaultAuthState,
}: AllProvidersProps) {
  return (
    <div data-auth-state={JSON.stringify(authState)} data-testid="test-wrapper">
      {children}
    </div>
  )
}

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  authState?: MockAuthState
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { authState = defaultAuthState, ...renderOptions } = options

  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders authState={authState}>{children}</AllProviders>
    ),
    ...renderOptions,
  })
}

export function renderAuthenticated(
  ui: ReactElement,
  options: Omit<CustomRenderOptions, "authState"> = {}
) {
  return renderWithProviders(ui, { ...options, authState: signedInAuthState })
}

export function renderUnauthenticated(
  ui: ReactElement,
  options: Omit<CustomRenderOptions, "authState"> = {}
) {
  return renderWithProviders(ui, { ...options, authState: defaultAuthState })
}

export { defaultAuthState, signedInAuthState }
export type { MockAuthState }
