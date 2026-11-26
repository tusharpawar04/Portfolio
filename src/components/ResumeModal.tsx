import { useEffect, useRef, useCallback, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { about, RESUME_FILENAME } from '../data'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

const isMobileViewport = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches

export const triggerResumeDownload = () => {
  const a = document.createElement('a')
  a.href = about.resumeUrl
  a.download = RESUME_FILENAME
  a.rel = 'noopener noreferrer'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export const openResumePreview = () => {
  if (isMobileViewport()) {
    triggerResumeDownload()
    return
  }
  window.dispatchEvent(new Event('open-resume-preview'))
}

type PageMetric = {
  pageNumber: number
  baseWidth: number
  baseHeight: number
}

export default function ResumeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [scale, setScale] = useState(1)
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null)
  const [pages, setPages] = useState<PageMetric[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const viewportRef = useRef<HTMLDivElement>(null)
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
  const lastPinchDist = useRef(0)

  const clampScale = (v: number) => Math.min(2.5, Math.max(0.5, +v.toFixed(2)))

  const zoomIn = useCallback(() => setScale((s) => clampScale(s + 0.15)), [])
  const zoomOut = useCallback(() => setScale((s) => clampScale(s - 0.15)), [])
  const resetZoom = useCallback(() => setScale(1), [])
  const close = useCallback(() => setIsOpen(false), [])

  /* ── open listener ─────────────────────────── */
  useEffect(() => {
    const open = () => {
      if (isMobileViewport()) {
        triggerResumeDownload()
        return
      }
      setIsOpen(true)
      setScale(1)
    }
    window.addEventListener('open-resume-preview', open)
    return () => window.removeEventListener('open-resume-preview', open)
  }, [])

  /* ── lock background scroll (html + body) ──── */
  useEffect(() => {
    if (!isOpen) return
    const prevHtml = document.documentElement.style.overflow
    const prevBody = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prevHtml
      document.body.style.overflow = prevBody
    }
  }, [isOpen])

  /* ── load PDF via pdfjs-dist ───────────────── */
  useEffect(() => {
    if (!isOpen) return
    let cancelled = false
    const loadingTask = pdfjsLib.getDocument({ url: about.resumeUrl })

    setLoading(true)
    setError(false)

    const load = async () => {
      try {
        const doc = await loadingTask.promise
        if (cancelled) return

        const containerW = viewportRef.current?.clientWidth ?? 820
        const targetW = Math.min(760, Math.max(320, containerW - 48))

        const metrics: PageMetric[] = []
        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i)
          const rawVp = page.getViewport({ scale: 1 })
          const fitScale = targetW / rawVp.width
          const vp = page.getViewport({ scale: fitScale })
          metrics.push({
            pageNumber: i,
            baseWidth: vp.width,
            baseHeight: vp.height,
          })
        }

        if (!cancelled) {
          setPdfDoc(doc)
          setPages(metrics)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
      loadingTask.destroy().catch(() => {})
      setPdfDoc(null)
      setPages([])
    }
  }, [isOpen])

  /* ── crisp canvas render (debounced on zoom) ─ */
  useEffect(() => {
    if (!isOpen || !pdfDoc || pages.length === 0) return

    let cancelled = false
    const activeTasks: Array<{ cancel: () => void }> = []

    const renderPages = async () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      for (let idx = 0; idx < pages.length; idx++) {
        if (cancelled) break
        const metric = pages[idx]
        const canvas = canvasRefs.current[idx]
        if (!canvas) continue

        const page = await pdfDoc.getPage(metric.pageNumber)
        if (cancelled) break

        const rawVp = page.getViewport({ scale: 1 })
        const fitScale = metric.baseWidth / rawVp.width
        // Render at target zoom * DPR (min 1.5x so zoom-ins stay crisp immediately)
        const renderScale = fitScale * Math.max(1.25, scale) * dpr
        const vp = page.getViewport({ scale: renderScale })

        canvas.width = Math.floor(vp.width)
        canvas.height = Math.floor(vp.height)

        const ctx = canvas.getContext('2d')
        if (!ctx) continue

        const task = page.render({ canvasContext: ctx, viewport: vp, canvas })
        activeTasks.push(task)
        try {
          await task.promise
        } catch {
          // Ignore cancelled render tasks during rapid zoom
        }
      }
    }

    const timer = window.setTimeout(renderPages, scale === 1 ? 0 : 90)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
      activeTasks.forEach((t) => {
        try { t.cancel() } catch {}
      })
    }
  }, [isOpen, pdfDoc, pages, scale])

  /* ── keyboard shortcuts ────────────────────── */
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === '+' || e.key === '=') {
        e.preventDefault(); zoomIn()
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault(); zoomOut()
      } else if (e.key === '0') {
        e.preventDefault(); resetZoom()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close, zoomIn, zoomOut, resetZoom])

  /* ── pinch & trackpad/ctrl+wheel zoom ──────── */
  useEffect(() => {
    if (!isOpen) return
    const el = viewportRef.current
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
          const delta = (dist - lastPinchDist.current) * 0.005
          setScale((s) => clampScale(s + delta))
        }
        lastPinchDist.current = dist
      }
    }

    const onTouchEnd = () => {
      lastPinchDist.current = 0
    }

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        setScale((s) => clampScale(s + delta))
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
      className="fixed inset-0 z-50 flex items-center justify-center overscroll-none"
      role="dialog"
      aria-modal="true"
      aria-label="Resume Preview"
    >
      {/* backdrop – static blur, fades opacity cleanly */}
      <div
        className="absolute inset-0 bg-ink/75 backdrop-blur-md"
        onClick={close}
        style={{ animation: 'ql-backdrop 240ms ease-out both' }}
      />

      {/* card – macOS Quick Look spring */}
      <div
        className="relative w-[94vw] max-w-4xl h-[92vh] bg-cloud rounded-3xl shadow-2xl border border-rule/70 flex flex-col overflow-hidden will-change-transform"
        style={{ animation: 'ql-card 380ms cubic-bezier(.18,1.1,.32,1) both' }}
      >
        {/* ── header bar ─────────────────────── */}
        <div className="shrink-0 flex items-center justify-between gap-3 px-5 py-3 border-b border-rule/70 bg-white/80">
          <h3 className="font-serif text-base md:text-lg text-ink truncate">
            Tushar_Pawar_Resume
            <span className="ml-2 font-mono text-[10px] text-cobalt bg-cobalt/10 px-2 py-0.5 rounded-full align-middle">
              PDF
            </span>
          </h3>

          <div className="flex items-center gap-2">
            {/* zoom controls */}
            <div className="flex items-center rounded-full bg-wash border border-rule/70 px-1 py-0.5 gap-0.5">
              <button
                type="button"
                onClick={zoomOut}
                disabled={scale <= 0.5}
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm text-ink/70 hover:text-ink hover:bg-white active:scale-90 disabled:opacity-30 transition-colors cursor-pointer"
                aria-label="Zoom out"
                title="Zoom Out (-)"
              >
                −
              </button>
              <button
                type="button"
                onClick={resetZoom}
                className="px-1.5 font-mono text-[11px] text-ink/80 hover:text-cobalt transition-colors min-w-[42px] text-center cursor-pointer"
                aria-label="Reset zoom"
                title="Reset zoom to 100% (0)"
              >
                {pct}%
              </button>
              <button
                type="button"
                onClick={zoomIn}
                disabled={scale >= 2.5}
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm text-ink/70 hover:text-ink hover:bg-white active:scale-90 disabled:opacity-30 transition-colors cursor-pointer"
                aria-label="Zoom in"
                title="Zoom In (+)"
              >
                +
              </button>
            </div>

            {/* open in browser tab */}
            <a
              href={about.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-wash border border-rule/70 text-ink/80 hover:text-cobalt hover:border-cobalt/40 text-xs font-mono tracking-wide transition-colors active:scale-95"
            >
              Open in Tab ↗
            </a>

            {/* download */}
            <a
              href={about.resumeUrl}
              download={RESUME_FILENAME}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cobalt hover:bg-cobalt/90 text-white text-xs font-mono tracking-wide transition-colors active:scale-95 shadow-xs"
            >
              Download
            </a>

            {/* close */}
            <button
              type="button"
              onClick={close}
              className="w-8 h-8 rounded-full flex items-center justify-center text-ink/60 hover:bg-ink hover:text-white transition-colors active:scale-90 cursor-pointer"
              aria-label="Close"
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── pdf viewport ───────────────────── */}
        <div
          ref={viewportRef}
          className="flex-1 overflow-auto overscroll-contain bg-wash/70 p-4 md:p-6"
        >
          {loading && (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-ink/60">
              <div className="w-7 h-7 rounded-full border-2 border-cobalt/30 border-t-cobalt animate-spin" />
              <span className="font-mono text-xs tracking-wide">Loading resume…</span>
            </div>
          )}

          {error && (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-6">
              <p className="font-serif text-xl text-ink">Couldn&apos;t render preview inline</p>
              <div className="flex gap-3">
                <a
                  href={about.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-white border border-rule text-xs font-mono text-ink hover:border-cobalt hover:text-cobalt"
                >
                  Open in Tab ↗
                </a>
                <a
                  href={about.resumeUrl}
                  download={RESUME_FILENAME}
                  className="px-4 py-2 rounded-full bg-cobalt text-white text-xs font-mono"
                >
                  Download PDF
                </a>
              </div>
            </div>
          )}

          {!loading && !error && pages.length > 0 && (
            <div className="flex flex-col items-center gap-5 min-w-max mx-auto pb-4">
              {pages.map((p, idx) => (
                <div
                  key={p.pageNumber}
                  className="bg-white rounded-xl border border-rule/70 shadow-md overflow-hidden shrink-0"
                  style={{
                    width: `${Math.round(p.baseWidth * scale)}px`,
                    height: `${Math.round(p.baseHeight * scale)}px`,
                  }}
                >
                  <canvas
                    ref={(el) => {
                      canvasRefs.current[idx] = el
                    }}
                    className="block w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes ql-backdrop {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes ql-card {
          0%   { opacity: 0; transform: scale(0.84) translateY(18px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
