import { useEffect, useRef, useState } from 'react'
import Supercat, { PAW, type Mood, type Pose } from './Supercat'
import { sling } from '../sling'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * A Supercat that rests in `rest` pose and, on request, shoots a web at `getTarget()`.
 * `children` renders the prompt button via render-prop: (state, toggle).
 */
export default function SlingCat({
  rest,
  getTarget,
  pull,
  hold,
  flip = false,
  className = '',
  onAttach,
  onRelease,
  children,
}: {
  rest: Pose
  getTarget: () => HTMLElement | null
  pull: number
  hold: number
  flip?: boolean
  className?: string
  onAttach?: () => void
  onRelease?: () => void
  children: (active: boolean, toggle: () => void) => React.ReactNode
}) {
  const [active, setActive] = useState(false)
  const [pose, setPose] = useState<Pose>(rest)
  const [mood, setMood] = useState<Mood>('smile')
  const [hop, setHop] = useState(false)
  const anchor = useRef<HTMLSpanElement>(null)
  const handle = useRef<ReturnType<typeof sling> | null>(null)

  useEffect(() => {
    return () => {
      handle.current?.cancel()
    }
  }, [])

  const toggle = () => {
    const target = getTarget()
    if (!target) return
    if (active) {
      handle.current?.release()
      return
    }
    setActive(true)
    if (reduced()) {
      // simplified: no motion, just the reveal
      setMood('open')
      onAttach?.()
      handle.current = {
        release: () => { setMood('smile'); setActive(false); onRelease?.() },
        done: Promise.resolve(),
        cancel() {},
      }
      return
    }
    setPose('shoot')
    setMood('open')
    // wait for the shoot pose to paint so the web leaves from the paw
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (!anchor.current) return
        const h = sling(anchor.current, target, {
          pull,
          hold,
          onAttach,
          onRelease: () => {
            setPose(rest)
            setMood('smile')
            setActive(false)
            onRelease?.()
          },
        })
        handle.current = h
      }),
    )
  }

  const [px, py] = PAW.shoot!
  return (
    <>
      <div className={`relative ${className}`}>
        <button
          type="button"
          aria-label="Supercat. Click for a small surprise."
          className="block w-full cursor-pointer"
          onClick={() => {
            if (active) return
            setHop(true)
            setMood('wink')
            setTimeout(() => { setHop(false); setMood('smile') }, 750)
          }}
        >
          <span className={`block ${hop ? 'cat-hop' : ''}`}>
            <Supercat pose={pose} mood={mood} flip={flip} track={pose === 'sit' || pose === 'curious'} />
          </span>
        </button>
        {pose === 'shoot' && (
          <span
            ref={anchor}
            className="absolute w-px h-px"
            style={{ left: `${flip ? 100 - px : px}%`, top: `${py}%` }}
          />
        )}
      </div>
      {children(active, toggle)}
    </>
  )
}
