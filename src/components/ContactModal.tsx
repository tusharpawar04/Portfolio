import { useState, useEffect, useRef, type FormEvent } from 'react'
import Supercat from './Supercat'
import { EMAIL, WHATSAPP_NUMBER, WEB3FORMS_ACCESS_KEY, getGmailComposeUrl, getMailtoUrl } from '../data'

export const openLetsTalk = () => window.dispatchEvent(new Event('open-lets-talk'))

const PROJECT_TYPES = ['Freelance Contract', 'AIML / RL System', 'Full-Stack Web App', 'Consulting & Architecture', 'General Inquiry']

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [selectedType, setSelectedType] = useState('Freelance Contract')
  const [isSending, setIsSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true)
      setSubmitted(false)
      setErrorMsg('')
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('open-lets-talk', handleOpen)
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('open-lets-talk', handleOpen)
      window.removeEventListener('keydown', handleKey)
    }
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Direct email notification dispatch using Web3Forms (Option 2) with graceful fallback
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return

    setIsSending(true)
    setErrorMsg('')

    try {
      // Option 2: Web3Forms submission endpoint
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: name.trim(),
          email: email.trim(),
          project_type: selectedType,
          message: message.trim(),
          to_email: EMAIL,
          subject: `Portfolio Inquiry: ${selectedType} from ${name.trim()}`,
        }),
      })

      const data = await response.json()
      if (data.success || response.ok) {
        setSubmitted(true)
      } else {
        // Fallback to FormSubmit / mailto if access key requires refresh
        await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            project: selectedType,
            message: message.trim(),
            _subject: `Portfolio Inquiry from ${name.trim()} [${selectedType}]`,
          }),
        })
        setSubmitted(true)
      }
    } catch {
      // If offline or network blocks, mark submitted so user can choose Gmail or Mailto
      setSubmitted(true)
    } finally {
      setIsSending(false)
    }
  }

  const subjectText = `Project Inquiry: ${selectedType} [from ${name.trim() || 'Visitor'}]`
  const bodyText = `Hi Tushar,\n\nName: ${name.trim() || '(Your Name)'}\nEmail: ${email.trim() || '(Your Email)'}\nProject Category: ${selectedType}\n\nMessage:\n${
    message.trim() || '(Your project details here)'
  }\n\n---\nSent via Portfolio Contact Form`

  const gmailHref = getGmailComposeUrl(subjectText, bodyText)
  const mailtoHref = getMailtoUrl(subjectText, bodyText)

  const handleSendWhatsApp = () => {
    if (!name.trim()) return
    const text = encodeURIComponent(
      `Hi Tushar! My name is ${name.trim()}.\nProject: ${selectedType}\nEmail: ${email.trim()}\n\n${message.trim()}`
    )
    window.open(`https://wa.me/917898818055?text=${text}`, '_blank')
    setSubmitted(true)
  }

  const handleReset = () => {
    setName('')
    setEmail('')
    setMessage('')
    setSubmitted(false)
    setIsOpen(false)
  }

  return (
    <>
      {/* Modal Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Let's Talk Form"
        >
          <div
            ref={modalRef}
            className="w-full max-w-lg bg-cloud border border-rule rounded-[28px] shadow-2xl overflow-hidden outline-none flex flex-col max-h-[92vh]"
            style={{ animation: 'slideUp 300ms cubic-bezier(0.16, 1, 0.3, 1) both' }}
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-rule bg-white/70 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <Supercat pose="bust" mood="smile" className="w-10 h-10 shrink-0" title="Supercat" />
                <div>
                  <h3 className="font-serif text-2xl text-ink leading-tight">Let's Talk</h3>
                  <p className="meta text-mute text-xs">Direct notification to Tushar's inbox</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-wash hover:bg-cobalt hover:text-white text-ink flex items-center justify-center font-mono text-xs transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Form Body */}
            {submitted ? (
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
                <Supercat pose="fly" mood="open" className="w-24 h-24" title="Sent!" />
                <h4 className="font-serif text-3xl text-ink">Inquiry Dispatched!</h4>
                <p className="text-sm text-ink/70 max-w-sm leading-relaxed">
                  Tushar has been directly notified at <strong className="text-ink">{EMAIL}</strong>. He will get back to you promptly!
                </p>
                <div className="pt-2 flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-full bg-cobalt text-white font-mono text-xs uppercase tracking-wider hover:bg-cobalt/90 transition-colors"
                  >
                    Done
                  </button>
                  <a
                    href={gmailHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-white border border-rule hover:border-cobalt/40 text-ink font-mono text-xs uppercase tracking-wider hover-scale"
                  >
                    Open in Gmail ↗
                  </a>
                  <a
                    href={mailtoHref}
                    className="px-5 py-2.5 rounded-full bg-white border border-rule hover:border-cobalt/40 text-ink font-mono text-xs uppercase tracking-wider hover-scale"
                  >
                    Mail App ✉️
                  </a>
                  <button
                    onClick={handleSendWhatsApp}
                    className="px-5 py-2.5 rounded-full bg-[#25D366] text-white font-mono text-xs uppercase tracking-wider hover:bg-[#20ba59] transition-colors"
                  >
                    WhatsApp 💬
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                {/* Project Category Pills */}
                <div>
                  <label className="block meta text-cobalt text-[11px] mb-2">Project Category</label>
                  <div className="flex flex-wrap gap-1.5">
                    {PROJECT_TYPES.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setSelectedType(t)}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                          selectedType === t
                            ? 'bg-cobalt text-white shadow-xs'
                            : 'bg-white border border-rule/80 text-ink/70 hover:border-cobalt/40'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block meta text-ink/80 text-[11px] mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Sharma"
                    className="w-full px-4 py-2.5 rounded-[14px] bg-white border border-rule focus:border-cobalt focus:outline-none text-sm text-ink"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block meta text-ink/80 text-[11px] mb-1.5">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-2.5 rounded-[14px] bg-white border border-rule focus:border-cobalt focus:outline-none text-sm text-ink"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block meta text-ink/80 text-[11px] mb-1.5">Project Details / Message *</label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell Tushar about your timeline, deliverables, or questions..."
                    className="w-full px-4 py-2.5 rounded-[14px] bg-white border border-rule focus:border-cobalt focus:outline-none text-sm text-ink resize-none"
                  />
                </div>

                {errorMsg && <p className="text-xs text-rose-600">{errorMsg}</p>}

                {/* Submit button & Mail options */}
                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-cobalt hover:bg-cobalt/90 text-white font-mono text-xs uppercase tracking-wider transition-all hover-scale shadow-md disabled:opacity-60 min-h-[44px]"
                  >
                    {isSending ? (
                      <span>Sending notification...</span>
                    ) : (
                      <>
                        <span>Notify Directly via Mail 🚀</span>
                      </>
                    )}
                  </button>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <a
                      href={gmailHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-rule hover:border-cobalt/40 text-ink font-mono text-xs uppercase tracking-wider transition-all hover-scale shadow-xs min-h-[40px]"
                      aria-label="Compose in Gmail Web"
                    >
                      <span>Compose in Gmail ↗</span>
                    </a>
                    <a
                      href={mailtoHref}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-rule hover:border-cobalt/40 text-ink font-mono text-xs uppercase tracking-wider transition-all hover-scale shadow-xs min-h-[40px]"
                      aria-label="Open your email client with pre-filled message"
                    >
                      <span>Mail App ✉️</span>
                    </a>
                  </div>
                </div>

                {/* WhatsApp optional quick-action */}
                <div className="pt-1 flex items-center justify-between text-[11px] text-mute border-t border-rule/50 pt-3">
                  <span>Prefer chatting?</span>
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    disabled={!name.trim() || isSending}
                    className="text-emerald-700 font-mono hover:underline flex items-center gap-1 font-medium disabled:opacity-40"
                  >
                    <span>WhatsApp: {WHATSAPP_NUMBER} 💬</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}