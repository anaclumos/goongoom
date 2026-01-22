"use client"

import { type DebouncedFunction, debounce } from "es-toolkit"
import { useCallback, useEffect, useRef } from "react"

type AnyFunction = (...args: never[]) => unknown

export function useDebouncedCallback<T extends AnyFunction>(
  callback: T,
  wait: number
): (...args: Parameters<T>) => void {
  const callbackRef = useRef<T>(callback)
  const debouncedRef = useRef<DebouncedFunction<
    (...args: Parameters<T>) => void
  > | null>(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    debouncedRef.current = debounce((...args: Parameters<T>) => {
      callbackRef.current(...args)
    }, wait)

    return () => {
      debouncedRef.current?.cancel()
    }
  }, [wait])

  return useCallback((...args: Parameters<T>) => {
    debouncedRef.current?.(...args)
  }, [])
}
