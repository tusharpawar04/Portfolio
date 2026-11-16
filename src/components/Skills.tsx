import { useState } from 'react'
import { skillCategories, type Skill } from '../data'
import { useScrollReveal } from '../hooks'
import { getTechIcon } from './TechIcons'

export default function Skills() {
  const { ref: sectionRef, isVisible } = useScrollReveal(0.08)
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  // Flatten all skills for marquee
  const allSkills = skillCategories.flatMap((c) => c.items)

  const displayedSkills = activeCategory === 'All'
    ? allSkills
    : skillCategories.find((c) => c.label === activeCategory)?.items || []

  return (
    <section id="skills" className="mx-auto max-w-[1440px] px-6 md:px-12 pt-20 md:pt-32 scroll-mt-8">
      {/* Section Header */}
      <div
        ref={sectionRef}
        className={`fade-slide-up ${isVisible ? 'is-visible' : ''}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4">
          <div className="md:col-span-3 meta text-cobalt">Skills & Stack</div>
          <div className="md:col-span-9">
            <h2 className="font-serif text-3xl md:text-5xl tracking-[-0.02em] leading-[1.05]">
              Tools of the <em className="text-cobalt">trade.</em>
            </h2>
            <p className="mt-3 text-ink/70 text-base md:text-lg max-w-2xl leading-relaxed">
              Engineered with production-tested technologies, type-safe architectures, and modern developer tooling.
            </p>
          </div>
        </div>
      </div>

      {/* Infinite scrolling technical marquee (no emojis, clean vector marks) */}
      <div className="mt-12 overflow-hidden relative" aria-label="Technical skills marquee">
        {/* Soft edge masks */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-cloud to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-cloud to-transparent z-10 pointer-events-none" />

        <div className="flex gap-3 animate-marquee whitespace-nowrap py-3">
          {[...allSkills, ...allSkills].map((skill, i) => (
            <div
              key={`${skill.name}-${i}`}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-rule/80 shadow-xs shrink-0 cursor-default transition-all duration-200 hover:border-cobalt/40 hover:scale-105 hover:shadow-sm"
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <span className="text-ink/80 group-hover:text-cobalt transition-colors">
                {getTechIcon(skill.name, 'w-4 h-4')}
              </span>
              <span className="text-sm font-medium text-ink">{skill.name}</span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-wash text-mute border border-rule/50">
                {skill.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mt-10 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-200 min-h-[38px] ${
            activeCategory === 'All'
              ? 'bg-ink text-white shadow-sm'
              : 'bg-white border border-rule text-ink/70 hover:text-ink hover:border-rule/80'
          }`}
        >
          All Technologies ({allSkills.length})
        </button>
        {skillCategories.map((c) => (
          <button
            key={c.label}
            onClick={() => setActiveCategory(c.label)}
            className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-200 min-h-[38px] ${
              activeCategory === c.label
                ? 'bg-cobalt text-white shadow-sm'
                : 'bg-white border border-rule text-ink/70 hover:text-ink hover:border-cobalt/30'
            }`}
          >
            {c.label} ({c.items.length})
          </button>
        ))}
      </div>

      {/* Creative Skill Grid */}
      <div
        className={`mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 fade-slide-up ${isVisible ? 'is-visible' : ''}`}
        style={{ transitionDelay: '0.15s' }}
      >
        {displayedSkills.map((skill: Skill) => (
          <div
            key={skill.name}
            className="group rounded-[20px] bg-white border border-rule p-5 hover:border-cobalt/40 hover-lift transition-all duration-200 relative overflow-hidden"
          >
            {/* Subtle glow on hover */}
            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-cobalt/5 blur-xl group-hover:bg-cobalt/10 transition-colors pointer-events-none" />

            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-wash flex items-center justify-center text-ink group-hover:text-cobalt group-hover:bg-cobalt/10 transition-all duration-200">
                  {getTechIcon(skill.name, 'w-5 h-5')}
                </div>
                <div>
                  <h3 className="font-semibold text-base text-ink tracking-tight">{skill.name}</h3>
                  <div className="text-xs text-cobalt font-medium">{skill.role}</div>
                </div>
              </div>

              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-wash text-mute border border-rule/60 shrink-0">
                {skill.tag}
              </span>
            </div>

            <p className="text-xs text-ink/70 leading-relaxed">
              {skill.context}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
