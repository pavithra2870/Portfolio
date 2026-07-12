import { useMagnetic } from '../hooks/useMagnetic'

export default function MagneticButton({ href, className, children, strength = 10 }) {
  const ref = useMagnetic(strength)
  return (
    <a ref={ref} href={href} className={className}>
      {children}
    </a>
  )
}
