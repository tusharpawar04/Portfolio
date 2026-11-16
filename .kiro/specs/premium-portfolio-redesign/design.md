# Design Document: Premium Portfolio Redesign

## Overview

This design transforms the existing minimalist portfolio into a premium, highly animated experience inspired by yinyeeho.com. The redesign integrates professional resume data, playful cat-themed interactions, and modern web animations while maintaining accessibility and performance standards.

**Key Design Principles:**
- Premium feel through generous use of animations and rounded UI elements
- Playful personality through cat-themed interactions
- Professional credibility through integrated resume data
- Performance-conscious animations using GPU-accelerated properties
- Responsive design optimized for all device sizes

## Architecture

### Component Hierarchy

```
App
├── Nav (sticky header with logo and navigation)
├── Hero (compact, animated introduction)
├── Work (enhanced project showcase)
├── About (rich personal background with resume data)
├── Experience (work history timeline/cards)
├── Skills (categorized tech stack display)
├── Beyond (personal interests - existing)
├── Contact (existing with enhancements)
├── Footer (playful with nuanced interactions)
└── Interactive Elements
    ├── SupercatButton (floating, animated)
    ├── SupercatModal (toggleable chat interface)
    └── CatAnimations (dynamic, time-based variations)
```

### Data Flow

```
data.ts
├── Projects (existing: Gymies, Cinemies)
├── Q&A (existing: Supercat responses)
└── Resume Data (new)
    ├── Education
    ├── Experience
    ├── Achievements
    └── Skills (categorized)
```

### State Management

```typescript
// Local component state for UI interactions
- Navigation: menuOpen (boolean), currentSection (string)
- SupercatModal: isOpen (boolean), toggleable
- CatAnimations: currentVariation (string), lastChangeTime (number)
- ScrollAnimations: intersectedSections (Set<string>)
```

## Components and Interfaces

This section defines the TypeScript interfaces and component APIs for all major components in the portfolio redesign.

### Core Component Interfaces

```typescript
// Hero Section
interface HeroProps {
  className?: string;
}

// Navigation
interface NavItem {
  label: string;
  href: string;
  onClick: () => void;
}

interface NavProps {
  items: NavItem[];
  currentSection?: string;
}

// About Section
interface AboutProps {
  personal: PersonalInfo;
  achievements: Achievement[];
  resumeUrl: string;
}

// Work Experience
interface ExperienceProps {
  experiences: WorkExperience[];
  education: Education;
  layout: 'timeline' | 'cards';
}

// Skills
interface SkillsProps {
  skills: SkillSet;
  layout: 'grid' | 'cloud';
}

// Supercat Components
interface SupercatButtonProps {
  onClick: () => void;
  className?: string;
}

interface SupercatModalProps {
  isOpen: boolean;
  onClose: () => void;
  qa: QA[];
}

// Footer
interface FooterProps {
  socialLinks: SocialLink[];
  showEasterEgg?: boolean;
}

// Animation Hooks
interface UseRevealAnimationReturn {
  ref: React.RefObject<HTMLElement>;
  isVisible: boolean;
}

interface UseCatAnimationReturn {
  currentAnimation: CatAnimation;
  transitionToAnimation: (animation: CatAnimation) => void;
}
```

### Component API Reference

**Hero Component:**
```typescript
const Hero: React.FC<HeroProps> = ({ className }) => {
  // Renders compact hero section with animations
  // Returns: JSX.Element
};
```

**Navigation Component:**
```typescript
const Nav: React.FC<NavProps> = ({ items, currentSection }) => {
  // Renders sticky navigation with animated pills
  // Returns: JSX.Element
};
```

**About Component:**
```typescript
const About: React.FC<AboutProps> = ({ personal, achievements, resumeUrl }) => {
  // Renders two-column about section with photo and resume data
  // Returns: JSX.Element
};
```

**Experience Component:**
```typescript
const Experience: React.FC<ExperienceProps> = ({ experiences, education, layout }) => {
  // Renders work experience in timeline or card layout
  // Returns: JSX.Element
};
```

**Skills Component:**
```typescript
const Skills: React.FC<SkillsProps> = ({ skills, layout }) => {
  // Renders categorized skills in grid or cloud layout
  // Returns: JSX.Element
};
```

**SupercatButton Component:**
```typescript
const SupercatButton: React.FC<SupercatButtonProps> = ({ onClick, className }) => {
  // Renders floating Supercat button with bob animation
  // Returns: JSX.Element
};
```

**SupercatModal Component:**
```typescript
const SupercatModal: React.FC<SupercatModalProps> = ({ isOpen, onClose, qa }) => {
  // Renders toggleable modal with Q&A interface
  // Returns: JSX.Element | null
};
```

**Footer Component:**
```typescript
const Footer: React.FC<FooterProps> = ({ socialLinks, showEasterEgg }) => {
  // Renders footer with social links and optional easter egg
  // Returns: JSX.Element
};
```

### Custom Hooks

**useRevealAnimation:**
```typescript
const useRevealAnimation = (threshold?: number): UseRevealAnimationReturn => {
  // Provides IntersectionObserver-based reveal animation
  // Parameters:
  //   - threshold: Intersection threshold (default: 0.1)
  // Returns: { ref, isVisible }
};
```

