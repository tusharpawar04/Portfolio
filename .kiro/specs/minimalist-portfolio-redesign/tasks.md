# Implementation Plan: Minimalist Portfolio Redesign

## Overview

This implementation plan transforms the existing portfolio into a refined minimalist experience by reducing animation durations by 40-50%, introducing gentler easing curves, making Supercat interactive with a tap-to-chat feature, and focusing content on two projects (Gymies and Cinemies). The implementation maintains the existing React + TypeScript + Tailwind architecture while updating CSS animations, data structures, and component interactions.

## Tasks

- [x] 1. Update animation system in index.css
  - [x] 1.1 Reduce animation durations by 40-50%
    - Update `@keyframes rise` from 900ms to 450ms
    - Update `@keyframes reveal` from 800ms to 400ms
    - Update character animation loops (blink, tail, cape) from 3000-5000ms to 1500-2500ms
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [x] 1.2 Refine easing curves for gentler motion
    - Replace aggressive easing `cubic-bezier(.2,.7,.2,1)` with gentle `cubic-bezier(.4,.8,.4,1)`
    - Apply `ease-out` or `ease-in-out` to all animation classes (rise, reveal, hover transitions)
    - Ensure hover transitions use 200-400ms durations
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 1.3 Reduce character animation intensity
    - Increase blink interval from 5.5s to 8s for less frequent blinking
    - Reduce tail sway amplitude by 35% (from -5deg/7deg to -3.25deg/4.55deg)
    - Reduce cape amplitude by 40% (from -2.5deg to -1.5deg)
    - Apply `ease-in-out` to tail and cape animations
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 2. Remove IndoorGuide project from data layer
  - [x] 2.1 Update projects array in data.ts
    - Remove IndoorGuide object from projects array (keep only Gymies and Cinemies)
    - Verify project numbers: Gymies = "01", Cinemies = "02"
    - Verify projects array length is exactly 2
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [x] 2.2 Update QA array in data.ts
    - Remove or update any QA items that reference IndoorGuide
    - Remove link `['Read about IndoorGuide', '#/work/indoorguide']` from QA items
    - Verify all remaining answers don't mention IndoorGuide
    - _Requirements: 4.4_

- [x] 3. Update Work section layout for two projects
  - [x] 3.1 Verify Work section in App.tsx renders correctly for two projects
    - Confirm Gymies layout: 8 columns visual left, 4 columns text right
    - Confirm Cinemies layout: 4 columns text left, 7 columns visual right (starting column 6)
    - Verify SlingCat component is properly positioned for Cinemies
    - _Requirements: 4.1, 4.5_

- [x] 4. Remove IndoorGuide visual from Visuals.tsx
  - [x] 4.1 Delete indoorguide export from Visuals.tsx
    - Remove the `indoorguide` component/function from the visuals object
    - Keep only `gymies` and `cinemies` visual exports
    - Verify no references to indoorguide remain in the file
    - _Requirements: 4.2_

- [x] 5. Implement interactive Supercat feature
  - [x] 5.1 Create fixed Supercat button at bottom-right
    - Add button element with `fixed z-50 right-3 bottom-3 md:right-6 md:bottom-6` positioning
    - Render Supercat component with `bust` pose and `smile` mood
    - Size button: `w-10 h-10 md:w-12 md:h-12` for responsive scaling
    - Ensure button remains visible while scrolling through all sections
    - _Requirements: 3.1, 3.2_
  
  - [x] 5.2 Wire Supercat button to openAsk function
    - Import `openAsk` from AskSupercat.tsx component
    - Add `onClick={openAsk}` handler to Supercat button
    - Add appropriate ARIA attributes: `aria-expanded`, `aria-label="Ask Supercat about Tushar"`
    - Ensure keyboard accessibility (Tab navigation, Enter/Space activation)
    - _Requirements: 3.3, 3.8_
  
  - [x] 5.3 Add modal entrance/exit animations
    - Create `@keyframes modalEnter` with 300ms duration and gentle ease-out
    - Animate opacity from 0 to 1 and scale from 0.92 to 1.0
    - Set transform-origin to bottom-right for origin near Supercat button
    - Add corresponding exit animation with reversed easing
    - _Requirements: 3.4, 3.6_
  
  - [ ]* 5.4 Write unit tests for Supercat interaction
    - Test: openAsk function dispatches custom event correctly
    - Test: Modal opens when custom event fires
    - Test: Modal closes on Escape key press
    - Test: Modal has correct ARIA attributes
    - _Requirements: 3.3, 3.5, 3.6, 3.8_

- [x] 6. Reduce SlingCat physics parameters for subtlety
  - [x] 6.1 Update SlingCat component props in App.tsx (Cinemies section)
    - Reduce `pull` prop from 22 to 15 pixels (~32% reduction)
    - Reduce `hold` prop from 1400ms to 800ms (~43% reduction)
    - Verify `rest="curious"` pose is maintained
    - Verify `getTarget` points to `#viz-cinemies` element
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ]* 6.2 Write unit tests for SlingCat parameters
    - Test: pull value is ≤ 20 pixels
    - Test: hold value is ≤ 1000ms
    - Test: SlingCat renders with correct rest pose
    - _Requirements: 5.2, 5.3, 5.4_

