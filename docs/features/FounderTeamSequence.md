# Founder and team sequence

## Goal

Append the approved `team-preview.html`, CSS and MJS composition after Selected Work on isolated `/redesign`. Stop at a plain dark boundary before enquiry. The gallery Continue control starts a short version of the real team's irregular-edge wipe from any selected project, then moves the native scroll position directly to the team's entrance. The real team stage is temporarily fixed for that wipe; it returns to sticky native-scroll geometry afterward. Wheel, touch, scroll keys and reduced motion can interrupt or bypass the effect without losing the gallery or team. Hero, tablet, quiz and gallery ranges and playback remain unchanged.

## Client and content

`Hero.tsx` keeps the existing gallery track and replaces its former plain end marker with `<TeamSection ref={end} />`. `TeamSection.tsx` owns only team rendering and native page-scroll measurement; `team.module.css` scopes the supplied typography, group positions and soft portrait masks. Existing `companyData.teamMembers` supplies names and verified roles. Only the displayed name of employee `JS005` is corrected to **Ifechukwude Odigwe**; shared About content is not changed. Employee IDs map explicitly to the eight approved cutouts. No biographies or additional team data are created.

The original transparent 1254px PNGs are copied without alteration into `docs/References/team-cutouts/`. `public/redesign/team-cutouts/` holds 780px lossless WebP derivatives with alpha intact. Image elements stay mounted throughout the sequence.

## Scroll and interaction

The team track has about 5.09 viewport heights of travel, plus its viewport-sized sticky stage. Each member keeps the original scroll allowance of about half a viewport. Olamide's caption stays fully visible through her introduction before the group reveal begins. After the complete group appears, about 0.69 viewport heights remain before the enquiry starts. Meet everyone lands at the start of that group pause, rather than at the enquiry handoff. The section reads native page scroll, spreads cubic entrance and settlement curves across each portrait's travel, and paints the pose on requestAnimationFrame. Ordinary wheel-step deltas get a brief (~70ms) team-only interpolation, capped at 0.18 of a member interval; large skips jump directly to the scroll position. On desktop, each portrait rises into focus, then settles into the group on a separate scroll-linked curve. On phones, John rises first and the other members fade in above their captions; the group assembles at the end. This is not a second page-scroll driver: it cannot hold the page, queue animations or change Hero's clock. Reversals always follow the current native position, and reduced motion jumps to the complete group. Member marks, Meet everyone and From the beginning use interruptible native smooth scrolling. Wheel, touch and scroll-key input cancels a pending navigation without locking page scroll.

On desktop, introduced teammates move into the smaller group throughout the sequence. On phones, earlier portraits and their duplicate labels stay hidden until the final group reveal, leaving the active portrait and caption unobstructed. The phone stage uses `100dvh` so its background and footer follow the visible viewport as the browser toolbar retracts or returns. The phone caption rises on taller screens but remains below the portrait on short screens. On very short phones, the intro heading clears before John's portrait rises, and the final group tightens to stay above the footer. The final positions follow the approved top row of Monjolaoluwa, Sharon and Justina and lower row of Ifechukwude, Nengimote, larger central John, Michael and Olamide. The final heading reads "Different talents. One studio." Only settled final portraits accept focus or pointer input. Their accessible names contain both name and role; hovering, focus or touch reveals one green role directly beneath that person's name. Member marks expose the current person. Reduced motion removes the travel and presents the complete group immediately.

## Server and data

This change has no server component, API, persistence, migration or database schema. All team content and image mappings remain static client assets. The shared About page and its existing spelling are untouched. No enquiry section is built.

## Verification

Check the gallery exit, forward/reverse and rapid native scrolling, interruption of member and Meet everyone navigation, final desktop/mobile spacing, name/role accessibility, reduced motion, earlier gallery and quiz continuity, plus a final-group screenshot and short NVENC recording. Keep final evidence in `docs/redesign-review/`; do not include test fixtures in the shipped page.
