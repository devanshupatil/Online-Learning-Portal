# Mobile Navbar Hamburger Visibility Fix

## Problem

On narrow phone widths (~360-390px), the hamburger menu toggle in the app's navbars can be pushed out of the visible viewport or forced into horizontal overflow, even though its `lg:hidden` visibility class is correct. This was observed on a real device at a small-phone width (~360-390px).

Root cause: the navbar's top row (`flex justify-between items-center h-16 px-4 gap-4`) has no wrap and no shrink protection. It packs the brand block (icon + title + subtitle), a notification bell, a theme toggle, a profile avatar, and the hamburger button into one line. None of these elements shrink or truncate, so at narrow widths the row overflows and the hamburger — the last item in the flex row — gets squeezed off-screen.

This structure is duplicated identically across four navbar components:
- `Frontend/src/components/Admin/AdminNavbar.jsx`
- `Frontend/src/components/Teacher/TeacherNavbar.jsx`
- `Frontend/src/components/Parents/ParentNavbar.jsx`
- `Frontend/src/components/Leraners/LearnerNavbar.jsx`

## Scope

Fix applies to all four navbars identically. No breakpoint values change — phones are already correctly under the existing `lg` (1024px) cutoff used for the hamburger's `lg:hidden` visibility. This is a layout-robustness fix, not a breakpoint change.

## Design

For each of the four navbar files, in the top row of the `<header>`:

1. **Brand block** (the `div` wrapping the brand icon + title/subtitle `div`):
   - Add `min-w-0` to the flex container that holds the title/subtitle stack, so it's allowed to shrink below its content width instead of forcing overflow.
   - Add `truncate` to the title element (`<h1>` in Admin/Teacher/Parent, `<span>` in Learner) and the subtitle element (`<p>` in Admin/Teacher/Parent, `<span>` in Learner), so long text ellipsizes instead of pushing the row wider.

2. **Right-side actions container** (the `div` with `flex items-center gap-2 sm:gap-3` holding notifications/help/divider/language/theme/profile/hamburger):
   - Add `flex-shrink-0` so this entire group is protected from being compressed by the brand block — it should always render at full size, with any overflow absorbed by the (now-truncating) brand text instead.

3. **Notification bell button**:
   - Change its class from always-visible to `hidden sm:flex`, matching the existing pattern already used for the Help button (`hidden sm:flex`). This frees horizontal space on phones (<640px width).

4. **Hamburger toggle button** itself:
   - Add `flex-shrink-0` directly on the button as a final safety net, so it is never the element that gets compressed even if the actions container's shrink behavior changes later.

No other markup, state, or behavior changes. The mobile drawer, its open/close logic, and all `lg:hidden` breakpoint usages remain unchanged.

## Testing

After implementation, verify manually via browser dev tools responsive mode at 360px, 375px, 390px, and 430px viewport widths, for each of the four portals (Admin, Teacher, Parent, Learner):
- Brand title/subtitle truncate cleanly with ellipsis rather than overflowing.
- Notification bell is hidden below the `sm` breakpoint (640px).
- The hamburger button is always visible, unclipped, and clickable.
- Opening the mobile drawer still works correctly (no regression).

## Out of Scope

- No change to the `lg` breakpoint value used to switch between desktop nav and hamburger/drawer.
- No change to drawer contents, animations, or the desktop (`lg`+) layout.
- No changes to the Help button or Language Switcher visibility rules (already `hidden sm:flex` / `hidden lg:flex` respectively).
