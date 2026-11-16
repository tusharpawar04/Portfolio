import type { ReactElement } from 'react'

interface IconProps {
  className?: string
  size?: number
}

export function JavaScriptIcon({ className = 'w-5 h-5', size = 20 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect width="24" height="24" rx="5" fill="#f7df1e" fillOpacity="0.15" />
      <path d="M7 16.5C7.8 17.5 9 17.5 9.5 17C10.2 16.3 10.2 14.8 10.2 13V7H8.5V13C8.5 14 8 14.3 7.5 14L7 16.5Z" fill="currentColor" />
      <path d="M12.5 14.2C13.2 14.8 14.2 15.2 15.2 15.2C16.3 15.2 17 14.7 17 13.9C17 13 16.2 12.6 15 12.1C13.2 11.4 12.2 10.6 12.2 9C12.2 7.4 13.5 6.2 15.4 6.2C16.7 6.2 17.8 6.7 18.5 7.4L17.5 9C16.9 8.5 16.1 8.2 15.3 8.2C14.5 8.2 13.9 8.6 13.9 9.2C13.9 9.9 14.5 10.2 15.8 10.8C17.6 11.5 18.8 12.3 18.8 13.9C18.8 15.7 17.3 17 15.1 17C13.6 17 12.2 16.3 11.5 15.5L12.5 14.2Z" fill="currentColor" />
    </svg>
  )
}

export function TypeScriptIcon({ className = 'w-5 h-5', size = 20 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect width="24" height="24" rx="5" fill="#3178c6" fillOpacity="0.15" />
      <path d="M5 8.5H13V10.2H10V18H7.9V10.2H5V8.5Z" fill="currentColor" />
      <path d="M13.8 15.4C14.5 16 15.5 16.4 16.6 16.4C17.8 16.4 18.5 15.8 18.5 15C18.5 14.1 17.6 13.7 16.4 13.2C14.4 12.5 13.3 11.7 13.3 10C13.3 8.4 14.7 7.2 16.7 7.2C18.1 7.2 19.3 7.7 20 8.5L18.8 10.1C18.2 9.6 17.4 9.2 16.6 9.2C15.8 9.2 15.2 9.6 15.2 10.2C15.2 10.9 15.8 11.2 17.2 11.8C19.1 12.5 20.4 13.4 20.4 15.1C20.4 16.9 18.8 18.2 16.5 18.2C14.8 18.2 13.4 17.5 12.6 16.6L13.8 15.4Z" fill="currentColor" />
    </svg>
  )
}

export function PythonIcon({ className = 'w-5 h-5', size = 20 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M11.8 3C8.6 3 8.8 4.4 8.8 4.4L8.8 5.8H12.3V6.3H5.9C4.5 6.3 3.3 7.1 3.3 9.4C3.3 11.7 4.1 12.4 5.3 12.4H6.5V10.7C6.5 8.7 8.3 8.7 8.3 8.7H11.7C13.4 8.7 13.4 7.2 13.4 7.2V4.4C13.4 4.4 13.5 3 11.8 3ZM10.4 4.2C10.8 4.2 11.1 4.5 11.1 4.9C11.1 5.3 10.8 5.6 10.4 5.6C10 5.6 9.7 5.3 9.7 4.9C9.7 4.5 10 4.2 10.4 4.2Z" fill="currentColor" />
      <path d="M12.2 21C15.4 21 15.2 19.6 15.2 19.6L15.2 18.2H11.7V17.7H18.1C19.5 17.7 20.7 16.9 20.7 14.6C20.7 12.3 19.9 11.6 18.7 11.6H17.5V13.3C17.5 15.3 15.7 15.3 15.7 15.3H12.3C10.6 15.3 10.6 16.8 10.6 16.8V19.6C10.6 19.6 10.5 21 12.2 21ZM13.6 19.8C13.2 19.8 12.9 19.5 12.9 19.1C12.9 18.7 13.2 18.4 13.6 18.4C14 18.4 14.3 18.7 14.3 19.1C14.3 19.5 14 19.8 13.6 19.8Z" fill="currentColor" opacity="0.8" />
    </svg>
  )
}

export function JavaIcon({ className = 'w-5 h-5', size = 20 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M8.5 18C10.5 18.5 14.5 18.5 16.5 18C14.8 19.5 9.8 19.5 8.5 18Z" fill="currentColor" />
      <path d="M7 21C10 21.8 15 21.8 18 21C15.5 23 9.5 23 7 21Z" fill="currentColor" />
      <path d="M13 3C11 5 13.5 7 11.5 9C10 7.5 10.5 6 11.5 4.5L13 3Z" fill="currentColor" opacity="0.7" />
      <path d="M15.5 5C14 7 16 9 14.5 11C13.5 9.8 14 8.5 14.8 7L15.5 5Z" fill="currentColor" opacity="0.6" />
      <path d="M6 14C8 15 15 15 17 14C18 16 14 17 11.5 17C8 17 5 15.5 6 14Z" fill="currentColor" />
    </svg>
  )
}

