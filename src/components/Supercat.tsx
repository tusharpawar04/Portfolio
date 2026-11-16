import { useEffect, useRef } from 'react'
import { useCatAnimationRotation } from '../hooks'
import type { CatAnimationType } from '../animations'

export type Pose = 'sit' | 'fly' | 'shoot' | 'curious' | 'idle' | 'bust'
export type Mood = 'smile' | 'open' | 'wink' | 'curious' | 'sleepy'

const INK = '#191d27'
const COBALT = '#5969df'
const APRICOT = '#f2a17d'
const CLOUD = '#f6f7fa'

// Anchor (paw tip) per pose, as % of the 200x200 viewBox. Used as the web origin.
export const PAW: Partial<Record<Pose, [number, number]>> = {
  shoot: [82, 44],
  curious: [66, 76],
}

function Head({ x = 100, y = 70, rot = 0, mood = 'smile', look = [0, 0] }: { x?: number; y?: number; rot?: number; mood?: Mood; look?: [number, number] }) {
  const eyes: [number, number][] = [[86, 70], [114, 70]]
  const ry = mood === 'curious' ? 10.5 : 9.5
  return (
    <g transform={`translate(${x - 100} ${y - 70}) rotate(${rot} 100 70)`}>
      {/* ears */}
      <path d="M71 54 L69 22 L96 42 Z" fill={INK} />
      <path d="M129 54 L131 22 L104 42 Z" fill={INK} />
      <path d="M76 47 L75 32 L88 42 Z" fill={APRICOT} />
      <path d="M124 47 L125 32 L112 42 Z" fill={APRICOT} />
      {/* head */}
      <ellipse cx="100" cy="70" rx="35" ry="29" fill={INK} />
      {/* mask */}
      <path d="M66 62 Q100 54 134 62 Q138 72 130 80 Q100 76 70 80 Q62 72 66 62 Z" fill={COBALT} />
      {/* eyes */}
      {eyes.map(([cx, cy], i) => (
        <g key={i} className={mood === 'wink' && i === 1 ? 'wink-eye' : 'cat-blink'}>
          {mood === 'sleepy' ? (
            <path d={`M${cx - 8} ${cy + 1} Q${cx} ${cy + 7} ${cx + 8} ${cy + 1}`} stroke={CLOUD} strokeWidth="2.6" strokeLinecap="round" fill="none" />
          ) : (
            <>
              <ellipse cx={cx} cy={cy} rx="8.5" ry={ry} fill={CLOUD} />
              <g style={{ transform: 'translate(var(--px,0px), var(--py,0px))' }}>
                <circle cx={cx + look[0]} cy={cy + look[1]} r="5" fill={INK} />
                <circle cx={cx + look[0] + 1.8} cy={cy + look[1] - 2} r="1.5" fill={CLOUD} />
              </g>
            </>
          )}
        </g>
      ))}
      {/* nose + mouth */}
      <path d="M96.5 81 L103.5 81 L100 85 Z" fill={APRICOT} />
      {mood === 'open' ? (
        <path d="M94 88 Q100 99 106 88 Q100 90 94 88 Z" fill={APRICOT} />
      ) : (
        <path d="M92 88 Q96 92 100 87 Q104 92 108 88" stroke={CLOUD} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      )}
      {/* whiskers */}
      <g stroke={INK} strokeWidth="1.4" strokeLinecap="round" opacity=".75">
        <path d="M68 80 L44 76" /><path d="M68 85 L46 90" />
        <path d="M132 80 L156 76" /><path d="M132 85 L154 90" />
      </g>
    </g>
  )
}

const Cape = ({ d }: { d: string }) => <path className="cat-cape" d={d} fill={COBALT} />
const Collar = () => (
  <g>
    <path d="M73 103 Q100 118 127 103 L127 112 Q100 128 73 112 Z" fill={COBALT} />
    <circle cx="100" cy="117" r="4.2" fill={APRICOT} />
  </g>
)

