import Nav from '../components/Nav'
import './page.css'

const Services = () => {
  return (
    <div className="page">
      <Nav />
      <main className="page__main">
        <p className="page__index">02</p>
        <h1 className="page__title">SERVICES</h1>
        <p className="page__copy">
          Product design, full-stack development, and cinematic web experiences for brands that move.
        </p>
      </main>
    </div>
  )
}

export default Services
