import { useState, useEffect } from 'react'
import { NAV_ITEMS, about, RESUME_FILENAME } from '../data'
import { openResumePreview } from './ResumeModal'

const isMobile = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches

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
          
          {/* Resume button with preview modal on desktop, direct download/open on phone */}
          <a
            href={about.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={RESUME_FILENAME}
            onClick={(e) => {
              if (!isMobile()) {
                e.preventDefault()
                openResumePreview()
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cobalt/30 bg-cobalt/10 hover:bg-cobalt hover:border-cobalt text-cobalt hover:text-white font-mono text-xs font-medium transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer"
            style={{
              opacity: showResume ? 1 : 0,
              transform: showResume ? 'translateY(0)' : 'translateY(-10px)',
              pointerEvents: showResume ? 'auto' : 'none',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            aria-label="Resume"
            title="Preview & Download Resume"
          >
            <span aria-hidden>📄</span>
            Resume
          </a>
        </div>

        {/* Mobile hamburger - Improved design */}
        <button
          className="md:hidden relative w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-rule hover:border-cobalt bg-white/80 backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
          aria-expanded={menu}
          aria-label={menu ? 'Close menu' : 'Open menu'}
          onClick={() => setMenu(!menu)}
        >
          <span 
            className={`w-5 h-0.5 bg-ink rounded-full transition-all duration-300 ${menu ? 'rotate-45 translate-y-2' : ''}`}
          />
          <span 
            className={`w-5 h-0.5 bg-ink rounded-full transition-all duration-300 ${menu ? 'opacity-0' : 'opacity-100'}`}
          />
          <span 
            className={`w-5 h-0.5 bg-ink rounded-full transition-all duration-300 ${menu ? '-rotate-45 -translate-y-2' : ''}`}
          />
        </button>
      </div>

      {/* Mobile overlay - Improved design */}
      {menu && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 top-16 bg-ink/20 backdrop-blur-sm z-40"
            onClick={() => setMenu(false)}
            aria-hidden="true"
          />
          
          {/* Menu panel */}
          <div className="md:hidden fixed inset-x-0 top-16 bg-cloud/95 backdrop-blur-md px-6 pt-6 pb-8 border-b border-rule shadow-lg z-50 animate-slideDown">
            <nav className="flex flex-col gap-1">
              {filteredNavItems.map(({ label, id }, i) => (
                <button
                  key={id}
                  onClick={() => goTo(id)}
                  className="group text-left font-serif text-3xl py-4 border-b border-rule/30 hover:border-cobalt/50 transition-all min-h-[44px] flex items-center justify-between"
                >
                  <span className="flex items-center gap-3">
                    <span className="meta text-cobalt group-hover:scale-110 transition-transform">0{i + 1}</span>
                    <span className="group-hover:text-cobalt group-hover:translate-x-1 transition-all">{label}</span>
                  </span>
                  <span className="text-base text-mute group-hover:text-cobalt group-hover:translate-x-1 transition-all">→</span>
                </button>
              ))}
            </nav>
            
            {/* Resume button — directly opens/downloads in mobile browser */}
            <a
              href={about.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={RESUME_FILENAME}
              onClick={(e) => {
                setMenu(false)
                if (!isMobile()) {
                  e.preventDefault()
                  openResumePreview()
                }
              }}
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-cobalt text-white font-mono text-sm hover:bg-cobalt/90 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            >
              <span aria-hidden>📄</span>
              Download Resume
            </a>
          </div>
        </>
      )}
    </header>
  )
}
