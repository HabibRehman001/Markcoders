/** Debounce a function so it only runs after `ms` of quiet. */
export function debounce(fn, ms = 150) {
  let timer = 0
  const wrapped = (...args) => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => fn(...args), ms)
  }
  wrapped.cancel = () => window.clearTimeout(timer)
  return wrapped
}

/** Throttle to one call per animation frame. */
export function rafThrottle(fn) {
  let raf = 0
  let latest = null
  const wrapped = (...args) => {
    latest = args
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      fn(...latest)
    })
  }
  wrapped.cancel = () => {
    cancelAnimationFrame(raf)
    raf = 0
  }
  return wrapped
}
