import { useState, useRef, useEffect } from 'react'
import { socialLinks, EMAIL, getGmailComposeUrl } from '../data'
import Supercat from './Supercat'
import type { Mood, Pose } from './Supercat'
import { useCatAnimationRotation } from '../hooks'

export default function Footer() {
  const [easterEgg, setEasterEgg] = useState(false)
  const [catMood, setCatMood] = useState<Mood>('smile')
  const [catPose, setCatPose] = useState<Pose>('sit')
  const [pats, setPats] = useState(0)
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { currentAnimation } = useCatAnimationRotation()

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  // Cat messages based on pats
  const catMessages = [
    '', // 0 pats
    'Meow! 🐱',
    'Purr... that\'s nice!',
    'More pats please! 😻',
    'I\'m Supercat, not a regular cat!',
    'Okay okay, I\'ll pose for you!',
    '✨ You found the secret! ✨',
  ]

  const handlePatCat = () => {
    const newPats = pats + 1
    setPats(newPats)
    setMessage(catMessages[Math.min(newPats, catMessages.length - 1)])

    // Change mood/pose based on pats
    if (newPats === 1) setCatMood('open')
    else if (newPats === 2) setCatMood('wink')
    else if (newPats === 3) { setCatMood('curious'); setCatPose('curious') }
    else if (newPats === 4) { setCatMood('open'); setCatPose('fly') }
    else if (newPats === 5) { setCatMood('smile'); setCatPose('shoot') }
    else if (newPats >= 6) {
      setEasterEgg(true)
      setCatPose('fly')
      setCatMood('open')
      setTimeout(() => { setEasterEgg(false); setPats(0); setCatPose('sit'); setCatMood('smile'); setMessage('') }, 4000)
    }

    // Reset after inactivity
    if (clickTimer.current) clearTimeout(clickTimer.current)
    clickTimer.current = setTimeout(() => {
      setPats(0); setCatPose('sit'); setCatMood('smile'); setMessage('')
    }, 5000)
  }

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Game-like scene background */}
      <div className="bg-ink text-cloud relative">
        {/* Pixel-art style ground */}
        <div className="absolute top-0 inset-x-0 h-2 bg-cobalt/40" />

        {/* Stars / particles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cloud/30 rounded-full"
              style={{
                left: `${(i * 37 + 13) % 100}%`,
                top: `${(i * 23 + 7) % 60 + 10}%`,
                animation: `blink ${2 + (i % 3)}s ease-in-out infinite ${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* Interactive Supercat Scene */}
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 pt-16 pb-8">
          <div className="text-center">
            <h3 className="font-serif text-3xl md:text-5xl tracking-tight mb-2">
              Let's make something <em className="text-cobalt">memorable.</em>
            </h3>
            <p className="meta text-cloud/50 mb-8">Tap the cat. Go on.</p>
          </div>

          {/* Interactive cat area */}
          <div className="flex flex-col items-center gap-4 mb-10">
            <button
              onClick={handlePatCat}
              className="relative group cursor-pointer focus:outline-none min-w-[44px] min-h-[44px]"
              aria-label="Pat Supercat"
            >
              <div
                className={`transition-all duration-300 ${easterEgg ? 'scale-125' : 'group-hover:scale-110 group-active:scale-95'}`}
                style={{ animation: currentAnimation === 'hop' ? 'hop 520ms cubic-bezier(.4,.8,.4,1.2)' : undefined }}
              >
                <Supercat
                  pose={catPose}
                  mood={catMood}
                  className={`w-28 md:w-36 ${easterEgg ? 'drop-shadow-[0_0_20px_rgba(124,58,237,0.6)]' : ''}`}
                  title="Supercat — tap me!"
                />
              </div>

              {/* Pat counter bubbles */}
              {pats > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-cobalt rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ animation: 'hop 300ms cubic-bezier(.4,.8,.4,1.2)' }}
                >
                  {pats}
                </div>
              )}
            </button>

            {/* Speech bubble */}
            {message && (
              <div
                className="bg-cloud/10 backdrop-blur-sm border border-cloud/20 rounded-[16px] px-4 py-2 text-sm text-cloud/90 max-w-[200px] text-center"
                style={{ animation: 'fadeInScale 200ms cubic-bezier(.16,1,.3,1) both' }}
              >
                {message}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-transparent border-b-cloud/10" />
              </div>
            )}
          </div>

          {/* Easter egg burst */}
          {easterEgg && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden="true">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: i % 3 === 0 ? '#7c3aed' : i % 3 === 1 ? '#f2a17d' : '#fff',
                    animation: `confetti-${i % 4} 1s cubic-bezier(.16,1,.3,1) forwards`,
                    left: '50%',
                    top: '40%',
                  }}
                />
              ))}
            </div>
          )}

          {/* Social links */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target={link.platform.includes('App') ? undefined : '_blank'}
                rel={link.platform.includes('App') ? undefined : 'noopener noreferrer'}
                aria-label={`Connect on ${link.platform}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-cloud/15 bg-cloud/5 backdrop-blur-sm text-sm text-cloud/80 hover:text-cloud hover:border-cobalt hover:bg-cobalt/20 transition-all duration-200 hover-scale min-h-[44px]"
              >
                <span aria-hidden>{link.icon}</span>
                {link.platform}
              </a>
            ))}
          </div>

          {/* Let's Talk CTA button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => window.dispatchEvent(new Event('open-lets-talk'))}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-cobalt hover:bg-cobalt/90 text-white font-mono text-xs uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-cobalt/25 min-h-[44px]"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Let's Talk Business</span>
              <span>✨</span>
            </button>
          </div>

          {/* Email row with Copy & Gmail links */}
          <div className="text-center mb-10 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <a
                href={getGmailComposeUrl('Hello Tushar! (From Portfolio)')}
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif text-xl md:text-3xl text-cloud/80 hover:text-cobalt transition-colors u-link"
                aria-label={`Send email to ${EMAIL} via Gmail`}
                title="Compose in Gmail Web"
              >
                {EMAIL}
              </a>
              <button
                onClick={handleCopyEmail}
                className="px-2.5 py-1 rounded-full bg-cloud/10 hover:bg-cobalt/30 border border-cloud/15 text-[11px] font-mono text-cloud/70 hover:text-cloud transition-all cursor-pointer active:scale-95"
                title="Copy email to clipboard"
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-cloud/50">
              <a
                href={getGmailComposeUrl('Hello Tushar! (From Portfolio)')}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cobalt transition-colors underline underline-offset-4"
              >
                Compose in Gmail ↗
              </a>
              <span>•</span>
              <a
                href={`mailto:${EMAIL}?subject=Hello%20Tushar!%20(From%20Portfolio)`}
                className="hover:text-cobalt transition-colors underline underline-offset-4"
              >
                Open in Mail App ✉️
              </a>
            </div>
          </div>

          {/* Ground line with walking cats */}
          <div className="relative border-t border-cloud/10 pt-6" aria-hidden="true">
            <div className="absolute -top-4 left-[20%]" style={{ animation: 'float 5s ease-in-out infinite' }}>
              <Supercat pose="idle" mood="sleepy" className="w-12 opacity-40" title="" />
            </div>
            <div className="absolute -top-4 right-[25%]" style={{ animation: 'float 4s ease-in-out infinite 1s' }}>
              <Supercat pose="bust" mood="wink" className="w-10 opacity-30" title="" />
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 meta text-cloud/30 pt-4 pb-4">
            <span>© 2026 Tushar Pawar · Built with 🐱 energy</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="u-link text-cloud/40 hover:text-cobalt transition-colors min-h-[44px] flex items-center"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>

      {/* Inline keyframes for confetti */}
      <style>{`
        @keyframes confetti-0 { to { transform: translate(-80px, -120px) rotate(720deg); opacity: 0; } }
        @keyframes confetti-1 { to { transform: translate(60px, -100px) rotate(-540deg); opacity: 0; } }
        @keyframes confetti-2 { to { transform: translate(-40px, -140px) rotate(360deg); opacity: 0; } }
        @keyframes confetti-3 { to { transform: translate(90px, -80px) rotate(-720deg); opacity: 0; } }
      `}</style>
    </footer>
  )
}
