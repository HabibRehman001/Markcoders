import { lazy } from 'react'

export const prefetchAbout = () => import('../pages/about')
export const prefetchServices = () => import('../pages/services')
export const prefetchProjects = () => import('../pages/projects')
export const prefetchContact = () => import('../pages/contact')

export const PREFETCH_BY_PATH = {
  '/about': prefetchAbout,
  '/services': prefetchServices,
  '/projects': prefetchProjects,
  '/contact': prefetchContact,
}

export const HomePage = lazy(() => import('../pages/home'))
export const AboutPage = lazy(prefetchAbout)
export const ServicesPage = lazy(prefetchServices)
export const ProjectsPage = lazy(prefetchProjects)
export const ContactPage = lazy(prefetchContact)
