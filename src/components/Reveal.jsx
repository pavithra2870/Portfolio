import { useReveal } from '../hooks/useReveal'

export default function Reveal({ as: Tag = 'div', stagger = false, className = '', children, ...rest }) {
  const ref = useReveal()
  const classes = [stagger ? 'reveal-stagger' : 'reveal', className].filter(Boolean).join(' ')

  return (
    <Tag ref={ref} className={classes} {...rest}>
      {children}
    </Tag>
  )
}
