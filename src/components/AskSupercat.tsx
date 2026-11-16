import { useEffect, useRef, useState, type FormEvent } from 'react'
import Supercat from './Supercat'
import { qa, EMAIL, WHATSAPP_NUMBER, WHATSAPP_URL, getGmailComposeUrl } from '../data'
import { prefersReduced } from '../hooks'

export const openAsk = () => window.dispatchEvent(new Event('ask-supercat'))

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
  actionLink?: { label: string; href: string; isMail?: boolean; isWhatsApp?: boolean }
}

export default function AskSupercat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputVal, setInputVal] = useState('')
  const [typedLen, setTypedLen] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const lastMessage = messages[messages.length - 1]
  const isTyping = lastMessage?.role === 'assistant' && typedLen < lastMessage.content.length

  const handleOpenMail = (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    window.location.href = `mailto:${EMAIL}?subject=Project%20Inquiry%20%2F%20Freelance%20(From%20Portfolio)`
  }

  // Toggle on event or escape
  useEffect(() => {
    const handleEvent = () => setOpen((prev) => !prev)
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('ask-supercat', handleEvent)
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('ask-supercat', handleEvent)
      window.removeEventListener('keydown', handleKey)
    }
  }, [])

  // Outside click closes modal
  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        const btn = document.getElementById('supercat-floating-toggle')
        if (btn && btn.contains(e.target as Node)) return
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  // Professional welcome message with a touch of cat charm (no phone number upfront)
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content:
            "Hi there! 🐱 I'm Supercat, Tushar's resident code companion. Tushar is currently focused on AIML systems engineering and active freelance consulting. Ask me anything about his work, technical stack, or project availability!",
        },
      ])
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 250)
    }
  }, [open, messages.length])

  // Typewriter effect for last assistant message
  useEffect(() => {
    if (lastMessage?.role !== 'assistant') return

    if (prefersReduced()) {
      setTypedLen(lastMessage.content.length)
      return
    }

    setTypedLen(0)
    const timer = setInterval(() => {
      setTypedLen((len) => {
        if (len >= lastMessage.content.length) {
          clearInterval(timer)
          return len
        }
        return len + 3
      })
    }, 12)
    return () => clearInterval(timer)
  }, [lastMessage])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typedLen])

  // Professional & witty response generator
  const generateBotResponse = (query: string): ChatMessage => {
    const q = query.toLowerCase().trim()

    // WhatsApp / Phone Number — ONLY revealed when explicitly asked
    if (q.includes('whatsapp') || q.includes('phone') || q.includes('number') || q.includes('mobile') || q.includes('call')) {
      return {
        role: 'assistant',
        content: `You can reach Tushar directly on WhatsApp at ${WHATSAPP_NUMBER}, or via email at ${EMAIL}. Click below to launch a chat directly!`,
        actionLink: { label: `Chat on WhatsApp (${WHATSAPP_NUMBER}) 💬`, href: WHATSAPP_URL, isWhatsApp: true },
      }
    }

    // Freelance & Availability
    if (q.includes('freelance') || q.includes('hire') || q.includes('available') || q.includes('contract') || q.includes('work together') || q.includes('pricing') || q.includes('rate')) {
      return {
        role: 'assistant',
        content:
          "Yes, absolutely! Tushar is actively freelancing and open for contract roles. He delivers production full-stack web platforms, custom AIML pipelines, and scalable backend architectures. Feel free to send an email to discuss your timeline and scope!",
        actionLink: { label: 'Send an Email ✉️', href: `mailto:${EMAIL}`, isMail: true },
      }
    }

    // AI & ML
    if (q.includes('aiml') || q.includes('ai') || q.includes('ml') || q.includes('machine learning') || q.includes('reinforcement') || q.includes('openenv') || q.includes('gdpr') || q.includes('compliance')) {
      return {
        role: 'assistant',
        content:
          "Tushar's AIML work emphasizes genuine systems engineering rather than basic prompt wrappers. His Compliance Audit Environment is an authentic OpenEnv reinforcement learning system that evaluates autonomous compliance agents against 8 GDPR rules with deterministic scoring and WebSocket streaming.",
        actionLink: { label: 'Explore Compliance Audit Env →', href: '#/work/compliance-audit' },
      }
    }

    // What is he doing right now
    if (q.includes('doing') || q.includes('currently') || q.includes('working on') || q.includes('focus')) {
      return {
        role: 'assistant',
        content:
          "Right now, Tushar is engineering AIML simulation systems (reinforcement learning and FAISS vector embeddings) while taking on select high-impact freelance development projects. Between sprints, he ensures my food bowl is suitably replenished.",
        actionLink: { label: 'See Selected Work →', href: '#work' },
      }
    }

    // Specific Projects
    if (q.includes('vinod') || q.includes('gym') || q.includes('fitness')) {
      return {
        role: 'assistant',
        content:
          "Vinod Fitness & Gym is a live production web application powering real daily fitness center operations for ~100 active members, complete with digital registration, automated plan validity tracking, and self-service member portals.",
        actionLink: { label: 'Vinod Fitness Case Study →', href: '#/work/gymies' },
      }
    }

    if (q.includes('tourmitra') || q.includes('guide') || q.includes('travel')) {
      return {
        role: 'assistant',
        content:
          "TourMitra is a dual-sided travel marketplace connecting tourists with verified local guides, featuring AI-assisted itinerary planning, automated pricing, and a stateful booking lifecycle (Pending → Confirmed → Completed).",
        actionLink: { label: 'TourMitra Case Study →', href: '#/work/tourmitra' },
      }
    }

    if (q.includes('voyager') || q.includes('airbnb') || q.includes('hotel') || q.includes('listing')) {
      return {
        role: 'assistant',
        content:
          "Voyager is a server-rendered accommodation platform built on clean MVC architecture using Express and EJS, with Cloudinary image streaming and Mapbox forward geocoding.",
        actionLink: { label: 'Voyager Case Study →', href: '#/work/voyager' },
      }
    }

    if (q.includes('cinemies') || q.includes('movie') || q.includes('vector') || q.includes('faiss')) {
      return {
        role: 'assistant',
        content:
          "Cinemies recommends movies by emotional vibe and atmosphere rather than keywords, utilizing Sentence Transformers and FAISS vector indexing for sub-50ms search latency.",
        actionLink: { label: 'Cinemies Case Study →', href: '#/work/cinemies' },
      }
    }

    // Tech Stack
    if (q.includes('tech') || q.includes('stack') || q.includes('languages') || q.includes('skills')) {
      return {
        role: 'assistant',
        content:
          "His primary stack includes Python, FastAPI, OpenEnv, Docker, and FAISS on the AI/ML side; and React, TypeScript, Next.js, Node.js, Express, and MongoDB on the web development side.",
        actionLink: { label: 'Browse Tech Skills →', href: '#skills' },
      }
    }

    // Jokes & Feline Humor
    if (q.includes('joke') || q.includes('funny') || q.includes('laugh')) {
      return {
        role: 'assistant',
        content:
          "He spent an entire weekend optimizing a FAISS vector index down to sub-50ms latency, yet he still hasn't engineered an algorithm to prevent me from falling asleep directly across his mechanical keyboard during production deployments. Priorities, right?",
      }
    }

    if (q.includes('cat') || q.includes('meow') || q.includes('supercat') || q.includes('who are you')) {
      return {
        role: 'assistant',
        content:
          "I am Supercat! Senior Feline Quality Assurance Lead and Tushar's senior code reviewer. I specialize in testing software stability by sitting on the spacebar.",
      }
    }

    // Contact & Email
    if (q.includes('email') || q.includes('contact') || q.includes('reach') || q.includes('mail') || q.includes('talk')) {
      return {
        role: 'assistant',
        content: `You can reach Tushar directly at ${EMAIL}. Click below and your email app will open up immediately!`,
        actionLink: { label: `Email ${EMAIL} ✉️`, href: `mailto:${EMAIL}`, isMail: true },
      }
    }

    // Default response
    return {
      role: 'assistant',
      content:
        "Tushar specializes in AIML systems engineering and full-stack freelance development. Feel free to explore his projects, check out his technical skills, or send him a direct email!",
      actionLink: { label: `Email Tushar ✉️`, href: `mailto:${EMAIL}`, isMail: true },
    }
  }

  const handleSendMessage = (e?: FormEvent) => {
    if (e) e.preventDefault()
    const text = inputVal.trim()
    if (!text || isTyping) return

    setInputVal('')
    setMessages((prev) => [...prev, { role: 'user', content: text }])

    setTimeout(() => {
      const reply = generateBotResponse(text)
      setMessages((prev) => [...prev, reply])
    }, 280)
  }

  const handlePromptClick = (qaItem: typeof qa[0]) => {
    if (isTyping) return
    setMessages((prev) => [...prev, { role: 'user', content: qaItem.q }])
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: qaItem.a,
          actionLink: qaItem.link
            ? {
                label: `${qaItem.link[0]} →`,
                href: qaItem.link[1],
                isMail: qaItem.link[1].startsWith('mailto:'),
                isWhatsApp: qaItem.link[1].includes('wa.me'),
              }
            : undefined,
        },
      ])
    }, 280)
  }

  const handleReset = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          "Hi again! Tushar is currently building AIML simulation systems and taking on freelance contracts. What would you like to know?",
      },
    ])
    setInputVal('')
  }

  return (
    <>
      {/* Floating Supercat / Ask Meow Button */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 flex flex-col items-end gap-2">
        {/* Floating pill */}
        <div
          className="bg-white/95 backdrop-blur-sm border border-cobalt/25 rounded-full px-3.5 py-1.5 shadow-md flex items-center gap-1.5 cursor-pointer hover:border-cobalt transition-colors"
          onClick={() => setOpen(!open)}
          style={{ animation: 'float 3.5s ease-in-out infinite' }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-cobalt font-semibold">Ask Meow</span>
        </div>

        {/* Cat button */}
        <button
          id="supercat-floating-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close Supercat chat' : 'Open Supercat chat'}
          aria-expanded={open}
          className="relative w-20 h-20 md:w-24 md:h-24 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 group"
        >
          <Supercat
            pose="sit"
            mood={open ? 'wink' : 'smile'}
            className="w-full h-full drop-shadow-xl"
            title="Tap to chat with Supercat"
          />
          <div className="absolute inset-0 -z-10 bg-cobalt/20 rounded-full blur-xl group-hover:bg-cobalt/35 transition-colors" />
          <span className="sr-only">{open ? 'Close Supercat' : 'Chat with Supercat'}</span>
        </button>
      </div>

      {/* Chatbox Dialog */}
      {open && (
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label="Chat with Supercat about Tushar's AIML & Freelancing"
          tabIndex={-1}
          className="fixed bottom-24 right-4 md:right-10 z-50 w-[min(28rem,calc(100vw-2rem))] h-[min(620px,85vh)] flex flex-col bg-cloud border border-rule rounded-[26px] shadow-[0_20px_50px_rgba(25,29,39,0.25)] overflow-hidden outline-none"
          style={{ animation: 'slideUp 320ms cubic-bezier(0.16, 1, 0.3, 1) both' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-rule bg-white/85 backdrop-blur-md shrink-0">
            <Supercat pose="bust" mood={isTyping ? 'open' : 'smile'} className="w-10 h-10 shrink-0" title="Supercat" />
            <div className="flex-1 min-w-0">
              <div className="font-serif text-lg tracking-tight text-ink flex items-center gap-2">
                <span>Ask Supercat</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono">
                  AIML & Freelance
                </span>
              </div>
              <div className="meta text-mute text-[10px]">
                {isTyping ? 'Supercat is typing...' : 'Curated answers · Zero fluff'}
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-full text-mute hover:text-cobalt hover:bg-wash transition-colors text-xs"
              aria-label="Reset chat"
              title="Reset conversation"
            >
              ↻
            </button>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-full text-mute hover:text-cobalt hover:bg-wash transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center font-mono text-sm"
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-wash/20 via-wash/40 to-wash/70">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <Supercat pose="bust" mood="smile" className="w-7 h-7 shrink-0 mt-1" title="Supercat" />
                )}
                <div
                  className={`max-w-[84%] ${
                    msg.role === 'user'
                      ? 'bg-cobalt text-white rounded-[18px] rounded-tr-[4px] px-4 py-2.5 shadow-xs'
                      : 'bg-white text-ink rounded-[18px] rounded-tl-[4px] px-4 py-2.5 border border-rule/70 shadow-xs'
                  }`}
                >
                  <p className="text-[13.5px] leading-relaxed">
                    {msg === lastMessage && msg.role === 'assistant' ? msg.content.slice(0, typedLen) : msg.content}
                    {msg === lastMessage && isTyping && (
                      <span className="text-cobalt font-bold animate-pulse ml-0.5">|</span>
                    )}
                  </p>

                  {/* Action Link Buttons */}
                  {msg.actionLink && (!isTyping || msg !== lastMessage) && (
                    <div className="mt-2.5 pt-2 border-t border-rule/50">
                      {msg.actionLink.isMail ? (
                        <div className="flex flex-wrap gap-2 items-center">
                          <a
                            href={getGmailComposeUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-white bg-cobalt hover:bg-cobalt/90 px-3 py-1.5 rounded-full transition-colors"
                          >
                            Compose in Gmail ↗
                          </a>
                          <a
                            href={msg.actionLink.href}
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-cobalt bg-cobalt/10 hover:bg-cobalt hover:text-white px-3 py-1.5 rounded-full transition-colors"
                          >
                            Mail App ✉️
                          </a>
                        </div>
                      ) : msg.actionLink.isWhatsApp ? (
                        <a
                          href={msg.actionLink.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-800 bg-emerald-100 hover:bg-[#25D366] hover:text-white px-3 py-1.5 rounded-full transition-colors"
                        >
                          {msg.actionLink.label}
                        </a>
                      ) : (
                        <a
                          href={msg.actionLink.href}
                          onClick={(e) => {
                            if (msg.actionLink!.href.startsWith('#')) {
                              e.preventDefault()
                              setOpen(false)
                              const target = msg.actionLink!.href.replace(/^#\/?/, '')
                              if (target.startsWith('work/')) {
                                window.location.hash = msg.actionLink!.href
                              } else {
                                window.location.hash = '#/'
                                setTimeout(() => {
                                  document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
                                }, 120)
                              }
                            }
                          }}
                          className="inline-flex items-center gap-1 text-xs font-mono text-cobalt hover:underline"
                        >
                          {msg.actionLink.label}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="px-3 py-2 bg-white/80 border-t border-rule shrink-0 overflow-x-auto scrollbar-hide">
            <div className="flex gap-1.5" style={{ width: 'max-content' }}>
              {qa.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(item)}
                  disabled={isTyping}
                  className="px-3 py-1 rounded-full bg-wash hover:bg-cobalt/10 border border-rule hover:border-cobalt/40 text-[11px] text-ink/80 hover:text-cobalt transition-all whitespace-nowrap active:scale-95 disabled:opacity-50"
                >
                  {item.q}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chat Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-rule flex items-center gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask about AIML, freelancing, projects..."
              className="flex-1 bg-wash/70 border border-rule/80 focus:border-cobalt focus:bg-white rounded-full px-4 py-2 text-xs text-ink placeholder:text-ink/40 focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs transition-all ${
                inputVal.trim() && !isTyping
                  ? 'bg-cobalt text-white hover:bg-cobalt/90 hover:scale-105 active:scale-95 shadow-xs'
                  : 'bg-wash text-ink/30 cursor-not-allowed'
              }`}
              aria-label="Send message"
            >
              🐾
            </button>
          </form>

          {/* Direct Email Action Footer */}
          <div className="px-4 py-2 bg-cloud border-t border-rule flex items-center justify-between text-[11px] text-mute shrink-0">
            <span>Direct contact:</span>
            <div className="flex items-center gap-2">
              <a
                href={getGmailComposeUrl('Hello Tushar! (From Portfolio)')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cobalt font-mono hover:underline font-medium"
              >
                Gmail ↗
              </a>
              <span>•</span>
              <a
                href={`mailto:${EMAIL}?subject=Hello%20Tushar!%20(From%20Portfolio)`}
                className="text-cobalt font-mono hover:underline font-medium"
              >
                Mail App ✉️
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}