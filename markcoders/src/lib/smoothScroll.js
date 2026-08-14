let smoothScroll = null

export function setSmoothScroll(instance) {
  smoothScroll = instance
}

export function getSmoothScroll() {
  return smoothScroll
}

/** Jump to the top of the page (native + Lenis / Locomotive). */
export function scrollToTop({ immediate = true } = {}) {
  if (typeof window === 'undefined') return

  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0

  if (!smoothScroll) return

  try {
    smoothScroll.scrollTo(0, {
      immediate,
      force: true,
      lock: true,
    })
  } catch {
    try {
      smoothScroll.lenis?.scrollTo(0, { immediate })
    } catch {
      // ignore
    }
  }
}