- [x] 7. Checkpoint - Manual testing and verification
  - Verify all animations complete in reduced timeframes (450ms rise, 400ms reveal)
  - Test Supercat button opens AskSupercat modal smoothly
  - Verify only 2 projects appear in Work section (Gymies 01, Cinemies 02)
  - Test SlingCat web-slinging feels more subtle than before
  - Test all interactions at mobile (320px), tablet (768px), and desktop (1440px) viewports
  - Verify reduced motion preference disables/simplifies animations
  - Ensure all interactive elements are keyboard accessible with visible focus indicators

- [ ]* 8. Property-based testing for universal properties
  - [ ]* 8.1 Write property test for Supercat pose/mood rendering
    - **Property 1: Supercat Component Pose/Mood Rendering**
    - **Validates: Requirements 3.7**
    - For any valid pose/mood combination, Supercat renders without errors
    - Test all combinations of poses (bust, sit, idle, curious) × moods (smile, open, wink, curious, sleepy)
  
  - [ ]* 8.2 Write property test for color contrast compliance
    - **Property 2: Color Contrast Compliance**
    - **Validates: Requirements 9.1**
    - For any text/background pair, contrast ratio meets WCAG AA standards (4.5:1 normal, 3:1 large)
    - Test body text, muted text, and link colors against background
  
  - [ ]* 8.3 Write property test for keyboard accessibility
    - **Property 3: Interactive Element Keyboard Accessibility**
    - **Validates: Requirements 9.2**
    - For any interactive element (buttons, links, inputs), element is keyboard accessible
    - Test Tab navigation, focus indicators visibility
  
  - [ ]* 8.4 Write property test for reduced motion animation disabling
    - **Property 4: Reduced Motion Animation Disabling**
    - **Validates: Requirements 9.4**
    - For any animated element, when prefers-reduced-motion matches, animation is disabled
    - Mock media query and verify animation: none applied
  
  - [ ]* 8.5 Write property test for image alternative text
    - **Property 5: Image Alternative Text Presence**
    - **Validates: Requirements 9.6**
    - For any img/SVG element, appropriate alt or title attribute exists
    - Test decorative images have empty alt, informative images have descriptive text
  
  - [ ]* 8.6 Write property test for responsive rendering
    - **Property 6: Viewport Responsive Rendering**
    - **Validates: Requirements 10.1**
    - For any viewport width 320-2560px, no horizontal overflow or layout breaks
    - Test random viewport widths, verify body scrollWidth ≤ viewport width
  
  - [ ]* 8.7 Write property test for Supercat responsive positioning
    - **Property 7: Supercat Responsive Positioning**
    - **Validates: Requirements 10.2**
    - For any viewport width, Supercat maintains fixed positioning without overlapping content
    - Test visibility and positioning at various viewport sizes
  
  - [ ]* 8.8 Write property test for modal responsive width
    - **Property 8: Modal Responsive Width Adaptation**
    - **Validates: Requirements 10.3**
    - For any viewport width <640px, AskSupercat modal adapts width using calc(100vw - 1.5rem)
    - Test modal width calculations at mobile viewport sizes
  
  - [ ]* 8.9 Write property test for touch target sizes
    - **Property 9: Touch Target Size Compliance**
    - **Validates: Requirements 10.4**
    - For any interactive element at mobile viewports (≤767px), dimensions ≥ 44x44px
    - Test all buttons, links, and interactive elements at mobile sizes

- [x] 9. Final checkpoint - End-to-end verification
  - Run all tests (unit and property tests if implemented)
  - Verify no console errors or warnings in browser
  - Test complete user flow: land on site → scroll → click Supercat → browse Q&A → close modal
  - Verify accessibility: keyboard navigation, screen reader announcements, focus management
  - Test responsive design at 320px, 768px, 1024px, 1440px, 2560px viewports
  - Verify reduced motion preferences respected across all animations
  - Confirm production build completes without errors

## Notes

- Tasks marked with `*` are optional property-based and unit tests that can be skipped for faster MVP delivery
- Each task references specific requirements from the requirements document for traceability
- Checkpoints ensure incremental validation of animation changes, content updates, and interactive features
- The implementation maintains the existing React + TypeScript + Tailwind CSS architecture
- Animation changes are CSS-only in index.css; no JavaScript animation logic changes needed
- Data layer changes are isolated to data.ts for clean separation
- Supercat interaction uses existing openAsk export mechanism from AskSupercat.tsx
- Property tests validate universal correctness properties across all valid inputs (minimum 100 iterations each)
- Unit tests validate specific examples, edge cases, and component integration

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1", "4.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "2.2", "3.1"] },
    { "id": 2, "tasks": ["5.1", "6.1"] },
    { "id": 3, "tasks": ["5.2", "5.3", "6.2"] },
    { "id": 4, "tasks": ["5.4", "8.1", "8.2", "8.3", "8.4", "8.5"] },
    { "id": 5, "tasks": ["8.6", "8.7", "8.8", "8.9"] }
  ]
}
```
