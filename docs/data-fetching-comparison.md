# Data Fetching Patterns: Next.js Server Components vs TanStack Start

## Overview

This document compares data fetching patterns between Next.js Server Components (with Convex) and TanStack Start, covering server-side data loading, client-side fetching, mutations, caching strategies, and form handling.

---

## 1. Server-Side Data Fetching

### Next.js Server Components

**Pattern**: Direct async/await in Server Components with `fetchQuery` from Convex

```tsx
// app/posts/page.tsx
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'

// Server Component - runs on server only
export default async function PostsPage() {
  // Direct async data fetching in component
  const posts = await fetchQuery(api.posts.list)

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  )
}
```

**Parallel Fetching** with `Promise.all()`:

```tsx
// app/dashboard/page.tsx
export default async function DashboardPage() {
  // Fetch multiple resources in parallel
  const [user, posts, stats] = await Promise.all([
    fetchQuery(api.users.current),
    fetchQuery(api.posts.list),
    fetchQuery(api.stats.get),
  ])

  return <Dashboard user={user} posts={posts} stats={stats} />
}
```

**Deduplication** with React `cache()`:

```tsx
// lib/queries.ts
import { cache } from 'react'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'

// Deduplicate identical requests across Server Components
export const getCurrentUser = cache(async () => {
  return await fetchQuery(api.users.current)
})

// app/layout.tsx
export default async function Layout({ children }) {
  const user = await getCurrentUser() // First call
  return <nav user={user}>{children}</nav>
}

// app/dashboard/page.tsx
export default async function DashboardPage() {
  const user = await getCurrentUser() // Deduplicated - same request
  return <Dashboard user={user} />
}
```

---

### TanStack Start

**Pattern**: Route loaders with `createFileRoute` + server functions

```tsx
// routes/posts.tsx
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

// Define server function (runs on server)
const getPosts = createServerFn({ method: 'GET' }).handler(async () => {
  const posts = await db.posts.findMany()
  return posts
})

// Route definition with loader
export const Route = createFileRoute('/posts')({
  loader: async () => {
    return await getPosts()
  },
  component: PostsPage,
})

function PostsPage() {
  // Access loader data
  const posts = Route.useLoaderData()

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
```

**Parallel Fetching** in loader:

```tsx
// routes/dashboard.tsx
const getUser = createServerFn({ method: 'GET' }).handler(async () => {
  return await db.users.current()
})

const getPosts = createServerFn({ method: 'GET' }).handler(async () => {
  return await db.posts.list()
})

const getStats = createServerFn({ method: 'GET' }).handler(async () => {
  return await db.stats.get()
})

export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    // Parallel fetching in loader
    const [user, posts, stats] = await Promise.all([getUser(), getPosts(), getStats()])

    return { user, posts, stats }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { user, posts, stats } = Route.useLoaderData()
  return <Dashboard user={user} posts={posts} stats={stats} />
}
```

**With Input Validation** (Zod):

```tsx
// routes/posts/$postId.tsx
import { z } from 'zod'

const getPost = createServerFn({ method: 'GET' })
  .inputValidator(z.string())
  .handler(async ({ data: postId }) => {
    return await db.posts.findById(postId)
  })

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    return await getPost({ data: params.postId })
  },
  component: PostPage,
})
```

---

## 2. Client-Side Data Fetching

### Next.js with TanStack Query

**Pattern**: Client Components with `useQuery` + Convex hooks

```tsx
// components/PostList.tsx
'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export function PostList() {
  // Real-time subscription to Convex
  const posts = useQuery(api.posts.list)

  if (posts === undefined) return <Skeleton />

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  )
}
```

**With TanStack Query** (non-Convex APIs):

```tsx
'use client'

import { useQuery } from '@tanstack/react-query'

export function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}`)
      return res.json()
    },
  })

  if (isLoading) return <Skeleton />

  return <Profile user={user} />
}
```

---

### TanStack Start with TanStack Query

**Pattern**: `useServerFn` + `useQuery` for client-side calls

```tsx
// routes/posts.tsx
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'

const getPosts = createServerFn({ method: 'GET' }).handler(async () => {
  return await db.posts.list()
})

function PostList() {
  // Convert server function to client-callable function
  const getPostsFn = useServerFn(getPosts)

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPostsFn(),
  })

  if (isLoading) return <Skeleton />

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
```

**With Suspense** (`useSuspenseQuery`):

```tsx
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'

function PostList() {
  const getPostsFn = useServerFn(getPosts)

  // No loading state needed - Suspense handles it
  const { data: posts } = useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: () => getPostsFn(),
  })

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

