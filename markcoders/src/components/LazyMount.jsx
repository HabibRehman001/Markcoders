import { useEffect, useRef, useState } from 'react'

/**
 * Mounts children only once the placeholder nears the viewport.
 * Keeps layout stable via minHeight while deferred.
 */
export default function LazyMount({
  children,
  rootMargin = '30% 0px',
  minHeight = '50svh',
  className = '',
  as: Tag = 'div',
}) {
  const ref = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || mounted) return undefined

    if (!('IntersectionObserver' in window)) {
      setMounted(true)
      return undefined
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setMounted(true)
        io.disconnect()
      },
      { rootMargin },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [mounted, rootMargin])

  return (
    <Tag
      ref={ref}
      className={className}
      style={mounted ? undefined : { minHeight }}
    >
      {mounted ? children : null}
    </Tag>
  )
}
