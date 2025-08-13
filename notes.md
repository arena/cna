Notes:

- [ ] Make about pg in app more about the project and less about the features of the app
- [ ] Set of icons that are visually consistent

Features:
- [x] hand pick a set of 5 skills to practice
- [] add a set of flash cards, include things like supplies for a skill, critical steps for a skill
- [] link to brainscape flashcards
- [] written exam practice questions
- [] how to contribute docs (how to use claude code to set up a development environment and connect to github)
- [] add another state and a way to toggle states

## Custom Practice Test Set

**Feature Goal:** Allow users to hand-pick their 5 skills for targeted practice while maintaining CNA test rules.

**UI Design:**
- Split current "New Skill Set" into two buttons:
  - "Random Set" (current behavior)
  - "Custom Set" (opens selection modal)

**Selection Modal Organization:**
1. **Hand Washing (required)** - Pre-selected and grayed out (always required first)
2. **Measurement Skills (select 1)** - Radio buttons (select exactly 1 of 5):
   - Ordered by length: Pulse, Respirations, BP, Weight, Urinary Output
3. **Additional Skills (select 3)** - Checkboxes (select exactly 3 from remaining ~16):
   - Sorted by estimated time (shortest to longest)
   - No water requirement (for "dry" practice environments)
   - Disable remaining checkboxes once 3 are selected
   - Re-enable all checkboxes when user unchecks any selected box
   - Selected checkboxes always remain clickable for unchecking

**Modal Bottom:**
- Progress indicator: "Selected X of 5 skills"
- "Cancel" and "Start Practice" buttons
- "Start Practice" only enabled when exactly 5 skills selected (1+1+3)

**Benefits:**
- Targeted practice for specific skills
- Time management (shorter skills visible first)
- Maintains official test structure
- Flexible for different practice environments

**Implementation Notes:**
- Reuse existing length sorting logic from Skills Browser
- Modal closes and starts practice with custom set
- All existing timer/evaluation flows remain unchanged

