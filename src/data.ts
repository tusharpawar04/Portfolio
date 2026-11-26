export const EMAIL = 'tusharpawar4801@gmail.com'
export const WHATSAPP_NUMBER = '+91 7898818055'
export const WHATSAPP_URL = 'https://wa.me/917898818055?text=Hi%20Tushar!%20Saw%20your%20portfolio%20and%20wanted%20to%20connect%20regarding%20a%20project.'

/**
 * Web3Forms Access Key:
 * 1. Visit https://web3forms.com
 * 2. Enter tusharpawar4801@gmail.com & click "Create Access Key"
 * 3. Copy the access key sent to your Gmail and replace this value:
 */
export const WEB3FORMS_ACCESS_KEY = 'e6b52be3-3fa8-44d4-b789-9b98687262ba'

export const getGmailComposeUrl = (
  subject = 'Project Inquiry / Freelance Contract',
  body = ''
) => {
  const encSubject = encodeURIComponent(subject)
  const encBody = encodeURIComponent(body)
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=${encSubject}&body=${encBody}`
}

export const getMailtoUrl = (
  subject = 'Project Inquiry / Freelance Contract',
  body = ''
) => {
  const encSubject = encodeURIComponent(subject)
  const encBody = body ? `&body=${encodeURIComponent(body)}` : ''
  return `mailto:${EMAIL}?subject=${encSubject}${encBody}`
}

export type ProjectImage = {
  url: string
  title: string
  caption: string
  aspect?: string
}

export type CodebaseModule = {
  name: string
  role: string
  details: string
}

export type DataModelSchema = {
  name: string
  description: string
  fields: string[]
}

export type ApiEndpoint = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
}

export type CodebaseOverview = {
  summary: string
  architecture: string
  fileTree?: string[]
  keyModules: CodebaseModule[]
  dataModels?: DataModelSchema[]
  apiEndpoints?: ApiEndpoint[]
  highlights: string[]
}

export type Project = {
  slug: string
  n: string
  title: string
  subtitle?: string
  category: string
  status: string
  liveUrl?: string
  githubUrl?: string
  stack: string[]
  summary: string
  whatItDoes: {
    problem: string
    solution: string
    targetUsers: string[]
    coreWorkflows: string[]
  }
  metrics?: { label: string; value: string }[]
  images?: ProjectImage[]
  codebase?: CodebaseOverview
  detail: [string, string][]
  caption: string
}

export const projects: Project[] = [
  {
    slug: 'gymies',
    n: '01',
    title: 'Vinod Fitness & Gym',
    subtitle: 'Production Gym Management & Member Portal',
    category: 'Full-stack web app',
    status: 'In production · ~100 active members',
    liveUrl: 'https://vinod-fitness.vercel.app/',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Vercel'],
    summary: 'A full-scale gym management application and member portal running a real fitness center day to day — ~100 active members, digital registration, and live subscription tracking.',
    whatItDoes: {
      problem: 'Vinod Fitness & Gym managed operations via paper registers and uncoordinated WhatsApp messages. Members frequently inquired about plan expiry dates, slot allocations, and payment receipts, creating administrative bottlenecks and missed renewals.',
      solution: 'A modern, high-availability web platform providing self-service member portals, real-time membership verification for front-desk counters, flexible morning/evening slot scheduling, and structured payment logging.',
      targetUsers: [
        'Gym Members: Self-service access to view subscription validity, check slot preferences, and request renewals',
        'Gym Owner / Management: Live counter verification, real-time active member count, and revenue records',
        'Front Desk Staff: Rapid paperless member status verification during rush hours',
      ],
      coreWorkflows: [
        'Member Onboarding & Digital Credential Issue',
        'Real-Time Subscription Expiry & Grace Period Calculation',
        'Flexible Shift & Slot Preference Configuration (Both Slots)',
        'Payment Logging, Receipt Generation & Renewal Processing',
      ],
    },
    metrics: [
      { label: 'Active Members', value: '~100' },
      { label: 'Operations', value: '100% Digital' },
      { label: 'Architecture', value: 'MERN Stack' },
      { label: 'Deployment', value: 'Vercel Live' },
    ],
    images: [
      {
        url: '/projects/vinod-fitness-landing.jpg',
        title: 'Brand Landing Page & Program Showcase',
        caption: 'High-energy modern landing page featuring gym branding, facility highlights, training programs, and responsive tier navigation.',
        aspect: 'Landing & Marketing',
      },
      {
        url: '/projects/vinod-fitness-dashboard.png',
        title: 'Member Portal & Subscription Management',
        caption: 'Live member dashboard showcasing active subscription status, flexible batch scheduling (Both Slots), payment history, and one-click renewals.',
        aspect: 'Member Portal',
      },
      {
        url: '/projects/vinod-fitness-dashboard.png',
        title: 'Plan Validity & Expiry Warning Engine',
        caption: 'Automated status engine notifying members when plans expire, preventing unauthorized facility entry while providing direct renewal options.',
        aspect: 'Plan & Billing',
      },
      {
        url: '/projects/vinod-fitness-landing.jpg',
        title: 'Facility Amenities & Dynamic Schedule View',
        caption: 'Interactive facility overview and training plans designed for seamless browsing on mobile and desktop devices.',
        aspect: 'Facility & Plans',
      },
    ],
    codebase: {
      summary: 'Production MERN codebase with clear separation of concerns, JWT authorization middleware, Mongoose ODM schemas, and a responsive Tailwind CSS client.',
      architecture: 'Layered client-server architecture. The React single-page app interacts through an abstracted Axios service layer with interceptors for bearer authentication. The Express.js backend handles route-level input validation, role guards, and interacts with MongoDB Atlas through optimized Mongoose models.',
      fileTree: [
        'vinod-fitness/',
        '├── client/                     # React Single-Page Application',
        '│   ├── src/',
        '│   │   ├── components/         # Reusable UI (Navbar, MemberBadge, PlanCard, StatTile)',
        '│   │   ├── pages/              # Dashboard, Plans, Profile, History, Login',
        '│   │   ├── context/            # AuthContext (JWT session state, current user profile)',
        '│   │   ├── services/           # api.ts (Central Axios instance, interceptors)',
        '│   │   └── utils/              # dateCalculators.ts, slotFormatters.ts',
        '├── server/                     # Node.js & Express REST Backend',
        '│   ├── controllers/            # memberController, planController, authController',
        '│   ├── models/                 # Member.js, Plan.js, PaymentLog.js',
        '│   ├── middleware/             # requireAuth.js, roleGuard.js, validatePlan.js',
        '│   ├── routes/                 # /api/members, /api/plans, /api/auth',
        '│   └── config/                 # db.js (MongoDB Atlas pooled connection)',
        '└── package.json',
      ],
      keyModules: [
        {
          name: 'Member Lifecycle & Expiry Engine',
          role: 'Core Business Logic',
          details: 'Computes remaining subscription duration dynamically from enrollment date and plan validity period. Automatically transitions member records across active, expiring-soon, and expired states with zero manual intervention.',
        },
        {
          name: 'Flexible Slot Scheduling Logic',
          role: 'Batch Management',
          details: 'Accommodates both fixed morning/evening shifts and "Both Slots (Flexible)" access for members with irregular work routines, balancing gym floor capacity.',
        },
        {
          name: 'Authentication & Session Guard',
          role: 'Security & Auth',
          details: 'JWT-based token issuance with client-side session persistence. Protects member profile endpoints and restricts administrative management routes.',
        },
        {
          name: 'Persistent Payment & Renewal Logger',
          role: 'Financial Audit Trail',
          details: 'Maintains immutable transaction records linked to member IDs, tracking renewal history and generating receipts for front-desk reconciliation.',
        },
      ],
      dataModels: [
        {
          name: 'Member',
          description: 'Represents an enrolled gym member with profile, slot preferences, and subscription status.',
          fields: ['_id', 'fullName', 'email', 'phone', 'membershipId', 'assignedSlot (Morning | Evening | Both)', 'status (Active | Expired)', 'planId', 'startDate', 'endDate'],
        },
        {
          name: 'Plan',
          description: 'Membership packages configured by gym administrators.',
          fields: ['_id', 'planName', 'durationMonths', 'price', 'hasBothSlotsAccess', 'isActive'],
        },
        {
          name: 'PaymentLog',
          description: 'Audit log of subscription renewals and payment transactions.',
          fields: ['_id', 'memberId', 'amountPaid', 'paymentMethod', 'renewalDate', 'expiresAt', 'receiptRef'],
        },
      ],
      apiEndpoints: [
        { method: 'POST', path: '/api/auth/login', description: 'Authenticates member credentials and issues signed JWT bearer token' },
        { method: 'GET', path: '/api/members/me', description: 'Returns authenticated member profile, active plan status, and assigned slots' },
        { method: 'POST', path: '/api/members/renew', description: 'Processes membership renewal request and computes extended expiration date' },
        { method: 'GET', path: '/api/admin/members', description: 'Admin query for active, expiring, and overdue members with pagination' },
      ],
      highlights: [
        'Zero heavy UI library dependencies: engineered entirely with custom Tailwind CSS utility styling',
        'High-speed serverless deployment on Vercel with automatic edge asset caching',
        'MongoDB indexed lookups on membershipId and status for instantaneous front-desk check-ins',
        'Responsive mobile-first interface optimized for gym members using iOS and Android smartphones',
      ],
    },
    detail: [
      [
        'The Challenge & Purpose',
        'Vinod Fitness & Gym needed a dependable, modern system to replace manual paper logbooks and disorganized WhatsApp payment reminders. Members needed immediate visibility into plan status, batch timings, and renewal schedules without constantly inquiring at the front desk.',
      ],
      [
        'Member Portal Experience',
        'Members log in to an intuitive dark-themed dashboard. They can verify active subscription validity, view assigned batch configurations (flexible morning and evening slots), inspect past transactions, and initiate renewals directly from their mobile or desktop browser.',
      ],
      [
        'Gym Management & Operations',
        'The backend system coordinates member onboarding, plan renewals, slot capacity, and administrative reporting — ensuring zero lost records, accurate member counts, and eliminating tedious front-desk paperwork.',
      ],
      [
        'Architecture & Engineering',
        'Engineered with a responsive React frontend styled with custom dark-neon aesthetics and smooth micro-interactions. The backend is powered by Node.js and Express REST APIs connected to MongoDB for persistent member and subscription storage, deployed continuously on Vercel.',
      ],
      [
        'Real-world Impact',
        'Currently deployed live in daily production at vinod-fitness.vercel.app, powering real-world operations, real member data, and daily gym check-ins for approximately 100 members.',
      ],
    ],
    caption: 'Production screenshots and codebase architecture for Vinod Fitness & Gym.',
  },
  {
    slug: 'compliance-audit',
    n: '02',
    title: 'Compliance Audit Environment',
    subtitle: 'Reinforcement Learning Environment for AI Agents',
    category: 'AI / ML Engineering · Reinforcement Learning',
    status: 'Research & Evaluation Environment · OpenEnv',
    githubUrl: 'https://github.com/tusharpawar04/compliance_audit_env',
    stack: ['Python', 'OpenEnv', 'FastAPI', 'WebSockets', 'Docker', 'GPT-4o-mini', 'Pytest'],
    summary: 'An OpenEnv-based reinforcement learning environment that trains and evaluates AI agents on GDPR-style regulatory compliance tasks. Agents analyze company privacy policies, detect violations, explain findings, and propose compliant rewrites.',
    whatItDoes: {
      problem: 'Evaluating AI agents on regulatory compliance tasks is typically done via subjective "LLM-as-a-judge" prompting, which produces non-deterministic, irreproducible scores. There was no standardized simulation environment providing measurable observation-action-reward loops for compliance officers.',
      solution: 'A structured reinforcement learning environment built on OpenEnv with WebSocket streaming, a deterministic rule-based evaluation engine covering 8 GDPR compliance categories, and 15 benchmark documents graded across Easy, Medium, and Hard difficulty levels.',
      targetUsers: [
        'AI & RL Researchers: Benchmarking agent policy reasoning, multi-turn task completion, and structured tool interactions',
        'Enterprise Compliance Teams: Automating GDPR privacy policy auditing, risk testing, and document remediation',
        'Autonomous Agent Developers: Training and evaluating specialized legal and compliance agent architectures',
      ],
      coreWorkflows: [
        'Environment Initialization: Observation sampling and document injection via WebSocket connection',
        'Agent Policy Action: Structured compliance action formulation with violation tags and explanations',
        'Deterministic Grading: Exact rule verification with precision, recall, and F1 calculations',
        'Episode Progression: Multi-attempt interaction loop with reward thresholds (up to 3 attempts, 0.85 termination target)',
      ],
    },
    metrics: [
      { label: 'Evaluation Engine', value: 'Deterministic Grader' },
      { label: 'Compliance Rules', value: '8 GDPR Rules' },
      { label: 'Benchmark Corpus', value: '15 Curated Docs' },
      { label: 'Baseline Agent', value: 'GPT-4o-mini' },
    ],
    codebase: {
      summary: 'OpenEnv-compliant reinforcement learning environment implemented with FastAPI and WebSockets, containerized in Docker, with deterministic grading and automated benchmark suites.',
      architecture: 'Asynchronous client-server architecture. The FastAPI server hosts an OpenEnv ComplianceEnvironment instance communicating via WebSockets. An agent client sends structured ComplianceActions (violations, explanation, suggested rewrite) and receives Observations with numeric rewards and feedback signals.',
      fileTree: [
        'compliance_audit_env/',
        '├── server/                     # FastAPI Environment Server',
        '│   ├── main.py                 # WebSocket endpoint (/ws) & episode state manager',
        '│   ├── env.py                  # OpenEnv ComplianceEnvironment implementation',
        '│   ├── evaluator.py            # Deterministic rule-based grading engine',
        '│   └── rules.py                # 8 GDPR compliance definitions & regex validators',
        '├── client/                     # Agent Client SDK',
        '│   ├── client.py               # EnvClient (reset, step, close WebSocket client)',
        '│   └── models.py               # ComplianceAction, Observation, StepResult',
        '├── tasks/                      # Benchmark Corpus (15 Documents)',
        '│   ├── easy/                   # 5 Obvious violation documents (P/R/F1 scoring)',
        '│   ├── medium/                 # 5 Category-level nuanced documents',
        '│   └── hard/                   # 5 Violation + Document Rewrite documents',
        '├── baselines/                  # Reference Agent Implementations',
        '│   ├── gpt4o_mini_agent.py     # GPT-4o-mini evaluation baseline',
        '│   └── run_eval.py             # Automated benchmark execution suite',
        '├── tests/                      # Pytest verification suite',
        '├── Dockerfile                  # Containerized reproducible deployment',
        '└── requirements.txt',
      ],
      keyModules: [
        {
          name: 'Deterministic Rule Engine',
          role: 'Core Evaluation Logic',
          details: 'Evaluates agent findings using deterministic, rule-based grading rather than another subjective LLM judge. Calculates precision, recall, and F1 scores against 8 standardized GDPR categories (RULE_01 to RULE_08).',
        },
        {
          name: 'WebSocket Episode Manager',
          role: 'Communication & State',
          details: 'Coordinates multi-attempt episode cycles over real-time WebSockets. Manages observation delivery, action reception, step transitions, and termination conditions (threshold >= 0.85 or 3 attempts exhausted).',
        },
        {
          name: 'Weighted Hard-Task Evaluator',
          role: 'Advanced Assessment',
          details: 'Implements dual-phase scoring for complex compliance challenges: 60% allocated to regulatory violation identification and 40% to the quality and validity of the proposed document rewrites.',
        },
        {
          name: 'GPT-4o-mini Baseline Harness',
          role: 'Benchmarking Suite',
          details: 'Automated evaluation suite establishing documented baseline reference performance across difficulty tiers (Easy: ~0.70, Medium: ~0.43, Hard: ~0.22) for comparative research.',
        },
      ],
      dataModels: [
        {
          name: 'ComplianceAction',
          description: 'Structured assessment payload submitted by the AI agent.',
          fields: ['violation_ids: List[str]', 'explanation: str', 'suggested_rewrite: Optional[str]'],
        },
        {
          name: 'Observation',
          description: 'State data presented to the agent at episode start or after each step.',
          fields: ['document_text: str', 'task_difficulty: str', 'feedback: Optional[str]', 'attempt_number: int'],
        },
        {
          name: 'StepResult',
          description: 'Standardized RL step outcome returned over WebSockets.',
          fields: ['observation: Observation', 'reward: float', 'done: bool', 'info: Dict[str, Any]'],
        },
      ],
      apiEndpoints: [
        { method: 'GET', path: '/ws', description: 'Bidirectional WebSocket connection for episode reset, agent actions, and reward streaming' },
        { method: 'GET', path: '/health', description: 'Server health check and active environment status' },
        { method: 'POST', path: '/evaluate/batch', description: 'Batch benchmark runner executing offline model evaluations across all 15 tasks' },
      ],
      highlights: [
        'Built on OpenEnv standard interface with clean observation-action-reward step cycle',
        'Deterministic rule-based grading ensures 100% reproducible and verifiable agent evaluations',
        '8 GDPR rule categories covering data retention, third-party disclosure, consent, and deletion',
        'Full Docker containerization ensures portable, reproducible multi-environment execution',
      ],
    },
    detail: [
      [
        'What is the Compliance Audit Environment?',
        'Think of this project as a flight simulator for AI compliance officers. In a production enterprise, privacy policies define how personal information is collected, retained, shared, and deleted. Rather than treating compliance as a simple chat prompt, this project provides a rigorous reinforcement learning environment where AI agents interact with real policy documents, submit formal assessments, and receive measurable feedback.',
      ],
      [
        'Deterministic Grading vs. LLM Judges',
        'A critical engineering decision was implementing deterministic, rule-based grading instead of asking another LLM to score the agent. If two agents submit identical answers, they must receive identical scores. Deterministic grading makes evaluation reproducible, consistent, easily debugged, and immune to the hallucinations or shifting biases of an external model judge.',
      ],
      [
        'The Eight GDPR Compliance Rules',
        'The environment evaluates agents against eight concrete regulatory categories: RULE_01 (Data retention limits), RULE_02 (Third-party data transparency), RULE_03 (Opt-out mechanisms), RULE_04 (Purpose limitation), RULE_05 (Breach notification windows), RULE_06 (Cross-border data transfers), RULE_07 (Affirmative consent requirements), and RULE_08 (Data erasure and right-to-be-forgotten).',
      ],
      [
        'Difficulty Tiers & Multi-Attempt Episodes',
        'Fifteen company documents are structured across three difficulty tiers: Easy (5 documents, obvious violations with precision/recall scoring), Medium (5 documents, nuanced violations with partial credit), and Hard (5 documents, requiring both violation detection and compliant document rewrites weighted 60/40). Episodes allow up to 3 attempts, terminating when a reward of 0.85 is attained.',
      ],
      [
        'AI Engineering Value',
        'This project demonstrates AI engineering beyond basic API wrapper calls. It showcases experience with agent-environment interaction loops, structured action spaces, reward modeling, deterministic scoring pipelines, and containerized WebSocket infrastructure for evaluating autonomous agents.',
      ],
    ],
    caption: 'Architecture, interaction loop, and evaluation matrix for the Compliance Audit Environment.',
  },
  {
    slug: 'tourmitra',
    n: '03',
    title: 'TourMitra',
    subtitle: 'AI-Powered Travel Planning & Local Guide Marketplace',
    category: 'Full-stack · AI Travel Marketplace',
    status: 'Live Production · React + Node.js',
    liveUrl: 'https://tourmitra.vercel.app/',
    githubUrl: 'https://github.com/tusharpawar04/tourmitra',
    stack: ['React', 'Vite', 'Node.js', 'Express', 'MongoDB Atlas', 'Mongoose', 'JWT', 'Google OAuth 2.0', 'Framer Motion', 'Tailwind CSS'],
    summary: 'A full-stack travel platform designed to connect tourists with verified local guides while simplifying destination discovery, personalized AI itinerary planning, and multi-state tour bookings.',
    whatItDoes: {
      problem: 'Travelers planning trips must consult disparate websites to discover attractions, estimate budgets, find knowledgeable local guides, negotiate pricing, and coordinate daily itineraries, leading to fragmented planning and administrative friction.',
      solution: 'A unified dual-sided marketplace bringing tourists and certified local guides into a cohesive application with automated pricing, role-specific dashboards, and AI-assisted day-by-day itineraries.',
      targetUsers: [
        'Tourists: Discover destinations, explore cultural history, generate custom AI itineraries, and book verified guides',
        'Local Guides: Create professional profiles, upload verification credentials, configure languages/rates, and manage tour bookings',
        'Platform Administrators: Review guide verification documents, monitor booking states, and ensure platform quality',
      ],
      coreWorkflows: [
        'Destination Discovery: Interactive exploration of attractions, historical summaries, and guide directories',
        'AI Itinerary Generation: Automated day-by-day travel schedules tailored to destination and duration',
        'Guide Verification: Identity document submission, profile validation, and hourly rate configuration',
        'Booking State Lifecycle: Dynamic progression through Pending → Confirmed → Completed / Cancelled states',
      ],
    },
    metrics: [
      { label: 'Platform Roles', value: 'Dual (Tourist & Guide)' },
      { label: 'Architecture', value: 'MERN + Vite' },
      { label: 'Auth Methods', value: 'JWT + Google OAuth' },
      { label: 'Booking Engine', value: 'State Machine' },
    ],
    images: [
      {
        url: '/projects/tourmitra-hero.png',
        title: 'Hero Landing - Discover India Through Local Eyes',
        caption: 'Beautiful gradient hero section showcasing the platform\'s value proposition: connecting travelers with 5,000+ verified local guides across 200+ destinations with AI-powered trip planning.',
        aspect: 'Hero & Branding',
      },
      {
        url: '/projects/tourmitra-explore.png',
        title: 'Destination Explorer & Guide Marketplace',
        caption: 'Interactive destination discovery interface featuring iconic locations like Jaipur\'s Amber Fort and Agra\'s Taj Mahal, with filtering by heritage, adventure, culture, and nature categories.',
        aspect: 'Explore & Discovery',
      },
      {
        url: '/projects/tourmitra-ai-planner.png',
        title: 'AI-Powered Trip Planner Interface',
        caption: 'Multi-step AI itinerary generator guiding users through destination selection, dates, travelers, budget, pace, and vibes to create personalized day-by-day travel schedules.',
        aspect: 'AI Planning',
      },
    ],
    codebase: {
      summary: 'Production MERN codebase with clean architectural separation, dual-role access control, centralized Axios service layer, and responsive Glassmorphism design system.',
      architecture: 'Client-server architecture featuring a React SPA fronted by Vite and backed by an Express REST API. The frontend communicates through an abstracted API service layer with bearer token interceptors. The backend orchestrates role-based middleware, Mongoose data models, and automated booking pricing logic.',
      fileTree: [
        'tourmitra/',
        '├── client/                     # React + Vite Single-Page Application',
        '│   ├── src/',
        '│   │   ├── components/         # Glassmorphism UI, GuideCard, ItineraryMap, BookingModal',
        '│   │   ├── pages/              # DestinationExplorer, GuideProfile, TouristDashboard, GuideDashboard',
        '│   │   ├── context/            # AuthContext (Google OAuth & JWT session handling)',
        '│   │   ├── services/           # api.ts (Central Axios instance with interceptors)',
        '│   │   └── hooks/              # useBookings.ts, useItinerary.ts',
        '├── server/                     # Node.js + Express REST API',
        '│   ├── controllers/            # authController, guideController, bookingController, reviewController',
        '│   ├── models/                 # User.js, GuideProfile.js, Destination.js, Booking.js, Review.js',
        '│   ├── middleware/             # authGuard.js, roleGuard.js, uploadMiddleware.js',
        '│   ├── routes/                 # /api/auth, /api/guides, /api/bookings, /api/destinations',
        '│   └── config/                 # db.js (MongoDB Atlas cluster connection)',
        '└── package.json',
      ],
      keyModules: [
        {
          name: 'Dual-Role Booking State Machine',
          role: 'Core Business Logic',
          details: 'Manages multi-stage booking lifecycle: Pending → Confirmed → Completed / Cancelled. Automatically computes booking pricing based on guide hourly rates and tour duration, preventing race conditions.',
        },
        {
          name: 'AI Itinerary Planner',
          role: 'Recommendation Feature',
          details: 'Generates structured, multi-day personalized travel schedules incorporating attraction highlights, optimal travel pacing, and destination recommendations.',
        },
        {
          name: 'Hybrid Authentication Pipeline',
          role: 'Security & Identity',
          details: 'Combines traditional Bcrypt password hashing and JWT session tokens with Google OAuth 2.0 single sign-on, protected by route-level role authorization guards.',
        },
        {
          name: 'Guide Discovery & Review Engine',
          role: 'Marketplace Operations',
          details: 'Search and filtering system allowing tourists to sort guides by destination, spoken languages, and specialties, paired with an immutable post-tour review system.',
        },
      ],
      dataModels: [
        {
          name: 'User',
          description: 'Core user model supporting Tourist, Guide, and Administrator roles.',
          fields: ['_id', 'fullName', 'email', 'role (Tourist | Guide | Admin)', 'googleId', 'avatarUrl', 'createdAt'],
        },
        {
          name: 'GuideProfile',
          description: 'Extended professional profile for registered local guides.',
          fields: ['_id', 'userId', 'bio', 'languagesSpoken', 'hourlyRate', 'specialties', 'verificationStatus', 'ratingAvg'],
        },
        {
          name: 'Booking',
          description: 'Stateful reservation linking tourists, guides, and destinations.',
          fields: ['_id', 'touristId', 'guideId', 'destinationId', 'startDate', 'endDate', 'totalPrice', 'status (Pending | Confirmed | Completed | Cancelled)'],
        },
        {
          name: 'Review',
          description: 'Post-tour feedback and rating submitted by verified travelers.',
          fields: ['_id', 'bookingId', 'reviewerId', 'guideId', 'rating (1-5)', 'comment', 'createdAt'],
        },
      ],
      apiEndpoints: [
        { method: 'POST', path: '/api/auth/google', description: 'Verifies Google OAuth tokens and provisions authenticated user session' },
        { method: 'GET', path: '/api/guides', description: 'Queries verified guide directory with destination, language, and pricing filters' },
        { method: 'POST', path: '/api/bookings', description: 'Initiates a new guide booking with automated server-side price calculation' },
        { method: 'PUT', path: '/api/bookings/:id/status', description: 'Transitions booking through lifecycle states (Confirm, Complete, Cancel)' },
      ],
      highlights: [
        'Complete end-to-end marketplace featuring dedicated dashboards for tourists and local guides',
        'Formal state-machine booking engine enforcing business rules beyond simple CRUD operations',
        'Modern Glassmorphism visual design system paired with fluid Framer Motion animations',
        'Live deployment on Vercel with responsive mobile and desktop viewports',
      ],
    },
    detail: [
      [
        'What is TourMitra?',
        'Suppose a traveler from Delhi wants to explore Jaipur for three days. Traditionally, they must cross-reference different websites for historical places, figure out realistic budgets, find trusted guides, negotiate fees over WhatsApp, and structure daily itineraries. TourMitra unifies these needs into a single product, connecting tourists directly with knowledgeable locals.',
      ],
      [
        'Dual-Role Architecture',
        'The platform supports two distinct user personas with customized interfaces. Tourists discover destinations, generate AI itineraries, and manage trips. Local guides create verified profiles, set hourly fees and language skills, receive booking requests, and manage tour schedules.',
      ],
      [
        'The Booking Lifecycle',
        'Rather than basic database operations, TourMitra implements a true business workflow: Pending → Confirmed → Completed / Cancelled. Bookings calculate automated pricing from guide rates, trigger status updates, and unlock verified reviews upon tour completion.',
      ],
      [
        'Authentication & Security',
        'Engineered with both Google OAuth 2.0 social login and standard Bcrypt/JWT authentication. Protected routes enforce strict role boundaries so tourists cannot modify guide profiles or accept bookings.',
      ],
      [
        'Product Engineering Impact',
        'TourMitra demonstrates the ability to architect a complete consumer product with multiple user roles, database relationships, stateful workflows, and clean responsive front-end aesthetics.',
      ],
    ],
    caption: 'Full-stack travel marketplace and AI itinerary planner interface for TourMitra.',
  },
  {
    slug: 'voyager',
    n: '04',
    title: 'Voyager',
    subtitle: 'Full-Stack Travel Accommodation Platform',
    category: 'Backend Engineering · Full-Stack MVC',
    status: 'Live Production · Render + MongoDB',
    liveUrl: 'https://voyager-ultimate-travel-platform.onrender.com/listings/home',
    githubUrl: 'https://github.com/tusharpawar04/Voyager',
    stack: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'EJS', 'Passport.js', 'Cloudinary', 'Mapbox SDK', 'Multer', 'Joi'],
    summary: 'A full-stack travel listing application that enables users to discover accommodation options, publish property listings with cloud-hosted media, and explore travel destinations through an integrated MVC web architecture.',
    whatItDoes: {
      problem: 'Building a robust property discovery platform requires handling server-side rendering, multipart image upload pipelines without filling server disk storage, coordinate-based geolocation mapping, strict schema validation, and persistent session authentication.',
      solution: 'An architectural MVC application built with Express.js and EJS templates, integrated with Cloudinary for external media delivery, Mapbox SDK for forward geocoding, Passport.js for MongoDB session persistence, and Joi for schema enforcement.',
      targetUsers: [
        'Travelers: Discover accommodations, browse high-resolution property galleries, inspect Mapbox location pins, and read guest reviews',
        'Property Hosts: Publish listings, upload photos directly to Cloudinary, define pricing, and manage property descriptions',
        'Community: Review and rate visited accommodations with author-attributed feedback',
      ],
      coreWorkflows: [
        'Property Publishing: Ingesting multipart property details and uploading high-res photos to Cloudinary CDN',
        'Forward Geocoding: Converting property addresses into GeoJSON coordinates via Mapbox SDK',
        'Session-Based Auth: User signup, login, and session persistence in MongoDB using Passport.js and Connect-Mongo',
        'Review Management: Submitting ratings and reviews with authorization guards preventing unauthorized deletions',
      ],
    },
    metrics: [
      { label: 'Architecture', value: 'Server-Rendered MVC' },
      { label: 'Media Storage', value: 'Cloudinary CDN' },
      { label: 'Geolocation', value: 'Mapbox SDK' },
      { label: 'Session Store', value: 'Connect-Mongo' },
    ],
    images: [
      {
        url: '/projects/voyager-listings.png',
        title: 'Property Listing Catalog & Discovery',
        caption: 'Responsive grid showcase of accommodation listings featuring diverse properties from "Enjoy the Nainital" studio apartments to modern private studios and boutique cafes across India.',
        aspect: 'Browse & Discovery',
      },
      {
        url: '/projects/voyager-detail.png',
        title: 'Property Detail View & Booking Information',
        caption: 'Comprehensive listing detail page for "Enjoy the Nainital" featuring high-res property gallery, owner attribution, full amenity descriptions, pricing (₹4,500/night), and location details.',
        aspect: 'Listing Detail',
      },
      {
        url: '/projects/voyager-create.png',
        title: 'Host Property Creation Interface',
        caption: 'Intuitive property submission form for hosts to create new listings with title, description, pricing, Cloudinary image upload, and Mapbox geocoded location fields.',
        aspect: 'Host Dashboard',
      },
    ],
    codebase: {
      summary: 'Classical MVC web architecture using Express.js and EJS templating, with Cloudinary image streaming, Mapbox forward geocoding, and Passport.js session management.',
      architecture: 'Strict Model-View-Controller design. Controllers encapsulate request handling and business logic, Mongoose models define MongoDB schema validation, and EJS templates render dynamic HTML server-side. Third-party integrations (Cloudinary, Mapbox) are decoupled through dedicated configuration modules.',
      fileTree: [
        'voyager/',
        '├── controllers/                # listings.js, reviews.js, users.js (Clean MVC logic)',
        '├── models/                     # listing.js, review.js, user.js (Mongoose schemas)',
        '├── routes/                     # listings.js, reviews.js, users.js (Express routing)',
        '├── views/                      # EJS Server-Rendered Templates',
        '│   ├── layouts/                # boilerplate.ejs (Global container, navbar, footer)',
        '│   ├── listings/               # index.ejs, show.ejs, new.ejs, edit.ejs',
        '│   └── includes/               # flash.ejs, navbar.ejs, footer.ejs',
        '├── middleware/                 # isLoggedIn.js, isOwner.js, isReviewAuthor.js, validateListing.js',
        '├── utils/                      # ExpressError.js, wrapAsync.js (Centralized error handling)',
        '├── public/                     # CSS stylesheets, client JavaScript, Mapbox initialization',
        '├── cloudConfig.js              # Cloudinary storage engine integration',
        '├── schema.js                   # Joi server-side validation schemas',
        '├── app.js                      # Express entry point, middleware stack, session config',
        '└── package.json',
      ],
      keyModules: [
        {
          name: 'MVC Separation of Concerns',
          role: 'Architectural Pattern',
          details: 'Strictly divides application responsibilities into Models (Mongoose database schemas), Views (modular EJS layouts and partials), and Controllers (business logic and route dispatching).',
        },
        {
          name: 'Cloudinary Media Pipeline',
          role: 'Asset Management',
          details: 'Leverages Multer and Cloudinary storage engines to stream image files directly to cloud CDN storage, storing secure image URLs and filenames in MongoDB without server disk load.',
        },
        {
          name: 'Mapbox Forward Geocoding Engine',
          role: 'Spatial Geolocation',
          details: 'Transforms text-based destination addresses into GeoJSON coordinates [longitude, latitude] during listing creation, rendering interactive Mapbox visual markers on detail views.',
        },
        {
          name: 'Session Security & Authorization',
          role: 'Authentication',
          details: 'Implements Passport Local authentication with persistent MongoDB session storage via Connect-Mongo. Custom middleware guards (isOwner, isReviewAuthor) prevent unauthorized mutations.',
        },
      ],
      dataModels: [
        {
          name: 'Listing',
          description: 'Core accommodation listing with pricing, coordinates, and media.',
          fields: ['_id', 'title', 'description', 'image: { url, filename }', 'price', 'location', 'country', 'geometry: Point [lng, lat]', 'owner: ObjectId(User)', 'reviews: [ObjectId(Review)]'],
        },
        {
          name: 'User',
          description: 'Registered user profile with Passport-Local Mongoose hashing.',
          fields: ['_id', 'email', 'username', 'hash', 'salt'],
        },
        {
          name: 'Review',
          description: 'Guest feedback record associated with a specific property listing.',
          fields: ['_id', 'comment', 'rating (1-5)', 'author: ObjectId(User)', 'createdAt'],
        },
      ],
      apiEndpoints: [
        { method: 'GET', path: '/listings', description: 'Renders the accommodation catalog view with all active property cards' },
        { method: 'POST', path: '/listings', description: 'Handles multipart listing creation with Multer upload, Mapbox geocoding, and Joi validation' },
        { method: 'GET', path: '/listings/:id', description: 'Renders listing showcase view with Mapbox coordinate map, gallery, and reviews' },
        { method: 'POST', path: '/listings/:id/reviews', description: 'Attaches user review to listing with author attribution and validation' },
      ],
      highlights: [
        'Robust implementation of server-rendered MVC architecture using Node.js, Express, and EJS',
        'Full cloud image processing pipeline integrating Multer with Cloudinary external storage',
        'Mapbox SDK geolocation integration converting textual addresses into interactive map pins',
        'Session-based authentication with persistent MongoDB session store and ownership guards',
      ],
    },
    detail: [
      [
        'What is Voyager?',
        'Think of an Airbnb-like accommodation platform. When traveling to destinations like Goa or Manali, users want to browse available properties, inspect photos, review locations on a map, sign up, post their own listings, and read genuine reviews. Voyager is a two-sided accommodation listing platform bringing these capabilities into one unified application.',
      ],
      [
        'Server-Rendered MVC Architecture',
        'Unlike client-rendered single-page apps, Voyager utilizes traditional server-rendered architecture with Express.js and EJS templates. Responsibilities are strictly partitioned: Models define database structures, Views render HTML, and Controllers govern application logic, making the codebase clean and maintainable.',
      ],
      [
        'Cloudinary Cloud Storage',
        'Storing user-uploaded property photos directly on a server disk causes performance degradation and deployment loss. Voyager integrates Multer with Cloudinary cloud storage, streaming image buffers directly to CDN endpoints and persisting secure URLs in MongoDB.',
      ],
      [
        'Mapbox Geolocation & Spatial Mapping',
        'During listing creation, Voyager invokes the Mapbox Geocoding API to translate text addresses into geographic coordinates [longitude, latitude]. These coordinates are stored in GeoJSON format and rendered as interactive map pins on the property showcase page.',
      ],
      [
        'Backend Engineering Foundations',
        'Voyager showcases essential backend engineering principles: session-based authentication using Passport.js, persistent session storage in MongoDB, Joi schema validation, custom middleware security guards, and asynchronous error boundaries.',
      ],
    ],
    caption: 'Server-rendered MVC property discovery and Mapbox geolocation architecture for Voyager.',
  },
  {
    slug: 'cinemies',
    n: '05',
    title: 'Cinemies',
    subtitle: 'Semantic Vector Search Recommendation Engine',
    category: 'AI · Recommendation',
    status: 'AI Vector Search Engine',
    stack: ['React', 'FastAPI', 'Sentence Transformers', 'FAISS', 'Python'],
    summary: 'Movie discovery powered by meaning, not keywords. Describe a vibe, mood, or nuanced atmosphere and find the nearest films in vector embedding space.',
    whatItDoes: {
      problem: 'Traditional search engines rely on exact keyword matches or tag intersections, failing when a viewer wants a film with a specific psychological tone, visual mood, or narrative nuance.',
      solution: 'An AI-powered discovery engine that transforms natural language query prompts into dense semantic vectors and performs millisecond similarity search across embedding space.',
      targetUsers: [
        'Film Enthusiasts searching for aesthetic or tonal cinematic equivalents',
        'Viewers exploring recommendations based on nuanced plot descriptions',
        'Data Engineers exploring vector embeddings and high-dimensional search indexing',
      ],
      coreWorkflows: [
        'Natural Language Query Semantic Encoding',
        'High-Dimensional FAISS Vector Space Traversal',
        'Top-K Nearest Neighbor Ranking & Metadata Hydration',
      ],
    },
    metrics: [
      { label: 'Embedding Space', value: 'Sentence-BERT' },
      { label: 'Vector Search', value: 'FAISS K-NN' },
      { label: 'Backend API', value: 'Python FastAPI' },
      { label: 'Search Latency', value: '<50ms' },
    ],
    codebase: {
      summary: 'Python FastAPI microservice paired with HuggingFace Sentence Transformers and Facebook AI Similarity Search (FAISS), fronted by a responsive visualizer.',
      architecture: 'Microservice architecture separating vector inference from client presentation. The Python service precomputes and indexes 384-dimensional embeddings, serving query similarity searches over high-performance asynchronous endpoints.',
      fileTree: [
        'cinemies/',
        '├── client/                     # React Visualization Client',
        '│   ├── src/',
        '│   │   ├── components/         # SearchBar, VectorPlot, MovieCard, DistanceGauge',
        '│   │   └── api/                # semanticApi.ts',
        '├── server/                     # Python FastAPI Backend',
        '│   ├── app.py                  # FastAPI route handlers & CORS',
        '│   ├── indexer.py              # FAISS index construction & persistence',
        '│   ├── embedder.py             # Sentence-Transformers pipeline (all-MiniLM-L6-v2)',
        '│   └── dataset.py              # Corpus loader & metadata hydration',
        '└── requirements.txt',
      ],
      keyModules: [
        {
          name: 'Vector Embedding Generator',
          role: 'Inference Pipeline',
          details: 'Leverages Sentence Transformers (all-MiniLM-L6-v2) to map movie synopsis corpora and incoming user prompts into a shared high-dimensional geometric embedding space.',
        },
        {
          name: 'FAISS Indexer & Search Engine',
          role: 'Vector Database',
          details: 'Maintains an inverted file index with Voronoi cell partitioning for sub-50ms approximate nearest-neighbor query execution.',
        },
        {
          name: 'FastAPI Semantic Gateway',
          role: 'REST API',
          details: 'Asynchronous Python API handling query sanitization, embedding computation, and metadata response enrichment.',
        },
      ],
      dataModels: [
        {
          name: 'FilmVector',
          description: 'Vector record stored in FAISS with metadata lookup mapping.',
          fields: ['id', 'title', 'year', 'genres', 'synopsis', 'embedding: float[384]'],
        },
        {
          name: 'SemanticQuery',
          description: 'Inference query payload submitted by the user.',
          fields: ['promptText: str', 'topK: int (default 5)', 'genreFilter: Optional[str]'],
        },
      ],
      apiEndpoints: [
        { method: 'POST', path: '/api/search', description: 'Computes query vector embedding and returns top-K nearest movies by cosine distance' },
        { method: 'GET', path: '/api/neighbors/:id', description: 'Fetches precomputed geometric neighbors for a selected movie title' },
      ],
      highlights: [
        'Sub-50ms vector query execution across thousands of film synopsis vectors',
        'Recommendation framed as geometric proximity rather than brittle relational joins',
        'Lightweight React client illustrating distance metrics and neighbor relationships',
      ],
    },
    detail: [
      [
        'The Concept & Inspiration',
        'Traditional keyword search fails when visitors describe an atmosphere, emotional tone, or nuanced cinematic vibe rather than exact titles. Cinemies solves this by converting natural language queries into semantic high-dimensional vectors.',
      ],
      [
        'Vector Geometry & Sentence Transformers',
        'Sentence Transformers turn plot summaries and aesthetic traits into embeddings. FAISS searches them in milliseconds using cosine similarity and nearest-neighbor calculations, finding films that genuinely match the feeling.',
      ],
      [
        'Engineering Architecture',
        'A high-performance Python FastAPI service handles embedding inference and indexing, while a responsive interface visualizes search proximity and recommendations.',
      ],
    ],
    caption: 'Vector embedding geometry and semantic search engine for Cinemies.',
  },
]

export type QA = { q: string; a: string; mood: 'smile' | 'open' | 'wink' | 'curious' | 'sleepy'; link?: [string, string] }

export const qa: QA[] = [
  {
    q: 'What is Tushar currently working on?',
    a: "Tushar is currently focused on two primary pursuits: engineering AIML systems (specifically reinforcement learning simulation environments like OpenEnv for compliance auditing and vector similarity search) and actively taking on high-impact freelance engineering contracts. Between coding sprints, he ensures my food bowl is suitably replenished.",
    mood: 'curious',
    link: ['Explore his work', '#work'],
  },
  {
    q: 'Is he available for freelance contracts?',
    a: "Yes, absolutely! Tushar is actively freelancing and open for contract roles. He designs and ships production full-stack web platforms, scalable backend APIs, and custom AIML integrations. You can reach out directly via email to discuss your timeline and project requirements.",
    mood: 'smile',
    link: ['Email Tushar directly', `mailto:${EMAIL}`],
  },
  {
    q: 'What makes his AIML work stand out?',
    a: "Unlike trivial LLM wrapper scripts, his flagship Compliance Audit Environment is a genuine OpenEnv reinforcement learning system. It grades autonomous agents on 8 GDPR rules using deterministic precision/recall scoring and multi-turn WebSocket episodes—true AI systems engineering.",
    mood: 'open',
    link: ['Inspect AI Compliance Env', '#/work/compliance-audit'],
  },
  {
    q: 'What kind of freelance projects does he build?',
    a: "End-to-end web applications (React, Node, Express, MongoDB), custom AI/ML tools and vector search engines, robust REST API architectures, and polished interactive frontends. Every project is built with production standards and feline quality assurance.",
    mood: 'wink',
    link: ['Get in touch', `mailto:${EMAIL}`],
  },
  {
    q: 'Tell me something funny about him',
    a: "He spent an entire weekend optimizing a FAISS vector search index down to sub-50ms latency, yet he still hasn't engineered an algorithm to prevent me from falling asleep directly across his mechanical keyboard during production deployments. Priorities, right?",
    mood: 'wink',
  },
  {
    q: 'What is his core technical stack?',
    a: "Python, FastAPI, OpenEnv, Docker, WebSockets & FAISS on the AI side; React, TypeScript, Next.js, Node.js, Express, MongoDB & Tailwind CSS on the full-stack web side. And Git to keep the experiments version-controlled.",
    mood: 'open',
  },
]

/* ── About & Resume ── */
export const RESUME_FILENAME = 'Tushar_Pawar_Resume.pdf'

export const about = {
  tagline: 'Developer who builds products people actually use',
  description: 'I\'m an independent developer from India who likes products that work in the real world, and ideas that are still a little too curious to ship.',
  resumeUrl: '/Tushar_Pawar_Resume.pdf',
}

/* ── Brief highlights (no personal details — just notable work) ── */
export type Highlight = { label: string; detail: string; accent?: boolean }
export const highlights: Highlight[] = [
  { label: 'BAH 2026', detail: 'ISRO Hackathon Finalist — Top 15 nationally', accent: true },
  { label: 'MetaXOpenENV', detail: 'Competition Finalist 2026', accent: true },
  { label: 'Vinod Fitness', detail: 'Production Web App · ~100 active members' },
  { label: 'SD Foods', detail: 'Intern · Backend & REST APIs' },
  { label: 'IDE Bootcamp', detail: 'Program Completed 2025' },
]

/* ── Categorised professional skills (zero emojis, highly technical) ── */
export type Skill = {
  name: string
  role: string
  tag: string
  context: string
}

export const skillCategories: { label: string; items: Skill[] }[] = [
  {
    label: 'Languages',
    items: [
      { name: 'TypeScript', role: 'Type-Safe Architecture', tag: 'Core', context: 'Strict static typing, interfaces, generics' },
      { name: 'JavaScript', role: 'ESNext / Async Event Loop', tag: 'Core', context: 'Web APIs, DOM engine, functional patterns' },
      { name: 'Python', role: 'FastAPI / OpenEnv Simulation', tag: 'Core', context: 'Compliance Audit RL environment & WebSocket streaming' },
      { name: 'Java', role: 'OOP & Scalable Backend', tag: 'Language', context: 'Object-oriented programming, data structures' },
      { name: 'C++', role: 'Algorithms & Memory', tag: 'Language', context: 'Algorithmic problem solving & low-level concepts' },
      { name: 'SQL', role: 'Relational Queries & Indexing', tag: 'Data', context: 'Query optimization, joins, relational schemas' },
    ],
  },
  {
    label: 'Frontend',
    items: [
      { name: 'React', role: 'Component Systems & Hooks', tag: 'UI Library', context: 'Primary client architecture in TourMitra & Vinod Fitness' },
      { name: 'Next.js', role: 'SSR & App Router', tag: 'Framework', context: 'Hybrid rendering, edge routing, performance tuning' },
      { name: 'Tailwind CSS', role: 'Design Systems & Tokens', tag: 'Styling', context: 'Responsive layouts, dark-mode themes, v4 engine' },
      { name: 'HTML5 / CSS3', role: 'Semantic Web & Motion', tag: 'Standard', context: 'Hardware-accelerated CSS, KaTeX, accessibility' },
    ],
  },
  {
    label: 'Backend & AI',
    items: [
      { name: 'Node.js', role: 'Event-Driven Server Runtime', tag: 'Runtime', context: 'High-throughput asynchronous REST APIs in TourMitra & Voyager' },
      { name: 'Express', role: 'MVC Architecture & REST APIs', tag: 'Framework', context: 'Route controllers, MVC models, auth guards, middleware' },
      { name: 'FastAPI', role: 'High-Speed Async Python API', tag: 'Framework', context: 'WebSocket streaming & evaluation endpoints in OpenEnv' },
      { name: 'Transformers', role: 'Agent Policy & NLP Evaluation', tag: 'Machine Learning', context: 'GPT-4o-mini baseline & GDPR compliance assessments' },
    ],
  },
  {
    label: 'DevOps & DB',
    items: [
      { name: 'MongoDB', role: 'Document Data Store', tag: 'Database', context: 'Production database for TourMitra, Voyager, and Vinod Fitness' },
      { name: 'PostgreSQL', role: 'ACID Relational Engine', tag: 'Database', context: 'Structured relational data, foreign keys, indexes' },
      { name: 'Docker', role: 'Containerization & Environments', tag: 'DevOps', context: 'Containerized deployment for Compliance Audit Environment' },
      { name: 'Kubernetes', role: 'Cluster Orchestration', tag: 'DevOps', context: 'Service discovery, pod scaling, declarative YAML' },
      { name: 'Git', role: 'Version Control & Workflows', tag: 'Tooling', context: 'Branching strategies, open source collaborative workflows' },
    ],
  },
]

/* ── Social links ── */
export type SocialLink = { platform: string; url: string; icon: string; hoverColor: string }
export const socialLinks: SocialLink[] = [
  { platform: 'WhatsApp', url: WHATSAPP_URL, icon: '💬', hoverColor: '#25D366' },
  { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/tusharpawar21/', icon: '💼', hoverColor: '#0077B5' },
  { platform: 'GitHub', url: 'https://github.com/tusharpawar04', icon: '🐙', hoverColor: '#333' },
  { platform: 'Gmail', url: getGmailComposeUrl(), icon: '✉️', hoverColor: '#EA4335' },
  { platform: 'Email App', url: `mailto:${EMAIL}`, icon: '📧', hoverColor: '#EA4335' },
]

/* ── Navigation items ── */
export type NavItem = { label: string; id: string }
export const NAV_ITEMS: NavItem[] = [
  { label: 'Work', id: 'work' },
  { label: 'About', id: 'about' },
  { label: 'Beyond', id: 'beyond' },
  { label: 'Contact', id: 'contact' },
]
