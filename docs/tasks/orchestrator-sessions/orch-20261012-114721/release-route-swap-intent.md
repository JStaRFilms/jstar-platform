# Pending route swap intent

The owner is satisfied with the direction after the remaining fullscreen correction. This records future intent, not release authorization.

## Intended result

After the YouTube fullscreen fix, validation and the owner's explicit go-ahead:

- The redesigned UI becomes the actual `/` homepage.
- The previous homepage moves to `/redesign`.
- Visitors see the new UI at the canonical home URL. Do not implement this as a redirect to `/redesign` or create another new showcase route.

Preserve public asset paths, including `/redesign/` media paths, existing portfolio/about/contact destinations and required layout behaviour. Root metadata, canonical URLs and indexing must match the new homepage rather than retaining preview no-index instructions. Inspect the current route/layout architecture before authoring the implementation plan.

## Approval boundary

No route swap, staging, commit, push or deployment is authorized now. Confirm the intended commit scope and release target after the owner gives the go-ahead. Shared unrelated dirty files and archives remain outside release scope.

## Screenshots

Proper software screenshots remain deferred. This statement does not renew permission to browse, test, fix or capture the unavailable full Study Game app. Use owner-supplied assets or obtain explicit app-access authorization when ready. Do not invent replacement screenshots.