// Parent component
function PostsPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <PostList />
    </Suspense>
  )
}
```

**Loader + Query Integration** (prefetch in loader, query in component):

```tsx
// routes/posts.tsx
import { queryOptions } from '@tanstack/react-query'

const postsQueryOptions = () =>
  queryOptions({
    queryKey: ['posts'],
    queryFn: async () => {
      const posts = await db.posts.list()
      return posts
    },
  })

export const Route = createFileRoute('/posts')({
  loader: async ({ context }) => {
    // Prefetch data in loader
    await context.queryClient.ensureQueryData(postsQueryOptions())
  },
  component: PostsPage,
})

function PostsPage() {
  // Use the same query in component (already prefetched)
  const { data: posts } = useSuspenseQuery(postsQueryOptions())

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
```

---

## 3. Mutations & Form Handling

### Next.js Server Actions

**Pattern**: Server Actions with `<form action={...}>`

```tsx
// app/posts/new/page.tsx
import { revalidatePath } from 'next/cache'
import { api } from '@/convex/_generated/api'
import { fetchMutation } from 'convex/nextjs'

// Server Action
async function createPost(formData: FormData) {
  'use server'

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  await fetchMutation(api.posts.create, { title, content })

  revalidatePath('/posts')
}

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">Create Post</button>
    </form>
  )
}
```

**With Validation** (Zod):

```tsx
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
})

async function createPost(formData: FormData) {
  'use server'

  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
  }

  const validated = createPostSchema.parse(rawData)

  await fetchMutation(api.posts.create, validated)

  revalidatePath('/posts')
}
```

**Progressive Enhancement** with `useFormStatus`:

```tsx
'use client'

import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Post'}
    </button>
  )
}

// In parent Server Component
export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <SubmitButton />
    </form>
  )
}
```

---

### TanStack Start Mutations

**Pattern**: Server Functions with `useMutation` (custom hook or TanStack Query)

```tsx
// routes/posts/new.tsx
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
})

const createPost = createServerFn({ method: 'POST' })
  .inputValidator(createPostSchema)
  .handler(async ({ data }) => {
    const post = await db.posts.create(data)
    return post
  })

export const Route = createFileRoute('/posts/new')({
  component: NewPostPage,
})

