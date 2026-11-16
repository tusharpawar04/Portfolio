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

        {/* Mobile hamburger icon */}
        <button
          className="md:hidden min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-1.5 relative z-50"
          aria-expanded={menu}
          aria-label={menu ? 'Close menu' : 'Open menu'}
          onClick={() => setMenu(!menu)}
        >
          <span
            className={`w-6 h-0.5 bg-ink transition-all duration-300 ${
              menu ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-ink transition-all duration-300 ${
              menu ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-ink transition-all duration-300 ${
              menu ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          menu ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenu(false)}
        aria-hidden="true"
      />

      {/* Mobile slide-in drawer */}
      <nav
        className={`md:hidden fixed top-0 right-0 bottom-0 w-[280px] bg-cloud shadow-2xl transform transition-transform duration-300 ease-out z-50 ${
          menu ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile menu"
      >
        <div className="flex flex-col h-full">
          {/* Drawer header */}
          <div className="px-6 py-6 border-b border-rule">
            <div className="flex items-center justify-between">
              <span className="font-serif text-xl text-ink">Menu</span>
              <button
                onClick={() => setMenu(false)}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-wash transition-colors"
                aria-label="Close menu"
              >
                <span className="text-xl" aria-hidden>×</span>
              </button>
            </div>
          </div>

          {/* Navigation items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {filteredNavItems.map(({ label, id }, i) => {
              const isActive = (id === 'about' && currentHash === 'about')
              return (
                <button
                  key={id}
                  onClick={() => goTo(id)}
                  className={`w-full text-left py-4 border-b border-rule/50 transition-all hover:pl-3 min-h-[44px] group ${
                    isActive ? 'text-cobalt' : 'text-ink'
                  }`}
                  style={{
                    animation: menu ? `slideInRight 0.3s ease-out ${i * 0.05}s both` : 'none'
                  }}
                >
                  <span className="meta text-cobalt mr-3">0{i + 1}</span>
                  <span className="font-serif text-2xl group-hover:text-cobalt transition-colors">
                    {label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Drawer footer with resume */}
          <div className="px-6 py-6 border-t border-rule bg-wash/50">
            <a
              href={about.resumeUrl}
              download
              onClick={() => setMenu(false)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-cobalt text-white hover:bg-cobalt/90 transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[44px]"
            >
              <span className="font-medium">Download Resume</span>
              <span className="text-lg" aria-hidden>📄</span>
            </a>
            <div className="mt-3 text-center">
              <span className="meta text-mute text-xs">India, {time}</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
