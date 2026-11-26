import { useEffect, useRef, useCallback, useState } from 'react'
import { about } from '../data'

export const openResumePreview = () =>
  window.dispatchEvent(new Event('open-resume-preview'))

export default function ResumeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [scale, setScale] = useState(1)
  const backdropRef = useRef<HTMLDivElement>(null)
  const lastPinchDist = useRef(0)

  /* ── helpers ───────────────────────────────── */
  const clampScale = (v: number) => Math.min(2.5, Math.max(0.5, v))

  const zoomIn = useCallback(
    () => setScale((s) => clampScale(+(s + 0.15).toFixed(2))),
    [],
  )
  const zoomOut = useCallback(
    () => setScale((s) => clampScale(+(s - 0.15).toFixed(2))),
    [],
  )
  const resetZoom = useCallback(() => setScale(1), [])

  const close = useCallback(() => setIsOpen(false), [])

  /* ── open listener ─────────────────────────── */
  useEffect(() => {
    const open = () => {
      setIsOpen(true)
      setScale(1)
    }
    window.addEventListener('open-resume-preview', open)
    return () => window.removeEventListener('open-resume-preview', open)
  }, [])

  /* ── lock body scroll while open ───────────── */
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [isOpen])

  /* ── keyboard shortcuts ────────────────────── */
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === '+' || e.key === '=') {
        e.preventDefault(); zoomIn()
      } else if (e.key === '-') {
        e.preventDefault(); zoomOut()
      } else if (e.key === '0') {
        e.preventDefault(); resetZoom()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close, zoomIn, zoomOut, resetZoom])

  /* ── pinch-to-zoom on the viewport ─────────── */
  useEffect(() => {
    if (!isOpen) return
    const el = backdropRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        lastPinchDist.current = Math.hypot(dx, dy)
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault()
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        const dist = Math.hypot(dx, dy)
        if (lastPinchDist.current > 0) {
          const delta = (dist - lastPinchDist.current) * 0.004
          setScale((s) => clampScale(+(s + delta).toFixed(2)))
        }
        lastPinchDist.current = dist
      }
    }

    const onTouchEnd = () => {
      lastPinchDist.current = 0
    }

    // ctrl+scroll / trackpad zoom
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.08 : 0.08
        setScale((s) => clampScale(+(s + delta).toFixed(2)))
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('wheel', onWheel)
    }
  }, [isOpen])

  if (!isOpen) return null

  const pct = Math.round(scale * 100)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Resume Preview"
    >
      {/* backdrop – click to close */}
      <div
        className="absolute inset-0 bg-ink/75 backdrop-blur-lg"
        onClick={close}
        style={{ animation: 'ql-backdrop 320ms cubic-bezier(.2,.9,.3,1) both' }}
      />

      {/* card – macOS Quick Look spring */}
      <div
        ref={backdropRef}
        className="relative w-[96vw] max-w-4xl h-[94vh] bg-cloud rounded-3xl shadow-2xl border border-rule/60 flex flex-col overflow-hidden"
        style={{ animation: 'ql-card 420ms cubic-bezier(.175,.885,.32,1.1) both' }}
      >
        {/* ── header bar ─────────────────────── */}
        <div className="shrink-0 flex items-center justify-between gap-3 px-5 py-3 border-b border-rule/70 bg-white/70 backdrop-blur-sm">
          <h3 className="font-serif text-base md:text-lg text-ink truncate">
            Tushar_Pawar_Resume
            <span className="ml-2 font-mono text-[10px] text-cobalt bg-cobalt/8 px-2 py-0.5 rounded-full align-middle">
              PDF
            </span>
          </h3>

          <div className="flex items-center gap-1.5">
            {/* zoom controls */}
            <div className="hidden sm:flex items-center rounded-full bg-wash border border-rule/60 px-1 py-0.5 gap-0.5">
              <button
                onClick={zoomOut}
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm text-ink/60 hover:text-ink hover:bg-white active:scale-90 transition-all"
                aria-label="Zoom out"
              >
                −
              </button>
              <button
                onClick={resetZoom}
                className="px-1.5 font-mono text-[11px] text-ink/70 hover:text-cobalt transition-colors min-w-[38px] text-center"
                aria-label="Reset zoom"
              >
                {pct}%
              </button>
              <button
                onClick={zoomIn}
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm text-ink/60 hover:text-ink hover:bg-white active:scale-90 transition-all"
                aria-label="Zoom in"
              >
                +
              </button>
            </div>

            {/* open in browser tab */}
            <a
              href={about.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-wash border border-rule/60 text-ink/70 hover:text-cobalt hover:border-cobalt/40 text-xs font-mono tracking-wide transition-colors active:scale-95"
            >
              Open in Tab ↗
            </a>

            {/* download */}
            <a
              href={about.resumeUrl}
              download="Tushar_Pawar_Resume.pdf"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cobalt hover:bg-cobalt/90 text-white text-xs font-mono tracking-wide transition-colors active:scale-95"
            >
              Download
            </a>

            {/* close */}
            <button
              onClick={close}
              className="w-8 h-8 rounded-full flex items-center justify-center text-ink/50 hover:bg-ink hover:text-white transition-colors active:scale-90"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── pdf viewport ───────────────────── */}
        <div className="flex-1 overflow-auto bg-wash/50">
          <div
            className="origin-top-center mx-auto will-change-transform"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              width: '100%',
              maxWidth: '850px',
              padding: '24px 16px 48px',
            }}
          >
            <object
              data={`${about.resumeUrl}#toolbar=0&navpanes=0&view=FitH`}
              type="application/pdf"
              className="w-full rounded-2xl border border-rule/50 shadow-lg bg-white"
              style={{ height: '1200px', minHeight: '80vh' }}
            >
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
                <div className="text-6xl">📄</div>
                <p className="text-ink/70 font-serif text-lg">Unable to display PDF preview</p>
                <p className="text-ink/50 text-sm max-w-md">Your browser doesn't support embedded PDFs. Please download the resume or open it in a new tab.</p>
                <div className="flex gap-3 mt-4">
                  <a
                    href={about.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-rule hover:border-cobalt text-ink hover:text-cobalt transition-all"
                  >
                    Open in New Tab ↗
                  </a>
                  <a
                    href={about.resumeUrl}
                    download="Tushar_Pawar_Resume.pdf"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cobalt hover:bg-cobalt/90 text-white transition-all"
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            </object>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ql-backdrop {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        @keyframes ql-card {
          0%   { opacity: 0; transform: scale(.72) translateY(28px); }
          60%  { opacity: 1; transform: scale(1.015) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
