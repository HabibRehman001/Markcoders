const INTRO_EVENT = 'markcoders:hero-intro'

export function signalHeroIntro() {
  if (typeof window === 'undefined') return
  window.__markcodersHeroIntro = true
  window.dispatchEvent(new CustomEvent(INTRO_EVENT))
}

export function hasHeroIntroStarted() {
  return typeof window !== 'undefined' && Boolean(window.__markcodersHeroIntro)
}

export function isLoaderVisible() {
  return typeof document !== 'undefined' && Boolean(document.querySelector('.m-loader-stage'))
}

/** Runs once — immediately if intro already fired, otherwise on the event. */
export function onHeroIntro(callback) {
  if (typeof window === 'undefined') return () => {}

  let done = false
  const run = () => {
    if (done) return
    done = true
    callback()
  }

  if (hasHeroIntroStarted() || !isLoaderVisible()) {
    // Loader already gone / intro already signaled — settle to resting view
    run()
    return () => {}
  }

  window.addEventListener(INTRO_EVENT, run)
  return () => window.removeEventListener(INTRO_EVENT, run)
}
