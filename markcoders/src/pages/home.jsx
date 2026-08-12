import { useCallback, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Nav from '../components/Nav'
import LogoHero from '../components/LogoHero'
import MenuGrid from '../components/MenuGrid'
import MarkcodersText from '../components/MarkcodersText'
import FunFacts from '../components/FunFacts'
import Technologies from '../components/Technologies'
import Footer from '../components/Footer'
import './home.css'

const Home = () => {
  const [entered, setEntered] = useState(false)

  const handleEnterMenu = useCallback(() => {
    setEntered(true)
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })
  }, [])

  return (
    <div className="home">
      <Nav />
      <main className="home__main">
        {!entered ? (
          <LogoHero onEnterMenu={handleEnterMenu} />
        ) : (
          <>
            <section className="home__menu home__menu--reveal">
              <MenuGrid />
            </section>

            <MarkcodersText />
            <Technologies />
            <FunFacts />
          </>
        )}
      </main>
      {entered ? <Footer /> : null}
    </div>
  )
}

export default Home
