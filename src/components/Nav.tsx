import { useState, useEffect } from 'react'
import { NAV_ITEMS, about } from '../data'

function useCurrentHash() {
  const get = () => window.location.hash.replace(/^#\/?/, '')
  const [hash, setHash] = useState(get)
  useEffect(() => {
    const handle = () => setHash(get())
    window.addEventListener('hashchange', handle)
    return () => window.removeEventListener('hashchange', handle)
  }, [])
  return hash
}

function useTime() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }).format(new Date())
  const [t, setT] = useState(fmt)
  useEffect(() => {
    const i = setInterval(() => setT(fmt()), 20000)
    return () => clearInterval(i)
  }, [])
  return t
}

function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handle = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handle, { passive: true })
    handle()
    return () => window.removeEventListener('scroll', handle)
  }, [])
  return scrollY
}

export default function Nav() {
  const time = useTime()
  const currentHash = useCurrentHash()
  const scrollY = useScrollPosition()
  const [menu, setMenu] = useState(false)

  // Show resume button after scrolling 200px
  const showResume = scrollY > 200

  const goTo = (id: string) => {
    setMenu(false)
    if (id === 'about') {
      window.location.hash = '#/about'
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (currentHash === 'about' || currentHash.startsWith('work/')) {
      window.location.hash = '#/'
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 80)
      return
    }

    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  // Filter out 'beyond' from nav items
  const filteredNavItems = NAV_ITEMS.filter(item => item.id !== 'beyond')

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-cloud/90 backdrop-blur-md border-b border-rule">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <a
          href="#/"
          className="flex items-center gap-2 font-serif text-xl"
          onClick={(e) => {
            setMenu(false)
            if (currentHash === '' || currentHash === '/') {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            } else {
              window.location.hash = '#/'
            }
          }}
        >
          <span className="text-lg" aria-hidden>🐱</span>
          <span className="tracking-tight">Tushar P.</span>
        </a>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden md:flex gap-2 flex-1 justify-center">
          {filteredNavItems.map(({ label, id }) => {
            const isActive = (id === 'about' && currentHash === 'about')
            return (
              <button
                key={id}
                className={`nav-pill ${isActive ? 'text-cobalt bg-cobalt/10 border-cobalt/30' : ''}`}
                onClick={() => goTo(id)}
              >
                {label}
              </button>
            )
          })}
        </nav>

        {/* Right side - Time and Resume */}
        <div className="hidden md:flex items-center gap-4">
          <span className="meta text-mute whitespace-nowrap">India, {time}</span>
          
          {/* Resume button with smooth appearance */}
          <a
            href={about.resumeUrl}
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cobalt/30 bg-cobalt/10 hover:bg-cobalt hover:border-cobalt text-cobalt hover:text-white font-mono text-xs font-medium transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap"
            style={{
              opacity: showResume ? 1 : 0,
              transform: showResume ? 'translateY(0)' : 'translateY(-10px)',
              pointerEvents: showResume ? 'auto' : 'none',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            aria-label="Download resume PDF"
          >
            <span aria-hidden>📄</span>
            Resume
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden meta min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-expanded={menu}
          aria-label={menu ? 'Close menu' : 'Open menu'}
          onClick={() => setMenu(!menu)}
        >
          {menu ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile overlay */}
      {menu && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-cloud px-6 pt-8 flex flex-col z-50">
          {filteredNavItems.map(({ label, id }, i) => (
            <button
              key={id}
              onClick={() => goTo(id)}
              className="text-left font-serif text-4xl border-b border-rule py-4 hover:text-cobalt transition-colors min-h-[44px]"
            >
              <span className="meta text-cobalt mr-4 align-middle">0{i + 1}</span>{label}
            </button>
          ))}
          <a
            href={about.resumeUrl}
            download
            onClick={() => setMenu(false)}
            className="text-left meta text-cobalt py-6 min-h-[44px]"
          >
            Download Resume →
          </a>
        </div>
      )}
    </header>
  )
}
