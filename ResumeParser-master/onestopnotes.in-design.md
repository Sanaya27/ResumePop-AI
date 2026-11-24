---
version: alpha
name: One Stop Notes
description: A playful, high-contrast study product with bold editorial type, bright accent color, and sticker-like UI depth.
colors:
  primary: "#ffdb00"
  secondary: "#ff4bb3"
  tertiary: "#6ee7b7"
  neutral: "#fef2fb"
  surface: "#fffdfe"
  on-surface: "#110d17"
  error: "#db2777"
  border: "#0f0b15"
  border-soft: "#2a2330"
  accent-soft: "#fef08a"
  highlight: "#7fe8c5"
typography:
  headline-display:
    fontFamily: "Space Grotesk"
    fontSize: "96px"
    fontWeight: 900
    lineHeight: "115px"
    letterSpacing: "0px"
  headline-lg:
    fontFamily: "Space Grotesk"
    fontSize: "48px"
    fontWeight: 800
    lineHeight: "56px"
    letterSpacing: "0px"
  headline-md:
    fontFamily: "Space Grotesk"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: "38px"
    letterSpacing: "0px"
  headline-sm:
    fontFamily: "Space Grotesk"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: "36px"
    letterSpacing: "0px"
  body-lg:
    fontFamily: "Space Grotesk"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "28px"
    letterSpacing: "0px"
  body-md:
    fontFamily: "Space Grotesk"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "26px"
    letterSpacing: "0px"
  body-sm:
    fontFamily: "Space Grotesk"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "22px"
    letterSpacing: "0px"
  label-lg:
    fontFamily: "Space Mono"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: "18px"
    letterSpacing: "0.08em"
  label-md:
    fontFamily: "Space Mono"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: "16px"
    letterSpacing: "0.08em"
  label-sm:
    fontFamily: "Space Mono"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: "14px"
    letterSpacing: "0.1em"
  mono-xs:
    fontFamily: "Space Mono"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: "13px"
    letterSpacing: "0.1em"
rounded:
  none: "0px"
  sm: "8px"
  md: "14px"
  lg: "22px"
  xl: "28px"
  full: "9999px"
spacing:
  xs: "6px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "80px"
  gutter: "24px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.error}"
    textColor: "{colors.surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
    height: "40px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
    height: "40px"
  button-tertiary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
    height: "40px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "20px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: "10px 14px"
  chip:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "6px 10px"
  marquee-bar:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.surface}"
    typography: "{typography.label-md}"
    height: "48px"
  badge:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-surface}"
    typography: "{typography.mono-xs}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
# One Stop Notes

## Overview
One Stop Notes feels energetic, youthful, and product-led, with a strong “study app meets creator brand” personality. The page balances playful stickers, bright accents, and bold typography against a soft pink canvas, making it feel approachable rather than corporate. The layout is spacious and centered, giving the interface room to breathe while still feeling full of momentum.

