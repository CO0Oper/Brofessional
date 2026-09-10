---
name: Brofessional
description: An editorial two-panel translation desk framed in black, paper, and restrained LinkedIn blue.
colors:
  ink: "#101214"
  muted-ink: "#686f76"
  stage: "#07090a"
  paper: "#f8f7f4"
  divider: "#d8dadd"
  action-blue: "#0a66c2"
  action-blue-deep: "#004182"
  action-blue-soft: "#e8f3ff"
  focus-blue: "#70b5f9"
  danger: "#b42318"
  success: "#44a67c"
  stage-muted: "#a9afb5"
  disabled: "#7f858a"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(2.25rem, 4.4vw, 4.25rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "clamp(1.2rem, 2.2vw, 1.55rem)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "clamp(1rem, 1.8vw, 1.2rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.04em"
rounded:
  mark: "4px"
  action: "6px"
  panel: "14px"
  pill: "999px"
  circle: "50%"
spacing:
  compact: "8px"
  control: "12px"
  panel-gap: "14px"
  component: "18px"
  panel: "24px"
  section: "28px"
  viewport-gutter: "40px"
  main-top: "44px"
components:
  primary-action:
    backgroundColor: "{colors.action-blue}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 17px 0 20px"
  primary-action-hover:
    backgroundColor: "{colors.action-blue-deep}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
  primary-action-disabled:
    backgroundColor: "{colors.disabled}"
    textColor: "{colors.divider}"
    rounded: "{rounded.pill}"
  paper-panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel}"
  swap-action:
    backgroundColor: "{colors.white}"
    textColor: "{colors.action-blue}"
    rounded: "{rounded.circle}"
    size: "54px"
  copy-action:
    backgroundColor: "transparent"
    textColor: "{colors.action-blue-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    padding: "7px 10px"
---

# Design System: Brofessional

## Overview

**Creative North Star: "Editorial Translation Desk"**

Brofessional feels like a focused editorial workstation set on a dark stage. Two warm paper surfaces hold the work, while restrained LinkedIn blue identifies action, direction, and provenance. The composition borrows the familiar rhythm of a two-panel translator without borrowing its anonymity: assertive editorial type and a live center rail give the utility a point of view.

The system is copy-first, direct, and lightly humorous, but never decorative at the expense of the task. Generous black framing creates focus; compact utility controls stay quiet until needed. The visual identity references LinkedIn through color only and must never imply affiliation.

**Key Characteristics:**

- Black stage with paired paper work surfaces.
- One restrained blue accent for action, direction, and provenance.
- Editorial display typography over compact, legible utility type.
- Familiar translator geometry sharpened by a central transfer signal.
- Quiet states, direct labels, and dense controls around spacious writing areas.

## Colors

The palette is ink-and-paper neutral at its core, with a single professional blue family carrying interactive emphasis and small semantic colors reserved for status.

### Primary

- **LinkedIn Signal Blue:** The sole action and provenance accent; use it for primary controls, interactive emphasis, the direction marker, caret, and selection.
- **Deep Signal Blue:** The pressed or hover voice for primary actions and dark-blue utility labels.
- **Soft Signal Blue:** A restrained wash behind hovered secondary controls.

### Neutral

- **Black Stage:** The page canvas and the visual frame around the working surfaces.
- **Warm Paper:** The writing and reading surfaces where content carries the focus.
- **Editorial Ink:** Primary text on paper.
- **Muted Utility Ink:** Counts, hints, status text, and supporting labels on paper.
- **Stage Muted:** Secondary text and quiet controls on the black stage.
- **Divider Gray:** Rules and disabled foregrounds that organize without competing.
- **Disabled Gray:** Inactive control fill and the lowest-emphasis stage text.
- **White:** High-contrast text on blue and the bridge control's surface.

### Tertiary

- **Focus Blue:** A bright, accessible outline reserved for keyboard focus.
- **Status Green:** A compact trust or success signal, never a decorative accent.
- **Danger Red:** Error feedback only.

### Named Rules

**The Blue Has a Job Rule.** Blue must signal action, direction, selection, or provenance; it does not become a decorative field.

**The Paper on Stage Rule.** Long-form input and output belong on warm paper, while the surrounding frame remains nearly black.

## Typography

**Display Font:** Manrope (with sans-serif fallback)  
**Body Font:** DM Sans (with sans-serif fallback)  
**Label Font:** DM Sans (with sans-serif fallback)

**Character:** Manrope gives the system a compact editorial headline with geometric confidence. DM Sans keeps the writing surfaces, controls, and status copy neutral, humane, and highly legible.

### Hierarchy

- **Display:** Bold, tightly tracked Manrope for the primary editorial proposition. It is the only oversized voice and uses balanced wrapping.
- **Headline:** Regular DM Sans for large editable or translated content; generous leading protects readability in the working panels.
- **Body:** Regular DM Sans for supporting explanation and longer utility prose.
- **Title:** Bold DM Sans at the inherited interface size for panel headings and key control labels.
- **Label:** Bold compact DM Sans for buttons, utility actions, metadata, and uppercase turn markers; uppercase is reserved for categorical metadata.

### Named Rules

**The Editorial Lead, Utility Body Rule.** Manrope opens the experience; DM Sans performs every task beneath it.

**The Quiet Metadata Rule.** Small type may become bold or uppercase, but must stay muted and compact so it never competes with user content.

## Layout

The desktop shell is centered and capped at 1180px with a 40px total side inset. The working area is a two-column grid with equal panels and a 14px rail between them. The central direction control bridges that rail rather than occupying a third column.

The page uses a compact proposition followed immediately by the working translator. Paper panels maintain a minimum working height of 430px, with stable heading and footer bands around flexible writing space. On mobile, the input/result split shifts to roughly 35/65 so short source text does not waste the viewport and long text remains internally scrollable. Panel content uses a 24px inset, and adjacent controls use compact 8–18px gaps.

At the 760px breakpoint, the equal columns become a single vertical stack locked to the dynamic viewport, the shell contracts to a 24px total side inset, and the center transfer signal rotates from horizontal travel to vertical travel. The promotional intro, examples, privacy note, and footer recede so the brand bar and complete translation task fit without page scrolling; long copy scrolls inside its own pane. Safe-area insets protect notches and home indicators, touch targets remain at least 44px, and short coarse-pointer landscape screens return to two columns.

**The Paired Before Stacked Rule.** Preserve the source-and-destination relationship side by side whenever the viewport can support it; stack in the same reading order on narrow screens.

## Elevation & Depth

Depth is structural, not ornamental. The two paper panels lift decisively above the black stage, while the center swap control receives a tighter shadow so it reads as the physical hinge between them. Most controls remain flat and gain emphasis through color rather than elevation.

### Shadow Vocabulary

- **Paper Lift** (`0 22px 50px rgba(0, 0, 0, 0.28)`): The shared ambient shadow for the two primary paper surfaces.
- **Bridge Lift** (`0 8px 22px rgba(0, 0, 0, 0.25)`): A smaller structural shadow for the circular control crossing the panel rail.
- **Status Halo** (`0 0 0 4px rgba(68, 166, 124, 0.13)`): A compact semantic halo around the trust-status dot.

### Named Rules

**The Paper Floats, Controls Don't Rule.** Elevate the working surfaces and their bridge; keep ordinary buttons, chips, and fields flat.

## Shapes

The form language combines softly rounded paper sheets with capsule controls. Panels use a generous but not playful radius, primary and inline send actions are fully pill-shaped, and icon-only actions become true circles. Small square marks and utility actions use tighter corners. One-pixel neutral rules provide most internal structure.

**The Soft Utility Rule.** Large surfaces use gentle corners, compact actions use pills or circles, and no component introduces ornamental geometry unrelated to its function.

## Components

### Buttons

Buttons are confident in hierarchy and quiet in motion.

- **Primary:** A white-on-blue pill with a 46px minimum height, asymmetric horizontal padding, bold labeling, and a small line icon. Hover deepens the blue; disabled state becomes neutral gray.
- **Icon:** A transparent circular control on the dark stage. Hover adds a dark-neutral fill and brightens the icon.
- **Copy / Utility:** A compact transparent action with deep-blue text. Hover introduces the soft-blue wash; disabled state mutes the label.
- **Focus:** Every interactive control receives the shared 3px focus-blue outline with a 3px offset.

### Chips

Example chips are compact outlined pills with a transparent resting surface. Hover shifts border and text to the blue family and adds the soft-blue wash. They remain secondary shortcuts, never peers of the primary action.

### Cards / Containers

The canonical container is a warm-paper panel with editorial ink, a 14px corner radius, clipped contents, and Paper Lift. A 62px heading band and 72px footer band establish consistent structure with one-pixel divider rules; the center writing area flexes.

### Inputs / Fields

The primary editor is borderless and transparent within the paper panel, using large content type, generous inset, blue caret, and no resize handle. The follow-up composer is a white pill with a one-pixel gray border and a circular blue send action. Placeholder text remains darker than generic disabled text so examples stay readable.

### Navigation

The masthead is a restrained single-row utility bar on the stage, separated by a dark one-pixel rule. The brand combines a compact blue square mark and bold Manrope wordmark; supporting descriptor text recedes, and the clear action is pushed to the far edge. The descriptor hides on narrow screens, while the brand and action remain.

### Paper Pair and Transfer Rail

The signature component is the equal source-and-destination panel pair bridged by a circular direction control. On transfer, one blue signal travels across the rail while the direction glyph flips over 700ms with a fast-out, long-settle curve. On mobile the same signal moves vertically. All other state changes remain quiet, and reduced-motion preference collapses the animation to effectively instantaneous feedback.

### Named Rules

**The One Loud Action Rule.** Within a panel, only the primary submit action receives a solid blue fill; all supporting actions stay transparent or outlined.

## Do's and Don'ts

### Do:

- **Do** preserve the black-stage, warm-paper, restrained-blue hierarchy across empty, loading, error, and history states.
- **Do** keep source and destination surfaces equal in visual weight and reading order.
- **Do** use blue only when an element is actionable, directional, selected, or provenance-bearing.
- **Do** preserve strong keyboard focus, readable placeholders, and the reduced-motion fallback.
- **Do** let writing space remain visually generous while controls stay compact.

### Don't:

- **Don't** imply a LinkedIn affiliation through logos, endorsement language, or copied brand assets; the relationship is limited to a familiar blue-and-neutral color cue.
- **Don't** introduce additional decorative accent colors, gradients on paper, or shadows on every control.
- **Don't** turn the two panels into unequal dashboard cards or separate the direction control from their shared rail.
- **Don't** add competing motion; the single transfer signal is the system's signature movement.
- **Don't** let metadata, helper text, or example chips compete with the editable and translated content.
