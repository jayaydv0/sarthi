# Design System Specification: High-End Editorial for Developer Tools

## 1. Overview & Creative North Star: "The Translucent Architect"
This design system moves away from the rigid, boxed-in layouts of traditional project management tools. Instead, it adopts the **Translucent Architect** persona—a philosophy that treats code and project data as living, fluid elements housed within a high-end, atmospheric environment.

By leveraging intentional asymmetry, high-contrast typography scales, and "glass" depth, we move beyond the "SaaS template" look. The goal is to create a workspace that feels like a premium studio rather than a spreadsheet. We prioritize breathing room over information density, ensuring that the developer's focus is preserved through "visual silence."

---

## 2. Colors & Surface Hierarchy

### The Palette (Material Design Tokens)
Our palette uses a sophisticated deep-sea dark mode (`#081425`) contrasted with vibrant Indigo and Emerald.

*   **Primary (Indigo):** `primary: #c0c1ff` | `primary_container: #8083ff`
*   **Secondary (Success):** `secondary: #4ae176` | `secondary_container: #00b954`
*   **Tertiary (Warning):** `tertiary: #f7be1d` | `tertiary_container: #b68a00`
*   **Error:** `error: #ffb4ab` | `error_container: #93000a`
*   **Neutral Surface:** `surface: #081425` | `surface_container_low: #111c2d` | `surface_container_high: #1f2a3c`

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section off the UI. 
Boundaries must be defined through **Background Color Shifts**. For example, a repository list should sit on `surface_container_low`, while the active repository detail view uses `surface_container_highest`. This creates a seamless, "molded" look rather than a fragmented one.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers of frosted glass.
1.  **Base Layer:** `surface` (The foundation).
2.  **Sectional Layer:** `surface_container_low` (Used for large layout sidebars or background panels).
3.  **Component Layer:** `surface_container_highest` (Used for cards and interactive elements).
4.  **Floating Layer:** Glassmorphic elements using `surface_bright` at 60% opacity with a `24px` backdrop blur.

### Signature Textures
Main CTAs and Hero headers should utilize a **Subtle Linear Gradient**: 
From `primary` (`#c0c1ff`) to `primary_container` (`#8083ff`) at a 135-degree angle. This adds "soul" and a sense of light source to the interface.

---

## 3. Typography: The Editorial Edge
We use **Inter** exclusively, but we manipulate the scale to create a high-end editorial feel.

*   **Display (Large/Medium/Small):** Used for project titles and dashboard totals. Bold weight, tight letter spacing (-0.02em).
    *   *Scale:* `3.5rem` / `2.75rem` / `2.25rem`
*   **Headline (Large/Medium/Small):** Used for page sections. Medium weight.
    *   *Scale:* `2rem` / `1.75rem` / `1.5rem`
*   **Body (Large/Medium/Small):** Regular weight. Used for code descriptions and commit messages. High line-height (1.6) for readability.
    *   *Scale:* `1rem` / `0.875rem` / `0.75rem`
*   **Label (Medium/Small):** All-caps for metadata like "LAST BACKUP" or "BRANCH NAME." Increased letter spacing (+0.05em).
    *   *Scale:* `0.75rem` / `0.6875rem`

---

## 4. Elevation & Depth: Tonal Layering

### The Layering Principle
Forget 90s drop shadows. Depth is achieved by "stacking" tones. 
*   Place a `surface_container_lowest` card inside a `surface_container_low` container. The contrast provides a soft, natural lift.

### Ambient Shadows
For floating modals or dropdowns, use the **Ambient Shadow**:
*   `box-shadow: 0 20px 40px rgba(8, 20, 37, 0.4);` 
*   Shadows should never be grey; they must be a darker version of the surface color to mimic real-world light occlusion.

### The "Ghost Border" Fallback
If accessibility requires a container boundary, use a **Ghost Border**:
*   `outline-variant` token at **15% opacity**. It should be felt, not seen.

### Glassmorphism Implementation
For navigation bars and floating action panels:
*   **Fill:** `surface_variant` at 40% opacity.
*   **Blur:** `backdrop-filter: blur(12px);`
*   **Top Edge:** A 1px top-only border of `primary_fixed` at 10% opacity to simulate light hitting the edge of the glass.

---

## 5. Components: Developer-First Primitives

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary_container`). `xl` rounded corners (`3rem`). No border.
*   **Secondary:** Glass background (`surface_variant` at 20%) with a Ghost Border.
*   **Tertiary:** Text only using `primary` color, with an underline appearing only on hover.

### Cards & Lists (The "No-Divider" Rule)
*   **Forbid dividers.** To separate commit entries or project tasks, use vertical white space (from the `lg` spacing scale) or subtle background shifts between rows.
*   **Project Cards:** Use `surface_container_high` with `xl` (3rem) corner radius. This aggressive rounding creates a bespoke, non-standard look.

### Input Fields
*   **Static State:** `surface_container_lowest` background. No border.
*   **Focus State:** A soft `2px` outer glow using `primary` at 30% opacity. Corner radius: `1rem` (default).

### Custom Dev-Context Components
*   **Code Diff Block:** Use `surface_container_lowest` for the code container. Use `secondary_fixed` for additions and `error` for deletions, but at 10% opacity backgrounds to keep the text readable.
*   **Branch Pill:** A `chip` variant using `secondary_container` with `secondary_fixed` text.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace Negative Space:** If a section feels crowded, increase the padding rather than adding a border.
*   **Use Asymmetry:** Place page titles in the `display-lg` scale offset to the left, with metadata floating to the right, breaking the standard "centered" grid.
*   **Color as Information:** Only use `secondary` (Green) for successful backups. Avoid using it for generic "Go" actions.

### Don't:
*   **Don't use 100% Black:** Even in dark mode, the darkest color should be our `surface` (`#081425`). Pure black kills the glassmorphic depth.
*   **Don't use Sharp Corners:** Everything must use at least the `DEFAULT` (1rem) or `xl` (3rem) radius. Sharp corners feel "legacy."
*   **Don't Over-Glow:** Glassmorphism is a spice, not the main course. Use it for navigation and overlays only.