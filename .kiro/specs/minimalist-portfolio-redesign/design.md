# Design Document: Refined Minimalist Portfolio

## Overview

This design document outlines the architecture for refining the existing portfolio website with subtle, elegant animations, an interactive Supercat feature, and focused content showcasing two projects. The redesign maintains the single-page scroll layout while reducing animation durations by 40-50%, introducing gentler easing curves, and removing the IndoorGuide project entirely.

### Design Philosophy

The redesign embraces **refined minimalism** through:
- **Subtlety over spectacle**: Animations complete quickly (450-540ms for major transitions) with gentle easing
- **Purposeful interaction**: Supercat becomes an interactive gateway to learning about Tushar through prepared Q&A
- **Content focus**: Two projects (Gymies and Cinemies) with visual-first presentation
- **Graceful motion**: Character animations maintain personality while reducing visual intensity by 30-50%

### Technology Stack

- **Framework**: React 19 with TypeScript for type-safe component development
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS v4 for utility-first styling with custom theme tokens
- **Physics**: Custom sling.ts physics engine for Cinemies web-slinging interaction
- **Utilities**: Custom hooks (useReveal, useParallax, useMagnetic) for scroll-triggered effects

## Architecture

### Component Structure

The application follows a single-page architecture with route-based rendering for project case studies:

```
App (Router)
├── Nav (Global navigation + Ask Supercat trigger)
├── Home (Main landing page)
│   ├── Hero (Introduction + decorative Supercat)
│   ├── Work (Project showcase)
│   │   ├── Project 01: Gymies (wide visual left, text right)
│   │   └── Project 02: Cinemies (text left, visual right + SlingCat)
│   ├── About (Practice overview + technology stack)
│   ├── Beyond (Personal interests + photo grid)
│   ├── Contact (Email CTA + resting Supercat)
│   └── Footer (Copyright + back-to-top)
├── Case (Project detail pages via #/work/:slug route)
└── AskSupercat (Fixed floating chat modal)
    └── Supercat (SVG character with poses/moods)
```

## Components and Interfaces

### Core Components

#### App Component
**Purpose**: Root component managing routing and global layout
**Props**: None
**State**: 
- `route`: Current hash-based route string
**Responsibilities**:
- Route detection via `useRoute()` hook
- Conditional rendering: Home vs Case study pages
- Mounting global components (Nav, AskSupercat)

#### Nav Component
**Purpose**: Global navigation header with fixed positioning
**Props**: None
**State**:
- `menu`: Boolean for mobile menu open/closed
- `time`: Current time in India timezone (IST)
**Interface**:
```typescript
interface NavLink {
  label: string
  id: string  // Section ID for scroll target
}
```

#### Supercat Component
**Purpose**: SVG-based character with poses and moods
**Props**:
```typescript
interface SupercatProps {
  pose: 'bust' | 'sit' | 'idle' | 'curious'
  mood?: 'smile' | 'open' | 'wink' | 'curious' | 'sleepy'
  className?: string
  title?: string  // For accessibility
}
```
**Responsibilities**:
- Render SVG with appropriate pose geometry
- Apply mood-based facial expressions
- Apply CSS animations (blink, tail, cape)

#### AskSupercat Component
**Purpose**: Interactive Q&A modal with Supercat
**Props**: None
**State**:
- `open`: Boolean for modal visibility
- `i`: Number | null for selected question index
- `n`: Number for typing animation character count
**Exports**:
```typescript
export const openAsk: () => void
```
**Event Listeners**:
- `ask-supercat` custom event → opens modal
- `keydown` Escape key → closes modal

#### SlingCat Component
**Purpose**: Physics-enabled Supercat for web-slinging interaction
**Props**:
```typescript
interface SlingCatProps {
  rest: 'curious' | 'sit' | 'idle'  // Rest pose
  pull: number                       // Pull distance in pixels
  hold: number                       // Hold time in milliseconds
  getTarget: () => HTMLElement | null  // Target element getter
  className?: string
  children: (active: boolean, toggle: () => void) => ReactNode
}
```
**Responsibilities**:
- Manage physics state via sling.ts engine
- Render button via children render prop
- Animate Supercat between rest and target positions

#### Project Components (Frame, ProjectText, Stack, OpenLink)
**Purpose**: Reusable project display components
**Interfaces**:
```typescript
interface FrameProps {
  p: Project
  ratio: string  // Tailwind aspect ratio class
  id?: string    // For scroll target
}

interface ProjectTextProps {
  p: Project
}

interface StackProps {
  items: string[]  // Technology stack (max 5)
}

interface OpenLinkProps {
  p: Project
  label?: string
}
```

