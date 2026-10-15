# Homepage route swap

## Goal and approval

The owner approved the local swap: the accepted redesigned site becomes `/`, and the previous homepage becomes `/redesign`. This is a real page swap, not a redirect. Nothing is staged, committed, pushed or deployed by this change.

## Client and server components

- `src/app/page.tsx` renders the existing Hero and its accepted gallery, team, enquiry and closing sequence. Hero/components/styles remain under `src/app/redesign/`; moving their files is unnecessary.
- `src/app/redesign/page.tsx` renders the previous eleven homepage sections unchanged.
- `ConditionalLayout.tsx` supplies no legacy global chrome/providers on `/`, as the new homepage owns its composition. It restores the legacy header/footer/mobile navigation/providers on `/redesign`, without new top padding.
- Legacy header, bottom-navigation items, scroll spy and `useSmartNavigation` recognize `/redesign` as their section-based page. Other public page destinations and Home links remain unchanged.
- The new root is canonical and indexable, with public studio metadata rather than Hero review/no-index copy. The legacy page is no-indexed. The existing production host and social image remain the metadata base.

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
