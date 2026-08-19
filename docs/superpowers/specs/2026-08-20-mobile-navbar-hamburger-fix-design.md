# Mobile Navbar Hamburger Visibility Fix

## Problem

On narrow phone widths (~360-390px), the hamburger menu toggle in the app's navbars can be pushed out of the visible viewport or forced into horizontal overflow, even though its `lg:hidden` visibility class is correct. This was observed on a real device at a small-phone width (~360-390px).

Root cause: the navbar's top row has no wrap and no shrink protection on its flex children. It packs a brand block (icon + title + subtitle), some combination of action buttons (notification bell, help, theme toggle, profile avatar, etc.), and the hamburger button into one line. None of these elements shrink or truncate, so at narrow widths the row overflows and the hamburger — the last item in the flex row — gets squeezed off-screen.

This layout pattern (unshrinkable brand block + unshrinkable action group + trailing hamburger) is shared across four navbar components, but the internal structure is **not identical** — Admin, Teacher, and Parent are structurally the same as each other; Learner differs in several respects noted below. Each file needs its own tailored edit.

- `Frontend/src/components/Admin/AdminNavbar.jsx`
- `Frontend/src/components/Teacher/TeacherNavbar.jsx`
- `Frontend/src/components/Parents/ParentNavbar.jsx`
- `Frontend/src/components/Leraners/LearnerNavbar.jsx`

### Structural differences to account for

| | Admin / Teacher / Parent | Learner |
|---|---|---|
| Top row classes | `flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8 gap-4` | `flex items-center justify-between gap-4` (inside a `h-20` header, `w-full px-6` wrapper) |
| Brand wrapper element | `div` | `Link` (react-router, `to="/learners"`) |
| Title/subtitle tags | `<h1>` title, `<p>` subtitle | `<span>` title, `<span>` subtitle |
| Actions container | `flex items-center gap-2 sm:gap-3` | `flex items-center gap-2 sm:gap-4` |
| Actions container contents | notification bell, help button, divider, language switcher, theme toggle, profile avatar+dropdown, hamburger | language switcher, theme toggle, logout button, hamburger — **no notification bell, no help button, no divider, no profile avatar** |

In all four files, the inner `<div className="flex flex-col text-left">` wrapping the title/subtitle stack is identical and is the target for the brand-truncation change below.

## Scope

Fix applies to all four navbars. No breakpoint values change — phones are already correctly under the existing `lg` (1024px) cutoff used for the hamburger's `lg:hidden` visibility. This is a layout-robustness fix, not a breakpoint change.

## Design

For **Admin, Teacher, and Parent** navbars, in the top row of the `<header>`:

1. **Brand block**:
   - Add `min-w-0` to the outer brand `div` (the flex item that itself sits in the top-row flex container) **and** to the inner `div className="flex flex-col text-left"` — nested flex truncation needs `min-w-0` at each ancestor level, not just the innermost node, or the truncation below won't take effect.
   - Add `truncate` to the `<h1>` title and `<p>` subtitle elements, so long text ellipsizes instead of pushing the row wider.

2. **Right-side actions container** (`flex items-center gap-2 sm:gap-3`):
   - Add `flex-shrink-0` so this entire group is protected from being compressed by the brand block.

3. **Notification bell button**:
   - Change its class from always-visible to `hidden sm:flex`, matching the existing pattern already used for the Help button (`hidden sm:flex`). This frees horizontal space on phones (<640px width).

4. **Hamburger toggle button**:
   - Add `flex-shrink-0` directly on the button as a final safety net.

For **Learner** navbar, in the top row of the `<header>`:

1. **Brand block**:
   - The `Link` is nested one level deeper than in the other three navbars: the actual direct flex item of the top-row container is `<div className="flex items-center gap-6">`, which wraps both the `Link` and the desktop `<nav>`. Add `min-w-0` to that wrapping `div`, to the `Link` itself, **and** to the inner `div className="flex flex-col text-left"` — nested flex truncation needs `min-w-0` at every ancestor level between the top-row container and the truncated text, not just the innermost node.
   - Add `truncate` to the two `<span>` elements holding the title and subtitle.

2. **Right-side actions container** (`flex items-center gap-2 sm:gap-4`):
   - Add `flex-shrink-0` so this group (language switcher, theme toggle, logout button, hamburger) is protected from being compressed by the brand block.
   - There is no notification bell in this file — skip that step; it does not apply here.

3. **Hamburger toggle button**:
   - Add `flex-shrink-0` directly on the button as a final safety net.

No other markup, state, or behavior changes in any file. The mobile drawer, its open/close logic, and all `lg:hidden` breakpoint usages remain unchanged.

## Testing

After implementation, verify manually via browser dev tools responsive mode at 360px, 375px, 390px, and 430px viewport widths, for each of the four portals (Admin, Teacher, Parent, Learner):
- Brand title/subtitle truncate cleanly with ellipsis rather than overflowing.
- Notification bell is hidden below the `sm` breakpoint (640px) on Admin, Teacher, and Parent (not applicable to Learner, which has no notification bell).
- The hamburger button is always visible, unclipped, and clickable.
- Opening the mobile drawer still works correctly (no regression).

## Out of Scope

- No change to the `lg` breakpoint value used to switch between desktop nav and hamburger/drawer.
- No change to drawer contents, animations, or the desktop (`lg`+) layout.
- No changes to the Help button or Language Switcher visibility rules (already `hidden sm:flex` / `hidden lg:flex` respectively).
