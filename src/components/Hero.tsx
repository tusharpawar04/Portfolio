import { useState, useEffect, useRef } from 'react'
import Supercat from './Supercat'
import { about } from '../data'
import { useSmoothParallax } from '../hooks'
import { openResumePreview } from './ResumeModal'

export default function Hero() {
  const [loaded, setLoaded] = useState(false)
  const [resumeHover, setResumeHover] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  // Silky smooth, hardware-accelerated inertia parallax
  useSmoothParallax(heroRef)

  useEffect(() => {
    requestAnimationFrame(() => setLoaded(true))
    const onScroll = () => {
      const isPast = window.scrollY > 40
      setScrolled((prev) => (prev !== isPast ? isPast : prev))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const entrance = (delay: number): React.CSSProperties => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(30px)',
    transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  })

  return (
    <section ref={heroRef} className="relative overflow-hidden bg-cloud" style={{ height: '100vh', maxHeight: '100vh' }}>
      {/* Background decorations - with hardware-accelerated inertia parallax */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Large animated gradient blob */}
        <div
          data-parallax-speed="0.2"
          className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full opacity-[0.08]"
          style={{ 
            background: 'radial-gradient(circle, #7c3aed 0%, #f2a17d 50%, transparent 70%)', 
            filter: 'blur(60px)',
            animation: 'pulse 8s ease-in-out infinite'
          }}
        />
        
        {/* Floating smooth dots */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            data-parallax-speed={`${-(0.06 + i * 0.03)}`}
            className="absolute rounded-full"
            style={{
              width: `${4 + (i % 3) * 4}px`,
              height: `${4 + (i % 3) * 4}px`,
              background: i % 2 === 0 ? 'var(--color-cobalt)' : 'var(--color-apricot)',
              opacity: 0.2 + (i % 3) * 0.1,
              left: `${60 + i * 10}%`,
              top: `${15 + (i * 13) % 70}%`,
              animation: `float ${3 + i}s ease-in-out infinite ${i * 0.5}s`
            }}
          />
        ))}
        
        {/* Decorative gradient rule */}
        <div
          data-parallax-speed="0.14"
          data-parallax-rotate="-0.02"
          className="absolute top-[30%] right-[15%] w-40 h-px bg-gradient-to-r from-transparent via-cobalt/30 to-transparent"
          style={{ 
            animation: 'fadeInOut 4s ease-in-out infinite'
          }}
        />
      </div>

      {/* Main content grid */}
      <div className="relative h-full flex items-center px-6 md:px-12 lg:px-16">
        <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Text content */}
          <div className="lg:col-span-6 z-10">
            <h1
              className="font-serif text-[clamp(2.8rem,9vw,6.5rem)] leading-[1.05] tracking-[-0.03em]"
              style={entrance(0)}
            >
              I build <em className="text-cobalt">thoughtful</em><br />digital products.
            </h1>

            <p
              className="mt-6 text-[18px] md:text-[20px] leading-[1.7] text-ink/70 max-w-[34rem]"
              style={entrance(0.15)}
            >
              Full-stack apps, AI-powered experiences, and ideas
              that are still a little too curious to ship.
            </p>

            <div 
              className="mt-8 flex flex-wrap items-center gap-4"
              style={entrance(0.3)}
            >
              <a
                href="#work"
                onClick={(e) => { e.preventDefault(); document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cobalt text-white font-medium hover:bg-cobalt/90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                See the work
                <span aria-hidden>→</span>
              </a>
              
              {/* Creative Resume Preview */}
              <button
                onClick={() => openResumePreview()}
                onMouseEnter={() => setResumeHover(true)}
                onMouseLeave={() => setResumeHover(false)}
                className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-cobalt/20 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-cobalt/40 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg cursor-pointer"
                aria-label="Preview resume"
              >
                <span className="text-lg" aria-hidden>📄</span>
                <span className="font-medium text-ink">Resume</span>
                {resumeHover && (
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-ink text-white px-3 py-1.5 rounded-lg shadow-lg"
                    style={{ animation: 'fadeInScale 200ms cubic-bezier(.16,1,.3,1) both' }}
                  >
                    Preview & Download 🐱
                  </span>
                )}
              </button>
            </div>

            {/* Floating info cards */}
            <div 
              className="mt-12 flex flex-wrap gap-3"
              style={entrance(0.45)}
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-rule shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-ink/70">Available for projects</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-rule shadow-sm">
                <span className="text-sm" aria-hidden>📍</span>
                <span className="text-sm text-ink/70">India</span>
              </div>
            </div>
          </div>

          {/* Right: Supercat with decorative elements */}
          <div className="lg:col-span-6 relative hidden lg:flex items-center justify-center" style={entrance(0.2)}>
            {/* Decorative circle background with inertia parallax */}
            <div 
              data-parallax-speed="-0.22"
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="relative w-[500px] h-[500px]">
                {/* Outer rotating ring */}
                <div 
                  className="absolute inset-0 rounded-full border-2 border-cobalt/10"
                  style={{ animation: 'rotate 20s linear infinite' }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cobalt/40" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-apricot/40" />
                </div>
                
                {/* Inner pulsing circle */}
                <div 
                  className="absolute inset-8 rounded-full bg-gradient-to-br from-cobalt/5 via-transparent to-apricot/5"
                  style={{ animation: 'pulse 4s ease-in-out infinite' }}
                />

                {/* Floating skill badges */}
                <div 
                  className="absolute top-[15%] left-[10%] px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-cobalt/20 shadow-md text-xs font-medium text-cobalt z-20"
                  style={{ animation: 'float 3s ease-in-out infinite' }}
                >
                  React
                </div>
                <div 
                  className="absolute top-[25%] right-[5%] px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-cobalt/20 shadow-md text-xs font-medium text-cobalt z-20"
                  style={{ animation: 'float 3.5s ease-in-out infinite 0.5s' }}
                >
                  TypeScript
                </div>
                <div 
                  className="absolute bottom-[20%] left-[5%] px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-cobalt/20 shadow-md text-xs font-medium text-cobalt z-20"
                  style={{ animation: 'float 4s ease-in-out infinite 1s' }}
                >
                  Node.js
                </div>
                <div 
                  className="absolute bottom-[30%] right-[15%] px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-cobalt/20 shadow-md text-xs font-medium text-cobalt z-20"
                  style={{ animation: 'float 3.8s ease-in-out infinite 1.5s' }}
                >
                  AI/ML
                </div>
              </div>
            </div>

            {/* Main Supercat with smooth inertia parallax */}
            <div
              data-parallax-speed="-0.32"
              data-parallax-scale="0.0006"
              className="relative z-10"
            >
              <Supercat 
                pose="sit" 
                mood="smile" 
                track 
                className="w-80 lg:w-[420px] filter drop-shadow-2xl" 
                title="Supercat - Portfolio Guardian" 
              />
              {/* Glow effect beneath cat */}
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-20 bg-gradient-to-t from-cobalt/20 via-cobalt/10 to-transparent blur-2xl -z-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-300 pointer-events-none"
        style={{ ...entrance(0.6), opacity: loaded && !scrolled ? 0.6 : 0 }}
      >
        <span className="text-xs text-ink/40 font-mono mb-1">Scroll</span>
        <div className="w-5 h-8 rounded-full border-2 border-ink/20 flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-ink/30 rounded-full" style={{ animation: 'bob 2s ease-in-out infinite' }} />
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
      `}</style>
    </section>
  )
}
