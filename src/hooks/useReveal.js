import { useEffect, useRef } from 'react'

export function useReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible')
      return
    }

    // A fixed share of a very tall element (e.g. a one-column card grid on mobile)
    // can be taller than the screen and would never count as visible, so cap the
    // threshold at what a viewport can actually show.
    const base = options.threshold ?? 0.15
    const height = node.offsetHeight
    const threshold = height > 0 ? Math.min(base, (window.innerHeight * 0.8) / height) : base

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -60px 0px', ...options, threshold }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [options])

  return ref
}
