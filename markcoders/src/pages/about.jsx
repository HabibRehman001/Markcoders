import Nav from '../components/Nav'
import { usePageTransition } from '../components/TransitionProvider'
import './page.css'

const About = () => {
  const { navigateWithTransition } = usePageTransition()

  return (
    <div className="page">
      <Nav />
      <main className="page__main">
        <p className="page__index">01</p>
        <h1 className="page__title">ABOUT</h1>
        <p className="page__copy">
          Markcoders builds sharp digital products — code, craft, and motion in one system.
        </p>
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

export default About