**useCatAnimationRotation:**
```typescript
const useCatAnimationRotation = (): UseCatAnimationReturn => {
  // Manages automatic cat animation rotation every 30-60s
  // Returns: { currentAnimation, transitionToAnimation }
};
```

**useBreakpoint:**
```typescript
const useBreakpoint = (): 'mobile' | 'tablet' | 'desktop' => {
  // Detects current responsive breakpoint
  // Returns: Current breakpoint string
};
```

**useModalToggle:**
```typescript
const useModalToggle = (initialState?: boolean) => {
  // Manages modal open/close state with outside click detection
  // Returns: { isOpen, open, close, toggle, modalRef }
};
```

## Component Design

### 1. Hero Section

**Purpose:** Provide a compact, visually engaging introduction that quickly communicates value proposition.

**Layout:**
```
┌────────────────────────────────────────┐
│  [Logo: Tushar P. 🐱]    [Nav Pills]  │ ← Sticky Header
├────────────────────────────────────────┤
│                                        │
│  I build thoughtful                   │ ← Large heading
│  digital products.                    │   (clamp 4-10rem)
│                                        │
│  Supporting text about full-stack     │ ← Body copy
│  applications and experiences         │   (22px)
│                                        │
│  View work ↓                          │ ← CTA link
│                                        │
│              [Supercat on ledge] ───→ │ ← Decorative
└────────────────────────────────────────┘
  (Max height: 100vh)
```

**TypeScript Interface:**
```typescript
interface HeroProps {
  className?: string;
}

// Animation configuration
const HERO_ANIMATIONS = {
  headingDelay: 0,
  bodyDelay: 0.15,
  ctaDelay: 0.3,
  duration: 0.5,
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;
```

**Animations:**
- Elements fade + slide up on load (0.5s duration)
- Heading: 0s delay
- Body: 0.15s delay
- CTA: 0.3s delay
- Parallax on background elements (transform based on scroll)

**Constraints:**
- Maximum height: 100vh
- Logo must include cat icon/element
- Must remain readable at all breakpoints

### 2. Logo & Navigation

**Purpose:** Provide persistent, attention-grabbing navigation with playful branding.

**Logo Design:**
```tsx
<a href="#/" className="logo">
  <span className="cat-icon" aria-hidden>🐱</span>
  <span>Tushar P.</span>
</a>
```

**Navigation Structure:**
```tsx
interface NavItem {
  label: string;
  href: string;
  onClick: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Work', href: '#work', onClick: () => goTo('work') },
  { label: 'About', href: '#about', onClick: () => goTo('about') },
  { label: 'Experience', href: '#experience', onClick: () => goTo('experience') },
  { label: 'Skills', href: '#skills', onClick: () => goTo('skills') },
  { label: 'Beyond', href: '#beyond', onClick: () => goTo('beyond') },
  { label: 'Contact', href: '#contact', onClick: () => goTo('contact') },
];
```

**Styling:**
- Border-radius: 20px (pill-shaped)
- Padding: 0.5rem 1.25rem
- Background: bg-cloud/95 with backdrop blur
- Border: 1px solid border-rule

**Interactions:**
- Hover: scale(1.05) + color shift (cobalt) in 0.2s
- Active: scale(0.98)
- Smooth scroll to target sections
- Sticky positioning (top: 0, z-index: 40)

### 3. About Section

**Purpose:** Showcase personal background, achievements, and skills with integrated resume data.

**Layout (Desktop):**
```
┌─────────────────────────────────────────────┐
│ About                                       │
├──────────────┬──────────────────────────────┤
│              │  Bio paragraph with personal │
│  [Photo]     │  introduction and passion    │
│   320x400    │                              │
│              │  ┌───────────────────────┐   │
│              │  │ Download Resume ↓     │   │
│              │  └───────────────────────┘   │
├──────────────┴──────────────────────────────┤
│  Achievements Grid                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ BAH 2026 │ │ MetaX    │ │ IDE Boot │   │
│  │ Finalist │ │ Finalist │ │ camp     │   │
│  └──────────┘ └──────────┘ └──────────┘   │
│  ┌──────────┐                              │
│  │ TCS      │                              │
│  │ Selected │                              │
│  └──────────┘                              │
└─────────────────────────────────────────────┘
```

**Data Structure:**
```typescript
interface Achievement {
  title: string;
  year: string;
  category: 'competition' | 'selection' | 'program';
}

const ACHIEVEMENTS: Achievement[] = [
  { title: 'BAH 2026 Finalist', year: '2026', category: 'competition' },
  { title: 'MetaXOpen Finalist', year: '2026', category: 'competition' },
  { title: 'IDE Bootcamp', year: '2025', category: 'program' },
  { title: 'TCS Selection', year: '2026', category: 'selection' },
];
```

**Animations:**
- Fade in on scroll intersection
- Stagger achievement cards: delay = index * 0.12s
- Achievement card hover: translateY(-4px) + shadow increase

**Accessibility:**
- Photo alt text: "Tushar Pawar, software developer"
- Download button: aria-label="Download resume PDF"
- Achievement cards: semantic list structure

### 4. Work Experience Section

**Purpose:** Display professional work history in an organized, visually appealing format.

**Layout Options:**

