import type { ReactNode } from "react"

const mockQueryResults = new Map<string, unknown>()
const mockMutationHandlers = new Map<string, (args: unknown) => unknown>()

export const setMockQueryResult = (queryName: string, result: unknown) => {
  mockQueryResults.set(queryName, result)
}

export const setMockMutationHandler = (
  mutationName: string,
  handler: (args: unknown) => unknown
) => {
  mockMutationHandlers.set(mutationName, handler)
}

export const resetMockConvex = () => {
  mockQueryResults.clear()
  mockMutationHandlers.clear()
}

export const useQuery = (
  query: { _name?: string } | undefined,
  _args?: unknown
) => {
  if (!query) {
    return undefined
  }
  const queryName = query._name || "unknown"
  if (mockQueryResults.has(queryName)) {
    return mockQueryResults.get(queryName)
  }
  return undefined
}

export const useMutation = (mutation: { _name?: string }) => {
  const mutationName = mutation._name || "unknown"
  return (args: unknown) => {
    const handler = mockMutationHandlers.get(mutationName)
    if (handler) {
      return Promise.resolve(handler(args))
    }
    return Promise.resolve(undefined)
  }
}

export const useAction = (action: { _name?: string }) => {
  const actionName = action._name || "unknown"
  return (args: unknown) => {
    const handler = mockMutationHandlers.get(actionName)
    if (handler) {
      return Promise.resolve(handler(args))
    }
    return Promise.resolve(undefined)
  }
}

export const ConvexProvider = ({ children }: { children: ReactNode }) =>
  children as React.ReactElement

export const ConvexProviderWithClerk = ({
  children,
}: {
  children: ReactNode
  client?: unknown
  useAuth?: unknown
}) => children as React.ReactElement

export const usePreloadedQuery = <T>(preloaded: T): T => {
  return preloaded
}

export const preloadQuery = <T>(_query: unknown, _args?: unknown): Promise<T> =>
  Promise.resolve({} as T)

export class ConvexReactClient {
  url: string
  constructor(_url: string) {
    this.url = _url
  }
}

export const createMockApi = () => ({
  users: {
    getByClerkId: { _name: "users:getByClerkId" },
    getOrCreate: { _name: "users:getOrCreate" },
    updateProfile: { _name: "users:updateProfile" },
    deleteByClerkId: { _name: "users:deleteByClerkId" },
  },
  questions: {
    create: { _name: "questions:create" },
    getById: { _name: "questions:getById" },
    getUnanswered: { _name: "questions:getUnanswered" },
    getAnsweredByRecipient: { _name: "questions:getAnsweredByRecipient" },
  },
  answers: {
    create: { _name: "answers:create" },
    getRecent: { _name: "answers:getRecent" },
  },
})