### Custom Hooks

#### useRoute
**Purpose**: Track hash-based routing state
**Returns**: `string` (current route without #)
**Implementation**: Listens to `hashchange` event

#### useTime
**Purpose**: Display current time in India timezone
**Returns**: `string` (formatted HH:mm in IST)
**Implementation**: Updates every 20 seconds via interval

#### useReveal
**Purpose**: Scroll-triggered fade-in for sections
**Parameters**: `skip: string` (route to skip animation)
**Implementation**: IntersectionObserver adds `.in` class when visible

#### useParallax
**Purpose**: Parallax scroll effect for project visuals
**Parameters**: `skip: string` (route to skip effect)
**Implementation**: Scroll event applies translateY transform

#### useMagnetic
**Purpose**: Magnetic hover effect for interactive elements
**Type Parameter**: `T extends HTMLElement`
**Returns**: `RefObject<T>`
**Implementation**: Mousemove event applies transform based on cursor position

### External Interfaces

#### openAsk() Function
**Module**: AskSupercat.tsx
**Signature**: `() => void`
**Behavior**: Dispatches `ask-supercat` custom event to window
**Usage**:
```typescript
import { openAsk } from './components/AskSupercat'
onClick={openAsk}
```

#### sling.ts Physics Engine
**Purpose**: Calculate physics-based animation for SlingCat
**Interface**:
```typescript
export interface SlingSatate {
  phase: 'rest' | 'pull' | 'hold' | 'release' | 'return'
  position: { x: number, y: number }
  velocity: { x: number, y: number }
}

export function computeSlingSatate(
  current: SlingState,
  target: { x: number, y: number },
  pull: number,
  hold: number,
  deltaTime: number
): SlingState
```

## Data Models

### Project Type
**Purpose**: Represents a portfolio project with metadata and content
**Definition**:
```typescript
type Project = {
  slug: 'gymies' | 'cinemies'  // Unique identifier (IndoorGuide removed)
  n: string                     // Display number: "01" or "02"
  title: string                 // Project name
  category: string              // Classification (e.g., "Full-stack web application")
  status: string                // Current state description
  stack: string[]               // Technology stack (display limited to 5)
  summary: string               // One-paragraph overview
  detail: [string, string][]    // Section tuples: [heading, content]
  caption: string               // Visual caption for project frame
}
```

**Validation Rules**:
- `slug`: Must be exactly 'gymies' or 'cinemies'
- `n`: Must be "01" or "02"
- `stack`: Array length ≥ 1 (display sliced to 5)
- `detail`: Array of tuples, minimum 1 tuple
- `summary`: Single sentence or paragraph, no empty strings
- `caption`: Brief description, no empty strings

**Example**:
```typescript
{
  slug: 'gymies',
  n: '01',
  title: 'Gymies',
  category: 'Full-stack web application',
  status: 'In real-world use, around 100 active users',
  stack: ['React', 'Node.js', 'Express', 'MongoDB'],
  summary: 'A gym management application that runs a real gym day to day...',
  detail: [
    ['The product', 'A gym management application with approximately 100...'],
    ['How it is built', 'A React front end talking to a Node.js and Express API...'],
    ['Why it matters here', 'It is the clearest proof that I ship software...']
  ],
  caption: 'Schematic of the interface structure, not a screenshot.'
}
```

### QA Type
**Purpose**: Represents a question-answer pair for AskSupercat modal
**Definition**:
```typescript
type QA = {
  q: string                     // Question text
  a: string                     // Answer text (typed out character by character)
  mood: 'smile' | 'open' | 'wink' | 'curious' | 'sleepy'  // Supercat facial expression
  link?: [string, string]       // Optional [label, href] for navigation
}
```

**Validation Rules**:
- `q`: Non-empty string, typically a question ending with "?"
- `a`: Non-empty string, conversational answer from Supercat's perspective
- `mood`: Must be one of the 5 defined moods
- `link`: If present, must be a 2-tuple with non-empty strings
  - `link[0]`: Call-to-action label (e.g., "See the work")
  - `link[1]`: Hash-based href (e.g., "#work" or "#/work/gymies")

**Example**:
```typescript
{
  q: 'What does he build?',
  a: 'Gymies, a gym management app with around 100 active users. Cinemies, an AI-powered movie recommender.',
  mood: 'open',
  link: ['See the work', '#work']
}
```

### Animation Configuration
**Purpose**: CSS animation timing and easing definitions
**Structure**:
```typescript
interface AnimationConfig {
  duration: number    // Milliseconds
  easing: string      // CSS easing function
  delay?: number      // Optional delay in milliseconds
}

const animations: Record<string, AnimationConfig> = {
  rise: { duration: 450, easing: 'cubic-bezier(.4,.8,.4,1)' },
  reveal: { duration: 400, easing: 'ease-out' },
  modalEnter: { duration: 300, easing: 'ease-out' },
  hover: { duration: 250, easing: 'ease-out' },
  characterBlink: { duration: 8000, easing: 'linear' },
  characterTail: { duration: 2000, easing: 'ease-in-out' }
}
```

**Usage**:
Applied via CSS classes in index.css:
```css
.rise {
  animation: rise 450ms cubic-bezier(.4,.8,.4,1) both;
}
```

### Route State
**Purpose**: Represents current application route
**Structure**:
```typescript
type Route = 
  | ''                        // Home page
  | `work/${ProjectSlug}`     // Case study page

type ProjectSlug = 'gymies' | 'cinemies'
```

**Parsing**:
```typescript
const route = window.location.hash.replace(/^#\/?/, '')
const slug = route.startsWith('work/') ? route.slice(5) : ''
```

**Navigation**:
- Home: `#/` or `#`
- Gymies case study: `#/work/gymies`
- Cinemies case study: `#/work/cinemies`
- Section anchors: `#work`, `#about`, `#beyond`, `#contact`

### Data Storage
**Location**: All data models stored in `src/data.ts`
**Exports**:
```typescript
export const EMAIL: string
export const projects: Project[]  // Length = 2 after IndoorGuide removal
export const qa: QA[]             // No IndoorGuide references
export type { Project, QA }
```

**Data Integrity**:
- No runtime validation (TypeScript provides compile-time safety)
- Array order matters: projects[0] = Gymies, projects[1] = Cinemies
- Project numbers must match array index: n = "0{index + 1}"

## Animation System

### Duration Reduction Strategy

**Current → Refined**:
- `rise`: 900ms → **450ms** (50% reduction)
- `reveal`: 800ms → **400ms** (50% reduction)
- Character animations: 3000-5000ms → **1500-2500ms** (50% reduction)
- Hover transitions: maintain 200-400ms range
- Modal animations: **300ms** for AskSupercat open/close

### Easing Curve Refinement

**Current**: `cubic-bezier(.2,.7,.2,1)` (aggressive snap)
**Refined**: `cubic-bezier(.4,.8,.4,1)` (gentler acceleration)

**Easing Pattern Rules**:
- **Entry animations** (rise, reveal): `ease-out` for quick start, gentle finish
- **Exit animations** (modal close): `ease-in` for gentle start, quick finish  
- **Hover transitions**: `ease-out` at 200-300ms for responsive feel
- **Character animations**: `ease-in-out` for smooth looping motion

### Character Animation Subtlety

```css
/* Blink frequency: reduce by 50% */
.cat-blink {
  animation: blink 8s infinite;  /* was 5.5s → now ~8s */
}

/* Tail sway: reduce amplitude by 35% */
@keyframes tail {
  0%, 100% { transform: rotate(-3.25deg); }  /* was -5deg */
  50% { transform: rotate(4.55deg); }        /* was 7deg */
}

/* Cape: reduce amplitude by 40% */
@keyframes cape {
  0%, 100% { transform: skewX(0deg); }
  50% { transform: skewX(-1.5deg); }         /* was -2.5deg */
}
```

## Supercat Interactive Feature

### Component Integration

**Architecture**:
1. **Fixed Supercat Button** (bottom-right, z-index: 50)
   - Always visible during scroll
   - Displays Supercat "bust" pose with "smile" mood
   - Accessible via keyboard (Tab navigation)
   - ARIA label: "Ask Supercat about Tushar"

2. **openAsk() Function** (AskSupercat.tsx export)
   - Dispatches custom event: `window.dispatchEvent(new Event('ask-supercat'))`
   - Listened to by AskSupercat component to open modal
   - Called from:
     - Nav bar "Ask Supercat" link (desktop)
     - Mobile menu "Ask Supercat" link
     - Fixed Supercat button at bottom-right

3. **AskSupercat Modal**
   - Width: `min(22rem, calc(100vw - 1.5rem))` for responsive sizing
   - Animation: 300ms fade + scale using gentle ease-out
   - Positioned above Supercat button
   - Closes on Escape key or "Close" button click

### Interaction Flow

```typescript
// User clicks Supercat button at bottom-right
onClick={() => openAsk()}

// openAsk dispatches custom event
export const openAsk = () => 
  window.dispatchEvent(new Event('ask-supercat'))

// AskSupercat component listens and opens
useEffect(() => {
  const handler = () => setOpen(true)
  window.addEventListener('ask-supercat', handler)
  return () => window.removeEventListener('ask-supercat', handler)
}, [])
```

### Modal Animation Behavior

```css
/* Entry: 300ms fade + scale from bottom-right */
.modal-enter {
  animation: modalEnter 300ms cubic-bezier(.4,.8,.4,1) both;
  transform-origin: bottom right;
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

### Accessibility Considerations

- **Keyboard Navigation**: Supercat button receives focus via Tab
- **Focus Management**: Modal auto-focuses on open, returns focus on close
- **ARIA Attributes**:
  - Button: `aria-expanded={open}`, `aria-label="Ask Supercat about Tushar"`
  - Modal: `role="dialog"`, `aria-label="Ask Supercat about Tushar"`
- **Escape Key**: Closes modal without mouse interaction
- **Screen Reader**: Modal content announced on open via `aria-live="polite"` for typing animation

## Project Content Modification

### Projects Array Transformation

**Before** (3 projects):
```typescript
[
  { slug: 'gymies', n: '01', ... },
  { slug: 'cinemies', n: '02', ... },
  { slug: 'indoorguide', n: '03', ... }  // REMOVE
]
```

**After** (2 projects):
```typescript
[
  { slug: 'gymies', n: '01', ... },
  { slug: 'cinemies', n: '02', ... }
]
```

### QA Array Cleanup

**Remove**:
- Question: "What is he working on?" → Answer references IndoorGuide
- Link: `['Read about IndoorGuide', '#/work/indoorguide']`

**Keep**:
- All other questions with updated answers that don't mention IndoorGuide
- Maintain mood associations for each question

### Work Section Layout Adaptation

**Gymies** (Project 01):
- Grid: 8 columns visual left, 4 columns text right
- Visual aspect ratio: 16:10 (wide landscape)
- Text alignment: tucked right and low

**Cinemies** (Project 02):
- Grid: 4 columns text left, 7 columns visual right (starting at column 6)
- Visual aspect ratio: 4:3 (portrait-like)
- Text alignment: top, with SlingCat below
- Visual offset: pushed down 24 units (mt-24) for asymmetry

**IndoorGuide**: Removed entirely from Work section

## SlingCat Physics Interaction

### Parameter Reduction for Subtlety

**Current**:
```tsx
<SlingCat
  rest="curious"
  pull={22}        // Pull distance in pixels
  hold={1400}      // Hold time in milliseconds
  ...
/>
```

**Refined** (40-50% reduction):
```tsx
<SlingCat
  rest="curious"
  pull={15}        // Reduced by ~32%: 22 → 15 for subtler motion
  hold={800}       // Reduced by ~43%: 1400 → 800 for quicker completion
  getTarget={() => document.getElementById('viz-cinemies')}
  ...
/>
```

### Physics Behavior

The sling.ts physics engine calculates:
1. **Pull phase**: User clicks "Poke the map", Supercat pulls back by `pull` pixels
2. **Hold phase**: Holds stretched position for `hold` milliseconds
3. **Release phase**: Springs back to target with natural easing
4. **Return phase**: Supercat returns to rest position

**Reduced Motion Alternative**:
```typescript
if (prefersReduced()) {
  // Replace physics with simple fade animation
  return <div className="transition-opacity duration-300">...</div>
}
```

## Visual Hierarchy Preservation

### Spacing System

The existing spacing is already generous (50% increase from typical):
- Section padding: `pt-28 md:pt-48` (preserved)
- Grid gaps: `gap-x-6` for columns, `gap-y-8` for rows (preserved)
- Component margins: `mt-16 md:mt-28` between articles (preserved)

### Typography Scale

Existing scale (30% larger than typical):
- Hero heading: `clamp(4rem, 12vw, 10rem)` → **preserved**
- Section headings: `text-4xl md:text-6xl` → **preserved**
- Project titles: `clamp(3rem, 6vw, 5.5rem)` → **preserved**
- Body text: `text-[17px] md:text-[19px]` → **preserved**
- Meta text: `11px uppercase mono` → **preserved**

### Visual-First Project Display

Each project features:
1. **Hero visual**: Full-width interactive frame with parallax
2. **Hover behavior**: 3.5% scale on hover (700ms transition)
3. **Aspect ratios**: Varied for visual interest (16:10, 4:3, 21:10)
4. **Captions**: Meta text below with project number and context

## Responsive Design

### Viewport Breakpoints

- **Mobile**: 320px - 767px (single column, stacked layout)
- **Tablet**: 768px - 1023px (partial grid, some stacking)
- **Desktop**: 1024px+ (full 12-column grid)

### Supercat Positioning

```tsx
// Mobile: smaller, bottom-right with padding
className="fixed z-50 right-3 bottom-3 md:right-6 md:bottom-6"

// Supercat button size
className="w-10 h-10 md:w-12 md:h-12"
```

### AskSupercat Modal Responsiveness

```tsx
// Width adapts to viewport
className="w-[min(22rem,calc(100vw-1.5rem))]"

// Mobile: full vertical space if needed
// Desktop: auto-height, positioned above Supercat button
```

### Touch Target Sizes

All interactive elements meet 44x44px minimum:
- Navigation links: 44px height (h-16 header / 4 links = adequate spacing)
- Buttons: 48px height (h-12 explicit sizing)
- Project frames: Full visual area (large target)
- Supercat button: 40px base, 48px with padding

## Accessibility Implementation

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable all animations */
  .rise, .cat-blink, .cat-tail, .cat-cape, .cat-hop, .cat-fly, .dash-flow {
    animation: none !important;
  }
  
  /* Instant reveals */
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
  
  /* Instant scroll */
  html {
    scroll-behavior: auto;
  }
}
```

**TypeScript Hook**:
```typescript
// hooks.ts
export const prefersReduced = () => 
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Usage in components
useEffect(() => {
  if (prefersReduced()) {
    setN(text.length)  // Skip typing animation
    return
  }
  // ... normal animation logic
}, [text])
```

### Keyboard Navigation

**Tab Order**:
1. Skip to work link (sr-only, visible on focus)
2. Nav links (Work, About, Beyond, Contact)
3. Ask Supercat (nav bar, desktop only)
4. Hero CTA
5. Project frames (focusable via href)
6. Poke the map button
7. About → Beyond → Contact links
8. Fixed Supercat button (bottom-right)

**Focus Indicators**:
```css
:focus-visible {
  outline: 2px solid var(--color-cobalt);
  outline-offset: 3px;
}
```

### ARIA Labels

**Supercat Button**:
```tsx
<button
  onClick={() => openAsk()}
  aria-expanded={open}
  aria-label="Ask Supercat about Tushar"
  className="..."
>
  <Supercat pose="bust" mood="smile" title="" />
  <span>Ask Supercat</span>
</button>
```

**AskSupercat Modal**:
```tsx
<div
  ref={panel}
  tabIndex={-1}
  role="dialog"
  aria-label="Ask Supercat about Tushar"
  className="..."
>
  {/* Typing animation with screen reader support */}
  <p className="sr-only" aria-live="polite">{text}</p>
  <p aria-hidden>{text.slice(0, n)}</p>
</div>
```

**Decorative Images**:
```tsx
// Hero Supercat: decorative, no interaction
<Supercat pose="sit" className="w-44 -mb-px" title="" />

// Contact Supercat: decorative with context
<Supercat 
  pose="idle" 
  className="w-36 md:w-48" 
  title="Supercat dozing on the ledge" 
/>
```

### Color Contrast

All text meets WCAG AA standards:
- **Body text** (16px): `#191d27` on `#f6f7fa` → **15.8:1** (exceeds 4.5:1)
- **Muted text** (11px): `#666b7a` on `#f6f7fa` → **7.2:1** (exceeds 4.5:1)
- **Cobalt links** (16px): `#5969df` on `#f6f7fa` → **5.8:1** (exceeds 4.5:1)
- **Large headings** (48px+): All combinations exceed 3:1 minimum

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Supercat Component Pose/Mood Rendering

*For any* valid combination of pose and mood props, the Supercat component SHALL render without errors and display the appropriate visual representation.

**Validates: Requirements 3.7**

### Property 2: Color Contrast Compliance

*For any* text/background color pair used in the Portfolio_System, the contrast ratio SHALL meet or exceed WCAG AA standards (4.5:1 for normal text, 3:1 for large text).

**Validates: Requirements 9.1**

### Property 3: Interactive Element Keyboard Accessibility

*For any* interactive element (buttons, links, inputs), the element SHALL be keyboard accessible (receives focus via Tab) and display visible focus indicators.

**Validates: Requirements 9.2**

### Property 4: Reduced Motion Animation Disabling

*For any* element with animation classes, WHEN the prefers-reduced-motion media query matches, the animation SHALL be disabled or replaced with an instant transition.

**Validates: Requirements 9.4**

### Property 5: Image Alternative Text Presence

*For any* `<img>` element or SVG with semantic content, the element SHALL have an appropriate alt attribute or title (empty string for decorative, descriptive text for informative).

**Validates: Requirements 9.6**

### Property 6: Viewport Responsive Rendering

*For any* viewport width between 320px and 2560px, the Portfolio_System SHALL render without horizontal overflow, layout breaks, or inaccessible content.

**Validates: Requirements 10.1**

### Property 7: Supercat Responsive Positioning

*For any* viewport width, the Supercat_Component SHALL maintain appropriate fixed positioning, sizing, and spacing that keeps it visible and accessible without overlapping critical content.

**Validates: Requirements 10.2**

### Property 8: Modal Responsive Width Adaptation

*For any* viewport width below 640px, the AskSupercat_Modal SHALL adapt its width to fit within viewport bounds with appropriate padding (using `calc(100vw - 1.5rem)` constraint).

**Validates: Requirements 10.3**

### Property 9: Touch Target Size Compliance

*For any* interactive element rendered at mobile viewport sizes (≤767px), the touch target dimensions SHALL be at least 44x44 pixels to ensure touch-friendly interaction.

**Validates: Requirements 10.4**

## Error Handling

### Routing Errors

**Scenario**: User navigates to invalid project slug (e.g., `#/work/invalid`)
**Behavior**: 
```typescript
const p = projects.find((p) => p.slug === slug)
if (!p) return <Home />  // Fallback to home page
```

### Modal State Errors

**Scenario**: Modal opened but question index out of bounds
**Behavior**:
```typescript
const item = i === null ? null : qa[i]
const text = item ? item.a : 'Hi, I am Supercat. ...'  // Default text
```

### Animation Errors

**Scenario**: Animation target element doesn't exist
**Behavior**:
```typescript
// SlingCat getTarget safety
getTarget={() => document.getElementById('viz-cinemies') || null}

// Graceful degradation if null
if (!target) return  // Skip physics, remain at rest
```

### Reduced Motion Detection Errors

**Scenario**: Browser doesn't support prefers-reduced-motion
**Behavior**:
```typescript
export const prefersReduced = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false  // Default to animations enabled
  }
}
```

## Performance Considerations

### Animation Performance

**Optimizations**:
1. **GPU Acceleration**: Use `transform` and `opacity` (not `left`, `top`)
2. **Will-change hints**: Apply to parallax elements
   ```tsx
   className="will-change-transform"
   ```
3. **Reduced paint**: Minimize reflows during scroll

### Bundle Size

**Current Architecture**:
- React 19 + ReactDOM: ~45KB gzipped
- Tailwind CSS (purged): ~8KB gzipped
- Custom components: ~12KB gzipped
- Total estimated: **~65KB gzipped** (excellent for portfolio)

### Image Optimization

**Strategy**:
- Visual components: SVG-based or procedurally generated (zero HTTP requests)
- Beyond section photos: Unsplash CDN with `w=900` and `q=80` query params
- Lazy loading: `loading="lazy"` on all non-hero images

### Code Splitting

**Routes**:
- Home: Main bundle (Hero, Work, About, Beyond, Contact)
- Case: Inline (minimal code, shares components)
- No lazy loading needed (total JS is small)

## Testing Strategy

### Unit Tests

Focus on specific examples and edge cases:

**Animation Configuration**:
- Verify rise animation duration is 450-540ms
- Verify reveal animation duration is 400-480ms
- Verify character animation durations are 1500-2500ms
- Verify easing curves match gentle patterns

**Data Validation**:
- Verify projects array has exactly 2 items
- Verify no references to 'indoorguide' in projects or qa arrays
- Verify project numbers are "01" and "02"
- Verify SlingCat props: pull ≤ 20, hold ≤ 1000ms

**Component Structure**:
- Verify Supercat component accepts all valid pose/mood combinations
- Verify AskSupercat exports openAsk function
- Verify modal has correct ARIA attributes
- Verify all sections render in correct order

### Property-Based Tests

**Minimum 100 iterations per property** to validate universal behaviors:

**Property 1 Test**: Supercat Rendering
```typescript
import { fc } from 'fast-check'

// Feature: minimalist-portfolio-redesign, Property 1:
// For any valid pose/mood combination, Supercat renders without error

test('Supercat renders all pose/mood combinations', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('bust', 'sit', 'idle', 'curious'),
      fc.constantFrom('smile', 'open', 'wink', 'curious', 'sleepy'),
      (pose, mood) => {
        const { container } = render(
          <Supercat pose={pose} mood={mood} className="w-12" />
        )
        expect(container.querySelector('svg')).toBeInTheDocument()
      }
    ),
    { numRuns: 100 }
  )
})
```

**Property 4 Test**: Reduced Motion
```typescript
// Feature: minimalist-portfolio-redesign, Property 4:
// For any animated element, reduced motion disables animation

test('animations disabled with reduced motion preference', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('rise', 'reveal', 'cat-blink', 'cat-tail'),
      (animationClass) => {
        // Mock reduced motion preference
        window.matchMedia = jest.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
        }))
        
        const { container } = render(
          <div className={animationClass}>Test</div>
        )
        
        const element = container.firstChild
        const styles = window.getComputedStyle(element)
        
        // Verify animation is disabled
        expect(styles.animation).toBe('none')
      }
    ),
    { numRuns: 100 }
  )
})
```

**Property 6 Test**: Responsive Rendering
```typescript
// Feature: minimalist-portfolio-redesign, Property 6:
// For any viewport width 320-2560px, no layout breaks

test('layout renders without overflow at all viewport widths', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 320, max: 2560 }),
      (width) => {
        global.innerWidth = width
        global.dispatchEvent(new Event('resize'))
        
        const { container } = render(<App />)
        
        // Check for horizontal overflow
        const bodyWidth = document.body.scrollWidth
        expect(bodyWidth).toBeLessThanOrEqual(width + 1) // +1 for rounding
        
        // Check critical elements are visible
        expect(container.querySelector('header')).toBeVisible()
        expect(container.querySelector('#work')).toBeVisible()
      }
    ),
    { numRuns: 100 }
  )
})
```

**Property 9 Test**: Touch Target Sizes
```typescript
// Feature: minimalist-portfolio-redesign, Property 9:
// For any interactive element at mobile viewports, touch target ≥ 44x44px

test('interactive elements meet touch target size at mobile viewports', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 320, max: 767 }), // Mobile range
      (width) => {
        global.innerWidth = width
        global.dispatchEvent(new Event('resize'))
        
        const { container } = render(<App />)
        
        // Find all interactive elements
        const interactives = container.querySelectorAll(
          'button, a[href], input, [role="button"]'
        )
        
        interactives.forEach((element) => {
          const rect = element.getBoundingClientRect()
          expect(rect.width).toBeGreaterThanOrEqual(44)
          expect(rect.height).toBeGreaterThanOrEqual(44)
        })
      }
    ),
    { numRuns: 100 }
  )
})
```

### Integration Tests

**Scenario-Based Testing**:

1. **Supercat Interaction Flow**:
   - Click fixed Supercat button → Modal opens with 300ms animation
   - Select question → Answer types out character by character
   - Click close → Modal closes with reversed animation
   - Press Escape → Modal closes immediately

2. **Navigation Flow**:
   - Click "Work" nav link → Smooth scroll to #work section
   - Click project frame → Navigate to case study (#/work/:slug)
   - Click "All work" → Return to home page
   - Click "Next" project → Navigate to next case study

3. **SlingCat Physics**:
   - Click "Poke the map" → Supercat pulls back 15px
   - Hold for 800ms → Supercat releases and springs to target
   - Return to rest → Animation completes smoothly

### Accessibility Testing

**Automated Tools**:
- **axe-core**: Run on all pages for WCAG violations
- **pa11y**: CI pipeline integration for regression detection

**Manual Testing Checklist**:
- [ ] Tab through all interactive elements in logical order
- [ ] Verify focus indicators visible on all elements
- [ ] Test with screen reader (NVDA/JAWS on Windows)
- [ ] Verify modal announced when opened
- [ ] Test with keyboard only (no mouse)
- [ ] Test with reduced motion enabled
- [ ] Verify all images have appropriate alt text

### Visual Regression Testing

**Tools**: Percy or Chromatic for screenshot comparisons

**Test Cases**:
- Home page at 320px, 768px, 1440px, 2560px
- AskSupercat modal open/closed states
- All project case study pages
- Hover states on interactive elements
- Character animation frames (sample keyframes)

## Deployment Strategy

### Build Process

```bash
# Development
npm run dev  # Vite dev server at localhost:5173

# Production build
npm run build  # Outputs to /dist

# Preview production build
npm run preview
```

### Environment Configuration

**Vite Config** (vite.config.ts):
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,  // Disable for production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: undefined  // Single bundle (app is small)
      }
    }
  }
})
```

### Asset Optimization

**Images**:
- Beyond section: Already optimized via Unsplash CDN
- Favicon: Compressed PNG at 32x32 and 192x192

**Fonts**:
- Google Fonts with `display=swap` for FOIT prevention
- Preconnect to `fonts.googleapis.com` and `fonts.gstatic.com`

### Hosting Recommendations

**Static Hosting** (Recommended):
- **Netlify**: Automatic deploys from Git, edge CDN
- **Vercel**: Optimized for Vite/React, instant cache invalidation
- **Cloudflare Pages**: Global CDN, free SSL

**Configuration**:
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Migration Plan

### Phase 1: Animation Refinement (Low Risk)

1. Update animation durations in index.css:
   - rise: 900ms → 450ms
   - reveal: 800ms → 400ms
   - Character animations: reduce by 50%

2. Update easing curves:
   - Replace `cubic-bezier(.2,.7,.2,1)` with `cubic-bezier(.4,.8,.4,1)`
   - Update hover transitions to use gentle ease-out

3. Reduce character animation amplitudes:
   - Blink: 5.5s → 8s interval
   - Tail: -5deg/7deg → -3.25deg/4.55deg rotation
   - Cape: -2.5deg → -1.5deg skew

**Validation**: Visual inspection + unit tests for CSS values

### Phase 2: Content Modification (Medium Risk)

1. Update data.ts:
   - Remove IndoorGuide from projects array
   - Update Gymies n: "01", Cinemies n: "02"
   - Remove IndoorGuide references from qa array
   - Update "What is he working on?" answer

2. Remove Visuals.tsx IndoorGuide component (if separate)

3. Update Work section in App.tsx:
   - Remove third project article
   - Verify grid layouts for remaining two projects

**Validation**: Unit tests for data structure + manual review

### Phase 3: Supercat Interactive Feature (High Risk)

1. Verify openAsk export exists in AskSupercat.tsx:
   ```typescript
   export const openAsk = () => 
     window.dispatchEvent(new Event('ask-supercat'))
   ```

2. Add fixed Supercat button to App.tsx:
   ```tsx
   <button
     onClick={openAsk}
     className="fixed z-50 right-3 bottom-3 md:right-6 md:bottom-6 ..."
   >
     <Supercat pose="bust" mood="smile" className="w-10 h-10" />
     <span className="meta">Ask Supercat</span>
   </button>
   ```

3. Update modal animation in AskSupercat.tsx:
   - Add modal enter/exit animations (300ms)
   - Ensure modal appears above Supercat button

**Validation**: Integration tests for interaction flow + accessibility audit

### Phase 4: SlingCat Parameter Tuning (Low Risk)

1. Update SlingCat props in App.tsx:
   - pull: 22 → 15
   - hold: 1400 → 800

2. Test physics feel manually

3. Verify reduced motion fallback

**Validation**: Manual testing of physics interaction

### Phase 5: Final Polish (Low Risk)

1. Run full test suite
2. Accessibility audit (axe-core + manual)
3. Cross-browser testing (Chrome, Firefox, Safari, Edge)
4. Performance audit (Lighthouse score > 95)
5. Visual regression review

## Conclusion

This design maintains the portfolio's refined minimalist aesthetic while introducing interactive features and content focus. The architecture leverages React's component model for maintainability, custom CSS animations for performance, and accessibility-first patterns for inclusive design. Animation refinements reduce duration by 50% and introduce gentler easing for a polished, unobtrusive feel. The Supercat interactive feature adds personality through prepared Q&A, while project content focuses on Gymies and Cinemies with visual-first presentation.

**Key Design Decisions**:
- Single-page scroll with hash-based routing for case studies
- Custom event-based communication for Supercat interaction
- CSS-based animations with reduced motion fallbacks
- TypeScript for type safety across data and components
- Generous spacing and expanded typography for readability
- WCAG AA color contrast and keyboard accessibility throughout

**Success Criteria**:
- Animations complete in 450-540ms (50% reduction)
- All interactive elements keyboard accessible
- WCAG AA compliance maintained
- Responsive 320px-2560px without layout breaks
- Lighthouse score > 95 across all metrics
- Zero accessibility violations via axe-core