## Colors
- **Primary (#ffdb00):** A saturated sunflower yellow used as an attention-grabbing accent for highlights, icons, and small emphasis moments. It should feel cheerful and optimistic, not dominant.
- **Secondary (#ff4bb3):** A vivid hot pink that carries the brand’s strongest personality and powers primary action, marquee energy, and headline emphasis. It is the most recognizable brand color in the system.
- **Tertiary (#6ee7b7):** A mint-green accent used for supportive badges, avatars, and “live” style indicators. It softens the palette and adds a fresh, digital-sticker feel.
- **Neutral (#fef2fb):** The page background is a very pale blush pink, creating a warm, friendly atmosphere and making dark text pop strongly.
- **Surface (#fffdfe):** Nearly white card and control surfaces keep the interface crisp against the pink background while preserving the soft overall tone.
- **On-surface (#110d17):** A near-black ink used for headings, body copy, borders, and icon outlines. This high contrast is central to the brand’s legibility and graphic style.
- **Error (#db2777):** A saturated magenta-red used sparingly for accents, active states, or emphasis that needs stronger urgency without breaking the palette.
- **Border (#0f0b15):** A deep outline color used to simulate thick marker strokes and create the sticker-like, cutout feel throughout the UI.
- **Border-soft (#2a2330):** A secondary dark tone that can be used where borders need slightly less visual weight than the main ink.
- **Accent-soft (#fef08a):** A lighter yellow used for secondary emphasis and friendly callouts.
- **Highlight (#7fe8c5):** A bright aqua-mint highlight color suited to small status elements and playful decorative details.

## Typography
The system is built almost entirely on Space Grotesk for a modern, rounded, editorial voice. Headlines use heavy weights, especially the display level, to create strong hierarchy and a confident, poster-like feel. Body text stays in Space Grotesk at regular weight for consistency and readability, while labels and tiny utility text switch to Space Mono to reinforce the coded, study-tool aesthetic.

Uppercase labels and navigation items rely on extra letter spacing and mono styling to feel crisp and techy. Headline treatment is bold but not overly condensed, and large type is allowed to dominate the page as a design feature. Use the display scale for hero statements, the mid-scale headlines for section titles, and the mono labels for pills, badges, and small interface copy.

## Layout
The composition is centered and roomy, with a large hero area and generous vertical breathing space between sections. Content sits in a fixed-ish max-width presentation rather than a dense fluid grid, which helps the page feel like a landing page rather than an application shell. The spacing rhythm is built around 6px, 16px, 24px, 40px, and 80px steps, with section-level separation using the larger values.

Cards and feature panels use substantial internal padding, especially around demo content, so components feel tactile and poster-like. Top navigation is compact, while the hero uses wide margins and large gaps to create focus. Marquee bars, pills, and badges should keep tight padding and short heights to preserve the crisp, energetic rhythm.

## Elevation & Depth
Depth is created with strong outlines and offset shadows rather than soft blur. The visual language resembles layered stickers: white surfaces, thick dark borders, and hard-edged drop shadows that push elements forward. Shadows are simple and graphic, often appearing as a small black offset rather than atmospheric elevation.

Because the system is mostly flat and outlined, contrast does much of the hierarchy work. Cards, buttons, and chips should feel like cutout pieces placed on top of the background. Avoid subtle gradients or glass effects; the brand depends on clear shapes and bold separation.

## Shapes
The shape language is rounded but assertive. Pills and buttons use full rounding, while larger containers use generous but not fully circular corners, giving the interface a friendly, toy-like softness. The system feels “soft-edged” rather than squishy, with clean radii that still respect the strong border treatment.

Use full rounding for primary actions, chips, and badges. Use the larger card radius for panels and feature blocks. Square corners should be reserved for structural elements only when needed, since the overall brand leans into approachable, rounded geometry.

## Components
Buttons are highly stylized and central to the brand. Primary buttons should use `button-primary`: hot pink or bright accent surfaces, bold text, thick dark borders, and a pronounced offset shadow. Secondary buttons should use `button-secondary`: white or surface fill, dark text, and the same pill shape so they still read as actions without competing with the primary CTA. Tertiary buttons can use `button-tertiary` for playful utility actions or compact accent buttons. Maintain tight vertical padding and medium horizontal padding so the pills stay compact and energetic.

Buttons should feel tactile on hover and active states, but not glossy. If a hover variant is needed, darken or intensify the fill while preserving the border and shadow logic. Keep icon + text buttons aligned center, and avoid oversized button heights that would dilute the compact system.

Cards use `card`: a light surface, dark border, rounded corners, and a clean interior with 20px padding. Cards should frame content as a discrete module, often with simple sections and lots of whitespace. Feature cards can include dashed or lighter internal regions for placeholders, but the outer shell should remain bold and graphic.

Inputs should mirror button geometry with full or near-full rounding, white surfaces, and strong outlines. They should feel like friendly tools, not enterprise form fields. Focus states should be obvious through border color change or shadow emphasis, not subtle shading.

Chips and badges use small, compact pills with mono typography and bright accent fills. Use `chip` for label-like affordances and `badge` for status text or small callouts. Keep these elements short and punchy so they function like stickers rather than tags.

Marquee bars and announcement strips should be vivid, full-width, and uppercase or small-caps in feel, with mono labels and repeated separators. They work best as high-energy information bands, not quiet utility text. Decorative icons, stars, and tiny avatars should use the accent palette to support the brand’s playful momentum.

## Do's and Don'ts
- Do keep primary actions pill-shaped, bold, and bordered with a visible shadow.
- Do use Space Grotesk for most text and Space Mono for compact labels, badges, and utility copy.
- Do preserve the soft pink background and strong dark text contrast.
- Do make hero headlines large and expressive; treat type as a visual asset.
- Don't introduce soft, blurry shadows or glassmorphism.
- Don't use muted, corporate blues or grays as major brand colors.
- Don't make cards or buttons feel delicate; the system should read as sturdy and sticker-like.
- Don't overuse rounded corners inconsistently—stick to the established pill and large-radius language.