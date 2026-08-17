import { lazy, Suspense } from 'react'
import Nav from '../components/Nav'
import StudioHero from '../components/StudioHero'
import LazyMount from '../components/LazyMount'
import './home.css'

const MenuGrid = lazy(() => import('../components/MenuGrid'))
const MarkcodersText = lazy(() => import('../components/MarkcodersText'))
const Technologies = lazy(() => import('../components/Technologies'))
const FunFacts = lazy(() => import('../components/FunFacts'))
const Footer = lazy(() => import('../components/Footer'))

const SectionFallback = () => (
  <div className="home__section-fallback" aria-hidden="true" />
)

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
          <Suspense fallback={<SectionFallback />}>
            <MenuGrid />
          </Suspense>
        </LazyMount>

        <LazyMount rootMargin="20% 0px" minHeight="60svh" as="section">
          <Suspense fallback={<SectionFallback />}>
            <MarkcodersText />
          </Suspense>
        </LazyMount>

        <LazyMount rootMargin="20% 0px" minHeight="70svh" as="section">
          <Suspense fallback={<SectionFallback />}>
            <Technologies />
          </Suspense>
        </LazyMount>

        <LazyMount rootMargin="15% 0px" minHeight="40svh" as="section">
          <Suspense fallback={<SectionFallback />}>
            <FunFacts />
          </Suspense>
        </LazyMount>
      </main>
      <LazyMount rootMargin="10% 0px" minHeight="40svh" as="div">
        <Suspense fallback={<SectionFallback />}>
          <Footer />
        </Suspense>
      </LazyMount>
    </div>
  )
}

export default Home
