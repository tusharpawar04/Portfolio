import { useState, useEffect, useCallback } from 'react'
import type { ProjectImage } from '../data'

interface ProjectSliderProps {
  images: ProjectImage[]
  projectTitle: string
}

export default function ProjectSlider({ images, projectTitle }: ProjectSliderProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const count = images.length
  const current = images[currentIdx]

  const next = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % count)
  }, [count])

  const prev = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + count) % count)
  }, [count])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [next, prev])

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0) next()
      else prev()
    }
    setTouchStart(null)
  }

  if (!images || images.length === 0) return null

  return (
    <div className="w-full">
      {/* Aspect Quick Tabs (if multiple aspects are configured) */}
      {count > 1 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="meta text-mute text-xs mr-1">Views:</span>
          {images.map((img, idx) => (
            <button
              key={`${img.title}-${idx}`}
              onClick={() => setCurrentIdx(idx)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200 min-h-[34px] flex items-center gap-1.5 ${
                idx === currentIdx
                  ? 'bg-cobalt text-white shadow-xs'
                  : 'bg-white border border-rule/80 text-ink/70 hover:text-ink hover:border-cobalt/30'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${idx === currentIdx ? 'bg-white' : 'bg-cobalt'}`} />
              <span>{img.aspect || `Aspect 0${idx + 1}`}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main slider viewport */}
      <div
        className="relative group rounded-[24px] overflow-hidden bg-ink/5 border border-rule shadow-sm"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Aspect container for the screenshots */}
        <div
          className="relative aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden cursor-zoom-in bg-ink"
          onClick={() => setLightboxOpen(true)}
          role="button"
          tabIndex={0}
          aria-label={`View fullscreen screenshot: ${current.title}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setLightboxOpen(true)
            }
          }}
        >
          {images.map((img, idx) => (
            <img
              key={img.url + idx}
              src={img.url}
              alt={`${projectTitle} - ${img.title}`}
              loading={idx === 0 ? 'eager' : 'lazy'}
              className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ease-in-out ${
                idx === currentIdx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            />
          ))}

          {/* Aspect tag pill on top-left */}
          {current.aspect && (
            <div className="absolute top-4 left-4 z-20 bg-ink/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-white/10 font-mono tracking-wide flex items-center gap-1.5 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-apricot animate-pulse" />
              <span>{current.aspect}</span>
            </div>
          )}

          {/* Zoom hint overlay on hover */}
          <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-ink/75 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-mono shadow-md">
            <span>⤢</span> Click to expand
          </div>

          {/* Slide counter pill */}
          <div className="absolute bottom-4 right-4 z-20 bg-ink/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-mono tracking-wider border border-white/10">
            0{currentIdx + 1} / 0{count}
          </div>
        </div>

        {/* Prev / Next navigation arrows */}
        {count > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-ink hover:text-cobalt shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border border-rule"
            >
              ←
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-ink hover:text-cobalt shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border border-rule"
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Thumbnails & Caption bar */}
      <div className="mt-4 p-4 rounded-[20px] bg-white border border-rule flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Caption */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-base text-ink flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cobalt" />
            {current.title}
          </div>
          <p className="mt-1 text-sm text-ink/75 leading-relaxed">{current.caption}</p>
        </div>

        {/* Thumbnails row */}
        {count > 1 && (
          <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
            {images.map((img, idx) => (
              <button
                key={img.url + idx}
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Go to slide ${idx + 1}: ${img.title}`}
                className={`relative w-16 h-11 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === currentIdx
                    ? 'border-cobalt scale-105 shadow-sm'
                    : 'border-rule/80 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img.url}
                  alt=""
                  aria-hidden
                  className="w-full h-full object-cover object-top"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
        >
          {/* Lightbox header bar */}
          <div
            className="w-full max-w-6xl flex items-center justify-between text-cloud pb-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-cobalt bg-cobalt/20 px-2.5 py-1 rounded-full">
                0{currentIdx + 1} / 0{count}
              </span>
              <span className="font-serif text-lg md:text-xl text-white">{current.title}</span>
              {current.aspect && (
                <span className="text-xs font-mono text-apricot bg-apricot/15 px-2 py-0.5 rounded-full">
                  {current.aspect}
                </span>
              )}
            </div>
            <button
              onClick={() => setLightboxOpen(false)}
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center font-mono text-lg transition-colors"
              aria-label="Close fullscreen view"
            >
              ✕
            </button>
          </div>

          {/* Fullscreen image container */}
          <div
            className="relative max-w-6xl max-h-[80vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={current.url}
              alt={current.title}
              className="max-h-[78vh] w-auto max-w-full rounded-[16px] object-contain shadow-2xl border border-white/10"
            />

            {/* Lightbox arrows */}
            {count > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous slide"
                  className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-ink flex items-center justify-center transition-all text-xl"
                >
                  ←
                </button>
                <button
                  onClick={next}
                  aria-label="Next slide"
                  className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-ink flex items-center justify-center transition-all text-xl"
                >
                  →
                </button>
              </>
            )}
          </div>

          {/* Lightbox footer caption */}
          <div
            className="mt-3 text-center text-sm text-cloud/80 max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {current.caption}
          </div>
        </div>
      )}
    </div>
  )
}
