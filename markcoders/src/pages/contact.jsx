import Nav from '../components/Nav'
import { usePageTransition } from '../components/TransitionProvider'
import './page.css'

const Contact = () => {
  const { navigateWithTransition } = usePageTransition()

  return (
    <div className="page">
      <Nav />
      <main className="page__main">
        <p className="page__index">04</p>
        <h1 className="page__title">CONTACT</h1>
        <p className="page__copy">
          Tell us what you&apos;re building. We&apos;ll help you ship it with clarity and impact.
        </p>
        <a className="page__back" href="mailto:hello@markcoders.com">
          hello@markcoders.com ↗
        </a>
        <button
          type="button"
          className="page__back"
          onClick={() => navigateWithTransition('HOME', '/', { index: '03' })}
        >
          ← Back to menu
        </button>
      </main>
    </div>
  )
}

export default Contact
