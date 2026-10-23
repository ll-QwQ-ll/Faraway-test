# Faraway — layout spec extracted from the user's PPTX (Interface.pptx) + Interface Draft doc

The user said: STRICTLY follow the layout, section flow and hierarchy of the PPTX. Positions below are % of a 16:9 slide (x, y, w, h).

## Global app shell (slides 4–13)
- Thin vertical icon rail on the far left (~4% wide, full height) with 4 icon buttons stacked at y≈15%, 35%, 58%, 74%:
  1. Atom icon (AI / Explore pathway – profile)
  2. Bar-graph-upward-trend icon (Skill Analysis / trends)
  3. Briefcase icon (Jobs / career target)
  4. Brain-in-head icon (Study plan / learning progress)
- Top-right: user avatar circle (x93 y2) with a small label under it.
- Header row at top-left of content: breadcrumb "Workspace / Personal" (x9 y9) with a full-width hairline divider under it (y14).

## 1. Login (slide 1)
- Left half: logo box top-left (x4 y5) + "FARAWAY" wordmark; a large hero/visual block (x4 y22 w45 h26); then stacked buttons "Login with Google" and "Login with …" (x11 y57/66, w31); small link "No acc? Sign up" right-aligned under buttons.
- Right side: one big tall panel (x56 y7 w38 h83) — visual/brand showcase.

## 2. Signup (slide 2)
- Centered card (x34 y17 w30 h65) with two input fields and an "Enter" button centered at the bottom. Title "Signup page" top-left.

## 3. Mode question (slide 3)
- Wide question block across the top (x6 y19 w90 h35) — e.g. "Who are you exploring for?"
- Two big choice buttons side by side at the bottom: "Personal" (left) and "Organization" (right).
- Personal = fresh graduate / job-risk worker. Organization = HR/manager, TVET or university career centre.

## 4. Workspace / Personal — dashboard (slides 4, 5, 6 are ONE long scrolling page)
Top of page (slide 4):
- A horizontal 5-step progress stepper across the top (line with 5 dots at x28/41/54/66/78, labels under each) — the journey: Interest → Profile/CV → Skills → Analysis → Study plan.
- A big welcome/hero card (x10 y36 w86 h31) with primary CTA button "Explore my pathway" bottom-left inside it. "(Scroll down)" hint at bottom-right.
Scrolling down (slide 5):
- Header strip image area (full width) then a stats/summary band (x13 y33 w80 h23) — "(remain empty or dash when CV not uploaded)".
- Two cards row: left card (x15 y59 w28 h34) = mini radar / skills snapshot; right card (x55 y59 w39 h34) = "Skill trend chart" with a "Moderate | Fast AI" segmented toggle in its top-right corner.
Scrolling further (slide 6):
- Two cards at top: left small card (match score / target job), right card (chart).
- Big card "Study plan overview | [Job Name]" (x13 y40 w78 h49): rows per skill (Python, C++, SQL…) each with an icon square, skill name, and a progress bar beneath; on the right inside the card a tall panel "SDG explanation (shows when hover)".

## 5. Explore Pathway Interface (Info) (slides 7–8) — one big rounded panel, scrolling
- Panel title "Explore Pathway Interface (Info)". Inside, a 5-dot stepper on top.
- Left column sections stacked: "Interest", "Education", "Experience". Right column: big "Upload CV" drop zone (x61 y24 w27 h32) — AI scans the CV and auto-fills the boxes.
- Divider, then "SKILLS" section (scroll down, slide 8):
  - Left: list of skills (Python, C, C++, HTML …) each with a slider/rating bar and "3/5" value.
  - Right: "Radar Map (Real time update)" card. If no job selected: just the user's skill hexagon. If a job is selected: overlapped hexagon of job requirement on top of the user's skills. Adjusting a skill slider (e.g. 4→5) updates the radar live.
- Doc details: Interest = pick stream first (Computer Science, Finance, Business, Design), then multiselect interested careers. Steps 2.1 basic info, 2.2 experience, 2.3 education (if autofilled fill UG/PG/PhD; ask highest education), 2.4 skills (list of skills related to interest + "Others" option, self-rate level), 2.5 summary, with Back/Next. If CV incomplete, leave empty boxes for user to fill.

## 6. Skill Analysis (slides 9–11) — one scrolling page
- Slide 9: wide card "Horizontal Bar Chart (Skill Trend)" (x13 y9 w81 h32) — click it to FLIP left/right (3D card flip) to show future scenarios (fast vs moderate AI adoption). Below: two side-by-side cards "Source 1 Vertical Bar Chart (Job Trend)" and "Source 2 Vertical Bar Chart (Job Trend)" (e.g. JobStreet and LinkedIn postings index).
- Slide 10: the two source charts on top; below a wide card "Bar reflection (future scenarios of job trend)" — vertical bars with a mirrored light reflection beneath (3D look). Click to flip 180° up/down to reveal future scenario bars. Button to select Fast or Moderate AI adoption.
- Slide 11: the reflection card on top; below a row of 3 suggested JOB cards (x10/40/71, each w24 h40): job title pill, illustration, match bar, and a "Set Career Target" button at the bottom. "Explore more" button for more jobs related to interests.
- Match Score = 100 × (0.65 × Skill Fit + 0.15 × Interest Fit + 0.10 × Experience Fit + 0.10 × Market Fit).

## 7. [Job Name] detail (slides 12–13)
- Title "[Job Name]" top-left.
- Three-column top row: LEFT tall card "SDG explanation (hover) – Job's SDG"; CENTER large radar hexagon (user skills vs job requirement, each radar point labelled with a small SDG tag); RIGHT tall card "SDG explanation (hover) – Skill's SDG" (hovering a radar point / skill shows how it connects to an SDG).
- Bottom row: LEFT wide chart (x17 y61 w48 h32) — demand/automation/salary under scenarios; RIGHT card "Toggle between Moderate / Fast" with explanation of what each means.
- Also: job description, prospects, expected salary (MYR). If a required skill was missed in the assessment, let user reassess and refresh the hexagon + match score.

## 8. Study plan (doc Screen 4) and Learning progress (doc Screen 5)
- Preferences: indoor/outdoor, study minutes per day, cost (free/low cost, HRD Corp claimable), online only; choose Recommended or Custom plan; plan adapts to the scenario; user selects skills to learn (disclaimer if unselecting core skills); show costs.
- Progress: per skill details + recommended resources, estimated time per sub-topic, animated progress (a small running figure), checklist; pop a skill badge on each completed skill; refreshable updated match score.

## 9. Organization view (doc) — TVET / HR
- Select Company or University; basic info (name, department, "add department" button); member table (name, position, skills with self-evaluation, add skill).

## SDG section — MUST be fully retained from the original project
Original used SDGS (4, 5, 8, 9, 10, 11, 12, 16 with official colours), SKILL_SDG mapping, career.sdgs, SDG tags on radar points, hover explanations, and "Related SDGs" pills. See attached_assets/original-faraway/pages/career-detail.tsx, components/ui-bits.tsx, pages/home.tsx.