export function CppIcon({ className = 'w-5 h-5', size = 20 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M10 7C7.2 7 5 9.2 5 12C5 14.8 7.2 17 10 17C11.5 17 12.8 16.3 13.7 15.3L12.3 13.9C11.7 14.6 10.9 15 10 15C8.3 15 7 13.7 7 12C7 10.3 8.3 9 10 9C10.9 9 11.7 9.4 12.3 10.1L13.7 8.7C12.8 7.7 11.5 7 10 7Z" fill="currentColor" />
      <path d="M15.5 11H17V9.5H18V11H19.5V12H18V13.5H17V12H15.5V11Z" fill="currentColor" />
      <path d="M20 11H21.5V9.5H22.5V11H24V12H22.5V13.5H21.5V12H20V11Z" fill="currentColor" />
    </svg>
  )
}

export function SqlIcon({ className = 'w-5 h-5', size = 20 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 6V12C4 13.7 7.6 15 12 15C16.4 15 20 13.7 20 12V6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 12V18C4 19.7 7.6 21 12 21C16.4 21 20 19.7 20 18V12" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export function ReactIcon({ className = 'w-5 h-5', size = 20 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" stroke="currentColor" strokeWidth="1.4" transform="rotate(0 12 12)" opacity="0.85" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" stroke="currentColor" strokeWidth="1.4" transform="rotate(60 12 12)" opacity="0.85" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" stroke="currentColor" strokeWidth="1.4" transform="rotate(120 12 12)" opacity="0.85" />
    </svg>
  )
}

