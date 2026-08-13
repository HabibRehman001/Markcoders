import Nav from '../components/Nav'
import LaptopIntro from '../components/LaptopIntro'
import MarkcodersText from '../components/MarkcodersText'
import FunFacts from '../components/FunFacts'
import Technologies from '../components/Technologies'
import Footer from '../components/Footer'
import laptopOnly from '../assets/laptoponly.png'
import './home.css'

const Home = () => {
  return (
    <div className="home">
      <img
        className="home__laptop-only"
        src={laptopOnly}
        alt=""
        draggable={false}
      />

      <Nav />
      <main className="home__main">
        <LaptopIntro />
        <MarkcodersText />
        <Technologies />
        <FunFacts />
      </main>
      <Footer />
    </div>
  )
}

export default Home
