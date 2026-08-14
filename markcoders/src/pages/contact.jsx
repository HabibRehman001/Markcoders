import { useState } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import Nav from '../components/Nav'
// import Footer from '../components/Footer'
import './Contact.css'
const TRUSTED = [
  { name: 'React', src: '/react.png' },
  { name: 'JavaScript', src: '/js.png' },
  { name: 'Python', src: '/python.png' },
  { name: 'Vue', src: '/vue.png' },
  { name: 'Angular', src: '/angular.png' },
  { name: 'Flutter', src: '/flutter.png' },
  { name: 'Node', src: '/tech/node.svg' },
  { name: 'Three.js', src: '/tech/three.svg' },
  { name: 'GSAP', src: '/tech/gsap.svg' },
  { name: 'Docker', src: '/dokcer.png' },
  { name: 'AWS', src: '/tech/aws.svg' },
  { name: 'TypeScript', src: '/tech/typescript.svg' },
]

const Contact = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  })
  const [sent, setSent] = useState(false)

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    setSent(true)
  }

  const loop = [...TRUSTED, ...TRUSTED]

  return (
    <div className="contact-page">
      <Nav />

      <main className="contact-main">
        <section className="contact-hero" aria-label="Contact">
          <div className="contact-hero__info">
            <p className="contact-badge">
              <Mail size={14} strokeWidth={2.25} aria-hidden="true" />
              <span>Contact</span>
            </p>

            <h1 className="contact-hero__title">How can we help you today?</h1>
            <p className="contact-hero__copy">
              Our team is a message away — tell us what you&apos;re building and
              we&apos;ll help you ship it with clarity and impact.
            </p>

            <ul className="contact-details">
              <li>
                <span className="contact-details__icon" aria-hidden="true">
                  <Mail size={18} strokeWidth={2} />
                </span>
                <a href="mailto:hello@markcoders.com">Email: hello@markcoders.com</a>
              </li>
              <li>
                <span className="contact-details__icon" aria-hidden="true">
                  <Phone size={18} strokeWidth={2} />
                </span>
                <a href="tel:+923001234567">Phone: +92 300 123 4567</a>
              </li>
              <li>
                <span className="contact-details__icon" aria-hidden="true">
                  <MapPin size={18} strokeWidth={2} />
                </span>
                <span>Location: Karachi, Pakistan</span>
              </li>
            </ul>
          </div>

          <div className="contact-form-card">
            {sent ? (
              <div className="contact-form-success" role="status">
                <h2>Message received.</h2>
                <p>We&apos;ll get back to you soon. Talk soon.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={onSubmit} noValidate>
                <div className="contact-form__row">
                  <label className="contact-field">
                    <span>
                      First name<span aria-hidden="true">*</span>
                    </span>
                    <input
                      name="firstName"
                      type="text"
                      required
                      autoComplete="given-name"
                      value={form.firstName}
                      onChange={onChange}
                      placeholder="First name"
                    />
                  </label>

                  <label className="contact-field">
                    <span>
                      Last name<span aria-hidden="true">*</span>
                    </span>
                    <input
                      name="lastName"
                      type="text"
                      required
                      autoComplete="family-name"
                      value={form.lastName}
                      onChange={onChange}
                      placeholder="Last name"
                    />
                  </label>
                </div>

                <label className="contact-field">
                  <span>
                    Work email<span aria-hidden="true">*</span>
                  </span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="Enter email"
                  />
                </label>

                <label className="contact-field">
                  <span>
                    Phone number<span aria-hidden="true">*</span>
                  </span>
                  <input
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="Enter phone number"
                  />
                </label>

                <label className="contact-field">
                  <span>
                    Message<span aria-hidden="true">*</span>
                  </span>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={onChange}
                    placeholder="Enter a question, feedback, or project brief..."
                  />
                </label>

                <button type="submit" className="contact-submit">
                  Submit
                </button>
              </form>
            )}
          </div>
        </section>

        <section className="contact-trusted" aria-label="Trusted stack">
          <p className="contact-trusted__title">
            Trusted tools behind exceptional brands we build for
          </p>

          <div className="contact-trusted__viewport">
            <div className="contact-trusted__track">
              {loop.map((item, index) => (
                <div className="contact-trusted__item" key={`${item.name}-${index}`}>
                  <img src={item.src} alt="" loading="lazy" decoding="async" />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}

export default Contact
