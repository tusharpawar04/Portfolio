// Supercat's web: a thin SVG line shot on a curved path, attached to a target, which is pulled
// with an underdamped spring (overshoot) and released with recoil. Plain rAF, no libraries.
const NS = 'http://www.w3.org/2000/svg'
const COBALT = '#5969df'
const APRICOT = '#f2a17d'

export type SlingOpts = {
  pull: number // px the target is drawn toward the paw
  hold: number // ms before auto-release (Infinity = manual)
  onAttach?: () => void
  onRelease?: () => void
}

let svg: SVGSVGElement | null = null
let path: SVGPathElement
let dot: SVGCircleElement
let burst: SVGGElement

function mount() {
  if (svg) return
  svg = document.createElementNS(NS, 'svg')
  svg.setAttribute('aria-hidden', 'true')
  Object.assign(svg.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '60' })
  path = document.createElementNS(NS, 'path')
  path.setAttribute('fill', 'none')
  path.setAttribute('stroke', COBALT)
  path.setAttribute('stroke-linecap', 'round')
  dot = document.createElementNS(NS, 'circle')
  dot.setAttribute('fill', COBALT)
  burst = document.createElementNS(NS, 'g')
  svg.append(path, dot, burst)
  document.body.appendChild(svg)
}

const eo = (t: number) => 1 - Math.pow(1 - t, 3)
const ei = (t: number) => t * t * t
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