export default function Supercat({
  pose = 'sit',
  mood = 'smile',
  flip = false,
  track = false,
  enableRotation = false,
  className = '',
  title = 'Supercat, an original superhero cat in a cobalt cape',
}: {
  pose?: Pose
  mood?: Mood
  flip?: boolean
  track?: boolean
  enableRotation?: boolean
  className?: string
  title?: string
}) {
  const ref = useRef<SVGSVGElement>(null)
  const { currentAnimation } = useCatAnimationRotation()

  // Apply animation class based on current rotation
  const animationClass = enableRotation ? `cat-${currentAnimation}` : ''

  // Pupils follow the pointer (fine pointers only, never required).
  useEffect(() => {
    if (!track || !window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height * 0.35)
        const d = Math.hypot(dx, dy) || 1
        const k = Math.min(1, d / 300) * 2.6
        el.style.setProperty('--px', `${((flip ? -dx : dx) / d) * k}px`)
        el.style.setProperty('--py', `${(dy / d) * k}px`)
      })
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [track, flip])

  const look: [number, number] = mood === 'curious' ? [2.5, -1.5] : [0, 0]

  return (
    <svg
      ref={ref}
      viewBox="0 0 200 200"
      role="img"
      aria-label={title}
      className={`${className} ${animationClass}`.trim()}
      style={{ transform: flip ? 'scaleX(-1)' : undefined, overflow: 'visible' }}
    >
      {pose === 'sit' && (
        <g>
          <Cape d="M72 106 L128 106 C152 130 160 162 170 186 C142 178 120 184 100 184 L58 184 C48 160 56 130 72 106 Z" />
          <path className="cat-tail" d="M136 172 C172 176 182 142 166 122" stroke={INK} strokeWidth="11" strokeLinecap="round" fill="none" />
          <ellipse cx="100" cy="142" rx="38" ry="42" fill={INK} />
          <ellipse cx="100" cy="148" rx="13" ry="20" fill={CLOUD} opacity=".95" />
          <ellipse cx="84" cy="182" rx="12" ry="8" fill={INK} />
          <ellipse cx="116" cy="182" rx="12" ry="8" fill={INK} />
          <Collar />
          <Head mood={mood} look={look} />
        </g>
      )}

      {pose === 'shoot' && (
        <g>
          <Cape d="M72 106 L128 106 C152 130 160 162 170 186 C142 178 120 184 100 184 L58 184 C48 160 56 130 72 106 Z" />
          <path d="M136 172 C172 176 182 150 170 130" stroke={INK} strokeWidth="11" strokeLinecap="round" fill="none" />
          <ellipse cx="100" cy="142" rx="38" ry="42" fill={INK} />
          <ellipse cx="100" cy="148" rx="13" ry="20" fill={CLOUD} opacity=".95" />
          <ellipse cx="84" cy="182" rx="12" ry="8" fill={INK} />
          <ellipse cx="116" cy="182" rx="12" ry="8" fill={INK} />
          {/* extended arm with web-shooter band */}
          <path d="M120 130 L156 96" stroke={INK} strokeWidth="13" strokeLinecap="round" />
          <path d="M139 109 L147 117" stroke={COBALT} strokeWidth="6" strokeLinecap="butt" />
          <circle cx="164" cy="88" r="9" fill={INK} />
          <Collar />
          <Head x={102} y={70} rot={8} mood="open" look={[3, -2]} />
        </g>
      )}

      {pose === 'curious' && (
        <g>
          <Cape d="M72 106 L128 106 C152 130 160 162 170 186 C142 178 120 184 100 184 L58 184 C48 160 56 130 72 106 Z" />
          {/* tail curls into a question mark */}
          <path className="cat-tail" d="M136 174 C176 176 184 140 160 126 C146 118 150 104 160 104" stroke={INK} strokeWidth="11" strokeLinecap="round" fill="none" />
          <ellipse cx="100" cy="142" rx="38" ry="42" fill={INK} />
          <ellipse cx="100" cy="148" rx="13" ry="20" fill={CLOUD} opacity=".95" />
          <ellipse cx="84" cy="182" rx="12" ry="8" fill={INK} />
          <ellipse cx="116" cy="182" rx="12" ry="8" fill={INK} />
          <path d="M80 150 L68 128" stroke={INK} strokeWidth="12" strokeLinecap="round" />
          <circle cx="66" cy="123" r="8" fill={INK} />
          <Collar />
          <Head x={98} y={70} rot={-11} mood="curious" look={look} />
        </g>
      )}

      {pose === 'fly' && (
        <g className="cat-fly">
          <path className="cat-cape" style={{ transformOrigin: '140px 96px' }} d="M138 86 C162 64 182 70 198 52 C196 76 190 90 198 112 C178 108 160 118 138 112 Z" fill={COBALT} />
          <path d="M156 112 C182 116 194 96 190 80" stroke={INK} strokeWidth="10" strokeLinecap="round" fill="none" />
          <ellipse cx="116" cy="104" rx="46" ry="25" transform="rotate(-10 116 104)" fill={INK} />
          <path d="M96 104 L30 74" stroke={INK} strokeWidth="12" strokeLinecap="round" />
          <circle cx="26" cy="72" r="8.5" fill={INK} />
          <path d="M150 104 L170 128" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          <circle cx="94" cy="112" r="4.2" fill={APRICOT} />
          <Head x={72} y={92} rot={-14} mood="open" look={[-2, -1]} />
        </g>
      )}

      {pose === 'idle' && (
        <g>
          <ellipse cx="112" cy="156" rx="56" ry="30" fill={INK} />
          <path className="cat-cape" style={{ transformOrigin: '100px 130px' }} d="M96 128 C120 120 150 126 166 146 C150 166 120 172 90 166 Z" fill={COBALT} />
          <path className="cat-tail" style={{ ['--tail-o' as string]: '160px 178px' }} d="M164 176 C190 176 192 148 176 140" stroke={INK} strokeWidth="10" strokeLinecap="round" fill="none" />
          <ellipse cx="80" cy="178" rx="13" ry="7" fill={INK} />
          <circle cx="94" cy="132" r="4.2" fill={APRICOT} />
          <Head x={78} y={118} rot={-6} mood="sleepy" />
        </g>
      )}

      {pose === 'bust' && (
        <g>
          <ellipse cx="100" cy="160" rx="52" ry="40" fill={INK} />
          <Cape d="M54 118 L146 118 L160 190 L40 190 Z" />
          <ellipse cx="100" cy="150" rx="40" ry="30" fill={INK} />
          <Collar />
          <Head mood={mood} look={look} />
        </g>
      )}
    </svg>
  )
}
