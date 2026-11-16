import { useEffect, useState, useRef, Component, type ReactNode } from 'react'
import { projects, EMAIL, WHATSAPP_URL, getGmailComposeUrl, getMailtoUrl, type Project } from './data'
import Supercat from './components/Supercat'
import AskSupercat from './components/AskSupercat'
import ContactModal from './components/ContactModal'
import ProjectSlider from './components/ProjectSlider'
import { visuals } from './components/Visuals'
import { useMagnetic, useParallax, useReveal, useScrollReveal } from './hooks'

import Nav from './components/Nav'
import Hero from './components/Hero'
import AboutPage from './components/About'
import Skills from './components/Skills'
import Footer from './components/Footer'

const PHOTOS = {
  book: 'https://images.unsplash.com/photo-1502979932800-33d311b7ce56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
  alley: 'https://images.unsplash.com/photo-1736695833196-62101ef362df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
  cat: 'https://images.unsplash.com/photo-1686762843717-dec31bdf210f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
}

function useRoute() {
  const get = () => window.location.hash.replace(/^#\/?/, '')
  const [r, setR] = useState(get)
  useEffect(() => {
    const f = () => setR(get())
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])
  return r
}

/* ════════════════════════════════════════════ */
/*  Work Section — Card slider style           */
/* ════════════════════════════════════════════ */

function WorkCard({ p, index }: { p: Project; index: number }) {
  const V = visuals[p.slug as keyof typeof visuals]
  const { ref, isVisible } = useScrollReveal(0.1)

  // Debug: Log image availability
  console.log(`Project ${p.slug}:`, {
    hasImages: !!p.images && p.images.length > 0,
    imageCount: p.images?.length || 0,
    firstImageUrl: p.images?.[0]?.url,
    hasVisual: !!V
  });

  return (
    <div
      ref={ref}
      className={`group fade-slide-up h-full flex flex-col ${isVisible ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      <a
        href={`#/work/${p.slug}`}
        className="flex-1 flex flex-col rounded-[24px] overflow-hidden bg-white border border-rule shadow-sm hover-lift h-full"
        aria-label={`Open ${p.title} project`}
      >
        {/* Visual preview */}
        <div className="relative aspect-[16/10] overflow-hidden bg-wash shrink-0">
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
            {p.images && p.images.length > 0 ? (
              <img
                src={p.images[0].url}
                alt={p.title}
                loading="lazy"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  console.error(`Failed to load image for ${p.title}:`, p.images?.[0]?.url);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
                onLoad={() => {
                  console.log(`Successfully loaded image for ${p.title}:`, p.images?.[0]?.url);
                }}
              />
            ) : V ? (
              <V />
            ) : (
              <div className="w-full h-full bg-wash flex items-center justify-center">
                <Supercat pose="bust" mood="smile" className="w-24 opacity-20" title="" />
              </div>
            )}
          </div>
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-cobalt/0 group-hover:bg-cobalt/5 transition-colors duration-300" />
          {p.liveUrl ? (
            <div className="absolute top-3 right-3 z-10 bg-ink/80 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live App
            </div>
          ) : p.githubUrl ? (
            <div className="absolute top-3 right-3 z-10 bg-ink/80 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              GitHub
            </div>
          ) : null}
        </div>

        {/* Info - equalized layout */}
        <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <div className="meta text-cobalt truncate">{p.n} · {p.category}</div>
              <span className="meta text-mute opacity-0 group-hover:opacity-100 transition-opacity shrink-0">Open →</span>
            </div>
            {/* Equal height title container */}
            <h3 className="font-serif text-2xl md:text-[26px] tracking-tight line-clamp-2 h-[3.8rem] flex items-start">
              {p.title}
            </h3>
            {/* Equal height summary container */}
            <p className="mt-2 text-[14px] md:text-[15px] text-ink/70 leading-relaxed line-clamp-2 h-[2.8rem]">
              {p.summary}
            </p>
          </div>
          {/* Equal height bottom tech stack container */}
          <div className="mt-4 pt-3 border-t border-rule/40 flex flex-wrap gap-1.5 h-[1.85rem] overflow-hidden">
            {p.stack.slice(0, 4).map((t) => (
              <span key={t} className="text-xs px-2.5 py-0.5 rounded-full bg-wash border border-rule/50 text-ink/80 whitespace-nowrap">
                {t}
              </span>
            ))}
          </div>
        </div>
      </a>
    </div>
  )
}

function Work() {
  const { ref: headingRef, isVisible: headingVisible } = useScrollReveal(0.1)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollButtons = () => {
    if (!carouselRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return
    
    carousel.addEventListener('scroll', updateScrollButtons)
    updateScrollButtons()
    
    return () => carousel.removeEventListener('scroll', updateScrollButtons)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return
    const scrollAmount = carouselRef.current.clientWidth * 0.8
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  return (
    <section id="work" className="mx-auto max-w-[1440px] px-6 md:px-12 pt-16 md:pt-28 scroll-mt-8">
      <div
        ref={headingRef}
        className={`grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4 fade-slide-up ${headingVisible ? 'is-visible' : ''}`}
      >
        <div className="md:col-span-3 meta text-cobalt">Selected work</div>
        <div className="md:col-span-9">
          <h2 className="font-serif text-4xl md:text-6xl tracking-[-0.025em] leading-[1.02] max-w-[40rem]">
            Engineering first. <span className="text-mute">Personality second.</span>
          </h2>
        </div>
      </div>

      {/* Horizontal carousel with navigation */}
      <div className="relative mt-12 md:mt-16">
        {/* Navigation buttons */}
        <div className="absolute right-0 -top-14 flex gap-2 z-10">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`w-10 h-10 rounded-full border border-rule bg-white shadow-sm flex items-center justify-center transition-all hover:border-cobalt hover:text-cobalt hover:shadow-md ${
              !canScrollLeft ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
            }`}
          >
            <span className="text-lg">←</span>
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`w-10 h-10 rounded-full border border-rule bg-white shadow-sm flex items-center justify-center transition-all hover:border-cobalt hover:text-cobalt hover:shadow-md ${
              !canScrollRight ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
            }`}
          >
            <span className="text-lg">→</span>
          </button>
        </div>

        {/* Scrollable carousel */}
        <div
          ref={carouselRef}
          className="overflow-x-auto overflow-y-visible scrollbar-hide snap-x snap-mandatory pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="flex gap-6 items-stretch" style={{ width: 'max-content' }}>
            {projects.map((p, i) => (
              <div
                key={p.slug}
                className="snap-start flex flex-col h-full"
                style={{
                  width: 'clamp(290px, 28vw, 380px)',
                  flexShrink: 0
                }}
              >
                <WorkCard p={p} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator dots */}
        <div className="flex justify-center gap-2 mt-6">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              onClick={() => {
                const card = carouselRef.current?.children[0]?.children[i] as HTMLElement
                card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
              }}
              aria-label={`Go to ${p.title}`}
              className="w-1.5 h-1.5 rounded-full bg-rule hover:bg-cobalt transition-all"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════ */
/*  Beyond section                             */
/* ════════════════════════════════════════════ */

function Beyond() {
  const { ref, isVisible } = useScrollReveal(0.1)
  return (
    <section id="beyond" className="mx-auto max-w-[1440px] px-6 md:px-12 pt-24 md:pt-40 scroll-mt-8">
      <div ref={ref} className={`border-t border-rule pt-6 grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-8 fade-slide-up ${isVisible ? 'is-visible' : ''}`}>
        <div className="md:col-span-3 meta text-cobalt">Beyond</div>
        <h2 className="md:col-span-9 font-serif text-4xl md:text-6xl tracking-[-0.025em] leading-[1.02]">
          A little beyond the <em className="text-cobalt">screen.</em>
        </h2>
      </div>
      <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-start reveal">
        <figure className="col-span-1">
          <img src={PHOTOS.book} alt="An open book in soft light" loading="lazy" className="w-full aspect-[3/4] object-cover rounded-[20px] shadow-sm" />
          <figcaption className="mt-3 meta text-mute">Reading & literature</figcaption>
        </figure>
        <figure className="col-span-1 md:mt-16">
          <img src={PHOTOS.alley} alt="A narrow alley with a light at the end" loading="lazy" className="w-full aspect-[4/5] object-cover rounded-[20px] shadow-sm" />
          <figcaption className="mt-3 meta text-mute">New perspectives</figcaption>
        </figure>
        <figure className="col-span-1 md:mt-4">
          <img src={PHOTOS.cat} alt="A black cat sitting on a bench" loading="lazy" className="w-full aspect-[3/4] object-cover rounded-[20px] shadow-sm" />
          <figcaption className="mt-3 meta text-mute">Cats, naturally</figcaption>
        </figure>
        <figure className="col-span-1 md:mt-24">
          <div className="w-full aspect-[3/4] bg-ink text-cloud p-5 rounded-[20px] flex flex-col justify-between">
            <div className="font-mono text-[11px] leading-relaxed text-cloud/60">
              <div>// today</div>
              <div><span className="text-apricot">const</span> next = <span className="text-cobalt">learn</span>(</div>
              <div className="pl-4">'something new'</div>
              <div>)</div>
            </div>
            <div className="font-serif text-2xl leading-tight">Always <em className="text-cobalt">tinkering.</em></div>
          </div>
          <figcaption className="mt-3 meta text-mute">Experiments</figcaption>
        </figure>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════ */
/*  Contact Section                            */
/* ════════════════════════════════════════════ */

function Contact() {
  const mail = useMagnetic<HTMLAnchorElement>(0.12)
  const { ref, isVisible } = useScrollReveal(0.1)
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <section id="contact" className="mx-auto max-w-[1440px] px-6 md:px-12 pt-24 md:pt-40 scroll-mt-8">
      <div ref={ref} className={`border-t border-rule pt-6 grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-8 fade-slide-up ${isVisible ? 'is-visible' : ''}`}>
        <div className="md:col-span-3 meta text-cobalt">Contact</div>
        <div className="md:col-span-9">
          <p className="font-serif text-4xl md:text-7xl tracking-[-0.03em] leading-[1.05] max-w-[48rem]">
            Have something worth <em className="text-cobalt">building</em> carefully?
          </p>

          {/* Primary Email row with instant Gmail compose & Copy */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              ref={mail}
              href={getGmailComposeUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-2xl md:text-4xl u-link break-all text-ink hover:text-cobalt transition-colors"
              title="Click to compose in Gmail (Web)"
              aria-label={`Send email to ${EMAIL} via Gmail`}
            >
              {EMAIL}
            </a>
            <button
              onClick={handleCopyEmail}
              className="px-3.5 py-1.5 rounded-full bg-wash hover:bg-cobalt/10 border border-rule text-xs font-mono text-ink/75 hover:text-cobalt transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              aria-label="Copy email address to clipboard"
            >
              <span>{copied ? '✓ Copied!' : '📋 Copy'}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {/* Primary: Web Gmail Compose */}
            <a
              href={getGmailComposeUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cobalt hover:bg-cobalt/90 text-white font-mono text-xs uppercase tracking-wider hover-scale shadow-sm min-h-[44px]"
              aria-label="Open Gmail in web browser"
            >
              <span>Compose in Gmail ↗</span>
            </a>

            {/* Desktop / Native Mail App */}
            <a
              href={getMailtoUrl()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-rule hover:border-cobalt/40 text-ink font-mono text-xs uppercase tracking-wider hover-scale shadow-xs min-h-[44px]"
              aria-label="Open in default desktop mail client (Outlook / Apple Mail)"
            >
              <span>Mail App ✉️</span>
            </a>

            {/* WhatsApp */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-mono text-xs uppercase tracking-wider hover-scale shadow-sm min-h-[44px]"
            >
              <span>WhatsApp (+91 7898818055) 💬</span>
            </a>

            {/* Let's Talk Form */}
            <button
              onClick={() => window.dispatchEvent(new Event('open-lets-talk'))}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-wash hover:bg-white border border-rule/80 hover:border-cobalt/40 text-ink font-mono text-xs uppercase tracking-wider hover-scale shadow-xs min-h-[44px]"
            >
              <span>Open Let's Talk Form ✨</span>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-10 flex justify-end md:pr-[6%]">
        <Supercat pose="idle" className="w-32 md:w-44" title="Supercat dozing" />
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════ */
/*  Case study view                            */
/* ════════════════════════════════════════════ */

function Case({ slug }: { slug: string }) {
  const i = projects.findIndex((p) => p.slug === slug)
  const p = projects[i]
  const [activeTab, setActiveTab] = useState<'overview' | 'codebase' | 'gallery'>('overview')

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [slug])
  if (!p) return <Home />
  const next = projects[(i + 1) % projects.length]
  const V = visuals[p.slug as keyof typeof visuals]

  return (
    <main className="min-h-screen">
      {/* Hero Header */}
      <section className="mx-auto max-w-[1440px] px-6 md:px-12 pt-28 md:pt-40">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6">
          <a
            href="#/"
            className="md:col-span-3 meta u-link self-start min-h-[44px] flex items-center text-ink/70 hover:text-cobalt"
          >
            ← Back to all work
          </a>
          <div className="md:col-span-9 rise">
            <div className="flex flex-wrap items-center gap-3">
              <span className="meta text-cobalt">{p.n} · {p.category}</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {p.status}
              </span>
            </div>
            <h1 className="mt-4 font-serif text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.98] tracking-[-0.03em] text-ink">
              {p.title}
            </h1>
            {p.subtitle && (
              <p className="mt-3 text-lg md:text-xl font-medium text-cobalt tracking-tight">
                {p.subtitle}
              </p>
            )}
            <p className="mt-6 font-serif italic text-xl md:text-2xl text-mute max-w-[42rem] leading-snug">
              {p.summary}
            </p>

            {/* Live site & GitHub repository buttons */}
            {(p.liveUrl || p.githubUrl) && (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${p.title} live application in new tab`}
                    className="inline-flex items-center gap-2.5 bg-cobalt hover:bg-cobalt/90 text-white px-6 py-3 rounded-full text-sm font-mono uppercase tracking-wider hover-scale shadow-md hover:shadow-lg hover:shadow-cobalt/25 transition-all min-h-[44px]"
                  >
                    <span>Visit Live Project</span>
                    <span className="text-base" aria-hidden>↗</span>
                  </a>
                )}
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${p.title} source code on GitHub`}
                    className="inline-flex items-center gap-2.5 bg-white hover:bg-wash border border-rule hover:border-cobalt/40 text-ink px-6 py-3 rounded-full text-sm font-mono uppercase tracking-wider hover-scale shadow-xs transition-all min-h-[44px]"
                  >
                    <span aria-hidden>🐙</span>
                    <span>GitHub Repository</span>
                    <span className="text-base" aria-hidden>↗</span>
                  </a>
                )}
                <span className="meta text-mute text-xs">
                  {p.liveUrl ? 'Production Deployment' : 'Open Source Repository'}
                </span>
              </div>
            )}

            {/* Key Metrics Strip */}
            {p.metrics && (
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {p.metrics.map((m) => (
                  <div key={m.label} className="p-4 rounded-[20px] bg-white border border-rule shadow-xs">
                    <div className="meta text-mute text-[10px]">{m.label}</div>
                    <div className="mt-1 font-serif text-xl md:text-2xl text-ink font-normal">{m.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* View Selection Tabs */}
        <div className="mt-14 border-t border-rule pt-6 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all min-h-[38px] ${
              activeTab === 'overview'
                ? 'bg-cobalt text-white shadow-xs'
                : 'bg-white border border-rule text-ink/70 hover:text-ink hover:border-cobalt/30'
            }`}
          >
            01 · Product Overview & Workflows
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all min-h-[38px] ${
              activeTab === 'gallery'
                ? 'bg-cobalt text-white shadow-xs'
                : 'bg-white border border-rule text-ink/70 hover:text-ink hover:border-cobalt/30'
            }`}
          >
            02 · Interface Gallery & Aspects ({p.images ? p.images.length : 1})
          </button>
          <button
            onClick={() => setActiveTab('codebase')}
            className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all min-h-[38px] ${
              activeTab === 'codebase'
                ? 'bg-cobalt text-white shadow-xs'
                : 'bg-white border border-rule text-ink/70 hover:text-ink hover:border-cobalt/30'
            }`}
          >
            03 · Codebase & Architecture
          </button>
        </div>
      </section>

      {/* TAB 1: OVERVIEW & WHAT IT DOES */}
      {activeTab === 'overview' && (
        <section className="mx-auto max-w-[1440px] px-6 md:px-12 mt-12">
          {/* Main Screenshot/Visual Banner */}
          <div className="mb-14">
            {p.images && p.images.length > 0 ? (
              <ProjectSlider images={p.images} projectTitle={p.title} />
            ) : (
              <div>
                <div className="w-full aspect-[16/9] overflow-hidden rounded-[24px] shadow-sm">
                  {V ? <V /> : <div className="w-full h-full bg-wash" />}
                </div>
                <p className="mt-3 meta text-mute">{p.caption}</p>
              </div>
            )}
          </div>

          {/* Problem & Solution Cards */}
          {p.whatItDoes && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              <div className="p-6 md:p-8 rounded-[24px] bg-white border border-rule shadow-xs">
                <div className="meta text-apricot mb-2">The Operational Challenge</div>
                <h3 className="font-serif text-2xl md:text-3xl text-ink mb-3">Why this software had to be built</h3>
                <p className="text-ink/80 text-base leading-relaxed">{p.whatItDoes.problem}</p>
              </div>
              <div className="p-6 md:p-8 rounded-[24px] bg-white border border-cobalt/20 shadow-xs">
                <div className="meta text-cobalt mb-2">The Engineering Solution</div>
                <h3 className="font-serif text-2xl md:text-3xl text-ink mb-3">What the system accomplishes</h3>
                <p className="text-ink/80 text-base leading-relaxed">{p.whatItDoes.solution}</p>
              </div>
            </div>
          )}

          {/* Target Users & Core Workflows */}
          {p.whatItDoes && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 border-t border-rule pt-10">
              <div className="md:col-span-5">
                <div className="meta text-cobalt mb-3">Who Relies On It</div>
                <h3 className="font-serif text-2xl md:text-3xl text-ink mb-4">Target Personas</h3>
                <div className="space-y-3">
                  {p.whatItDoes.targetUsers.map((u, idx) => (
                    <div key={idx} className="p-4 rounded-[18px] bg-wash/60 border border-rule/70 text-sm text-ink/85 leading-relaxed">
                      {u}
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-7">
                <div className="meta text-cobalt mb-3">Operational Flow</div>
                <h3 className="font-serif text-2xl md:text-3xl text-ink mb-4">Core Workflows</h3>
                <div className="space-y-3">
                  {p.whatItDoes.coreWorkflows.map((w, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-[18px] bg-white border border-rule">
                      <span className="font-mono text-xs text-cobalt bg-cobalt/10 px-2 py-1 rounded-md shrink-0">
                        Step 0{idx + 1}
                      </span>
                      <span className="text-sm text-ink/85 font-medium leading-relaxed">{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Detailed Narrative Sections */}
          <div className="border-t border-rule pt-10 divide-y divide-rule mb-16">
            {p.detail.map(([k, v], idx) => (
              <div key={k} className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-3 py-8 items-start">
                <div className="md:col-span-3">
                  <span className="font-mono text-xs text-cobalt mb-1 block">0{idx + 1}</span>
                  <span className="font-serif text-xl md:text-2xl text-ink">{k}</span>
                </div>
                <p className="md:col-span-8 text-[17px] md:text-[18px] text-ink/80 leading-relaxed">{v}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 2: GALLERY & ALL ASPECTS */}
      {activeTab === 'gallery' && (
        <section className="mx-auto max-w-[1440px] px-6 md:px-12 mt-12">
          <div className="mb-8">
            <h2 className="font-serif text-3xl md:text-4xl text-ink">Interface & Aspects Gallery</h2>
            <p className="mt-2 text-ink/70 text-base">Browse through the visual aspects of the application. Click any screenshot for a full-resolution lightbox view.</p>
          </div>

          {p.images && p.images.length > 0 ? (
            <ProjectSlider images={p.images} projectTitle={p.title} />
          ) : (
            <div className="w-full aspect-[16/9] overflow-hidden rounded-[24px] shadow-sm">
              {V ? <V /> : <div className="w-full h-full bg-wash" />}
            </div>
          )}
        </section>
      )}

      {/* TAB 3: CODEBASE & ARCHITECTURE DEEP-DIVE */}
      {activeTab === 'codebase' && (
        <section className="mx-auto max-w-[1440px] px-6 md:px-12 mt-12 mb-16">
          <div className="mb-10">
            <div className="meta text-cobalt mb-2">Technical Deep-Dive</div>
            <h2 className="font-serif text-3xl md:text-5xl text-ink">Codebase & System Architecture</h2>
            <p className="mt-2 text-ink/70 text-lg max-w-2xl leading-relaxed">
              {p.codebase?.summary || 'Comprehensive breakdown of modules, data models, and architectural patterns.'}
            </p>
          </div>

          {/* Architecture Overview Card */}
          {p.codebase?.architecture && (
            <div className="p-6 md:p-8 rounded-[24px] bg-white border border-rule mb-10 shadow-xs">
              <div className="meta text-cobalt mb-2">Architectural Blueprint</div>
              <p className="text-ink/80 text-base md:text-lg leading-relaxed">{p.codebase.architecture}</p>
            </div>
          )}

          {/* File Tree / Repository Anatomy */}
          {p.codebase?.fileTree && (
            <div className="p-6 md:p-8 rounded-[24px] bg-ink text-cloud mb-10 shadow-lg">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <span className="font-mono text-xs uppercase tracking-wider text-cobalt">Repository Anatomy / Tree</span>
                <span className="text-xs font-mono text-cloud/50">Production Structure</span>
              </div>
              <pre className="font-mono text-xs md:text-sm text-cloud/85 overflow-x-auto leading-relaxed whitespace-pre py-2">
                {p.codebase.fileTree.join('\n')}
              </pre>
            </div>
          )}

          {/* Key Modules Breakdown */}
          {p.codebase?.keyModules && (
            <div className="mb-12">
              <h3 className="font-serif text-2xl md:text-3xl text-ink mb-6">Key Engineering Modules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {p.codebase.keyModules.map((m) => (
                  <div key={m.name} className="p-5 md:p-6 rounded-[20px] bg-white border border-rule hover-lift transition-all">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-semibold text-lg text-ink">{m.name}</span>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cobalt/10 text-cobalt border border-cobalt/20">
                        {m.role}
                      </span>
                    </div>
                    <p className="text-sm text-ink/75 leading-relaxed">{m.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Models Schema Breakdown */}
          {p.codebase?.dataModels && (
            <div className="mb-12 border-t border-rule pt-10">
              <h3 className="font-serif text-2xl md:text-3xl text-ink mb-6">Database Schema & Models</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {p.codebase.dataModels.map((d) => (
                  <div key={d.name} className="p-5 rounded-[20px] bg-white border border-rule flex flex-col justify-between">
                    <div>
                      <div className="font-mono text-xs text-cobalt mb-1">Mongoose Schema</div>
                      <h4 className="font-serif text-2xl text-ink mb-2">{d.name}</h4>
                      <p className="text-xs text-ink/70 leading-relaxed mb-4">{d.description}</p>
                    </div>
                    <div className="border-t border-rule/60 pt-3">
                      <div className="meta text-mute text-[10px] mb-2">Fields & Properties</div>
                      <div className="flex flex-wrap gap-1">
                        {d.fields.map((f) => (
                          <span key={f} className="text-[11px] font-mono px-2 py-0.5 rounded bg-wash border border-rule/50 text-ink/80">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* API Endpoints */}
          {p.codebase?.apiEndpoints && (
            <div className="mb-12 border-t border-rule pt-10">
              <h3 className="font-serif text-2xl md:text-3xl text-ink mb-6">REST API Endpoints</h3>
              <div className="divide-y divide-rule rounded-[20px] bg-white border border-rule overflow-hidden">
                {p.codebase.apiEndpoints.map((ep) => (
                  <div key={ep.path} className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold ${
                        ep.method === 'GET' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        ep.method === 'POST' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        ep.method === 'PUT' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {ep.method}
                      </span>
                      <span className="font-mono text-sm text-ink font-semibold">{ep.path}</span>
                    </div>
                    <span className="text-sm text-ink/75 sm:text-right">{ep.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          {p.codebase?.highlights && (
            <div className="p-6 md:p-8 rounded-[24px] bg-wash/70 border border-rule">
              <div className="meta text-cobalt mb-3">Engineering Highlights</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {p.codebase.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-ink/85">
                    <span className="text-cobalt font-bold">✓</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Tech Stack Banner */}
      <section className="mx-auto max-w-[1440px] px-6 md:px-12 mt-12 md:mt-16">
        <div className="p-6 md:p-8 rounded-[24px] bg-wash/60 border border-rule flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="meta text-cobalt mb-1">Architecture & Stack</div>
            <div className="font-serif text-2xl">Production-grade, modular engineering.</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <span key={s} className="px-3.5 py-1.5 rounded-full bg-white border border-rule text-sm font-medium text-ink/80 shadow-xs">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Live / GitHub CTA Banner */}
      {(p.liveUrl || p.githubUrl) && (
        <section className="mx-auto max-w-[1440px] px-6 md:px-12 mt-16">
          <div className="rounded-[24px] bg-ink text-cloud p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-cobalt/25 blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-xl">
              <div className="meta text-apricot mb-2">Source & Demonstration</div>
              <h3 className="font-serif text-3xl md:text-4xl leading-tight">
                Inspect <em className="text-cobalt">{p.title}</em> in action.
              </h3>
              <p className="mt-3 text-cloud/70 text-base leading-relaxed">
                {p.liveUrl
                  ? 'Explore the live running application in production, test workflows, and experience the user interface firsthand.'
                  : 'Examine the complete repository code, architecture patterns, and automated test suite on GitHub.'}
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap gap-3">
              {p.liveUrl && (
                <a
                  href={p.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-cobalt hover:bg-cobalt/90 text-white px-7 py-3.5 rounded-full font-mono text-sm uppercase tracking-wider hover-scale shrink-0 shadow-lg min-h-[44px]"
                >
                  Open Live App ↗
                </a>
              )}
              {p.githubUrl && (
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-7 py-3.5 rounded-full font-mono text-sm uppercase tracking-wider hover-scale shrink-0 shadow-lg min-h-[44px]"
                >
                  View on GitHub ↗
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Next Project Footer */}
      <section className="mx-auto max-w-[1440px] px-6 md:px-12 mt-20 md:mt-32">
        <a href={`#/work/${next.slug}`} className="group border-t border-rule pt-6 grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4 items-baseline min-h-[44px]">
          <span className="md:col-span-3 meta text-mute">Next / {next.n}</span>
          <span className="md:col-span-9 font-serif text-4xl md:text-7xl tracking-[-0.03em] leading-none transition-transform duration-300 group-hover:translate-x-3 text-ink">
            {next.title} <span className="text-cobalt">→</span>
          </span>
        </a>
      </section>

      <Footer />
    </main>
  )
}

/* ════════════════════════════════════════════ */
/*  Home page                                  */
/* ════════════════════════════════════════════ */

function Home() {
  return (
    <main>
      <Hero />
      <Work />
      <Skills />
      <Contact />
      <Footer />
    </main>
  )
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">Something went slightly sideways</h2>
          <p className="text-ink/70 mb-6 max-w-md">There was a hiccup rendering this page. You can return safely to the home portfolio.</p>
          <a
            href="#/"
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-3 rounded-full bg-cobalt text-white font-mono text-xs uppercase tracking-wider hover:bg-cobalt/90 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      )
    }
    return this.props.children
  }
}

/* ════════════════════════════════════════════ */
/*  App with routing                           */
/* ════════════════════════════════════════════ */

export default function App() {
  const route = useRoute()
  const slug = route.startsWith('work/') ? route.slice(5) : (route === 'work' ? 'gymies' : '')
  const isAbout = route === 'about'
  useReveal(slug + isAbout)
  useParallax(slug)

  return (
    <ErrorBoundary>
      <a href="#work" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-cloud focus:px-3 focus:py-2 meta">
        Skip to work
      </a>
      <Nav />
      {isAbout ? <AboutPage /> : slug ? <Case slug={slug} /> : <Home />}
      <AskSupercat />
      <ContactModal />
    </ErrorBoundary>
  )
}
