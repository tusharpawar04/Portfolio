import type { ReactElement } from 'react'

const INK = '#191d27'
const COBALT = '#7c3aed'
const APRICOT = '#f2a17d'
const CLOUD = '#faf7f2'

function rng(seed: number) {
  let s = seed
  return () => ((s = (s * 16807) % 2147483647) / 2147483647)
}

export function GymiesVisual(): ReactElement {
  const rows = [0.8, 0.55, 0.9, 0.4, 0.7, 0.62]
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="800" height="500" fill="#e8ebfa" />
      <g transform="translate(110 60)">
        <rect width="580" height="380" fill={CLOUD} stroke={INK} strokeOpacity=".15" />
        <rect width="120" height="380" fill={INK} />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x="18" y={34 + i * 30} width={i === 1 ? 70 : 50} height="6" fill={i === 1 ? COBALT : CLOUD} opacity={i === 1 ? 1 : 0.5} />
        ))}
        <text x="148" y="46" fontFamily="Instrument Serif" fontSize="26" fill={INK}>Members</text>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${148 + i * 142} 68)`}>
            <rect width="126" height="58" fill="none" stroke={INK} strokeOpacity=".18" />
            <rect x="12" y="14" width="40" height="5" fill={INK} opacity=".35" />
            <text x="12" y="45" fontFamily="Instrument Serif" fontSize="26" fill={i === 0 ? COBALT : INK}>{['~100', '', ''][i]}</text>
          </g>
        ))}
        {rows.map((w, i) => (
          <g key={i} transform={`translate(148 ${150 + i * 36})`}>
            <line x1="0" x2="410" y1="30" y2="30" stroke={INK} strokeOpacity=".12" />
            <circle cx="8" cy="12" r="8" fill={i === 2 ? COBALT : INK} opacity={i === 2 ? 1 : 0.15} />
            <rect x="28" y="7" width={90 + (i % 3) * 20} height="6" fill={INK} opacity=".55" />
            <rect x="260" y="9" width="140" height="4" fill={INK} opacity=".1" />
            <rect x="260" y="9" width={140 * w} height="4" fill={COBALT} />
          </g>
        ))}
      </g>
    </svg>
  )
}

export function CinemiesVisual(): ReactElement {
  const r = rng(42)
  const clusters: [number, number][] = [[210, 170], [560, 150], [330, 360], [620, 350]]
  const pts = clusters.flatMap(([cx, cy]) =>
    Array.from({ length: 26 }, () => ({ x: cx + (r() - 0.5) * 190 + (r() - 0.5) * 60, y: cy + (r() - 0.5) * 130 + (r() - 0.5) * 40 })),
  )
  const q = { x: 560, y: 185 }
  const near = [...pts].sort((a, b) => Math.hypot(a.x - q.x, a.y - q.y) - Math.hypot(b.x - q.x, b.y - q.y)).slice(0, 5)
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="800" height="500" fill={INK} />
      {[100, 200, 300, 400].map((y) => <line key={y} x1="0" x2="800" y1={y} y2={y} stroke={CLOUD} strokeOpacity=".06" />)}
      {[160, 320, 480, 640].map((x) => <line key={x} y1="0" y2="500" x1={x} x2={x} stroke={CLOUD} strokeOpacity=".06" />)}
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="2.6" fill={CLOUD} opacity=".45" />)}
      {near.map((p, i) => (
        <g key={i}>
          <line x1={q.x} y1={q.y} x2={p.x} y2={p.y} stroke={COBALT} strokeWidth="1.2" />
          <circle cx={p.x} cy={p.y} r="5" fill={COBALT} />
        </g>
      ))}
      <circle cx={q.x} cy={q.y} r="22" fill="none" stroke={APRICOT} strokeOpacity=".5" />
      <circle cx={q.x} cy={q.y} r="8" fill={APRICOT} />
      <text x={q.x + 30} y={q.y - 14} fontFamily="Geist Mono, monospace" fontSize="12" fill={CLOUD} opacity=".8" letterSpacing="1.2">QUERY</text>
      <text x="40" y="468" fontFamily="Geist Mono, monospace" fontSize="11" fill={CLOUD} opacity=".45" letterSpacing="1.2">EMBEDDING SPACE / K = 5</text>
    </svg>
  )
}

export function PortfolioVisual(): ReactElement {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="800" height="500" fill="#f5f0eb" />
      {/* Decorative layout grid */}
      {[80, 160, 240, 320, 400].map((y) => (
        <line key={y} x1="0" x2="800" y1={y} y2={y} stroke={INK} strokeOpacity=".05" />
      ))}
      <g transform="translate(100 50)">
        {/* Browser Mockup */}
        <rect width="600" height="400" rx="20" fill={CLOUD} stroke={INK} strokeOpacity=".15" />
        {/* Browser Top Bar */}
        <path d="M0 20 C0 9 9 0 20 0 L580 0 C591 0 600 9 600 20 L600 44 L0 44 Z" fill="#ebe6df" />
        <circle cx="24" cy="22" r="5" fill="#f26c60" />
        <circle cx="40" cy="22" r="5" fill="#f5be4f" />
        <circle cx="56" cy="22" r="5" fill="#5fc454" />
        {/* Address pill */}
        <rect x="80" y="12" width="220" height="20" rx="10" fill="#ffffff" stroke={INK} strokeOpacity=".1" />
        <text x="96" y="26" fontFamily="Geist Mono, monospace" fontSize="10" fill={INK} opacity=".5">portfolio · supercat</text>
        {/* Inner page content schematic */}
        <rect x="40" y="76" width="220" height="22" rx="4" fill={INK} opacity=".8" />
        <rect x="40" y="108" width="160" height="14" rx="4" fill={COBALT} opacity=".7" />
        <rect x="40" y="136" width="300" height="8" rx="4" fill={INK} opacity=".2" />
        <rect x="40" y="152" width="260" height="8" rx="4" fill={INK} opacity=".15" />
        <rect x="40" y="168" width="280" height="8" rx="4" fill={INK} opacity=".1" />
        {/* Floating pill badge */}
        <rect x="40" y="200" width="110" height="28" rx="14" fill={COBALT} />
        <text x="64" y="218" fontFamily="Geist Mono, monospace" fontSize="11" fill="#ffffff">SUPERCAT</text>
        {/* Cat Silhouette schematic */}
        <g transform="translate(400 90)">
          <circle cx="90" cy="90" r="80" fill={COBALT} opacity=".08" />
          <path d="M50 70 L50 20 L80 50 Z" fill={INK} />
          <path d="M130 70 L130 20 L100 50 Z" fill={INK} />
          <ellipse cx="90" cy="90" rx="46" ry="38" fill={INK} />
          <path d="M46 80 Q90 68 134 80 Q138 94 128 104 Q90 98 52 104 Q42 94 46 80 Z" fill={COBALT} />
          <circle cx="72" cy="90" r="7" fill={CLOUD} />
          <circle cx="108" cy="90" r="7" fill={CLOUD} />
          <circle cx="74" cy="90" r="4" fill={INK} />
          <circle cx="110" cy="90" r="4" fill={INK} />
          <ellipse cx="90" cy="190" rx="55" ry="50" fill={INK} />
          <path d="M48 146 L132 146 C160 178 170 216 182 248 C148 238 122 246 98 246 L45 246 C32 216 42 178 48 146 Z" fill={COBALT} />
          <circle cx="90" cy="156" r="6" fill={APRICOT} />
        </g>
      </g>
    </svg>
  )
}

export function ComplianceAuditVisual(): ReactElement {
  const rules = [
    { id: 'R01', name: 'Retention', score: 0.92, ok: true },
    { id: 'R02', name: '3rd-Party', score: 0.85, ok: true },
    { id: 'R03', name: 'Opt-Out', score: 0.45, ok: false },
    { id: 'R04', name: 'Purpose', score: 0.88, ok: true },
    { id: 'R05', name: 'Breach', score: 0.78, ok: true },
    { id: 'R06', name: 'X-Border', score: 0.38, ok: false },
    { id: 'R07', name: 'Consent', score: 0.95, ok: true },
    { id: 'R08', name: 'Deletion', score: 0.82, ok: true },
  ]
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="800" height="500" fill={INK} />
      {/* Background terminal grid */}
      {[80, 160, 240, 320, 400].map((y) => (
        <line key={y} x1="0" x2="800" y1={y} y2={y} stroke={CLOUD} strokeOpacity=".05" />
      ))}
      {[160, 320, 480, 640].map((x) => (
        <line key={x} y1="0" y2="500" x1={x} x2={x} stroke={CLOUD} strokeOpacity=".05" />
      ))}

      {/* Main Terminal Window */}
      <g transform="translate(60 40)">
        <rect width="680" height="420" rx="16" fill="#13161f" stroke={CLOUD} strokeOpacity=".12" />
        {/* Terminal Header */}
        <path d="M0 16 C0 7.2 7.2 0 16 0 L664 0 C672.8 0 680 7.2 680 16 L680 42 L0 42 Z" fill="#1e2230" />
        <circle cx="22" cy="21" r="5" fill="#f26c60" />
        <circle cx="38" cy="21" r="5" fill="#f5be4f" />
        <circle cx="54" cy="21" r="5" fill="#5fc454" />
        <text x="80" y="25" fontFamily="Geist Mono, monospace" fontSize="11" fill={CLOUD} opacity=".7">
          openenv · compliance_audit_env (FastAPI + WebSockets)
        </text>
        <rect x="530" y="11" width="130" height="20" rx="10" fill={COBALT} opacity=".25" />
        <text x="548" y="25" fontFamily="Geist Mono, monospace" fontSize="10" fill={COBALT} fontWeight="bold">
          DETERMINISTIC EVAL
        </text>

        {/* Left Column: RL Episode Loop */}
        <g transform="translate(30 65)">
          <text x="0" y="16" fontFamily="Geist Mono, monospace" fontSize="12" fill={APRICOT} fontWeight="bold">
            // AGENT INTERACTION LOOP
          </text>
          <rect x="0" y="30" width="280" height="74" rx="10" fill="#1b2030" stroke={COBALT} strokeOpacity=".3" />
          <text x="14" y="52" fontFamily="Geist Mono, monospace" fontSize="11" fill={CLOUD}>
            observation = client.reset('hard')
          </text>
          <text x="14" y="72" fontFamily="Geist Mono, monospace" fontSize="11" fill="#8b949e">
            document: 15 GDPR clauses loaded
          </text>
          <text x="14" y="90" fontFamily="Geist Mono, monospace" fontSize="11" fill={COBALT}>
            attempt: 01 / 03 · reward: pending
          </text>

          {/* Action Node */}
          <line x1="140" y1="104" x2="140" y2="128" stroke={COBALT} strokeWidth="2" strokeDasharray="3 3" />
          <rect x="0" y="128" width="280" height="80" rx="10" fill="#1b2030" stroke={CLOUD} strokeOpacity=".15" />
          <text x="14" y="150" fontFamily="Geist Mono, monospace" fontSize="11" fill={CLOUD}>
            action = ComplianceAction(
          </text>
          <text x="28" y="168" fontFamily="Geist Mono, monospace" fontSize="10" fill={APRICOT}>
            violations=['R03', 'R06'],
          </text>
          <text x="28" y="184" fontFamily="Geist Mono, monospace" fontSize="10" fill="#a5d6ff">
            suggested_rewrite='...'
          </text>
          <text x="14" y="200" fontFamily="Geist Mono, monospace" fontSize="11" fill={CLOUD}>
            )
          </text>

          {/* Feedback & Step */}
          <line x1="140" y1="208" x2="140" y2="232" stroke={COBALT} strokeWidth="2" />
          <rect x="0" y="232" width="280" height="76" rx="10" fill="#162b25" stroke="#3fb950" strokeOpacity=".4" />
          <text x="14" y="254" fontFamily="Geist Mono, monospace" fontSize="11" fill="#3fb950" fontWeight="bold">
            {'step() -> Reward: +0.865'}
          </text>
          <text x="14" y="274" fontFamily="Geist Mono, monospace" fontSize="10" fill={CLOUD} opacity=".8">
            Precision: 1.0 · Recall: 0.85
          </text>
          <text x="14" y="292" fontFamily="Geist Mono, monospace" fontSize="10" fill="#3fb950">
            ✓ Episode Terminated (Threshold &gt; 0.85)
          </text>
        </g>

        {/* Right Column: 8 GDPR Compliance Rule Gauges */}
        <g transform="translate(350 65)">
          <text x="0" y="16" fontFamily="Geist Mono, monospace" fontSize="12" fill={CLOUD} opacity=".9">
            GDPR RULE EVALUATION MATRIX (8 RULES)
          </text>
          {rules.map((r, i) => (
            <g key={r.id} transform={`translate(0 ${35 + i * 34})`}>
              <text x="0" y="16" fontFamily="Geist Mono, monospace" fontSize="11" fill={r.ok ? CLOUD : APRICOT}>
                {r.id} {r.name}
              </text>
              <rect x="110" y="6" width="130" height="12" rx="6" fill="#1b2030" />
              <rect x="110" y="6" width={130 * r.score} height="12" rx="6" fill={r.ok ? COBALT : APRICOT} />
              <text x="250" y="16" fontFamily="Geist Mono, monospace" fontSize="10" fill="#8b949e">
                {Math.round(r.score * 100)}%
              </text>
              <circle cx="288" cy="12" r="5" fill={r.ok ? '#3fb950' : '#f85149'} />
            </g>
          ))}
        </g>
      </g>
    </svg>
  )
}

export function TourMitraVisual(): ReactElement {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="800" height="500" fill="#f0edf8" />
      {/* Background soft geometric blobs */}
      <circle cx="150" cy="120" r="140" fill={COBALT} opacity=".07" />
      <circle cx="700" cy="380" r="160" fill={APRICOT} opacity=".1" />

      {/* Main Glassmorphic Travel Card */}
      <g transform="translate(70 50)">
        <rect width="660" height="400" rx="24" fill="#ffffff" stroke={INK} strokeOpacity=".12" />
        
        {/* Navigation Strip */}
        <rect x="0" y="0" width="660" height="60" rx="24" fill="#faf9fe" />
        <circle cx="36" cy="30" r="14" fill={COBALT} />
        <text x="31" y="35" fontFamily="sans-serif" fontSize="14" fill="#fff" fontWeight="bold">TM</text>
        <text x="62" y="36" fontFamily="Instrument Serif" fontSize="22" fill={INK}>TourMitra</text>
        
        {/* Dual Persona Switcher */}
        <g transform="translate(420 16)">
          <rect width="210" height="32" rx="16" fill="#ece8f5" />
          <rect x="2" y="2" width="102" height="28" rx="14" fill={COBALT} />
          <text x="24" y="20" fontFamily="Geist Mono, monospace" fontSize="10" fill="#ffffff" fontWeight="bold">TOURIST</text>
          <text x="124" y="20" fontFamily="Geist Mono, monospace" fontSize="10" fill={INK} opacity=".6">LOCAL GUIDE</text>
        </g>

        {/* Content area: Destination & Guide Marketplace */}
        <g transform="translate(30 85)">
          {/* Destination Hero snippet */}
          <rect width="360" height="170" rx="16" fill="#191d27" />
          <text x="24" y="40" fontFamily="Instrument Serif" fontSize="26" fill="#ffffff">Jaipur · The Pink City</text>
          <text x="24" y="65" fontFamily="Geist Mono, monospace" fontSize="11" fill={APRICOT}>AI Itinerary: 3-Day Heritage & Forts</text>
          
          {/* Itinerary timeline pills */}
          {[
            'Day 1: Amber Fort & Hawa Mahal',
            'Day 2: City Palace & Local Bazaars',
            'Day 3: Nahargarh Sunset & Cuisine',
          ].map((d, i) => (
            <g key={i} transform={`translate(24 ${85 + i * 26})`}>
              <circle cx="5" cy="5" r="4" fill={COBALT} />
              <text x="18" y="9" fontFamily="sans-serif" fontSize="11" fill="#e2e8f0">{d}</text>
            </g>
          ))}

          {/* Booking State Lifecycle */}
          <g transform="translate(0 195)">
            <rect width="360" height="85" rx="14" fill="#f5f3fb" stroke={COBALT} strokeOpacity=".2" />
            <text x="16" y="24" fontFamily="Geist Mono, monospace" fontSize="10" fill={COBALT} fontWeight="bold">
              BOOKING STATE LIFECYCLE
            </text>
            <g transform="translate(16 40)">
              {['Pending', 'Confirmed', 'Completed'].map((s, idx) => (
                <g key={s} transform={`translate(${idx * 110} 0)`}>
                  <rect width="95" height="24" rx="12" fill={idx === 1 ? COBALT : idx === 0 ? '#ece8f5' : '#e6f4ea'} />
                  <text x="16" y="16" fontFamily="Geist Mono, monospace" fontSize="10" fill={idx === 1 ? '#ffffff' : idx === 2 ? '#137333' : INK}>
                    {s}
                  </text>
                </g>
              ))}
            </g>
          </g>

          {/* Right Column: Verified Guide Card */}
          <g transform="translate(385 0)">
            <rect width="215" height="280" rx="18" fill="#ffffff" stroke={INK} strokeOpacity=".12" />
            <rect x="18" y="18" width="56" height="56" rx="28" fill={COBALT} opacity=".15" />
            <circle cx="46" cy="46" r="16" fill={COBALT} />
            <text x="86" y="38" fontFamily="sans-serif" fontSize="14" fill={INK} fontWeight="bold">Rajesh Sharma</text>
            <text x="86" y="55" fontFamily="Geist Mono, monospace" fontSize="10" fill="#137333">✓ Verified Guide</text>
            <line x1="18" x2="197" y1="88" y2="88" stroke={INK} strokeOpacity=".08" />
            <text x="18" y="112" fontFamily="sans-serif" fontSize="11" fill={INK} opacity=".8">Languages: Hindi, English</text>
            <text x="18" y="132" fontFamily="sans-serif" fontSize="11" fill={INK} opacity=".8">Specialty: Architectural History</text>
            <text x="18" y="152" fontFamily="sans-serif" fontSize="11" fill={INK} opacity=".8">Rate: ₹1,200 / day</text>
            
            {/* Rating */}
            <rect x="18" y="172" width="180" height="34" rx="10" fill="#fff9db" />
            <text x="28" y="194" fontFamily="sans-serif" fontSize="12" fill="#b17a00" fontWeight="bold">★ 4.9 · 84 Tours</text>
            
            {/* Book Guide button */}
            <rect x="18" y="222" width="180" height="38" rx="19" fill={COBALT} />
            <text x="56" y="246" fontFamily="Geist Mono, monospace" fontSize="11" fill="#ffffff" fontWeight="bold">
              REQUEST BOOKING
            </text>
          </g>
        </g>
      </g>
    </svg>
  )
}

export function VoyagerVisual(): ReactElement {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="800" height="500" fill="#edf4f7" />
      
      {/* Container */}
      <g transform="translate(60 40)">
        <rect width="680" height="420" rx="20" fill="#ffffff" stroke={INK} strokeOpacity=".12" />
        
        {/* Header */}
        <rect x="0" y="0" width="680" height="54" rx="20" fill="#191d27" />
        <circle cx="34" cy="27" r="12" fill={APRICOT} />
        <text x="29" y="32" fontFamily="sans-serif" fontSize="12" fill="#fff" fontWeight="bold">V</text>
        <text x="56" y="33" fontFamily="Instrument Serif" fontSize="24" fill="#ffffff">Voyager</text>
        <text x="156" y="32" fontFamily="Geist Mono, monospace" fontSize="10" fill={CLOUD} opacity=".5">
          MVC ARCHITECTURE · CLOUDINARY + MAPBOX
        </text>
        
        <rect x="540" y="14" width="115" height="26" rx="13" fill="#2d3748" />
        <text x="556" y="31" fontFamily="Geist Mono, monospace" fontSize="10" fill="#63b3ed">PASSPORT AUTH</text>

        {/* Left Side: Property Listing Card */}
        <g transform="translate(30 75)">
          <rect width="300" height="320" rx="16" fill="#f8fafc" stroke={INK} strokeOpacity=".1" />
          
          {/* Cloudinary Image Placeholder */}
          <rect x="14" y="14" width="272" height="145" rx="12" fill="#cbd5e1" />
          <path d="M14 125 L90 75 L160 125 L210 95 L286 150 L14 150 Z" fill="#94a3b8" />
          <circle cx="60" cy="50" r="16" fill="#fbbf24" opacity=".8" />
          <rect x="24" y="24" width="105" height="20" rx="10" fill={INK} opacity=".75" />
          <text x="34" y="38" fontFamily="Geist Mono, monospace" fontSize="9" fill="#ffffff">CLOUDINARY CDN</text>

          {/* Details */}
          <text x="16" y="185" fontFamily="sans-serif" fontSize="16" fill={INK} fontWeight="bold">Cliffside Villa</text>
          <text x="16" y="205" fontFamily="sans-serif" fontSize="12" fill="#64748b">Anjuna, Goa · India</text>
          <text x="16" y="235" fontFamily="sans-serif" fontSize="15" fill={COBALT} fontWeight="bold">₹6,500 <span style={{ fontSize: '11px', color: '#64748b' }}>/ night</span></text>
          
          {/* MVC Flow pill */}
          <rect x="16" y="260" width="268" height="34" rx="8" fill="#e2e8f0" />
          <text x="26" y="282" fontFamily="Geist Mono, monospace" fontSize="10" fill={INK}>
            Mongoose Model &gt; EJS View
          </text>
        </g>

        {/* Right Side: Mapbox Geolocation & MVC Schema */}
        <g transform="translate(355 75)">
          {/* Mapbox Geolocation Card */}
          <rect width="295" height="155" rx="16" fill="#1e293b" />
          <text x="16" y="28" fontFamily="Geist Mono, monospace" fontSize="11" fill="#38bdf8" fontWeight="bold">
            MAPBOX FORWARD GEOCODING
          </text>
          <text x="16" y="48" fontFamily="Geist Mono, monospace" fontSize="10" fill="#94a3b8">
            geometry: Point [73.742, 15.584]
          </text>
          
          {/* Radar / Pin graphic */}
          <g transform="translate(145 95)">
            <circle cx="0" cy="0" r="34" fill="#38bdf8" opacity=".12" />
            <circle cx="0" cy="0" r="18" fill="#38bdf8" opacity=".25" />
            <path d="M0 -14 C-7 -14 -12 -9 -12 -2 C-12 7 0 16 0 16 C0 16 12 7 12 -2 C12 -9 7 -14 0 -14 Z" fill="#ef4444" />
            <circle cx="0" cy="-4" r="4" fill="#ffffff" />
          </g>

          {/* MVC Architecture & Tech Stack Card */}
          <g transform="translate(0 170)">
            <rect width="295" height="150" rx="16" fill="#f1f5f9" stroke={INK} strokeOpacity=".1" />
            <text x="16" y="26" fontFamily="Geist Mono, monospace" fontSize="11" fill={INK} fontWeight="bold">
              BACKEND ARCHITECTURE
            </text>
            
            <g transform="translate(16 40)">
              {[
                { layer: 'Controller', tech: 'Express & Async/Await' },
                { layer: 'Persistence', tech: 'MongoDB + Mongoose ODM' },
                { layer: 'Validation', tech: 'Joi Request Schemas' },
                { layer: 'Auth Engine', tech: 'Passport-Local & Sessions' },
              ].map((item, idx) => (
                <g key={item.layer} transform={`translate(0 ${idx * 24})`}>
                  <text x="0" y="14" fontFamily="Geist Mono, monospace" fontSize="10" fill={COBALT} fontWeight="bold">
                    {item.layer}:
                  </text>
                  <text x="95" y="14" fontFamily="sans-serif" fontSize="10" fill="#334155">
                    {item.tech}
                  </text>
                </g>
              ))}
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}

export const visuals: Record<string, () => ReactElement> = {
  'compliance-audit': ComplianceAuditVisual,
  tourmitra: TourMitraVisual,
  voyager: VoyagerVisual,
  gymies: GymiesVisual,
  cinemies: CinemiesVisual,
  portfolio: PortfolioVisual,
}
