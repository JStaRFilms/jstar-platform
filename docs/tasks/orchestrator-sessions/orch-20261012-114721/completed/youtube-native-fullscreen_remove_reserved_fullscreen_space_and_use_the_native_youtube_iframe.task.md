# YouTube immersive fullscreen

## Agent setup
Main agent executes directly as sole writer in the current shared root. Read youtube-native-fullscreen.md in this session, current Viewer/Media/Hero source/styles and PortfolioViewerIntegration.md.

## Objective
Owner rejected the external fullscreen row. The existing YouTube iframe must own and fill the whole fullscreen viewport with its native controls.

## Scope
Use ready iframe requestFullscreen and controls=1/fs=1; preserve instance/time/mute. Recognize descendant ownership for exit/notes/orientation/focus/cleanup. Portrait lock is best effort. Remove unused row rotation plumbing, preserve compact controls and all other source/content/media behaviour. No crop, scale, branding concealment or player reload.

## Dependencies
Trusted-click prototype proved iframe-owned fullscreen at760x360 with the viewer popover retained. Prior credit and cancellation/viewport fixes remain.

## Definition of done
Full viewport iframe with no website bar, preserved player state and notes/focus on exit, scoped types/lint and focused regression checks with explicit real-device limits.

## Expected artifacts
Narrow four-file source/style diff, existing feature-doc update, focused receipts under docs/redesign-review/youtube-native-fullscreen and QA addendum.

## Constraints
No route swap/staging/commit/push/deploy. Future '/' and '/redesign' swap requires owner go-ahead. No full Study Game use/screenshots or protected-preview/archive changes.