function NewPostPage() {
  const router = useRouter()
  const createPostFn = useServerFn(createPost)

  // Custom useMutation hook (simplified)
  const mutation = useMutation({
    fn: createPostFn,
    onSuccess: async () => {
      await router.invalidate()
      router.navigate({ to: '/posts' })
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    await mutation.mutate({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Post'}
      </button>
      {mutation.error && <p>Error: {mutation.error.message}</p>}
    </form>
  )
}
```

**With TanStack Query** `useMutation`:

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function NewPostPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const createPostFn = useServerFn(createPost)

  const mutation = useMutation({
    mutationFn: createPostFn,
    onSuccess: () => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      router.navigate({ to: '/posts' })
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    mutation.mutate({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  )
}
```

**Optimistic Updates**:

```tsx
const mutation = useMutation({
  mutationFn: createPostFn,
  onMutate: async (newPost) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['posts'] })

    // Snapshot previous value
    const previousPosts = queryClient.getQueryData(['posts'])

    // Optimistically update
    queryClient.setQueryData(['posts'], (old) => [...old, newPost])

    return { previousPosts }
  },
  onError: (err, newPost, context) => {
    // Rollback on error
    queryClient.setQueryData(['posts'], context.previousPosts)
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  },
})
```

---

## 4. Caching Strategies

### Next.js Server Components

**Default Caching**: Fetch requests are cached by default

```tsx
// Cached indefinitely (until revalidation)
const posts = await fetchQuery(api.posts.list)
```

**Revalidation** with `revalidatePath`:

```tsx
// Server Action
async function createPost(formData: FormData) {
  "use server"

  await fetchMutation(api.posts.create, { ... })

  // Revalidate specific path
  revalidatePath("/posts")

  // Or revalidate layout
  revalidatePath("/posts", "layout")
}
```

**Revalidation** with `revalidateTag`:

```tsx
// In data fetching
const posts = await fetchQuery(api.posts.list, {
  next: { tags: ['posts'] }
})

// In Server Action
async function createPost(formData: FormData) {
  "use server"

  await fetchMutation(api.posts.create, { ... })

  // Revalidate all requests tagged with 'posts'
  revalidateTag('posts')
}
```

**Time-based Revalidation**:

```tsx
// Revalidate every 60 seconds
const posts = await fetchQuery(api.posts.list, {
  next: { revalidate: 60 },
})
```

**Opt-out of Caching**:

```tsx
// No caching
const posts = await fetchQuery(api.posts.list, {
  cache: 'no-store',
})

// Or at route level
export const dynamic = 'force-dynamic'
```

**React `cache()` for Deduplication**:

```tsx
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  return await fetchQuery(api.users.current)
})

// Multiple calls in same render = single request
```

---

### TanStack Start

**Built-in Route-Level Caching**:

```tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => fetchPost(params.postId),
  staleTime: 10_000, // Fresh for 10 seconds
  gcTime: 5 * 60_000, // Keep in memory for 5 minutes
})
```

**TanStack Query Caching** (when using `queryOptions`):

```tsx
const postsQueryOptions = () =>
  queryOptions({
    queryKey: ['posts'],
    queryFn: async () => await db.posts.list(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })

export const Route = createFileRoute('/posts')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(postsQueryOptions())
  },
  component: PostsPage,
})

function PostsPage() {
  // Uses cached data from loader
  const { data: posts } = useSuspenseQuery(postsQueryOptions())
  return <PostList posts={posts} />
}
```

**Manual Cache Invalidation**:

```tsx
import { useQueryClient } from '@tanstack/react-query'

function NewPostPage() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createPostFn,
    onSuccess: () => {
      // Invalidate posts cache
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
```

**Router Invalidation**:

```tsx
import { useRouter } from '@tanstack/react-router'

function NewPostPage() {
  const router = useRouter()

  const mutation = useMutation({
    fn: createPostFn,
    onSuccess: async () => {
      // Invalidate all route loaders
      await router.invalidate()
      router.navigate({ to: '/posts' })
    },
  })
}
```

**Prefetching**:

```tsx
export const Route = createFileRoute('/posts')({
  loader: ({ context }) => {
    // Prefetch (don't await - fire and forget)
    context.queryClient.prefetchQuery(deferredQueryOptions())
  },
  component: PostsPage,
})
```

---

## 5. Streaming & Suspense

### Next.js Server Components

**Streaming with Suspense**:

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Fast component renders immediately */}
      <UserGreeting />

      {/* Slow component streams in */}
      <Suspense fallback={<Skeleton />}>
        <SlowPosts />
      </Suspense>

      <Suspense fallback={<Skeleton />}>
        <SlowStats />
      </Suspense>
    </div>
  )
}

async function SlowPosts() {
  const posts = await fetchQuery(api.posts.list) // Slow query
  return <PostList posts={posts} />
}

async function SlowStats() {
  const stats = await fetchQuery(api.stats.get) // Slow query
  return <Stats data={stats} />
}
```

**Loading UI** with `loading.tsx`:

```tsx
// app/posts/loading.tsx
export default function Loading() {
  return <Skeleton />
}

// app/posts/page.tsx
export default async function PostsPage() {
  const posts = await fetchQuery(api.posts.list)
  return <PostList posts={posts} />
}
```

---

### TanStack Start

**Streaming with Server Functions**:

```tsx
// Server function with async generator
const streamMessages = createServerFn().handler(async function* () {
  const messages = generateMessages()

  for (const msg of messages) {
    await sleep(500)
    yield msg // Stream each message
  }
})

function MessagesPage() {
  const streamFn = useServerFn(streamMessages)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const stream = streamFn()

    for await (const msg of stream) {
      setMessages((prev) => [...prev, msg])
    }
  }, [])

  return <MessageList messages={messages} />
}
```

**Suspense with `useSuspenseQuery`**:

```tsx
import { Suspense } from 'react'

function PostsPage() {
  return (
    <div>
      <h1>Posts</h1>

      <Suspense fallback={<Skeleton />}>
        <PostList />
      </Suspense>

      <Suspense fallback={<Skeleton />}>
        <Comments />
      </Suspense>
    </div>
  )
}

function PostList() {
  const { data: posts } = useSuspenseQuery(postsQueryOptions())
  return <div>{posts.map(...)}</div>
}

function Comments() {
  const { data: comments } = useSuspenseQuery(commentsQueryOptions())
  return <div>{comments.map(...)}</div>
}
```

**Deferred Loading** (prefetch in loader, render in component):

```tsx
export const Route = createFileRoute('/deferred')({
  loader: ({ context }) => {
    // Kick off loading early (don't await)
    context.queryClient.prefetchQuery(deferredQueryOptions())
  },
  component: DeferredPage,
})

function DeferredPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <DeferredContent />
    </Suspense>
  )
}