export function NextjsIcon({ className = 'w-5 h-5', size = 20 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 8V16L16.2 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 11V16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function TailwindIcon({ className = 'w-5 h-5', size = 20 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M6 12C6.8 9.5 9 8.5 11 9C12.8 9.5 13.5 11 14.5 11.5C15.8 12.2 17 11.5 18 10C17.2 12.5 15 13.5 13 13C11.2 12.5 10.5 11 9.5 10.5C8.2 9.8 7 10.5 6 12Z" fill="currentColor" />
      <path d="M2 17C2.8 14.5 5 13.5 7 14C8.8 14.5 9.5 16 10.5 16.5C11.8 17.2 13 16.5 14 15C13.2 17.5 11 18.5 9 18C7.2 17.5 6.5 16 5.5 15.5C4.2 14.8 3 15.5 2 17Z" fill="currentColor" opacity="0.7" />
    </svg>
  )
}

export function HtmlCssIcon({ className = 'w-5 h-5', size = 20 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M7 8L3 12L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 8L21 12L17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 4L10 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

export function NodeIcon({ className = 'w-5 h-5', size = 20 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12 3L20 7.6V16.4L12 21L4 16.4V7.6L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 8V16M9 10L15 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
    </svg>
  )
}

export function ExpressIcon({ className = 'w-5 h-5', size = 20 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 10L10 14M10 10L7 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13 14H17M13 10H17M13 12H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function FastApiIcon({ className = 'w-5 h-5', size = 20 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M13 6L8 13H13L11 18L16 11H11L13 6Z" fill="currentColor" />
    </svg>
  )
}

export function FaissIcon({ className = 'w-5 h-5', size = 20 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="6" cy="6" r="2.5" fill="currentColor" />
      <circle cx="18" cy="8" r="2.5" fill="currentColor" />
      <circle cx="15" cy="18" r="2.5" fill="currentColor" />
      <circle cx="8" cy="16" r="2" fill="currentColor" opacity="0.6" />
      <line x1="6" y1="6" x2="18" y2="8" stroke="currentColor" strokeWidth="1.4" opacity="0.5" />
      <line x1="6" y1="6" x2="8" y2="16" stroke="currentColor" strokeWidth="1.4" opacity="0.5" />
      <line x1="18" y1="8" x2="15" y2="18" stroke="currentColor" strokeWidth="1.4" opacity="0.5" />
      <line x1="8" y1="16" x2="15" y2="18" stroke="currentColor" strokeWidth="1.4" opacity="0.5" />
    </svg>
  )
}

export function TransformersIcon({ className = 'w-5 h-5', size = 20 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="5" cy="8" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="5" cy="16" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="19" cy="8" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="19" cy="16" r="2" fill="currentColor" opacity="0.7" />
      <path d="M7 8L9.5 11M7 16L9.5 13M17 8L14.5 11M17 16L14.5 13" stroke="currentColor" strokeWidth="1.3" opacity="0.5" />
    </svg>
  )
}

export function GitIcon({ className = 'w-5 h-5', size = 20 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="6" cy="18" r="2.5" fill="currentColor" />
      <circle cx="6" cy="6" r="2.5" fill="currentColor" />
      <circle cx="18" cy="9" r="2.5" fill="currentColor" />
      <path d="M6 8.5V15.5M6 12C9 12 12 11 15.5 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function DockerIcon({ className = 'w-5 h-5', size = 20 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M2 13C4 13 5 15 8 15C11 15 12 13 15 13C18 13 19 14.5 21 14C21.5 16 19.5 18 16 18C10 18 6 17 2 13Z" fill="currentColor" />
      <rect x="7" y="9" width="2" height="2" fill="currentColor" opacity="0.8" />
      <rect x="10" y="9" width="2" height="2" fill="currentColor" opacity="0.8" />
      <rect x="13" y="9" width="2" height="2" fill="currentColor" opacity="0.8" />
      <rect x="10" y="6" width="2" height="2" fill="currentColor" opacity="0.8" />
      <rect x="13" y="6" width="2" height="2" fill="currentColor" opacity="0.8" />
    </svg>
  )
}

export function KubernetesIcon({ className = 'w-5 h-5', size = 20 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path d="M12 3.5V10M12 14V20.5M4.5 8L10 11M14 13L19.5 16M4.5 16L10 13M14 11L19.5 8" stroke="currentColor" strokeWidth="1.4" opacity="0.75" />
    </svg>
  )
}

export function MongoIcon({ className = 'w-5 h-5', size = 20 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12 2C12 2 6 8.5 6 13.5C6 17.5 8.7 21 12 22C15.3 21 18 17.5 18 13.5C18 8.5 12 2 12 2Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 3V21" stroke="currentColor" strokeWidth="1.4" opacity="0.7" />
    </svg>
  )
}

export function PostgresIcon({ className = 'w-5 h-5', size = 20 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12 4C8 4 5 7 5 11C5 15.5 8 19 12 19C14 19 15.8 18.2 17 17L18.5 19L19.5 18L18 15.5C18.6 14.2 19 12.6 19 11C19 7 16 4 12 4Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8C10.5 8 9.5 9 9.5 10.5M14.5 10.5C14.5 9 13.5 8 12 8" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export function GenericCodeIcon({ className = 'w-5 h-5', size = 20 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="4" width="18" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10L6 12L8 14M16 10L18 12L16 14M13 9L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function getTechIcon(name: string, className = 'w-5 h-5'): ReactElement {
  const norm = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  if (norm.includes('javascript') || norm === 'js') return <JavaScriptIcon className={className} />
  if (norm.includes('typescript') || norm === 'ts') return <TypeScriptIcon className={className} />
  if (norm.includes('python')) return <PythonIcon className={className} />
  if (norm.includes('java') && !norm.includes('script')) return <JavaIcon className={className} />
  if (norm.includes('c') && (norm.includes('plus') || norm.includes('pp'))) return <CppIcon className={className} />
  if (norm.includes('sql') && !norm.includes('postgre') && !norm.includes('my')) return <SqlIcon className={className} />
  if (norm.includes('react')) return <ReactIcon className={className} />
  if (norm.includes('next')) return <NextjsIcon className={className} />
  if (norm.includes('tailwind')) return <TailwindIcon className={className} />
  if (norm.includes('html') || norm.includes('css')) return <HtmlCssIcon className={className} />
  if (norm.includes('node')) return <NodeIcon className={className} />
  if (norm.includes('express')) return <ExpressIcon className={className} />
  if (norm.includes('fastapi')) return <FastApiIcon className={className} />
  if (norm.includes('faiss')) return <FaissIcon className={className} />
  if (norm.includes('transformer')) return <TransformersIcon className={className} />
  if (norm.includes('git')) return <GitIcon className={className} />
  if (norm.includes('docker')) return <DockerIcon className={className} />
  if (norm.includes('kubernetes') || norm === 'k8s') return <KubernetesIcon className={className} />
  if (norm.includes('mongo')) return <MongoIcon className={className} />
  if (norm.includes('postgre')) return <PostgresIcon className={className} />
  if (norm.includes('mysql')) return <SqlIcon className={className} />
  return <GenericCodeIcon className={className} />
}
