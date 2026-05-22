# Visual Language Guide

- **Contrast-First Palette**: The UI leans on
  high-contrast black and white, treating mid greys
  (#f5f5f5, #e0e0e0, #666) as supporting tones for
  depth and hierarchy. Cards and toggles use white
  backgrounds with black borders; active states invert
  to black backgrounds with white text for clarity.

- **Geometric Structure**: Components rely on rectangles
  with tight 4px radii and generous gutters (15–40px)
  to keep dense information readable.

- **Card Framing & Grouping**: Every logical group sits
  inside a bordered box to echo the control panel
  aesthetic. Headings keep moderate weight (500–600).

- **Stateful Toggles & Buttons**: Active items add 1px
  thicker borders plus subtle lift shadows; inactive
  items fade to soft grey while staying legible.

- **Interactive Micro-Patterns**: 0.2s transitions,
  small hover lifts, scaling info icons to 110%.

- **Typography**: Headings use clamp() to scale between
  desktop and mobile with tight letter-spacing.
  Body copy 0.95–1.05rem in neutral greys.

- **Control Styling**: Slider thumbs are solid black
  circles with white borders. Restrained greys with
  black text throughout.

- **Dark Mode**: Inverts backgrounds to near-black but
  keeps borders white to preserve the signature frame.
  Active elements flip to white with black text.
  Treat every surface as a card with a border — invert
  card and text colors, keep geometry identical.
