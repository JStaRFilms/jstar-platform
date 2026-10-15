# YouTube immersive fullscreen correction

## Objective

The owner rejected the remaining 44px external playback row in fullscreen. Give the unchanged YouTube iframe the entire fullscreen display with its own supported controls. Do not reserve website chrome space, crop/stretch the iframe, hide branding or replace the player.

## Scope and approach

The trusted-click browser prototype confirmed iframe-owned fullscreen fills 760x360 exactly while its ancestor viewer popover stays open. Request fullscreen on the selected ready iframe, not the whole gallery shell. Enable native YouTube controls/fullscreen parameters on initial player creation. Existing compact custom controls remain available; none of the website controls participate in iframe-owned fullscreen.

Recognize owned descendant fullscreen for notes return, orientation locks, cleanup and Escape/focus handling. Portrait films request portrait when supported. Preserve native-film/software fullscreen behaviour, compact gallery, thirteen records/media, quiz/player state and earlier owner credit corrections. Remove the now-unused fullscreen rotation-row plumbing. Do not implement route changes.

## Definition of done

Current iframe fills the whole viewport with no external reserved row. Same player/time/mute survive entry/exit, compact notes/focus return, supported portrait locks clean up correctly, and no website overlay covers the iframe. Focused type/lint and native/iframe regression checks pass or have explicit environment/device limits. Actual phone retest remains required.

## Expected artifacts

Narrow changes to PortfolioViewer, PortfolioMedia, viewer CSS and Hero's fullscreen ownership checks, updated behaviour docs, and receipts under `docs/redesign-review/youtube-native-fullscreen/`.

## Approval boundary

No staging, commit, push, deployment or route swap. The owner separately described a future approved swap: new UI at `/`, previous homepage at `/redesign`, only after validation and explicit go-ahead. Screenshots remain deferred. Sole writer in the current shared root; protected previews and archives remain untouched.