function DeferredContent() {
  const { data } = useSuspenseQuery(deferredQueryOptions())
  return <div>{data}</div>
}
```

---

## 6. Key Differences Summary

| Feature                  | Next.js Server Components                    | TanStack Start                                           |
| ------------------------ | -------------------------------------------- | -------------------------------------------------------- |
| **Server Data Fetching** | Direct `async/await` in components           | Route loaders with `createFileRoute`                     |
| **Server Functions**     | Server Actions (`"use server"`)              | `createServerFn()`                                       |
| **Client Data Fetching** | `useQuery` (TanStack Query or Convex)        | `useServerFn` + `useQuery`                               |
| **Mutations**            | Server Actions with `<form action={...}>`    | `createServerFn` + `useMutation`                         |
| **Caching**              | Fetch cache + `revalidatePath/Tag`           | Route-level `staleTime/gcTime` + TanStack Query          |
| **Deduplication**        | React `cache()`                              | TanStack Query automatic deduplication                   |
| **Streaming**            | Suspense boundaries in Server Components     | Async generators + Suspense                              |
| **Form Handling**        | Progressive enhancement with `useFormStatus` | Client-side with `useMutation`                           |
| **Type Safety**          | Convex auto-generates types                  | Zod validators with `inputValidator`                     |
| **Revalidation**         | `revalidatePath`, `revalidateTag`            | `router.invalidate()`, `queryClient.invalidateQueries()` |

---

## 7. Migration Patterns

### From Next.js Server Component to TanStack Start

**Before (Next.js)**:

```tsx
// app/posts/page.tsx
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'

export default async function PostsPage() {
  const posts = await fetchQuery(api.posts.list)

  return <PostList posts={posts} />
}
```

**After (TanStack Start)**:

```tsx
// routes/posts.tsx
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const getPosts = createServerFn({ method: 'GET' }).handler(async () => {
  return await db.posts.list()
})

export const Route = createFileRoute('/posts')({
  loader: async () => await getPosts(),
  component: PostsPage,
})

function PostsPage() {
  const posts = Route.useLoaderData()
  return <PostList posts={posts} />
}
```

---

### From Next.js Server Action to TanStack Start Mutation

**Before (Next.js)**:

```tsx
// app/posts/new/page.tsx
async function createPost(formData: FormData) {
  'use server'

  const title = formData.get('title') as string
  await fetchMutation(api.posts.create, { title })

  revalidatePath('/posts')
}

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <button type="submit">Create</button>
    </form>
  )
}
```

**After (TanStack Start)**:

```tsx
// routes/posts/new.tsx
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const createPost = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ title: z.string() }))
  .handler(async ({ data }) => {
    return await db.posts.create(data)
  })

export const Route = createFileRoute('/posts/new')({
  component: NewPostPage,
})

function NewPostPage() {
  const router = useRouter()
  const createPostFn = useServerFn(createPost)

  const mutation = useMutation({
    fn: createPostFn,
    onSuccess: async () => {
      await router.invalidate()
      router.navigate({ to: '/posts' })
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    await mutation.mutate({
      title: formData.get('title') as string,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  )
}
```

---

## 8. Best Practices

### Next.js Server Components

1. **Default to Server Components** - Only use `"use client"` for interactivity
2. **Use `cache()` for deduplication** - Wrap shared queries
3. **Parallel fetch with `Promise.all()`** - Avoid waterfalls
4. **Use Server Actions for mutations** - Progressive enhancement
5. **Leverage Suspense boundaries** - Stream slow components
6. **Revalidate strategically** - Use `revalidatePath` or `revalidateTag`

### TanStack Start

1. **Define server functions separately** - Reusable across routes
2. **Use route loaders for initial data** - SSR-friendly
3. **Integrate TanStack Query for client-side** - Prefetch in loader, query in component
4. **Validate inputs with Zod** - Type-safe server functions
5. **Use `useSuspenseQuery` for Suspense** - Cleaner than `useQuery`
6. **Invalidate with `router.invalidate()`** - Refresh all route data

---

## Conclusion

Both approaches are powerful but differ in philosophy:

- **Next.js Server Components**: Server-first with progressive enhancement, tight integration with React's streaming and Suspense, minimal client JavaScript
- **TanStack Start**: Router-centric with explicit loaders, flexible client/server boundary, strong TypeScript integration with Zod

Choose based on your needs:

- **Next.js** if you want maximum server-side rendering, minimal client JS, and tight React integration
- **TanStack Start** if you want explicit data loading, flexible routing, and strong type safety with Zod
