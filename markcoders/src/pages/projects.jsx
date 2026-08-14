import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Projects from '../components/Projects'

const ProjectsPage = () => {
  return (
    <div className="projects-page">
      <Nav />
      <main>
        <Projects />
      </main>
      <Footer />
    </div>
  )
}

export default ProjectsPage
