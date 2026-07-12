import { useEffect, useRef, useState } from 'react'

export default function CountUp({ to, suffix = '', duration = 1400, className }) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setValue(to)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
              setValue(to)
              return
            }
            const start = performance.now()
            const tick = (now) => {
              const progress = Math.min(1, (now - start) / duration)
              const eased = 1 - Math.pow(1 - progress, 3)
              setValue(Math.round(eased * to))
              if (progress < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
            observer.unobserve(node)
          }
        })
      },
      { threshold: 0.4 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [to, duration])

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  )
}
