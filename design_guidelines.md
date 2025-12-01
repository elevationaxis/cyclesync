# Design Guidelines: Cycle Syncing App with Aunt B

## Design Approach

**Reference-Based Approach**: Drawing inspiration from modern wellness apps that prioritize calm functionality and emotional safety.

**Primary References**:
- **Headspace** - approachable wellness tone with clean hierarchy
- **Notion** - organized content with generous breathing room
- **Calm** - soothing interface without clinical coldness

**Design Principles**:
1. Grounded warmth - trustworthy older sister energy, never sterile
2. Emotional safety - cozy, supportive spaces users return to daily
3. Visual calm - generous whitespace, soft edges, gentle shadows
4. Human-first - conversational UI, zero clinical or mystical language
5. Mobile-optimized - primary daily check-in device

## Color System

**Foundation**:
- Soft Cream (#F7F4F2) - primary backgrounds, breathing room
- Light Taupe (#E4DAD2) - secondary backgrounds, subtle cards
- Charcoal Grey (#3A3A3A) - body text, readable and warm

**Accent Colors**:
- Cozy Lavender (#C8B7E4) - primary actions, phase highlights
- Soft Plum (#A184C5) - interactive elements, emphasis
- Lilac Wash (#EFE7FA) - soft backgrounds, gentle emphasis areas
- Muted Peach (#F2C8B8) - warm accents, celebration moments

**Application Strategy**:
- Page backgrounds: Soft Cream
- Card backgrounds: White with soft shadows
- Aunt B chat bubbles: Lilac Wash with Soft Plum text
- User chat bubbles: Light Taupe
- Phase indicators: Gradient from Cozy Lavender to Soft Plum
- Primary buttons: Soft Plum with white text
- Success states: Muted Peach accents
- Text hierarchy: Charcoal Grey primary, Soft Plum for emphasis

## Typography System

**Font Families** (Google Fonts):
- **Primary**: Inter (400, 500, 600) - UI elements, body text
- **Display**: DM Sans (500, 700) - headings, warmth

**Hierarchy**:
- Hero/Dashboard headers: text-4xl md:text-5xl, font-bold (DM Sans)
- Section headers: text-2xl md:text-3xl, font-semibold (DM Sans)
- Card titles: text-xl, font-medium (Inter)
- Body text: text-base, leading-relaxed (Inter)
- Aunt B responses: text-base, leading-loose (extra breathing room)
- Captions/metadata: text-sm

## Layout System

**Spacing Primitives**: Tailwind units of **4, 6, 8, 12, 16**
- Card padding: p-6 md:p-8
- Section spacing: py-12 md:py-16
- Component gaps: gap-6
- Vertical rhythm: space-y-6 to space-y-8
- Tight groupings: space-y-4

**Container Strategy**:
- Main content: max-w-6xl
- Dashboard cards: max-w-md
- Chat interface: max-w-3xl
- Reading content: max-w-prose

## Core Components

### 1. Cycle Compass Dashboard Hero
Centered circular phase visualization (300px diameter on desktop):
- Current phase name prominently displayed inside circle
- Gentle progress arc showing phase progression (gradient: Cozy Lavender to Soft Plum)
- Today's date and cycle day count below
- Aunt B's supportive daily message card beneath (Lilac Wash background, rounded-2xl, p-8)
- Four phase segments around circle with labels and day ranges

### 2. Phase Education Cards
Large, breathing cards in 2-column grid (single column mobile):
- Rounded-2xl corners with shadow-sm
- Generous padding (p-8)
- Simple line-art phase icon at top (48px, Soft Plum)
- Phase name (text-2xl, font-semibold)
- Day range subtitle (text-sm, Charcoal Grey)
- Energy level visual bar (gradient fill)
- 4-5 characteristic bullet points with ample line-height
- Expandable "Learn more" section (collapsed by default)

### 3. Daily Check-In Flow
Vertical single-column form with breathing room:
- Progress indicator at top (4 dots showing current section)
- Section headers with encouraging copy
- Mood scale: 5 large circular buttons (60px) with emoji representations
- Energy level: Horizontal slider with soft endpoints
- Physical symptoms: Generous checkbox grid (grid-cols-2 md:grid-cols-3, gap-4)
- Notes textarea: min-height 120px, rounded-lg, Lilac Wash background
- Submit button: full-width on mobile, centered on desktop, rounded-full, px-8 py-4

### 4. Ask Aunt B Chat Interface
Clean conversation layout:
- Aunt B avatar: 48px circular illustration (warm, friendly face with cozy lavender tones)
- Aunt B messages: left-aligned, Lilac Wash background, rounded-2xl (sharp corner bottom-left), p-6, max-width 80%
- User messages: right-aligned, Light Taupe background, rounded-2xl (sharp corner bottom-right), p-4, max-width 70%
- Generous message spacing (space-y-6)
- Input field: sticky bottom, Light Taupe background, rounded-full, py-4 px-6, shadow-lg
- Send button: circular (48px), Soft Plum, icon only

### 5. Tips & Wellness Suggestions
Grid layout (grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-6):
- Category label ribbon at top (Mind/Body/Food/Flow) - Muted Peach background
- Simple icon (Soft Plum, 40px)
- Card title (text-lg, font-medium)
- 3-4 practical suggestions as clean list
- Cards use white backgrounds with shadow-sm, rounded-xl, p-6
- Hover: shadow-md transition

### 6. Gentle Wins Tracker
Vertical checklist with celebration:
- Section header with current streak count
- Large checkboxes (32px) with rounded-lg borders
- Habit labels with warm, encouraging wording (text-base, leading-relaxed)
- Checked items: Muted Peach checkmark, subtle strikethrough
- Completion celebration: Confetti-style dots (Cozy Lavender, Soft Plum, Muted Peach)
- Weekly reset indicator at bottom
- Each item: p-4, hover background Light Taupe

### 7. Partner Dashboard View
Simplified, educational cards:
- Large phase overview hero (same circular design, educational context)
- "What's happening" card: current phase explanation, p-8, white background
- "Ways to support" grid: 3-4 suggestion cards with icons
- "Remember" reminder card: Lilac Wash background, italic text emphasis
- "Ask first" principle highlighted
- No personal check-in data visible

### 8. Navigation Structure
**Desktop**: Top horizontal bar (sticky)
- Logo/app name left (DM Sans, text-xl)
- Main nav center: Dashboard, Check-In, Learn, Chat (horizontal spacing gap-8)
- User menu right with partner toggle if enabled
- Background: white with shadow-sm
- Active nav items: Soft Plum underline

**Mobile**: Bottom tab bar (fixed)
- 4 main sections as icons with labels
- Active tab: Cozy Lavender fill
- Safe area padding for modern devices

## Images

**Illustrated Style Throughout** (NO photos):

**Hero Section (Marketing/Onboarding)**:
- Soft abstract illustration of cycle phases as flowing shapes
- Gentle gradients (Soft Cream → Lilac Wash → Cozy Lavender)
- Width: full-width, height: 60vh
- CTA buttons overlaid with backdrop-blur-sm backgrounds

**Dashboard**:
- Cycle Compass uses custom SVG illustration (geometric, clean)
- Phase icons: simple line-art representations (flower buds, blooms, leaves, rest)

**Throughout App**:
- Aunt B avatar: warm illustrated character (cozy cardigan colors)
- Wellness illustrations: minimalist spot illustrations for tip categories
- Body symptom diagrams: clean, educational line drawings
- Success states: small celebratory abstract shapes (dots, gentle curves)

**Image Library**:
All images use CDN placeholders with specific descriptions for custom illustration

## Responsive Strategy

**Mobile (Primary Experience)**:
- Single column layouts
- Bottom navigation (fixed)
- Thumb-friendly targets (min 48px)
- Cycle Compass: 240px diameter
- Generous tap padding

**Tablet (md:)**:
- Two-column card grids
- Cycle Compass: 280px diameter
- Side navigation appears
- Expanded chat width

**Desktop (lg:)**:
- Dashboard with sidebar navigation + main content
- Three-column tip grids
- Cycle Compass: 320px diameter
- Chat interface max-w-3xl centered
- Generous margins (px-8 to px-16)

## Content Voice

All UI copy maintains Aunt B warmth:
- Buttons: "Let's check in" / "Share with me" / "Got it, thanks"
- Empty states: "Nothing here yet, love"
- Errors: "Oops, something got tangled"
- Loading: "Just a moment, dear"
- Success: "Beautiful, I've got it"