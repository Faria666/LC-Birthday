# Feature Specification: Birthday Countdown Page

**Feature Branch**: `001-birthday-countdown-page`

**Created**: 2026-06-10

**Status**: Draft

**Input**: User description: "i want a static webpage to deploy in github pages, girly, nature, old money, country, kdrama color palette, for my girlfriend's birthday, with a countdown ending 12 june 2026 at 09:45 am, her interests are reading, k dramas, nature, country aesthetic, old money aesthetic, travel. When the countdown reaches the end it should pop or throw confetti. Images and drawing and lettering and fonts should be in the style of a chibi/kawaii anime illustration."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor Views the Live Countdown (Priority: P1)

The birthday person (or anyone the creator shares the link with) opens the page and immediately sees a beautiful, personalised countdown timer ticking in real time toward 12 June 2026 at 09:45 AM. The design communicates warmth, love, and anticipation through its visual world — palette, typography, and illustrations all reinforce the girlfriend's aesthetic identity.

**Why this priority**: This is the entire purpose of the page. Every other element serves or enriches this moment.

**Independent Test**: Can be fully tested by opening the page URL before 12 June 2026 09:45 AM and confirming the timer is live, accurate, and ticking every second.

**Acceptance Scenarios**:

1. **Given** a visitor opens the page before the target datetime, **When** the page loads, **Then** a countdown displaying four labelled units — **Days : Hours : Minutes : Seconds** — is prominently visible and actively decrementing each second.
2. **Given** the countdown is running, **When** less than 1 hour remains, **Then** the display shifts to emphasise minutes and seconds with a heightened visual urgency (e.g., pulse or glow effect on the digits).
3. **Given** a visitor on a mobile device opens the page, **When** the page renders, **Then** the countdown digits and all surrounding content are fully visible without horizontal scrolling.

---

### User Story 2 - Countdown Reaches Zero and Celebration Triggers (Priority: P1)

At the precise moment the countdown hits zero, the page erupts into a joyful celebration: confetti bursts and rains across the full screen, the countdown is replaced by a personalised birthday message, and the girlfriend feels genuinely surprised and cherished.

**Why this priority**: The payoff moment the whole page builds toward. A poor transition ruins the entire emotional arc.

**Independent Test**: Can be validated by temporarily overriding the target date to 60 seconds in the future and observing the full transition flow.

**Acceptance Scenarios**:

1. **Given** the countdown reaches zero, **When** the transition triggers, **Then** confetti animates across the full viewport within 1 second of the timer hitting zero.
2. **Given** confetti is active, **When** a personalised birthday greeting is displayed, **Then** the message is clearly readable over or after the confetti and the page does not feel cluttered or broken.
3. **Given** a visitor opens the page after 12 June 2026 09:45 AM, **When** the page loads, **Then** the celebration state (confetti + birthday message) is shown immediately without showing the countdown first.
4. **Given** the celebration state is active on mobile, **When** confetti animates, **Then** animation is smooth without perceptible lag or frame drops.

---

### User Story 3 - Immersive Aesthetic Experience (Priority: P2)

The page feels like a handcrafted gift, not a generic webpage. Every visual element — colour, typography, illustration, layout — reflects the girlfriend's personality and passions: books, K-dramas, lush nature, countryside quietude, old-money elegance, and wanderlust. The art style is chibi/kawaii anime: clean outlines, rosy cheeks, soft warm rendering, expressively cute characters.

**Why this priority**: The aesthetic is the emotional differentiator. A countdown on a plain page is a tool; a beautiful page is a gift.

**Independent Test**: Can be validated by showing the page to a neutral third party and asking them to describe the mood and interests they perceive.

**Acceptance Scenarios**:

1. **Given** a visitor views the page, **When** they observe the colour palette, **Then** they see a cohesive harmony of sage green, dusty rose, warm ivory, muted gold, and soft earthy tones — consistent with K-drama, old money, nature, and country aesthetics simultaneously.
2. **Given** a visitor views the illustrations on the page, **When** they describe the art style, **Then** they use words such as "cute," "anime," "chibi," "kawaii," or "cartoon" — matching the reference image of two school children high-fiving.
3. **Given** a visitor reads any text on the page, **When** they look at the typography, **Then** they see a combination of a decorative/handcrafted display font (for headings, the countdown label, the birthday message) paired with a clean, legible body font — creating an elegant yet personal feel.
4. **Given** a visitor scrolls or examines the page, **When** they look for interest references, **Then** they can identify visual nods to at least four of the girlfriend's interests: reading, K-dramas, nature/botanical elements, country aesthetic, old money elegance, or travel.

---

### User Story 4 - Seamless Mobile and Desktop Experience (Priority: P2)

Whether the creator shares the link from a laptop or the girlfriend opens it on her phone during a commute, the experience is equally beautiful, functional, and fast on both contexts.

**Why this priority**: Personal links are overwhelmingly opened on mobile; a broken phone experience breaks the surprise.

**Independent Test**: Can be verified by opening the page on a real mobile device and on a desktop browser.

**Acceptance Scenarios**:

1. **Given** a device with screen width between 320px and 2560px, **When** the page loads, **Then** all content reflows correctly with no horizontal overflow, no overlapping elements, and no text truncation.
2. **Given** a slow mobile connection, **When** the page loads, **Then** the countdown is visible and interactive within 3 seconds.
3. **Given** JavaScript is disabled, **When** the page loads, **Then** a graceful static message (e.g., "Please enable JavaScript to experience this page") is displayed rather than a broken layout.

---

