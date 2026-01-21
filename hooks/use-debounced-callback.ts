"use client"

import { debounce } from "es-toolkit"
import { useEffect, useMemo, useRef } from "react"

export function useDebouncedCallback<T extends (...args: never[]) => unknown>(
  callback: T,
  wait: number
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const debouncedFn = useMemo(() => {
    return debounce((...args: Parameters<T>) => {
      callbackRef.current(...args)
    }, wait)
  }, [wait])

  useEffect(() => {
    return () => {
      debouncedFn.cancel()
    }
  }, [debouncedFn])

  return debouncedFn
}
