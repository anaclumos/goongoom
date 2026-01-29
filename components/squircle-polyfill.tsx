'use client'

import { useEffect } from 'react'
import { clipSquircle } from 'html-squircle'

function supportsNativeSquircle(): boolean {
  if (typeof window === 'undefined') return true
  return CSS.supports('corner-shape', 'squircle')
}

export function SquirclePolyfill() {
  useEffect(() => {
    if (supportsNativeSquircle()) return

    const elementStyles = new WeakMap<Element, { width: number; height: number }>()

    const updateElement = (element: Element) => {
      const rect = element.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const cached = elementStyles.get(element)
      if (cached && cached.width === rect.width && cached.height === rect.height) return

      elementStyles.set(element, { width: rect.width, height: rect.height })

      const clipPath = clipSquircle({
        width: rect.width,
        height: rect.height,
      })

      ;(element as HTMLElement).style.clipPath = clipPath
    }

    const updateAllSquircles = () => {
      document.querySelectorAll('.squircle').forEach(updateElement)
    }

    updateAllSquircles()

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target.classList.contains('squircle')) {
          updateElement(entry.target)
        }
      }
    })

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
              if (node.classList.contains('squircle')) {
                updateElement(node)
                resizeObserver.observe(node)
              }
              node.querySelectorAll('.squircle').forEach((el) => {
                updateElement(el)
                resizeObserver.observe(el)
              })
            }
          })
        }
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target as Element
          if (target.classList.contains('squircle')) {
            updateElement(target)
            resizeObserver.observe(target)
          }
        }
      }
    })

    document.querySelectorAll('.squircle').forEach((el) => {
      resizeObserver.observe(el)
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  return null
}
