import { GlobalRegistrator } from "@happy-dom/global-registrator"

GlobalRegistrator.register()

const mockRouter = {
  push: () => undefined,
  replace: () => undefined,
  prefetch: () => undefined,
  back: () => undefined,
  forward: () => undefined,
  refresh: () => undefined,
}

Object.assign(globalThis, {
  __NEXT_ROUTER_MOCK__: mockRouter,
  __NEXT_PATHNAME_MOCK__: "/",
  __NEXT_SEARCH_PARAMS_MOCK__: new URLSearchParams(),
})

const createMockTranslations = (namespace: string) => {
  const t = (key: string, values?: Record<string, unknown>) => {
    if (values) {
      return `${namespace}.${key}(${JSON.stringify(values)})`
    }
    return `${namespace}.${key}`
  }
  t.rich = (_key: string, _components?: Record<string, unknown>) => {
    return `${namespace}.${_key}[rich]`
  }
  return t
}

Object.assign(globalThis, {
  __NEXT_INTL_MOCK__: {
    useTranslations: createMockTranslations,
  },
})
