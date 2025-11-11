# Design Guidelines: Cycle Syncing App

## Design Approach

**Reference-Based Approach**: Drawing inspiration from modern wellness apps with a focus on calm functionality. Primary references:
- **Headspace** - approachable wellness tone with clean information hierarchy
- **Notion** - organized content with breathing room
- **Calm** - soothing interface design without clinical coldness

**Design Principles**:
1. Grounded warmth - trustworthy but never sterile
2. Breathing room - generous spacing for calm feeling
3. Human-first - conversational UI text, never robotic
4. Mobile-optimized - primary use case is daily phone check-ins

## Typography System

**Font Families** (Google Fonts):
- **Primary**: Inter (400, 500, 600) - body text, UI elements
- **Display**: DM Sans (500, 700) - headings, emphasis

**Hierarchy**:
- Hero/Dashboard headers: text-4xl md:text-5xl, font-bold
- Section headers: text-2xl md:text-3xl, font-semibold
- Card titles: text-xl, font-medium
- Body text: text-base, font-normal, leading-relaxed
- Small text/captions: text-sm
- Aunt B chat responses: text-base, leading-loose (extra breathing room)

## Layout System

**Spacing Primitives**: Use Tailwind units of **4, 6, 8, 12, 16** for consistency
- Component padding: p-6 to p-8
- Section spacing: py-12 to py-16
- Card gaps: gap-6
- Tight spacing: space-y-4
- Generous spacing: space-y-8

**Container Strategy**:
- Max width: max-w-6xl for main content
- Dashboard cards: max-w-sm to max-w-md
- Chat interface: max-w-3xl
- Full-width sections for phase visualizations

## Core Components

### 1. Cycle Compass (Dashboard Hero)
- Circular phase indicator centered at top
- Current phase name prominently displayed
- Brief Aunt B-style message below (e.g., "You're in your luteal phase, which means it's okay to say no more often")
- Today's date and cycle day count
- Visual progress arc showing phase progression

### 2. Phase Card Layout
Large cards for each of 4 phases with:
- Phase icon/symbol
- Phase name and day range
- Energy level indicator
- 3-4 bullet points of key characteristics
- "Learn more" expansion option

### 3. Daily Check-In Form
Clean, vertical form layout:
- Question groupings with space-y-6
- Radio buttons for mood/energy (visual scale 1-5)
- Checkboxes for physical symptoms (grouped)
- Textarea for notes (optional, generous height)
- Submit button with encouraging copy ("Share with Aunt B")

### 4. Ask Aunt B Chat Interface
- Chat bubbles with generous padding (p-4 to p-6)
- User messages: aligned right, distinct styling
- Aunt B responses: aligned left, warm styling
- Avatar for Aunt B (circular, 40px)
- Input at bottom with auto-focus
- Scrollable message area with smooth scroll

### 5. Tips & Suggestions Cards
Grid layout (grid-cols-1 md:grid-cols-2):
- Icon at top (48px size)
- Category label (Mind/Body/Food/Flow)
- 2-3 practical suggestions
- Subtle card elevation
- Rounded corners (rounded-xl)

### 6. Gentle Wins Tracker
Vertical checklist layout:
- Large, satisfying checkboxes
- Habit text with encouraging wording
- Completion count at top
- Reset option at bottom
- Celebration micro-interaction on completion

### 7. Partner View Dashboard
Simplified, educational view:
- Phase overview card (larger)
- "What to know" section with 3-4 key points
- "Ways to support" practical suggestions
- "Ask before assuming" reminder card
- No access to personal check-in data

### 8. Navigation
Top navigation bar:
- Logo/app name left
- Main nav items center (Dashboard, Check-In, Learn, Chat)
- User menu right with partner toggle if applicable
- Sticky on scroll
- Mobile: hamburger menu

## Component Patterns

**Cards**: All cards use rounded-xl, shadow-sm, p-6, with hover:shadow-md transition

**Buttons**:
- Primary actions: px-6 py-3, rounded-full, font-medium
- Secondary: outlined style, same dimensions
- Icon buttons: rounded-full, p-3

**Form Inputs**:
- Consistent height: py-3 px-4
- Rounded-lg borders
- Focus states with ring effect
- Labels above inputs with mb-2

**Phase Indicators**: 
- Use progress bars/arcs
- Segment indicators for 4 phases
- Visual current phase highlight

## Animations

Minimal, purposeful animations only:
- Smooth transitions on card hover (transform scale-105)
- Gentle fade-in for content loading
- Check-in submission with brief success animation
- Chat message slide-in
- NO decorative background animations

## Images

**Hero Section**: 
- Dashboard uses illustrated cycle diagram, not photo
- Marketing pages can use soft, abstract imagery

**Throughout App**:
- Phase icons (custom illustrated, simple line art style)
- Aunt B avatar (warm, friendly illustration - not realistic photo)
- Wellness spot illustrations for tips sections
- NO stock photos of women - keep it abstract/illustrated

**Image Placement**:
- Login/onboarding: full-width hero with soft gradient overlay
- Phase education pages: supporting illustrations inline with content
- Body Cues library: simple diagrams where helpful

## Responsive Strategy

**Mobile-first** (primary experience):
- Single column layouts
- Bottom navigation option
- Thumb-friendly tap targets (min 44px)
- Generous spacing for readability

**Tablet** (md:):
- Two-column card grids
- Sidebar navigation appears
- Expanded phase visualizations

**Desktop** (lg:):
- Dashboard with sidebar + main content area
- Three-column tip grids
- Chat interface with fixed width for readability

## Content Tone in UI

All UI copy follows Aunt B voice:
- Buttons: "Let's check in" not "Submit"
- Empty states: "Nothing here yet, love" not "No data"
- Errors: "Oops, something got mixed up" not "Error"
- Success: "Got it, thanks for sharing" not "Saved successfully"