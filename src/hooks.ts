import { useEffect, useRef, useState, useCallback } from 'react'
import { CAT_ANIMATIONS, type CatAnimationType } from './animations'

export const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const finePointer = () => window.matchMedia('(pointer: fine)').matches

/** Adds `.in` to every `.reveal` element as it enters the viewport. */
export function useReveal(dep: unknown) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (prefersReduced() || !('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
      { threshold: 0.12 },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [dep])
}

/** Gentle vertical parallax for `[data-par]` children, driven by scroll. */
export function useParallax(dep: unknown) {
  useEffect(() => {
    if (prefersReduced() || !finePointer()) return
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-par]'))
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      els.forEach((el) => {
        const r = (el.parentElement as HTMLElement).getBoundingClientRect()
        const p = (r.top + r.height / 2 - vh / 2) / vh
        el.style.transform = `translate3d(0, ${(-p * 28).toFixed(1)}px, 0) scale(1.1)`
      })
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [dep])
}

/**
 * Ultra-smooth, hardware-accelerated parallax with inertia lerping.
 * Operates directly on the DOM with zero React re-renders.
 * Animates elements carrying `data-parallax-speed` with smooth weighted momentum.
 */
export function useSmoothParallax(containerRef?: React.RefObject<HTMLElement | null>, dep?: unknown) {
  useEffect(() => {
    if (prefersReduced()) return

    const root = containerRef?.current || document
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-parallax-speed]'))
    if (items.length === 0) return

    let targetScroll = window.scrollY
    let currentScroll = targetScroll
    let rafId = 0
    let isRunning = false

    const speeds = items.map((el) => {
      const s = parseFloat(el.getAttribute('data-parallax-speed') || '0')
      return isNaN(s) ? 0 : s
    })

    // Prepare hardware acceleration
    items.forEach((el) => {
      el.style.willChange = 'transform'
    })

    const update = () => {
      const diff = targetScroll - currentScroll
      if (Math.abs(diff) < 0.2) {
        currentScroll = targetScroll
        isRunning = false
      } else {
        currentScroll += diff * 0.085
      }

      for (let i = 0; i < items.length; i++) {
        const el = items[i]
        const speed = speeds[i]
        const y = (currentScroll * speed).toFixed(2)
        const scaleAttr = el.getAttribute('data-parallax-scale')
        const scaleVal = scaleAttr ? Math.max(0.4, 1 - currentScroll * parseFloat(scaleAttr)).toFixed(3) : null
        const rotAttr = el.getAttribute('data-parallax-rotate')
        const rotVal = rotAttr ? (currentScroll * parseFloat(rotAttr)).toFixed(2) : null

        let transform = `translate3d(0, ${y}px, 0)`
        if (scaleVal) transform += ` scale(${scaleVal})`
        if (rotVal) transform += ` rotate(${rotVal}deg)`
        el.style.transform = transform
      }

      if (isRunning) {
        rafId = requestAnimationFrame(update)
      }
    }

    const onScroll = () => {
      targetScroll = window.scrollY
      if (!isRunning) {
        isRunning = true
        rafId = requestAnimationFrame(update)
      }
    }

    // Set initial position
    update()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [containerRef, dep])
}

/** Magnetic hover: element leans toward the pointer. */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced() || !finePointer()) return
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) * strength
      const y = (e.clientY - (r.top + r.height / 2)) * strength
      el.style.transform = `translate(${x}px, ${y}px)`
    }
    const leave = () => { el.style.transform = '' }
    el.style.transition = 'transform 350ms cubic-bezier(.4,.8,.4,1.2)'
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
  }, [strength])
  return ref
}

/** IntersectionObserver-based scroll reveal. Once visible, stays visible. */
export function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReduced() || !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

/** Manages automatic cat animation rotation every 30-60 seconds. */
export function useCatAnimationRotation() {
  const [currentAnimation, setCurrentAnimation] = useState<CatAnimationType>('blink')
  const lastChangeRef = useRef(Date.now())

  useEffect(() => {
    if (prefersReduced()) return

    const interval = setInterval(() => {
      const elapsed = (Date.now() - lastChangeRef.current) / 1000
      const shouldChange = (elapsed >= 30 && Math.random() > 0.5) || elapsed >= 60

      if (shouldChange) {
        const rand = Math.random()
        let cumulative = 0
        for (const anim of CAT_ANIMATIONS) {
          cumulative += anim.probability
          if (rand <= cumulative) {
            setCurrentAnimation(anim.name)
            lastChangeRef.current = Date.now()
            break
          }
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const transitionToAnimation = useCallback((anim: CatAnimationType) => {
    setCurrentAnimation(anim)
    lastChangeRef.current = Date.now()
  }, [])

  return { currentAnimation, transitionToAnimation }
}

/** Modal open/close state with outside click and Escape detection. */
export function useModalToggle(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState)
  const modalRef = useRef<HTMLDivElement>(null)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((v) => !v), [])

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return { isOpen, open, close, toggle, modalRef }
}

/** Detects current responsive breakpoint. */
export function useBreakpoint() {
  const getBreakpoint = (): 'mobile' | 'tablet' | 'desktop' => {
    if (typeof window === 'undefined') return 'desktop'
    if (window.innerWidth < 768) return 'mobile'
    if (window.innerWidth < 1024) return 'tablet'
    return 'desktop'
  }

  const [breakpoint, setBreakpoint] = useState(getBreakpoint)

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)')
    const tablet = window.matchMedia('(min-width: 768px) and (max-width: 1023px)')

    const update = () => setBreakpoint(getBreakpoint())

    mobile.addEventListener('change', update)
    tablet.addEventListener('change', update)
    return () => {
      mobile.removeEventListener('change', update)
      tablet.removeEventListener('change', update)
    }
  }, [])

  return breakpoint
}