**Option A - Timeline (Recommended):**
```
Experience
──────────────────────────
2026  ● SD Foods
      Software Developer Intern
      March - April 2026
      • Achievement 1
      • Achievement 2
      [SD Foods Logo]
──────────────────────────
2023  ● Oriental Institute
      B.Tech Computer Science
      2023 - 2027 (Expected)
      GPA: 7.55
──────────────────────────
```

**Option B - Card Grid:**
```
┌────────────────────┐  ┌────────────────────┐
│ [SD Foods Logo]    │  │ [TCS Logo]         │
│ Software Developer │  │ Selected for TCS   │
│ Intern             │  │ Digital            │
│ March-April 2026   │  │ 2026               │
│ • Key achievement  │  │ • Achievement      │
└────────────────────┘  └────────────────────┘
```

**Data Structure:**
```typescript
interface WorkExperience {
  company: string;
  position: string;
  duration: string;
  startDate: string;
  endDate: string;
  achievements: string[];
  logo?: string;
  type: 'internship' | 'fulltime' | 'freelance';
}

const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'SD Foods',
    position: 'Software Developer Intern',
    duration: 'March - April 2026',
    startDate: '2026-03',
    endDate: '2026-04',
    achievements: [
      'Developed full-stack features',
      'Collaborated with cross-functional team',
    ],
    type: 'internship',
  },
];

interface Education {
  institution: string;
  degree: string;
  field: string;
  duration: string;
  gpa: string;
}

const EDUCATION: Education = {
  institution: 'Oriental Institute',
  degree: 'B.Tech',
  field: 'Computer Science',
  duration: '2023 - 2027',
  gpa: '7.55',
};
```

**Animations:**
- Scroll-triggered reveal (fade + slide up)
- Hover on cards: scale(1.02) + shadow increase
- Stagger timeline items: delay = index * 0.15s

**Company Strip (if using timeline):**
```tsx
<div className="company-strip">
  <img src="/logos/sd-foods.svg" alt="SD Foods" />
  <img src="/logos/tcs.svg" alt="TCS" />
</div>
```

### 5. Skills & Tech Stack

**Purpose:** Display technical capabilities organized by category with visual appeal.

**Layout:**
```
Skills
─────────────────────────────────────
Languages
┌─────┐ ┌─────┐ ┌─────┐
│ ☕  │ │ JS  │ │ 🐍  │
│Java │ │     │ │Pythn│
└─────┘ └─────┘ └─────┘

Frameworks
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│React│ │Node │ │Exprs│ │Fast │
│     │ │ .js │ │     │ │ API │
└─────┘ └─────┘ └─────┘ └─────┘

Tools & Platforms
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│ Git │ │Dockr│ │ K8s │ │Mongo│
└─────┘ └─────┘ └─────┘ └─────┘
┌─────┐ ┌─────┐
│PgSQL│ │MySQL│
└─────┘ └─────┘
```

**Data Structure:**
```typescript
interface Skill {
  name: string;
  icon?: string; // emoji or icon component
  category: 'language' | 'framework' | 'tool';
}

const SKILLS: Skill[] = [
  // Languages
  { name: 'Java', icon: '☕', category: 'language' },
  { name: 'JavaScript', icon: '⚡', category: 'language' },
  { name: 'Python', icon: '🐍', category: 'language' },
  
  // Frameworks
  { name: 'React', category: 'framework' },
  { name: 'Node.js', category: 'framework' },
  { name: 'Express', category: 'framework' },
  { name: 'FastAPI', category: 'framework' },
  
  // Tools
  { name: 'Git', category: 'tool' },
  { name: 'Docker', category: 'tool' },
  { name: 'Kubernetes', category: 'tool' },
  { name: 'MongoDB', category: 'tool' },
  { name: 'PostgreSQL', category: 'tool' },
  { name: 'MySQL', category: 'tool' },
];
```

**Styling:**
- Skill cards: 80x80px minimum
- Border-radius: 16px
- Background: cloud color
- Border: 1px solid rule color
- Icon: 24px size

**Animations:**
- Scroll-triggered fade-in with stagger (delay = index * 0.08s)
- Hover: scale(1.1) + rotate(5deg) + shadow, 0.2s cubic-bezier
- Active: scale(0.95)

**Accessibility:**
- Each skill has proper text label
- Icons are decorative (aria-hidden) with text backup

### 6. Supercat Interactive Feature

**Purpose:** Provide engaging, playful interaction for learning about Tushar.

**Current State vs. Enhanced:**
```
Current: Click button → Modal opens (stays open)
Enhanced: Click button → Modal opens/closes (toggle)
          Click outside → Modal closes
```

**Component Structure:**
```tsx
interface SupercatModalProps {
  isOpen: boolean;
  onClose: () => void;
  qa: QA[];
}

const SupercatModal: React.FC<SupercatModalProps> = ({ isOpen, onClose, qa }) => {
  // Modal implementation
};

const SupercatButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="supercat-float-btn"
      aria-label="Chat with Supercat"
    >
      <Supercat pose="bust" mood="smile" />
    </button>
  );
};
```

**Modal Animations:**
```typescript
const MODAL_ANIMATIONS = {
  enter: {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    animate: { y: '100%', opacity: 0 },
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
  },
};
```