export function sling(from: HTMLElement, to: HTMLElement, o: SlingOpts) {
  mount()
  const restRot = parseFloat(to.dataset.rot || '0')
  const off = { x: 0, y: 0, vx: 0, vy: 0 }
  const sag = { y: 0, v: 0 }
  let phase: 'shoot' | 'hold' | 'release' = 'shoot'
  let t0 = performance.now()
  let last = t0
  let releaseAt = 0
  let tipFrom = { x: 0, y: 0 }
  let attached = false
  let burstT = -1
  let burstP = { x: 0, y: 0 }
  let raf = 0
  let finish!: () => void
  const done = new Promise<void>((r) => (finish = r))

  const anchor = () => {
    const r = from.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }
  const base = () => {
    const r = to.getBoundingClientRect()
    return { l: r.left - off.x, t: r.top - off.y, w: r.width, h: r.height }
  }
  // closest point on the target's current box to the paw: a clear attachment point
  const attachPt = (A: { x: number; y: number }) => {
    const b = base()
    return { x: clamp(A.x, b.l + off.x, b.l + off.x + b.w), y: clamp(A.y, b.t + off.y, b.t + off.y + b.h) }
  }
  const draw = (A: { x: number; y: number }, tip: { x: number; y: number }, arc: number, sw: number) => {
    const cx = (A.x + tip.x) / 2
    const cy = (A.y + tip.y) / 2 - arc
    path.setAttribute('d', `M${A.x} ${A.y} Q${cx} ${cy} ${tip.x} ${tip.y}`)
    path.setAttribute('stroke-width', String(sw))
    dot.setAttribute('cx', String(tip.x))
    dot.setAttribute('cy', String(tip.y))
    dot.setAttribute('r', attached ? '3.2' : '2')
  }
  const drawBurst = (now: number) => {
    if (burstT < 0) return
    const p = (now - burstT) / 450
    burst.replaceChildren()
    if (p >= 1) { burstT = -1; return }
    const ring = document.createElementNS(NS, 'circle')
    ring.setAttribute('cx', String(burstP.x)); ring.setAttribute('cy', String(burstP.y))
    ring.setAttribute('r', String(4 + eo(p) * 14)); ring.setAttribute('fill', 'none')
    ring.setAttribute('stroke', COBALT); ring.setAttribute('stroke-width', '1.2')
    ring.setAttribute('opacity', String(1 - p))
    burst.appendChild(ring)
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + 0.3
      const r1 = 7 + eo(p) * 12, r2 = r1 + 4 + (1 - p) * 4
      const l = document.createElementNS(NS, 'line')
      l.setAttribute('x1', String(burstP.x + Math.cos(a) * r1)); l.setAttribute('y1', String(burstP.y + Math.sin(a) * r1))
      l.setAttribute('x2', String(burstP.x + Math.cos(a) * r2)); l.setAttribute('y2', String(burstP.y + Math.sin(a) * r2))
      l.setAttribute('stroke', i % 3 === 0 ? APRICOT : COBALT); l.setAttribute('stroke-width', '1.4')
      l.setAttribute('stroke-linecap', 'round'); l.setAttribute('opacity', String(1 - p))
      burst.appendChild(l)
    }
  }
  const apply = (progress: number) => {
    to.style.transform = `translate(${off.x}px, ${off.y}px) rotate(${restRot * (1 - progress)}deg)`
  }

  function frame(now: number) {
    const dt = Math.min(0.033, (now - last) / 1000)
    last = now
    const A = anchor()
    const b = base()
    const cxy = { x: b.l + b.w / 2, y: b.t + b.h / 2 }
    const dist = Math.hypot(A.x - cxy.x, A.y - cxy.y) || 1
    const dir = { x: (A.x - cxy.x) / dist, y: (A.y - cxy.y) / dist }
    const want = phase === 'release' ? { x: 0, y: 0 } : { x: dir.x * o.pull, y: dir.y * o.pull }

    if (phase !== 'shoot') {
      // underdamped spring toward the pulled position (k=150, c=11 gives a visible overshoot)
      const k = phase === 'release' ? 190 : 150, c = phase === 'release' ? 9 : 11
      off.vx += (k * (want.x - off.x) - c * off.vx) * dt
      off.vy += (k * (want.y - off.y) - c * off.vy) * dt
      off.x += off.vx * dt
      off.y += off.vy * dt
      apply(clamp(Math.hypot(off.x, off.y) / (o.pull || 1), 0, 1))
      // line sag springs separately so the web whips after attaching
      sag.v += (200 * (8 - sag.y) - 8 * sag.v) * dt
      sag.y += sag.v * dt
    }

    if (phase === 'shoot') {
      const s = clamp((now - t0) / 300, 0, 1)
      const P = attachPt(A)
      const e = eo(s)
      const tip = { x: A.x + (P.x - A.x) * e, y: A.y + (P.y - A.y) * e }
      draw(A, tip, Math.hypot(P.x - A.x, P.y - A.y) * 0.22 * (1 - e), 1.6)
      if (s >= 1) {
        phase = 'hold'
        attached = true
        burstT = now
        burstP = P
        off.vx = dir.x * o.pull * 3 // impulse: the tug
        off.vy = dir.y * o.pull * 3
        sag.y = -26
        sag.v = 160
        o.onAttach?.()
        if (isFinite(o.hold)) setTimeout(release, o.hold)
      }
    } else if (phase === 'hold') {
      const P = attachPt(A)
      const stretch = clamp(Math.hypot(off.x, off.y) / (o.pull || 1), 0, 1.4)
      draw(A, P, sag.y, 1.6 / (1 + stretch * 0.5))
    } else {
      const s = clamp((now - releaseAt) / 280, 0, 1)
      const e = ei(s)
      const tip = { x: tipFrom.x + (A.x - tipFrom.x) * e, y: tipFrom.y + (A.y - tipFrom.y) * e }
      if (s < 1) draw(A, tip, sag.y + s * 18, 1.6 * (1 - s * 0.5))
      else { path.setAttribute('d', ''); dot.setAttribute('r', '0') }
      const still = Math.hypot(off.x, off.y) < 0.15 && Math.hypot(off.vx, off.vy) < 2
      if (s >= 1 && still) {
        to.style.transform = restRot ? `rotate(${restRot}deg)` : ''
        burst.replaceChildren()
        o.onRelease?.()
        finish()
        return
      }
    }
    drawBurst(now)
    raf = requestAnimationFrame(frame)
  }

  function release() {
    if (phase === 'release') return
    if (phase === 'shoot') t0 = -1e9 // snap tip to target, then retract
    phase = 'release'
    releaseAt = performance.now()
    tipFrom = attachPt(anchor())
    attached = false
  }

  raf = requestAnimationFrame(frame)
  return {
    release,
    done,
    cancel() { cancelAnimationFrame(raf); to.style.transform = restRot ? `rotate(${restRot}deg)` : ''; path.setAttribute('d', ''); dot.setAttribute('r', '0'); burst.replaceChildren() },
  }
}
