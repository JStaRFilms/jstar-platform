# Homepage route swap

## Goal and approval

The owner approved the local swap: the accepted redesigned site becomes `/`, and the previous homepage becomes `/redesign`. This is a real page swap, not a redirect. Nothing is staged, committed, pushed or deployed by this change.

## Client and server components

- `src/app/page.tsx` renders the existing Hero and its accepted gallery, team, enquiry and closing sequence. Hero/components/styles remain under `src/app/redesign/`; moving their files is unnecessary.
- `src/app/redesign/page.tsx` renders the previous eleven homepage sections unchanged.
- `ConditionalLayout.tsx` supplies no legacy global chrome/providers on `/`, as the new homepage owns its composition. It restores the legacy header/footer/mobile navigation/providers on `/redesign`, without new top padding.
- Legacy header, bottom-navigation items, scroll spy and `useSmartNavigation` recognize `/redesign` as their section-based page. Other public page destinations and Home links remain unchanged.
- The new root is canonical and indexable, with public studio metadata rather than Hero review/no-index copy. The legacy page is no-indexed. The existing production host and social image remain the metadata base.

## Incoming section links

After release, the owner reported that the email's `/#selected-work` link opened the homepage without reaching Work. These section elements live inside pinned scenes, so their native DOM offsets are not the intended resting scroll positions.

`Hero.tsx` now applies incoming `#selected-work`, `#meet-the-studio` and `#project-enquiry` fragments after fonts and layout frames are ready. It calls the same gallery/team/enquiry imperative scroll targets used by the visible navigation, without an entrance transition. Work resets to the first real project, Studio uses the accepted `.4` intro, and enquiry completes its reveal before focusing the name field. The handler also follows fragment history changes. Unknown or empty fragments retain native browser behaviour.

Work entry now focuses the non-interactive catalogue heading rather than the entire navigation pane. The heading is a programmatic focus target without a decorative outline; real links, filters and project controls retain their keyboard focus rings. This prevents a large green border appearing on direct link arrivals without losing keyboard entry into the section.

The legacy site uses custom inline SVG icons, and Lucide was already installed for the redesigned player's sound controls. Redesigned public-site navigation, forms, footer, portfolio controls and mini-quiz action/status icons now reuse Lucide SVGs instead of platform-dependent Unicode icon glyphs. The shared `.studio-icon` rule follows the surrounding text size and colour; decorative icons are hidden from assistive technology. Existing company artwork, educational topic emoji and mathematical/content text remain unchanged. There is no new runtime dependency or icon-font download.

Visible section actions update the URL through the native history API, so their destinations can be copied and reopened. Back-to-top actions clear the section fragment. This adds no continuous scroll clock or content remount, and does not reset enquiry drafts or recreate media. Tests cover initial cold-font landings, fragment changes, browser Back, media identity and retained drafts at desktop/phone widths with normal and reduced motion. Verification uses read-only navigation, blocks mutating requests and takes no screenshots.

## Data flow and schema

No CMS, database schema, endpoint, authentication, migration or persistence change. The same static thirteen-record portfolio and mounted quiz/player components feed the new homepage. No media, portrait, caption/credit or state-engine changes.

Public assets remain at existing `/redesign/`, `/team/`, `/portfolio/` and other paths. Page-route ownership does not move the public media directory. Film comparison remains an unlinked review route, not a new default film.

## Constraints

Keep accepted motion, native scrolling, quiz/player identity and state, focus/notes restoration, enquiry drafts, team/footer geometry and physical-device limits. Screenshots remain owner-deferred; this is not authorization to access the unavailable full Study Game app or invent images. Real enquiry delivery and release require separate approval.

## Validation

Current-source TypeScript and focused lint passed. A temporary production build compiled and checked all 388 current source files. The copied source matches the root checkout exactly. It used unchanged configuration and existing assets/dependencies/env links, without copying historical workspaces or replacing dev caches.

Desktop 1440x900 and mobile 390x844 checks passed for both routes on the temporary production server and ordinary private HTTPS3461. They checked direct 200 responses, metadata, own/legacy chrome, section scrolling, desktop long-press navigation, Home links from secondary pages, Work's first project, Studio's .4 intro, retained enquiry drafts and footer return. No submission, screenshot or full software app use.

The previous homepage's render body is identical to the pre-swap root. All 24 protected accepted UI/content/style files remain unchanged. Nothing is staged. Receipts and remaining limits are in `docs/redesign-review/route-swap/report.md`.

An initial dev check observed the pre-existing intermittent bootstrap parse error. Later private checks passed, but permanent cold-dev reliability is not certified. Root-wide TypeScript still includes historical workspaces; this check did not edit archives or change build configuration. Physical Safari/screen-reader checks and release approval remain separate.