**Positioning:**
```css
.supercat-float-btn {
  position: fixed;
  bottom: 5rem;
  right: 1.5rem;
  width: 5rem;
  height: 5rem;
  z-index: 40;
  
  /* Floating animation */
  animation: bob 3s ease-in-out infinite;
}

@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

**Modal Styling:**
```css
.supercat-modal {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 80vh;
  background: var(--cloud);
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15);
  z-index: 50;
}
```

**Interaction Logic:**
```typescript
const [isModalOpen, setIsModalOpen] = useState(false);

const toggleModal = () => setIsModalOpen(!isModalOpen);
const closeModal = () => setIsModalOpen(false);

// Close on outside click
useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (isModalOpen && modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeModal();
    }
  };
  
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [isModalOpen]);
```

### 7. Cat Animations System

**Purpose:** Create dynamic, playful interactions that change over time to maintain engagement.

**Animation Variations:**
```typescript
type CatAnimation = 
  | 'blink'        // Existing: subtle eye blink
  | 'tail-sway'    // Existing: gentle tail movement
  | 'hop'          // Existing: small jump
  | 'sleep'        // New: resting with closed eyes
  | 'stretch'      // New: stretching motion
  | 'paw-wave'     // New: playful wave
  | 'head-tilt'    // New: curious head movement
  | 'cape-flutter' // Existing: cape movement

interface CatAnimationConfig {
  name: CatAnimation;
  duration: number; // seconds
  easing: string;
  probability: number; // 0-1, for random selection
}

