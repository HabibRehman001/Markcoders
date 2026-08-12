import Nav from '../components/Nav'
import { usePageTransition } from '../components/TransitionProvider'
import './page.css'

const Services = () => {
  const { navigateWithTransition } = usePageTransition()

  return (
    <div className="page">
      <Nav />
      <main className="page__main">
        <p className="page__index">02</p>
        <h1 className="page__title">SERVICES</h1>
        <p className="page__copy">
          Product design, full-stack development, and cinematic web experiences for brands that move.
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

export default Services
