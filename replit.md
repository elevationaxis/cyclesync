# Cync — Cycle Intelligence by Chaos & Co

## Overview

Cync is a cycle intelligence companion within the Chaos & Co ecosystem, designed to transform cycle data into actionable daily support. The app helps users understand their hormonal rhythms through science-backed guidance delivered in a warm, conspiratorial tone inspired by a "wise auntie" persona named Aunt B. The platform emphasizes connection over clinical tracking, making self-care social and collaborative while supporting partners via CyncLink. Part of the broader Chaos & Co brand alongside The Sanctuary (physical spaces) and The Thread (premium membership).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and data fetching

**UI Component System**
- Radix UI primitives for accessible, unstyled component foundations
- shadcn/ui component library configured with "new-york" style preset
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for type-safe component variants

**Design System — Chaos & Co Brand**
- Typography: Inter (body/UI) and DM Serif Display (display/headings) from Google Fonts
- Brand colors: Warm Black #0D0B0A, Dusty Rose #C4846E, Warm Cream #F7F2EB, Copper #B07D52, Lavender Whisper #EDE4F5
- CSS custom properties: --brand-rose, --brand-cream, --brand-copper, --brand-lavender, --brand-black
- Spacing primitives based on Tailwind units (4, 6, 8, 12, 16)
- Border radius: small (0.375rem) for editorial feel
- Landing page uses full-bleed dark (warm black) editorial design; app interior uses cream-based light theme
- Responsive breakpoints prioritizing mobile-first design
- Custom elevation system using hover/active states and shadow utilities

**State Management Pattern**
- Server state managed via TanStack Query with optimistic updates
- Local UI state handled with React hooks (useState, useContext)
- No global state management library - relying on component composition and React Query cache

### Backend Architecture

**Runtime & Server Framework**
- Node.js with Express.js for REST API endpoints
- TypeScript throughout for type safety across client and server
- ESM module system for modern JavaScript standards

**API Design**
- RESTful endpoints under `/api` namespace
- JSON request/response format
- Session-based authentication architecture (connect-pg-simple for session store)
- File upload support via Multer for ritual media (audio/video)
- Request logging middleware for debugging and monitoring

**AI Integration**
- OpenAI GPT-5 integration via Replit AI Integrations service
- "Aunt B" chatbot persona with custom system prompts emphasizing grounded, non-clinical wellness language
- Streaming not implemented - using standard completion responses

### Data Storage

**Database Technology**
- PostgreSQL via Neon serverless driver for connection pooling
- Drizzle ORM for type-safe database queries and schema management
- Schema-first approach with Drizzle Kit for migrations

**Data Models**
- **User Profiles**: User onboarding data with name, lastPeriodStart, cycleLength, and optional concerns
- **Spoon Entries**: Daily energy tracking using spoon theory (totalSpoons, usedSpoons, notes)
- **Rituals**: Phase-specific audio/video guided practices with file storage
- **Care Requests**: Partner support requests with status tracking
- **Community Posts**: Anonymous Q&A organized by cycle phase with upvoting
- **Calendar Events**: Shared scheduling with cycle phase associations

**File Storage Strategy**
- Local filesystem storage in `attached_assets/rituals/` directory
- Files served via Express static middleware
- Upload limits: 100MB max file size
- Allowed formats: mp3, mp4, wav, m4a, mov, avi, webm

### User Onboarding Flow

**Multi-Step Onboarding**
- Landing page at "/" introduces Aunt B persona with warm, inviting copy
- "Get Started" navigates to /onboarding (4-step form)
- Step 1: Name collection for personalization
- Step 2: Last period start date for cycle tracking
- Step 3: Average cycle length (default 28 days, range 20-45)
- Step 4: Optional concerns/goals for personalized support
- On completion, profile stored in database and localStorage, redirects to /dashboard

**Access Control**
- Dashboard and app routes protected via ProtectedApp component
- Checks localStorage for cycleSync_profileId
- Redirects to /onboarding if no profile exists

### Cycle Calculation Logic

**Phase Determination**
- Four phases: Menstrual (days 1-5), Follicular (6-13), Ovulatory (14-17), Luteal (18-28)
- Default 28-day cycle with user-configurable length
- Phase boundaries scale proportionally for non-28-day cycles
- Phase-specific color coding, energy descriptions, and support tips
- Utility functions in `client/src/lib/cycleUtils.ts`:
  - `calculateCycleDay()`: Computes current day from lastPeriodStart
  - `getPhaseForCycleLength()`: Returns phase adjusted for custom cycle length
  - `getCurrentPhase()`: Legacy function for 28-day cycles

### Authentication & Security

**Current Implementation**
- Session-based authentication using express-session with PostgreSQL store
- Password storage (implementation details not visible but schema includes password field)
- Credentials included in fetch requests for session persistence

**Security Considerations**
- CORS configured for same-origin requests
- File upload validation by MIME type and extension
- Environment variable requirements for DATABASE_URL and AI API keys

### Partner Feature Architecture

**View Toggle System**
- Client-side state toggle between primary user and partner views
- Partner view provides phase-specific support tips without exposing private data
- Care request system allows users to send specific support needs to partners
- Calendar sharing with phase visualization for both users

### Development & Deployment

**Environment Configuration**
- Database URL required via DATABASE_URL environment variable
- AI integration via Replit-provided OpenAI-compatible endpoint
- Development mode includes Replit-specific plugins (cartographer, dev banner, error overlay)

**Build Process**
- Client: Vite build outputting to `dist/public`
- Server: esbuild bundling to `dist/index.js` with external packages
- Drizzle migrations managed via `drizzle-kit push` command

**Path Aliases**
- `@/`: Client source directory
- `@shared/`: Shared types and schemas
- `@assets/`: Attached assets directory

## External Dependencies

### Third-Party Services

**AI & ML**
- Replit AI Integrations (OpenAI-compatible API) for GPT-5 model access
- Powers "Aunt B" conversational chatbot feature

**Database**
- Neon Serverless PostgreSQL with WebSocket connections
- Managed database service requiring DATABASE_URL environment variable

### Key Libraries

**Frontend**
- @tanstack/react-query: Server state synchronization
- wouter: Lightweight routing
- @radix-ui/*: 20+ accessible UI primitive components
- tailwindcss: Utility-first CSS framework
- react-hook-form + @hookform/resolvers: Form validation
- date-fns: Date manipulation for cycle calculations
- cmdk: Command palette component

**Backend**
- drizzle-orm + @neondatabase/serverless: Database ORM and driver
- express: Web server framework
- multer: Multipart form data handling for file uploads
- connect-pg-simple: PostgreSQL session store
- openai: AI completions client

**Development**
- typescript: Type checking
- vite: Build tool and dev server
- tsx: TypeScript execution for development
- esbuild: Production server bundling
- drizzle-kit: Schema migrations

### Font & Design Assets

- Google Fonts API for Inter and DM Sans typefaces
- Custom favicon served from `/favicon.png`