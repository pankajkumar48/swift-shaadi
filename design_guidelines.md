# Swift Shaadi - Design Guidelines

## Design Approach
**Wedding-Focused PWA Design** - Drawing inspiration from modern wedding platforms like Zola, The Knot, and Joy, combined with clean mobile-first principles. This is a utility application with emotional resonance, requiring both efficiency and warmth.

## Color Palette
**Light Pastel Wedding Theme:**
- Soft Peach (#FFE5D9, #FFDDC1)
- Blush Pink (#FFD6D6, #FFC7C7)
- Mint (#D4F1E8, #B8E6D5)
- Lavender (#E6E6FA, #D8D8F7)
- Light Gold (#FFF8DC, #F5E6C8)
- White (#FFFFFF, #FAFAFA)

**Usage:**
- Backgrounds: White and very light tints
- Accents: Soft peach and blush pink for primary actions
- Status indicators: Mint (success), lavender (info), light gold (premium badges)
- Absolutely NO harsh neons, saturated colors, or dark backgrounds

## Typography
**Font Stack:** SF Pro Display / -apple-system / Helvetica Neue / Arial / sans-serif

**Hierarchy:**
- Page Titles: 24px-28px, medium weight (500)
- Section Headers: 18px-20px, medium weight (500)
- Card Titles: 16px-18px, medium weight (500)
- Body Text: 15px-16px, regular weight (400)
- Small Text/Labels: 13px-14px, regular weight

**Spacing:** Generous line-height (1.6-1.8) for readability

## Layout System
**Tailwind Spacing Primitives:** Use units of 2, 3, 4, 6, 8, 12, 16 (p-2, p-4, h-8, m-6, etc.)

**Container Strategy:**
- Mobile-first responsive design
- Max width: 1200px for desktop views
- Padding: p-4 (mobile), p-6 (tablet), p-8 (desktop)
- Consistent card spacing: gap-4 (mobile), gap-6 (desktop)

## Component Library

### Navigation
- Bottom tab bar for mobile (4-5 main sections: Dashboard, Guests, Timeline, Tasks, Budget)
- Top header with wedding name and profile/settings icon
- Premium features badge in navigation with gold accent

### Cards
- Soft shadows (shadow-sm to shadow-md)
- Rounded corners (rounded-lg to rounded-xl)
- White backgrounds with subtle borders
- Generous internal padding (p-4 to p-6)

### Buttons
- Primary: Soft peach/blush pink background, white text, rounded-full
- Secondary: White background, soft border, peach text
- Sizes: px-6 py-3 (default), px-4 py-2 (small)
- Icons from Heroicons (outline style for consistency)

### Forms
- Clean, spacious input fields with rounded corners
- Floating labels or clear top-aligned labels
- Soft focus states (lavender/mint borders)
- Generous spacing between fields (mb-4 to mb-6)
- Helper text in muted colors

### Data Display
- Lists with card-based items (not dense tables)
- Guest cards with avatar placeholders, name, RSVP status badge
- Event cards with date badge, time, location icons
- Task cards with checkboxes, due date, assignee avatar
- Budget cards with category, planned/actual progress bars

### Status Badges
- RSVP statuses: Going (mint), Not Going (soft gray), Maybe (lavender), Invited (light peach)
- Task statuses: To Do (light gray), In Progress (lavender), Done (mint)
- Role badges: Owner (light gold), FamilyAdmin (blush pink), Helper (lavender)
- Rounded-full, px-3 py-1, small text

### Premium Feature Placeholders
- Locked state cards with light gold border
- "Coming Soon - Premium Feature" message with crown/lock icon
- Soft disabled appearance, not clickable

### Icons & Accents
- Heroicons throughout for consistency
- Subtle decorative elements: small flower/ring illustrations in empty states
- Use sparingly for elegance - not cluttered

## Dashboard Layout
**Four Summary Cards:**
1. Guest Count & RSVP breakdown (donut chart or simple counts)
2. Next Upcoming Event (date, event name, countdown)
3. Open Tasks Count (with quick link)
4. Budget Snapshot (total, spent, remaining with progress bar)

**Grid:** 1 column (mobile), 2 columns (tablet), 2x2 grid (desktop)

## Invitation Generator
- Template selector as scrollable card carousel
- Preview card showing filled template with couple's details
- "Copy to Clipboard" button (primary action)
- Templates organized by category (Traditional, Modern, Regional)

## Animations
**Minimal and Purposeful:**
- Smooth page transitions (fade)
- Button press feedback (subtle scale)
- Card hover states on desktop only
- No distracting scroll animations

## Accessibility
- WCAG AA contrast ratios (maintain even with pastel colors)
- Clear focus states for keyboard navigation
- Descriptive button labels
- Form field labels always visible

## Images
**No large hero images required** - This is a utility dashboard application. Use:
- Illustration placeholders for empty states (guests list, timeline, tasks)
- Small decorative accents (flower/ring icons) in headers
- Avatar placeholders for guests and team members
- Keep focus on functionality and data, not visual imagery