import { useEffect, useRef } from 'react'

// As the user scrolls past `range` px, the element recedes in 3D space —
// a subtle perspective tilt + scale-down, inspired by scroll-driven hero exits.
export function useScrollDepth(range = 640) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = null

    const apply = () => {
      const progress = Math.min(1, Math.max(0, window.scrollY / range))
      const rotate = progress * 7
      const scale = 1 - progress * 0.05
      const opacity = 1 - progress * 0.55
      node.style.transform = `perspective(1400px) rotateX(${rotate}deg) scale(${scale})`
      node.style.opacity = String(opacity)
      raf = null
    }

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [range])

  return ref
}
