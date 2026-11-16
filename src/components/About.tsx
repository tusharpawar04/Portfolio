import { useState, useEffect, useRef } from 'react'
import Supercat from './Supercat'
import { about, highlights, socialLinks } from '../data'
import { useScrollReveal, useSmoothParallax } from '../hooks'

export default function AboutPage() {
  const [loaded, setLoaded] = useState(false)
  const aboutRef = useRef<HTMLElement>(null)
  const { ref: highlightRef, isVisible: highlightVisible } = useScrollReveal(0.1)

  useSmoothParallax(aboutRef)

  useEffect(() => {
    window.scrollTo({ top: 0 })
    requestAnimationFrame(() => setLoaded(true))
  }, [])

  const entrance = (delay: number): React.CSSProperties => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  })

  return (
    <main ref={aboutRef} className="min-h-screen">
      {/* Hero header */}
      <section className="relative overflow-hidden pt-32 md:pt-44 pb-20 px-6 md:px-12">
        {/* Parallax deco */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            data-parallax-speed="0.12"
            className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full opacity-[0.05]"
            style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
          />
          <div
            data-parallax-speed="-0.08"
            className="absolute top-[30%] right-[8%] w-3 h-3 rounded-full bg-apricot/40"
          />
        </div>

        <div className="relative max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-12">
          {/* Photo / visual area */}
          <div className="md:col-span-5 md:col-start-1" style={entrance(0)}>
            <div className="relative">
              {/* Actual photo */}
              <div className="w-full max-w-[400px] aspect-[3/4] rounded-[24px] overflow-hidden shadow-lg bg-gradient-to-br from-ink/5 to-cobalt/5">
                <img 
                  src="/TusharNavy.png" 
                  alt="Tushar Pawar" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating Supercat on the photo corner */}
              <div
                data-parallax-speed="-0.1"
                className="absolute -bottom-6 -right-6 hidden md:block"
                style={{ animation: 'float 4s ease-in-out infinite' }}
              >
                <Supercat pose="curious" mood="curious" className="w-24" title="" />
              </div>
            </div>
          </div>

          {/* Bio text */}
          <div className="md:col-span-6 md:col-start-7 flex flex-col justify-center">
            <div className="meta text-cobalt mb-4" style={entrance(0.1)}>About</div>
            <h1
              className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em]"
              style={entrance(0.15)}
            >
              I'm <em className="text-cobalt">Tushar</em>, an independent developer from India who likes products that work in the real world, and ideas that are still a little too curious to ship.
            </h1>

            <div className="mt-8 flex flex-wrap gap-3" style={entrance(0.3)}>
              {socialLinks.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target={s.platform === 'Email' ? undefined : '_blank'}
                  rel={s.platform === 'Email' ? undefined : 'noopener noreferrer'}
                  aria-label={s.platform}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-rule bg-white text-sm font-mono hover-lift min-h-[44px]"
                >
                  <span aria-hidden>{s.icon}</span> {s.platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Graphical divider */}
      <div className="relative h-24 overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 1440 100" className="absolute bottom-0 w-full" preserveAspectRatio="none">
          <path d="M0 60 Q360 20 720 50 Q1080 80 1440 30 L1440 100 L0 100Z" fill="#fff" opacity="0.5" />
          <path d="M0 70 Q360 40 720 65 Q1080 90 1440 45 L1440 100 L0 100Z" fill="var(--color-cloud)" />
        </svg>
      </div>

      {/* Highlights — brief work & competitions */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-20">
        <div
          ref={highlightRef}
          className={`fade-slide-up ${highlightVisible ? 'is-visible' : ''}`}
        >
          <div className="meta text-cobalt mb-6">Notable</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {highlights.map((h, i) => (
              <div
                key={h.label}
                className={`rounded-[20px] p-5 border transition-all duration-300 hover-lift fade-slide-up ${highlightVisible ? 'is-visible' : ''} ${
                  h.accent
                    ? 'bg-cobalt/5 border-cobalt/20'
                    : 'bg-white border-rule'
                }`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className={`font-semibold text-lg ${h.accent ? 'text-cobalt' : ''}`}>{h.label}</div>
                <div className="text-sm text-mute mt-1">{h.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beyond Section - A little beyond the screen */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-20 bg-gradient-to-b from-transparent to-wash/30">
        <div className="border-t border-rule pt-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6 mb-12">
            <div className="md:col-span-3 meta text-cobalt">Beyond code</div>
            <h2 className="md:col-span-9 font-serif text-4xl md:text-6xl tracking-[-0.025em] leading-[1.02]">
              A little beyond the <em className="text-cobalt">screen.</em>
            </h2>
          </div>
          
          {/* Photo grid with staggered layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-start">
            <figure className="col-span-1 group">
              <div className="overflow-hidden rounded-[20px] shadow-md hover:shadow-xl transition-shadow duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1502979932800-33d311b7ce56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900" 
                  alt="An open book in soft light" 
                  loading="lazy" 
                  className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <figcaption className="mt-3 meta text-mute">Reading & literature</figcaption>
            </figure>
            
            <figure className="col-span-1 md:mt-16 group">
              <div className="overflow-hidden rounded-[20px] shadow-md hover:shadow-xl transition-shadow duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1736695833196-62101ef362df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900" 
                  alt="A narrow alley with a light at the end" 
                  loading="lazy" 
                  className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <figcaption className="mt-3 meta text-mute">New perspectives</figcaption>
            </figure>
            
            <figure className="col-span-1 md:mt-4 group">
              <div className="overflow-hidden rounded-[20px] shadow-md hover:shadow-xl transition-shadow duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1686762843717-dec31bdf210f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900" 
                  alt="A black cat sitting on a bench" 
                  loading="lazy" 
                  className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <figcaption className="mt-3 meta text-mute">Cats, naturally</figcaption>
            </figure>
            
            <figure className="col-span-1 md:mt-24 group">
              <div className="w-full aspect-[3/4] bg-gradient-to-br from-ink to-cobalt/90 text-cloud p-6 rounded-[20px] flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                <div className="font-mono text-[11px] leading-relaxed text-cloud/70">
                  <div className="mb-1">// today</div>
                  <div><span className="text-apricot font-medium">const</span> next = <span className="text-cloud">learn</span>(</div>
                  <div className="pl-4 text-cloud/90">'something new'</div>
                  <div>)</div>
                </div>
                <div className="font-serif text-2xl leading-tight">
                  Always <em className="text-apricot">tinkering.</em>
                </div>
              </div>
              <figcaption className="mt-3 meta text-mute">Experiments</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Graphical bottom — cat scene */}
      <section className="relative overflow-hidden py-16 bg-ink text-cloud">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center">
          <p className="font-serif text-3xl md:text-5xl leading-tight max-w-[36rem] mx-auto">
            Always <em className="text-cobalt">tinkering</em>, always <em className="text-apricot">curious</em>.
          </p>
          <div className="mt-10 flex justify-center gap-6" aria-hidden="true">
            <Supercat pose="sit" mood="smile" className="w-20" title="" />
            <Supercat pose="fly" mood="open" className="w-20" title="" />
            <Supercat pose="curious" mood="curious" className="w-20" title="" />
          </div>
          <a
            href="#/"
            className="inline-block mt-10 meta text-cloud/60 u-link"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            ← Back to home
          </a>
        </div>
      </section>
    </main>
  )
}