const CAT_ANIMATIONS: CatAnimationConfig[] = [
  { name: 'blink', duration: 0.3, easing: 'ease-in-out', probability: 0.3 },
  { name: 'tail-sway', duration: 2, easing: 'cubic-bezier(0.45, 0, 0.55, 1)', probability: 0.25 },
  { name: 'sleep', duration: 4, easing: 'ease-in-out', probability: 0.1 },
  { name: 'stretch', duration: 1.5, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', probability: 0.15 },
  { name: 'paw-wave', duration: 0.8, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', probability: 0.15 },
  { name: 'head-tilt', duration: 0.6, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', probability: 0.05 },
];
```

**Animation Rotation Logic:**
```typescript
const useCatAnimationRotation = () => {
  const [currentAnimation, setCurrentAnimation] = useState<CatAnimation>('blink');
  const [lastChangeTime, setLastChangeTime] = useState(Date.now());
  
  useEffect(() => {
    // Check every 5 seconds
    const interval = setInterval(() => {
      const elapsed = (Date.now() - lastChangeTime) / 1000;
      const shouldChange = elapsed >= 30 && Math.random() > 0.5; // 30-60s window
      
      if (shouldChange || elapsed >= 60) {
        // Select random animation based on probability
        const randomValue = Math.random();
        let cumulativeProbability = 0;
        
        for (const anim of CAT_ANIMATIONS) {
          cumulativeProbability += anim.probability;
          if (randomValue <= cumulativeProbability) {
            setCurrentAnimation(anim.name);
            setLastChangeTime(Date.now());
            break;
          }
        }
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [lastChangeTime]);
  
  return currentAnimation;
};
```

**Reduced Motion Support:**
```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Only show subtle blink, disable rotation
  return 'blink';
}
```

**SVG Animation Implementation:**
```tsx
// Example: Stretch animation
const StretchAnimation = () => (
  <g className="cat-stretch">
    <animateTransform
      attributeName="transform"
      type="scale"
      values="1 1; 1.1 0.95; 1 1"
      dur="1.5s"
      repeatCount="1"
    />
  </g>
);

// Example: Paw wave
const PawWave = () => (
  <g className="cat-paw-wave">
    <animateTransform
      attributeName="transform"
      type="rotate"
      values="0 100 130; 20 100 130; -20 100 130; 0 100 130"
      dur="0.8s"
      repeatCount="1"
    />
  </g>
);
```

### 8. Footer

**Purpose:** Provide social links and additional navigation with playful interactions.

**Layout:**
```
┌─────────────────────────────────────────┐
│                                         │
│  Connect                                │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│  │ LI  │ │ GH  │ │ TW  │ │ EM  │      │
│  └─────┘ └─────┘ └─────┘ └─────┘      │
│                                         │
│  © 2025 Tushar Pawar | Back to top ↑  │
│                                         │
│  [Hidden easter egg: Sleeping cat]     │
└─────────────────────────────────────────┘
```

**Social Links Structure:**
```typescript
interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  hoverColor: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  { platform: 'LinkedIn', url: 'https://linkedin.com/in/username', icon: '💼', hoverColor: '#0077B5' },
  { platform: 'GitHub', url: 'https://github.com/username', icon: '🐙', hoverColor: '#333' },
  { platform: 'Twitter', url: 'https://twitter.com/username', icon: '🐦', hoverColor: '#1DA1F2' },
  { platform: 'Email', url: 'mailto:hello@tusharpawar.dev', icon: '📧', hoverColor: '#EA4335' },
];
```

**Animations:**
```css
.footer-link {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-link:hover {
  transform: translateY(-4px) scale(1.05);
  color: var(--hover-color);
}

.footer-link:active {
  transform: translateY(-2px) scale(1.02);
}
```

**Easter Egg:**
```tsx
// Hidden cat that appears on triple-click of copyright text
const [easterEggVisible, setEasterEggVisible] = useState(false);
const clickCount = useRef(0);

const handleCopyrightClick = () => {
  clickCount.current += 1;
  
  if (clickCount.current === 3) {
    setEasterEggVisible(true);
    setTimeout(() => setEasterEggVisible(false), 3000);
    clickCount.current = 0;
  }
  
  setTimeout(() => { clickCount.current = 0; }, 1000);
};

// Render sleeping cat with fade-in animation
{easterEggVisible && (
  <div className="easter-egg">
    <Supercat pose="sleep" className="w-24" />
  </div>
)}
```

### 9. Responsive Design

**Breakpoints:**
```typescript
const BREAKPOINTS = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
} as const;
```

**Layout Adaptations:**

**Mobile (< 768px):**
- Navigation: Hamburger menu
- Hero: Stacked, reduced font sizes
- About: Single column, photo at top
- Experience: Vertical timeline
- Skills: 2-column grid
- Animations: Simplified (reduced distance, shorter duration)
- Touch targets: Minimum 44x44px

**Tablet (768px - 1023px):**
- Navigation: Horizontal, potentially scrollable
- Hero: Optimized spacing
- About: 2-column layout
- Experience: Cards in 2-column grid
- Skills: 3-column grid
- Animations: Full animations with slightly reduced complexity

**Desktop (1024px+):**
- Navigation: Full horizontal display
- Hero: Multi-column with decorative elements
- About: Full 2-column layout with large photo
- Experience: Timeline or 3-column card grid
- Skills: 4-5 column grid
- Animations: Full animation suite

**Responsive Utilities:**
```tsx
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  useEffect(() => {
    const mobile = window.matchMedia(BREAKPOINTS.mobile);
    const tablet = window.matchMedia(BREAKPOINTS.tablet);
    
    const updateBreakpoint = () => {
      if (mobile.matches) setBreakpoint('mobile');
      else if (tablet.matches) setBreakpoint('tablet');
      else setBreakpoint('desktop');
    };
    
    updateBreakpoint();
    
    mobile.addEventListener('change', updateBreakpoint);
    tablet.addEventListener('change', updateBreakpoint);
    
    return () => {
      mobile.removeEventListener('change', updateBreakpoint);
      tablet.removeEventListener('change', updateBreakpoint);
    };
  }, []);
  
  return breakpoint;
};
```

### 10. Animation System

**Purpose:** Provide consistent, performant animations throughout the portfolio.

**Core Animation Utilities:**
```typescript
// Intersection Observer hook for scroll-triggered animations
const useRevealAnimation = (threshold = 0.1) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);
  
  return { ref, isVisible };
};

// Stagger animation utility
const getStaggerDelay = (index: number, baseDelay = 0, increment = 0.1) => {
  return baseDelay + (index * increment);
};
```

**Animation CSS Variables:**
```css
:root {
  --anim-duration-fast: 0.2s;
  --anim-duration-normal: 0.3s;
  --anim-duration-slow: 0.5s;
  
  --anim-ease-standard: cubic-bezier(0.16, 1, 0.3, 1);
  --anim-ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --anim-ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Reduced motion overrides */
  --anim-translate-distance: 30px;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --anim-duration-fast: 0.01s;
    --anim-duration-normal: 0.01s;
    --anim-duration-slow: 0.01s;
    --anim-translate-distance: 5px;
  }
  
  * {
    animation-duration: 0.01s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01s !important;
  }
}
```

**Common Animation Classes:**
```css
.fade-slide-up {
  opacity: 0;
  transform: translateY(var(--anim-translate-distance));
  transition: opacity var(--anim-duration-slow) var(--anim-ease-standard),
              transform var(--anim-duration-slow) var(--anim-ease-standard);
}

.fade-slide-up.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.hover-lift {
  transition: transform var(--anim-duration-fast) var(--anim-ease-standard),
              box-shadow var(--anim-duration-fast) var(--anim-ease-standard);
}

.hover-lift:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.hover-scale {
  transition: transform var(--anim-duration-fast) var(--anim-ease-bounce);
}

.hover-scale:hover {
  transform: scale(1.05);
}
```

## Design Specifications

### Visual Style Guide

**Rounded Corners:**
- Small elements (buttons, tags): 16px
- Medium elements (cards, inputs): 20px
- Large elements (modals, sections): 24px

**Spacing Scale:**
```typescript
const SPACING = {
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
} as const;
```

**Section Padding:**
- Mobile: 2rem vertical
- Tablet: 2.5rem vertical
- Desktop: 3rem vertical

**Typography Scale:**
```css
:root {
  /* Headings */
  --text-display: clamp(4rem, 12vw, 10rem);
  --text-h1: clamp(3rem, 8vw, 6rem);
  --text-h2: clamp(2rem, 5vw, 4rem);
  --text-h3: clamp(1.5rem, 3vw, 2.5rem);
  
  /* Body */
  --text-body-lg: 22px;
  --text-body: 17px;
  --text-body-sm: 15px;
  --text-meta: 13px;
  
  /* Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-semibold: 600;
  --font-bold: 700;
}
```

**Color System:**
```typescript
const COLORS = {
  // Primary palette (existing)
  ink: '#191d27',
  cobalt: '#5969df',
  apricot: '#f2a17d',
  cloud: '#f6f7fa',
  
  // Supporting colors
  rule: 'rgba(25, 29, 39, 0.08)',
  mute: 'rgba(25, 29, 39, 0.6)',
  
  // Depth effects (new)
  shadow: {
    sm: '0 2px 8px rgba(25, 29, 39, 0.08)',
    md: '0 8px 24px rgba(25, 29, 39, 0.12)',
    lg: '0 16px 48px rgba(25, 29, 39, 0.16)',
  },
  
  gradient: {
    subtle: 'linear-gradient(180deg, rgba(246, 247, 250, 0) 0%, rgba(246, 247, 250, 1) 100%)',
    brand: 'linear-gradient(135deg, #5969df 0%, #7d8aed 100%)',
  },
} as const;
```

### Accessibility Requirements

**Keyboard Navigation:**
```tsx
// All interactive elements must be keyboard accessible
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
/>

// Skip links
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

**Focus Styles:**
```css
:focus-visible {
  outline: 3px solid var(--cobalt);
  outline-offset: 2px;
  border-radius: 4px;
}
```

**ARIA Labels:**
```tsx
// Navigation
<nav aria-label="Primary navigation">...</nav>

// Buttons
<button aria-label="Open menu" aria-expanded={isOpen}>...</button>

// Decorative images
<img src="cat.svg" alt="" aria-hidden="true" />

// Meaningful images
<img src="project.png" alt="Gymies dashboard interface showing member management" />
```

**Screen Reader Support:**
```tsx
// Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {notification}
</div>

// Hidden text for context
<span className="sr-only">Opens in new window</span>
```

### Performance Optimization

**Animation Performance:**
```typescript
// Only animate transform and opacity (GPU-accelerated)
const PERFORMANT_PROPERTIES = ['transform', 'opacity'];

// Avoid animating these (trigger layout/paint)
const AVOID_ANIMATING = ['width', 'height', 'top', 'left', 'margin', 'padding'];

// Use will-change sparingly
.animating-element {
  will-change: transform, opacity;
}

.animating-element.is-done {
  will-change: auto; // Remove after animation
}
```

**Image Optimization:**
```tsx
// Lazy loading
<img src="photo.jpg" loading="lazy" alt="..." />

// Responsive images
<img
  srcSet="photo-400.jpg 400w, photo-800.jpg 800w, photo-1200.jpg 1200w"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  src="photo-800.jpg"
  alt="..."
/>
```

**Bundle Size Management:**
```typescript
// Code splitting
const SupercatModal = lazy(() => import('./components/SupercatModal'));

// Tree-shaking friendly imports
import { useState } from 'react'; // ✓
// import React from 'react'; // ✗ (imports entire library)

// Conditional loading
if (breakpoint === 'desktop') {
  const ParallaxModule = await import('./parallax');
  ParallaxModule.init();
}
```

## Data Models

### Resume Data Integration

```typescript
interface ResumeData {
  personal: PersonalInfo;
  education: Education;
  experience: WorkExperience[];
  achievements: Achievement[];
  skills: SkillSet;
  projects: Project[];
}

interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  location: string;
  bio: string;
  photo?: string;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  gpa?: string;
}

interface WorkExperience {
  company: string;
  position: string;
  type: 'internship' | 'fulltime' | 'freelance';
  startDate: string;
  endDate: string | 'Present';
  duration: string;
  achievements: string[];
  logo?: string;
}

interface Achievement {
  title: string;
  description?: string;
  date: string;
  category: 'competition' | 'selection' | 'program' | 'certification';
}

interface SkillSet {
  languages: Skill[];
  frameworks: Skill[];
  tools: Skill[];
}

interface Skill {
  name: string;
  icon?: string;
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface Project {
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  stack: string[];
  status: string;
  metrics?: {
    users?: number;
    duration?: string;
  };
  links?: {
    live?: string;
    repo?: string;
    caseStudy?: string;
  };
}
```

### Resume Data Instance

```typescript
export const RESUME: ResumeData = {
  personal: {
    name: 'Tushar Pawar',
    title: 'Full-Stack Developer',
    email: 'hello@tusharpawar.dev',
    location: 'India',
    bio: 'An independent developer who likes products that work in the real world, and ideas that are still a little too curious to ship.',
    photo: '/images/tushar-photo.jpg',
  },
  
  education: {
    institution: 'Oriental Institute',
    degree: 'B.Tech',
    field: 'Computer Science',
    startYear: '2023',
    endYear: '2027',
    gpa: '7.55',
  },
  
  experience: [
    {
      company: 'SD Foods',
      position: 'Software Developer Intern',
      type: 'internship',
      startDate: '2026-03',
      endDate: '2026-04',
      duration: 'March - April 2026',
      achievements: [
        'Developed full-stack features for food distribution platform',
        'Collaborated with cross-functional team',
      ],
    },
  ],
  
  achievements: [
    {
      title: 'BAH 2026 Finalist',
      description: 'Finalist in BAH (Booz Allen Hamilton) Hackathon 2026',
      date: '2026',
      category: 'competition',
    },
    {
      title: 'MetaXOpen Finalist',
      description: 'Finalist in MetaXOpen Competition',
      date: '2026',
      category: 'competition',
    },
    {
      title: 'IDE Bootcamp',
      description: 'Completed IDE Bootcamp program',
      date: '2025',
      category: 'program',
    },
    {
      title: 'TCS Selection',
      description: 'Selected for TCS Digital',
      date: '2026',
      category: 'selection',
    },
  ],
  
  skills: {
    languages: [
      { name: 'Java', icon: '☕' },
      { name: 'JavaScript', icon: '⚡' },
      { name: 'Python', icon: '🐍' },
      { name: 'TypeScript' },
    ],
    frameworks: [
      { name: 'React' },
      { name: 'Node.js' },
      { name: 'Express' },
      { name: 'FastAPI' },
    ],
    tools: [
      { name: 'Git' },
      { name: 'Docker' },
      { name: 'Kubernetes' },
      { name: 'MongoDB' },
      { name: 'PostgreSQL' },
      { name: 'MySQL' },
    ],
  },
  
  projects: [
    {
      slug: 'gymies',
      title: 'Gymies',
      category: 'Full-stack web application',
      summary: 'A gym management application that runs a real gym day to day.',
      description: 'Freelance project with approximately 100 active users, built and maintained end to end.',
      stack: ['React', 'Node.js', 'Express', 'MongoDB'],
      status: 'In production, ~100 active users',
      metrics: {
        users: 100,
      },
    },
    {
      slug: 'cinemies',
      title: 'Cinemies',
      category: 'AI-powered recommendation',
      summary: 'A movie discovery project that recommends by meaning instead of by keyword.',
      description: 'Sentence Transformers turn text into embeddings, FAISS searches them for similarity, FastAPI serves the results and React presents them.',
      stack: ['React', 'FastAPI', 'Sentence Transformers', 'FAISS'],
      status: 'Project',
    },
  ],
};
```

## Error Handling

### Animation Errors

```typescript
// Graceful degradation for unsupported features
const supportsIntersectionObserver = 'IntersectionObserver' in window;

if (!supportsIntersectionObserver) {
  // Fallback: show all content immediately
  elements.forEach(el => el.classList.add('is-visible'));
}

// Handle reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Disable or simplify animations
  document.body.classList.add('reduce-motion');
}
```

### Image Loading Errors

```tsx
const [imageError, setImageError] = useState(false);

<img
  src={photo}
  alt={altText}
  onError={() => setImageError(true)}
/>

{imageError && (
  <div className="fallback-avatar">
    {initials}
  </div>
)}
```

### Modal Focus Trap

```typescript
// Trap focus within modal when open
useEffect(() => {
  if (!isOpen) return;
  
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };
  
  document.addEventListener('keydown', handleTab);
  firstElement?.focus();
  
  return () => document.removeEventListener('keydown', handleTab);
}, [isOpen]);
```

## Testing Strategy

### Unit Testing

Focus on specific component behaviors and data transformations:

1. **Data transformation functions**
   - Resume data parsing and formatting
   - Animation timing calculations
   - Responsive breakpoint detection

2. **Component rendering**
   - Correct props rendering
   - Conditional rendering logic
   - Error state handling

3. **User interactions**
   - Click handlers
   - Form submissions
   - Keyboard navigation

**Example unit tests:**
```typescript
describe('Skills Component', () => {
  it('renders all skill categories', () => {
    render(<Skills skills={mockSkills} />);
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('Frameworks')).toBeInTheDocument();
    expect(screen.getByText('Tools')).toBeInTheDocument();
  });
  
  it('applies hover effects on skill cards', () => {
    render(<Skills skills={mockSkills} />);
    const skillCard = screen.getByText('React').closest('.skill-card');
    fireEvent.mouseEnter(skillCard);
    expect(skillCard).toHaveClass('hover-scale');
  });
});
```

### Integration Testing

Test interactions between multiple components:

1. **Navigation flow**
   - Clicking nav items scrolls to sections
   - URL hash updates on section changes

2. **Modal interactions**
   - Button opens modal
   - Outside click closes modal
   - Escape key closes modal

3. **Responsive behavior**
   - Layout changes at breakpoints
   - Touch vs. mouse interactions

**Example integration test:**
```typescript
describe('Supercat Modal Integration', () => {
  it('opens and closes modal via button and outside click', async () => {
    render(<App />);
    
    const button = screen.getByLabelText('Chat with Supercat');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    
    // Click outside modal
    fireEvent.mouseDown(document.body);
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
```

### Property-Based Testing

Test universal properties that should hold across many inputs:

**Note:** Property-based testing is most appropriate for testing YOUR code's logic, not external UI rendering or infrastructure. Focus on data transformations, algorithms, and business logic.

See the Correctness Properties section below for specific properties to test.

### Accessibility Testing

1. **Automated checks** (axe-core, Lighthouse)
2. **Keyboard navigation testing**
3. **Screen reader testing** (manual)
4. **Color contrast verification**

### Performance Testing

1. **Lighthouse scores** (target: 90+ on all metrics)
2. **Animation frame rate monitoring** (target: 60fps)
3. **Bundle size analysis** (target: <500KB)
4. **Lazy loading verification**

## Implementation Phases

### Phase 1: Foundation (Week 1)
- Set up design system (colors, typography, spacing)
- Implement base layout components
- Add responsive utilities
- Create animation system utilities

### Phase 2: Core Components (Week 1-2)
- Redesign Hero section (compact, animated)
- Enhance Navigation (logo, pills, animations)
- Build About section with resume data
- Create Work Experience section

### Phase 3: Interactive Features (Week 2)
- Implement Skills showcase
- Enhance Supercat modal (toggle behavior)
- Add cat animation rotation system
- Build playful Footer

### Phase 4: Polish & Testing (Week 3)
- Add all animations and transitions
- Implement accessibility features
- Performance optimization
- Cross-browser testing
- Responsive testing

### Phase 5: Deployment (Week 3)
- Final QA and bug fixes
- Performance audit
- Accessibility audit
- Deploy to production

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Navigation Smooth Scroll Consistency

*For any* navigation item, clicking it should trigger smooth scroll behavior to the correct target section with the matching ID

**Validates: Requirements 2.4**

### Property 2: Experience Card Hover Consistency

*For any* work experience card, hovering over it should trigger either scale transformation or elevation change animation

**Validates: Requirements 4.5**

### Property 3: Skill Item Visual Representation

*For any* skill item in the skills list, it should have an associated visual icon or styled tag element

**Validates: Requirements 5.3**

### Property 4: Skill Item Hover Micro-interactions

*For any* skill item, hovering over it should trigger at least one micro-interaction (scale, color shift, or rotation)

**Validates: Requirements 5.5**

### Property 5: Supercat Modal Toggle Behavior

*For any* initial modal state (open or closed), clicking the Supercat button should toggle to the opposite state with appropriate slide animation

**Validates: Requirements 6.2**

### Property 6: Cat Animation Easing Consistency

*For all* cat animation definitions in the animation system, each should use cubic-bezier easing function for smooth, natural movement

**Validates: Requirements 7.3**

### Property 7: Footer Link Hover Animation

*For all* social links in the footer, each should have hover animation handlers that trigger on pointer hover

**Validates: Requirements 8.1**

### Property 8: Footer Link Color Transition Timing

*For any* footer link, the hover color transition duration should be between 0.2s and 0.3s

**Validates: Requirements 8.2**

### Property 9: Viewport Transition Smoothness

*For any* viewport size change (within responsive breakpoints), layout transitions should occur without content jumping or jarring visual shifts

**Validates: Requirements 9.4**

### Property 10: Interactive Element Touch Target Size

*For all* interactive elements (buttons, links, inputs), the hit area dimensions should be at least 44x44 pixels

**Validates: Requirements 9.5**

### Property 11: Animation Performance Optimization

*For all* animations in the system, they should only animate transform and opacity properties (GPU-accelerated) and avoid layout-triggering properties

**Validates: Requirements 10.2**

### Property 12: Interactive Element Accessibility Labels

*For all* interactive elements (buttons, links, inputs, navigation items), each should have appropriate ARIA label or role attribute

**Validates: Requirements 11.1**

### Property 13: Keyboard Navigation Reachability

*For all* interactive elements, each should be reachable via tab navigation and display visible focus styles when focused

**Validates: Requirements 11.2**

### Property 14: Decorative Image Accessibility

*For all* decorative images (including cat illustrations), each should have either aria-hidden="true" or alt="" attribute

**Validates: Requirements 11.4**

### Property 15: Color Information Redundancy

*For any* information conveyed using color, there should be alternative non-color indicators (text labels, icons, or patterns)

**Validates: Requirements 11.5**

### Property 16: Project Card Content Completeness

*For any* project card, it should contain all required content fields: image, description, tech stack array, and status string

**Validates: Requirements 12.3**

### Property 17: Project Card Hover Animation

*For all* project cards, hovering over each should trigger either scale transformation or elevation (shadow) animation

**Validates: Requirements 12.4**

### Property 18: Project Card Navigation

*For any* project card, clicking it should trigger navigation to its corresponding detail page route

**Validates: Requirements 12.5**

### Property 19: Rounded Corner Consistency

*For all* UI elements with rounded corners (buttons, cards, modals, inputs), the border-radius value should be between 16px and 24px

**Validates: Requirements 13.1**

### Property 20: Section Spacing Consistency

*For any* pair of adjacent major sections in the layout, the vertical spacing between them should be between 2rem and 3rem

**Validates: Requirements 13.2**

## Conclusion

This design document provides a comprehensive blueprint for transforming the minimalist portfolio into a premium, animated experience. The design maintains the existing strengths (clean code, thoughtful interactions) while adding:

1. **Visual richness** through animations, rounded elements, and depth effects
2. **Professional credibility** through integrated resume data
3. **Playful personality** through cat animations and interactive features
4. **Performance** through GPU-accelerated animations and lazy loading
5. **Accessibility** through ARIA labels, keyboard navigation, and reduced motion support

The implementation should proceed in phases, with each phase building on the foundation of the previous one. Testing and accessibility should be considered throughout the implementation, not as afterthoughts.

**Next Steps:**
1. Review and approve this design document
2. Set up design system utilities (colors, spacing, animations)
3. Begin Phase 1 implementation
4. Conduct user testing after Phase 3
5. Iterate based on feedback
6. Deploy to production after Phase 5 completion
