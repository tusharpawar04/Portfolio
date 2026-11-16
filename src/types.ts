/**
 * Type definitions for the premium portfolio redesign
 */

export interface Achievement {
  title: string
  year: string | number
  category: string
  description?: string
}

export interface WorkExperience {
  company: string
  position: string
  duration: string
  period: string
  achievements: string[]
  logo?: string
}

export interface Education {
  institution: string
  degree: string
  field: string
  duration: string
  gpa: string
}

export interface Skill {
  name: string
  icon: string
  category: 'Languages' | 'Frameworks' | 'Tools'
}

export interface SkillCategory {
  name: string
  skills: Skill[]
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
  color?: string
}

export type CatAnimationType = 
  | 'blink' 
  | 'tail-sway' 
  | 'hop' 
  | 'sleep' 
  | 'stretch' 
  | 'paw-wave' 
  | 'head-tilt' 
  | 'cape-flutter'

export interface CatAnimationConfig {
  type: CatAnimationType
  duration: number
  easing: AnimationEasing
  probability: number
}

export type AnimationEasing = 'standard' | 'bounce' | 'smooth'

export interface NavItem {
  label: string
  id: string
}