### Edge Cases

- What happens if the visitor's device clock is significantly wrong? The countdown uses the fixed target datetime against the device's `Date.now()` — a wrong device clock will show an incorrect countdown, but this is an accepted limitation for a purely client-side static page.
- What if the page is shared and opened in a country with a very different timezone? The countdown should target the correct absolute moment in time (not a local "09:45 AM") — the timezone used must be unambiguous.
- What if the confetti library fails to load (e.g., blocked by a corporate firewall)? The birthday message must still appear; confetti is a progressive enhancement.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page MUST display a live countdown timer showing days, hours, minutes, and seconds remaining until 12 June 2026 at 09:45 AM in the Europe/Lisbon timezone (UTC+2 / WEST in June).
- **FR-002**: The countdown timer MUST decrement exactly once per second without requiring a page refresh.
- **FR-003**: When the countdown timer reaches zero, the page MUST trigger a confetti animation that covers the full viewport.
- **FR-004**: When the countdown reaches zero, the page MUST transition to a celebration screen (confetti launches simultaneously per FR-003) composed of three reveal elements: (1) a prominent "Happy Birthday, Leonor!" heading in the decorative display font; (2) a thematic chibi/kawaii illustration of a girl surrounded by her interest motifs — open book, botanical flowers, a small vintage suitcase, a teacup — rendered in the same art style as the reference image; (3) a short personalised message from the creator, signed with the "Momô Minium" nickname as a decorative stamp or seal element.
- **FR-005**: If the page is loaded at or after the target datetime, the celebration state MUST be shown immediately on page load without displaying the countdown first.
- **FR-006**: The page MUST be fully responsive and render correctly on viewport widths from 320px to 2560px.
- **FR-007**: The page MUST be deployable as a static site on GitHub Pages with no server-side runtime.
- **FR-008**: The visual colour palette MUST draw from sage green, dusty rose, warm ivory, muted gold, and soft earthy/botanical tones to express the K-drama, old money, nature, and country aesthetics simultaneously.
- **FR-009**: All character illustrations on the page MUST follow the chibi/kawaii anime art style as shown in the reference image: clean black outlines, rosy blushing cheeks, large expressive eyes, soft rounded proportions, warm flat colouring.
- **FR-010**: Typography MUST use a decorative or handcrafted display typeface for the main heading and countdown label, paired with a clean, highly legible body typeface — both available as web fonts.
- **FR-011**: The page MUST include visual references to at least four of the girlfriend's interests: reading (books), K-dramas, nature/botanical, country aesthetic, old money elegance, travel.
- **FR-012**: The page MUST incorporate the girlfriend's name "Leonor" prominently as the primary name throughout the page (e.g., countdown heading "X days until Leonor's birthday"). The nickname "Momo" MAY appear as a secondary decorative label or intimate subtitle in select locations. The full affectionate name "Momô Minium" MUST appear as a decorative stamp, seal, or signature element within the celebration state reveal.
- **FR-013**: The confetti animation MUST perform smoothly on mid-range mobile hardware without causing visible lag or freezing the browser.
- **FR-014**: The page MUST pass WCAG 2.1 AA contrast requirements for all text elements (per the project constitution).

### Key Entities

- **Countdown Target**: The fixed absolute datetime — 12 June 2026 at 09:45 AM in the specified timezone — that separates the countdown state from the celebration state.
- **Countdown State**: The full page experience rendered while time remains: live timer, ambient illustrations, anticipation-building copy.
- **Celebration State**: The page experience activated when the timer reaches zero or the page is loaded past the target: confetti, birthday message, reveal content.
- **Aesthetic Identity**: The curated visual language of the page — palette, illustration style, typography, motifs — derived from the girlfriend's interests and the chibi/kawaii reference style.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can identify the page as a personalised birthday countdown within 5 seconds of arrival, without reading any instructions.
- **SC-002**: The countdown digits visibly update every second with no perceptible delay or stutter on a mid-range Android or iOS device.
- **SC-003**: The confetti celebration begins within 1 second of the countdown reaching zero.
- **SC-004**: The page is fully interactive (countdown running, layout complete, fonts loaded) within 3 seconds on a mobile 4G connection.
- **SC-005**: The page renders without horizontal overflow or element overlap at any viewport width between 320px and 2560px.
- **SC-006**: A neutral viewer shown the page — without context — describes the aesthetic as "cute," "elegant," "nature-inspired," or "K-drama/Asian" without prompting.
- **SC-007**: Total JavaScript payload for the critical path is under 50 kB compressed (per the project constitution).

---

## Assumptions

- The target timezone is Europe/Lisbon (UTC+2 in June — WEST), confirmed by the creator.
- The girlfriend's primary name is **Leonor**; her intimate nickname is **Momo**; her full playful name is **Momô Minium** — all three appear in different typographic roles.
- The celebration reveal illustration will feature a chibi/kawaii girl surrounded by interest motifs (book, botanical flowers, vintage suitcase, teacup); sourced from royalty-free/open-licence assets or provided by the creator.
- The page is a single-screen experience: one URL, no multi-page routing.
- The page will be shared with the girlfriend via a direct URL — search engine indexing is not a goal.
- The confetti effect is implemented via a lightweight client-side library to respect the 50 kB bundle limit from the project constitution.
- Personalised message copy (the short text shown after confetti) will be provided by the creator before implementation; placeholder text will be used during development and testing.
- No analytics, tracking, or back-end services are required.
- The page degrades gracefully: if JavaScript fails to load, a static message is visible and the layout does not break.
