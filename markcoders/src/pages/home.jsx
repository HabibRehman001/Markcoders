import { lazy, Suspense } from 'react'
import Nav from '../components/Nav'
import StudioHero from '../components/StudioHero'
import LazyMount from '../components/LazyMount'
import MarkcodersText from '../components/MarkcodersText'
import FunFacts from '../components/FunFacts'
import Technologies from '../components/Technologies'
import Footer from '../components/Footer'
import './home.css'

const MenuGrid = lazy(() => import('../components/MenuGrid'))

const Home = () => {
  return (
    <div className="home">
      <Nav />
      <main className="home__main">
        <StudioHero />

        <LazyMount
          className="home__menu"
          rootMargin="30% 0px"
          minHeight="70svh"
          as="section"
        >
          <Suspense fallback={<div className="home__section-fallback" aria-hidden="true" />}>
            <MenuGrid />
          </Suspense>
        </LazyMount>

        <MarkcodersText />
        <Technologies />
        <FunFacts />
      </main>
      <Footer />
    </div>
  )
}

export default Home
