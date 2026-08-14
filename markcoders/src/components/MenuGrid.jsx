import { usePageTransition } from './TransitionProvider'
import './MenuGrid.css'

const ITEMS = [
  {
    id: 'about',
    index: '01',
    title: 'ABOUT',
    to: '/about',
    area: 'about',
  },
  {
    id: 'services',
    index: '02',
    title: 'SERVICES',
    to: '/services',
    area: 'services',
  },
  {
    id: 'projects',
    index: '03',
    title: 'PROJECTS',
    to: '/projects',
    area: 'projects',
  },
  {
    id: 'contact',
    index: '04',
    title: 'CONTACT',
    to: '/contact',
    area: 'contact',
  },
]

const MenuGrid = () => {
  const { navigateWithTransition, isTransitioning } = usePageTransition()

  const handleCardClick = (event, item) => {
    const rect = event.currentTarget.getBoundingClientRect()

    navigateWithTransition(item.title, item.to, {
      index: item.index,
      rect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
    })
  }

  return (
    <section className="menu-grid" aria-label="Site menu">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`menu-card menu-card--${item.id}`}
          style={{ gridArea: item.area }}
          disabled={isTransitioning}
          onClick={(event) => handleCardClick(event, item)}
        >
          <div className="menu-card__content">
            <span className="menu-card__index">{item.index}</span>
            <div className="menu-card__footer">
              <h2 className="menu-card__title">{item.title}</h2>
              <span className="menu-card__arrow" aria-hidden="true">
                ↗
              </span>
            </div>
          </div>
        </button>
      ))}
    </section>
  )
}

export default MenuGrid
