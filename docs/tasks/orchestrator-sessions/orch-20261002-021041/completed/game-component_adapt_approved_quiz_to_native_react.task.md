# Native approved study game

## Objective
Adapt the approved standalone quiz into a persistent React client component.

## Scope
Own only src/app/redesign/StudyGame.tsx, study-game.module.css, quiz-data.ts, public/redesign/study-logo.png and approved font files if needed. Read the five originals directly under C:/Users/johno/Documents/Codex/2026-09-30/https-www-jstarstudios-com-https-www/outputs/. Do not edit Hero, hero.module.css, docs, recording tools or unrelated files.

## Contract
Default export StudyGame with props { interactive: boolean }. Stay mounted through all scroll states. Parent controls inert/clipping; suppress focus while inactive and never scroll. Preserve exact source copy, UI and formats. Reset only on explicit replay/topic actions.

## Definition of done
Three topics, four questions, choice/boolean/order and removal, exact feedback, scores/review, replay/topic switching, keyboard and responsive styling. Strong TypeScript, scoped CSS, no iframe/any/casts/dependency. Targeted checks pass.

## Expected artifacts
Component, scoped CSS, typed data, original logo/fonts and concise check report.
