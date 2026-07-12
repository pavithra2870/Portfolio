import { useEffect, useRef } from 'react'

// Subtle magnetic hover: the element eases a few pixels toward the cursor.
export function useMagnetic(strength = 14) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(hover: none)').matches) return

    const handleMove = (e) => {
      const rect = node.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      node.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px)`
    }

    const handleLeave = () => {
      node.style.transform = 'translate(0, 0)'
    }

    node.addEventListener('mousemove', handleMove)
    node.addEventListener('mouseleave', handleLeave)
    return () => {
      node.removeEventListener('mousemove', handleMove)
      node.removeEventListener('mouseleave', handleLeave)
    }
  }, [strength])

  return ref
}
