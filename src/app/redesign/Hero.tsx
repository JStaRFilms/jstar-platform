'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import Image from 'next/image';
import { Volume2, VolumeX } from 'lucide-react';
import styles from './hero.module.css';
import StudyGame from './StudyGame';
import TeamSection, { type TeamHandle } from './TeamSection';
import ClosingSequence, { type ClosingHandle } from './ClosingSequence';
import SelectedWorkGallery, { panelPose, panelWindow, type GalleryFrame, type GalleryHandle } from './SelectedWorkGallery';
import { selectedWork, type GalleryFilter, type GalleryMode, type GalleryProject } from '@/content/selected-work';

interface GalleryState {
  filter: GalleryFilter;
  committedId: string | null;
  pointerId: string | null;
  focusId: string | null;
  mode: GalleryMode;
}
interface MotionControls {
  align: (index: number, collectionChanged?: boolean) => void;
  jumpToGallery: () => void;
  jumpToOpening: () => void;
  refresh: () => void;
  suspend: () => void;
}

const FILM = '/redesign/nifemi.mp4';
const POSTER = '/redesign/nifemi-poster.jpg';
const TABLET_SCENE = '/redesign/tablet-scene-v1.png';
const TABLET_MASK = '/redesign/tablet-screen-mask.svg';
const PROJECT_STRIDE = .5;
const OPENING_LINE = 'J StaR Films';
const STUDIOS_LINE = 'Studios';
const OPENING_COPY = 'Films, websites and software. One creative team.';
const SCRAMBLE_COLORS = ['#b33d48', '#206fa1'];
type HoverFragment = { node: HTMLSpanElement; x: number; y: number; offsetX: number; offsetY: number };
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

export default function Hero({ projects = selectedWork }: { projects?: readonly GalleryProject[] }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const sceneImage = useRef<HTMLImageElement>(null);
  const firstLine = useRef<HTMLSpanElement>(null);
  const secondLine = useRef<HTMLSpanElement>(null);
  const description = useRef<HTMLSpanElement>(null);
  const firstScrambleLayer = useRef<HTMLSpanElement>(null);
  const secondScrambleLayer = useRef<HTMLSpanElement>(null);
  const attractLayer = useRef<HTMLSpanElement>(null);
  const attractFragments = useRef<HoverFragment[]>([]);
  const hoverFrame = useRef<number | null>(null);
  const scrambleFrames = useRef<{ first: number | null; second: number | null }>({ first: null, second: null });
  const projectRiseRunning = useRef(false);
  const workHandoffRunning = useRef(false);
  const studioHandoffRunning = useRef(false);
  const video = useRef<HTMLVideoElement>(null);
  const soundButton = useRef<HTMLButtonElement>(null);
  const soundTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wantsOpeningFocus = useRef(false);
  const wantsPlayback = useRef(true);
  const wantsScreeningFocus = useRef(false);
  const inView = useRef(false);
  const filmConcealed = useRef(false);
  const gameFrame = useRef<HTMLDivElement>(null);
  const gameCanvas = useRef<HTMLDivElement>(null);
  const gallery = useRef<GalleryHandle>(null);
  const end = useRef<TeamHandle>(null);
  const closing = useRef<ClosingHandle>(null);
  const [teamCovered, setTeamCovered] = useState(false);
  const viewer = useRef<HTMLDialogElement>(null);
  const viewerVideo = useRef<HTMLVideoElement>(null);
  const backButton = useRef<HTMLButtonElement>(null);
  const invokingAction = useRef<HTMLElement | null>(null);
  const savedGameScroll = useRef(0);
  const motionControls = useRef<MotionControls | null>(null);
  const initialGallery: GalleryState = { filter: 'all', committedId: projects[0]?.id ?? null, pointerId: null, focusId: null, mode: 'browse' };
  const [galleryState, setGalleryState] = useState(initialGallery);
  const galleryLive = useRef(galleryState);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [playReady, setPlayReady] = useState(false);
  const [staticGalleryInView, setStaticGalleryInView] = useState(false);
  const filteredProjects = useMemo(() => projects.filter(project => galleryState.filter === 'all' || project.kind === galleryState.filter), [projects, galleryState.filter]);
  const filterCounts = useMemo(() => ({ all: projects.length, software: projects.filter(project => project.kind === 'software').length, film: projects.filter(project => project.kind === 'film').length }), [projects]);
  const collection = useRef<readonly GalleryProject[]>(filteredProjects);
  const updateGallery = useCallback((patch: Partial<GalleryState>) => {
    const previous = galleryLive.current;
    const next = { ...previous, ...patch };
    if (previous.filter === next.filter && previous.committedId === next.committedId && previous.pointerId === next.pointerId && previous.focusId === next.focusId && previous.mode === next.mode) return;
    galleryLive.current = next;
    setGalleryState(next);
  }, []);
  const clearPreviews = useCallback(() => {
    gallery.current?.disarm();
    updateGallery({ pointerId: null, focusId: null });
  }, [updateGallery]);
  const closeGalleryMode = useCallback(() => {
    if (galleryLive.current.mode === 'play') savedGameScroll.current = gameCanvas.current?.scrollTop ?? savedGameScroll.current;
    setPlayReady(false);
    updateGallery({ mode: 'browse', pointerId: null, focusId: null });
  }, [updateGallery]);
  const [gameExpanded, setGameExpanded] = useState(false);
  const [gameInteractive, setGameInteractive] = useState(false);
  const [filmAvailable, setFilmAvailable] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [tabletExpanded, setTabletExpanded] = useState(false);
  const [tabletReady, setTabletReady] = useState(false);
  const [controlsAvailable, setControlsAvailable] = useState(false);
  const [navFolded, setNavFolded] = useState(false);
  const [soundAwake, setSoundAwake] = useState(false);
  const [soundHint, setSoundHint] = useState(false);
  const [message, setMessage] = useState('');
  const controlsVisible = filmAvailable && (controlsAvailable || (reduced && expanded));
  const navHidden = navFolded || (reduced && expanded);

  function resetAttract() {
    if (hoverFrame.current !== null) cancelAnimationFrame(hoverFrame.current);
    hoverFrame.current = null;
    description.current?.removeAttribute('data-hover-type');
    attractLayer.current?.replaceChildren();
    attractFragments.current = [];
  }

  function prepareAttract() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const row = description.current;
    const layer = attractLayer.current;
    const text = row?.firstChild;
    if (!row || !layer || !text || text.nodeType !== Node.TEXT_NODE) return;
    const bounds = row.getBoundingClientRect();
    const range = document.createRange();
    const fragments: HoverFragment[] = [];
    for (const match of (text.textContent ?? '').matchAll(/\S+/g)) {
      const start = match.index;
      range.setStart(text, start);
      range.setEnd(text, start + match[0].length);
      const box = range.getBoundingClientRect();
      const node = document.createElement('span');
      node.className = styles.attractWord;
      node.textContent = match[0];
      node.style.left = `${box.left - bounds.left}px`;
      node.style.top = `${box.top - bounds.top}px`;
      layer.appendChild(node);
      fragments.push({ node, x: box.left - bounds.left + box.width / 2, y: box.top - bounds.top + box.height / 2, offsetX: 0, offsetY: 0 });
    }
    attractFragments.current = fragments;
    row.dataset.hoverType = 'true';
  }

  function moveAttract(clientX: number, clientY: number) {
    const row = description.current;
    if (!row?.hasAttribute('data-hover-type')) return;
    const bounds = row.getBoundingClientRect();
    const x = clientX - bounds.left, y = clientY - bounds.top;
    if (hoverFrame.current !== null) cancelAnimationFrame(hoverFrame.current);
    hoverFrame.current = requestAnimationFrame(() => {
      for (const fragment of attractFragments.current) {
        const dx = fragment.x - x, dy = fragment.y - y;
        const distance = Math.hypot(dx, dy);
        if (distance < 135) {
          const strength = (1 - distance / 135) ** 2 * 22;
          fragment.offsetX = -dx / (distance || 1) * strength;
          fragment.offsetY = -dy / (distance || 1) * strength;
        } else fragment.offsetX = fragment.offsetY = 0;
        fragment.node.style.transform = `translate(${fragment.offsetX}px, ${fragment.offsetY}px)`;
        fragment.node.style.textDecoration = distance < 88 ? 'underline 3px #b5e619' : 'none';
      }
      hoverFrame.current = null;
    });
  }

  function stopScramble(line: 'first' | 'second') {
    const frame = scrambleFrames.current[line];
    if (frame !== null) cancelAnimationFrame(frame);
    scrambleFrames.current[line] = null;
    const row = line === 'first' ? firstLine.current : secondLine.current;
    const layer = line === 'first' ? firstScrambleLayer.current : secondScrambleLayer.current;
    row?.removeAttribute('data-scrambling');
    layer?.replaceChildren();
  }

  function scrambleLine(line: 'first' | 'second', pointerType: string) {
    if (pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    stopScramble(line);
    const row = line === 'first' ? firstLine.current : secondLine.current;
    const layer = line === 'first' ? firstScrambleLayer.current : secondScrambleLayer.current;
    const source = line === 'first' ? OPENING_LINE : STUDIOS_LINE;
    const text = row?.firstChild;
    if (!row || !layer || !text || text.nodeType !== Node.TEXT_NODE) return;
    const range = document.createRange();
    const glyphs: { node: HTMLSpanElement; letter: string; index: number }[] = [];
    for (let index = 0; index < source.length; index++) {
      if (source[index] === ' ') continue;
      range.setStart(text, index);
      range.setEnd(text, index + 1);
      const original = range.getBoundingClientRect();
      const node = document.createElement('span');
      node.className = styles.scrambleGlyph;
      node.textContent = source[index];
      layer.appendChild(node);
      range.selectNodeContents(node);
      const rendered = range.getBoundingClientRect();
      node.style.left = `${original.left - rendered.left}px`;
      node.style.top = `${original.top - rendered.top}px`;
      glyphs.push({ node, letter: source[index], index });
    }
    row.dataset.scrambling = 'true';
    const start = performance.now();
    const duration = line === 'first' ? 1000 : 500;
    const cadence = line === 'first' ? 70 : 45;
    const pool = line === 'first' ? 'JSTARFILMS' : 'STUDIOS';
    let lastStep = -1;
    const paint = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const step = Math.floor(elapsed / cadence);
      if (step !== lastStep || progress === 1) {
        const settled = Math.floor(progress * source.length);
        for (const glyph of glyphs) {
          const changing = glyph.index >= settled;
          glyph.node.textContent = changing ? pool[Math.floor(Math.random() * pool.length)] : glyph.letter;
          glyph.node.style.color = changing && Math.random() < .3
            ? SCRAMBLE_COLORS[Math.floor(Math.random() * SCRAMBLE_COLORS.length)] : 'var(--ink)';
        }
        lastStep = step;
      }
      if (progress < 1) scrambleFrames.current[line] = requestAnimationFrame(paint);
      else stopScramble(line);
    };
    scrambleFrames.current[line] = requestAnimationFrame(paint);
  }

  useEffect(() => {
    const reset = () => { stopScramble('first'); stopScramble('second'); resetAttract(); };
    window.addEventListener('scroll', reset, { passive: true });
    window.addEventListener('resize', reset);
    return () => {
      window.removeEventListener('scroll', reset);
      window.removeEventListener('resize', reset);
      reset();
    };
  }, []);

  const wakeSound = useCallback((delay = 1600) => {
    if (!controlsVisible) return;
    setSoundAwake(true);
    if (soundTimer.current) clearTimeout(soundTimer.current);
    soundTimer.current = setTimeout(() => {
      setSoundAwake(false);
      setSoundHint(false);
    }, delay);
  }, [controlsVisible]);

  useEffect(() => {
    if (controlsVisible) {
      setSoundHint(true);
      wakeSound(3000);
      if (wantsScreeningFocus.current) {
        wantsScreeningFocus.current = false;
        soundButton.current?.focus({ preventScroll: true });
      }
    } else {
      setSoundAwake(false);
      setSoundHint(false);
    }
    return () => { if (soundTimer.current) clearTimeout(soundTimer.current); };
  }, [controlsVisible, wakeSound]);

  useEffect(() => {
    if (!navHidden && wantsOpeningFocus.current) {
      wantsOpeningFocus.current = false;
      root.current?.querySelector<HTMLAnchorElement>('header a')?.focus({ preventScroll: true });
    }
  }, [navHidden]);

  useLayoutEffect(() => {
    collection.current = filteredProjects;
    const current = galleryLive.current.committedId;
    if (!filteredProjects.some(project => project.id === current)) updateGallery({ committedId: filteredProjects[0]?.id ?? null });
    motionControls.current?.refresh();
  }, [filteredProjects, updateGallery]);

  useLayoutEffect(() => {
    if (galleryState.mode === 'browse') return;
    const shell = galleryState.mode === 'play' ? gameFrame.current : viewer.current;
    if (!shell) return;
    motionControls.current?.suspend();
    video.current?.pause();
    const canvas = gameCanvas.current;
    const catalogHandle = gallery.current;
    const scrollY = window.scrollY;
    const overflow = document.body.style.overflow;
    const padding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar) document.body.style.paddingRight = `${scrollbar}px`;
    const siblings: { element: HTMLElement; inert: boolean }[] = [];
    let branch: HTMLElement = shell;
    while (branch.parentElement) {
      for (const sibling of branch.parentElement.children) {
        if (sibling !== branch && sibling instanceof HTMLElement && !sibling.hasAttribute('data-gallery')) {
          siblings.push({ element: sibling, inert: sibling.inert });
          sibling.inert = true;
        }
      }
      if (branch.parentElement === document.body) break;
      branch = branch.parentElement;
    }
    if (galleryState.mode === 'play') {
      if (typeof shell.showPopover === 'function') shell.showPopover();
      canvas?.scrollTo({ top: savedGameScroll.current });
      shell.inert = false;
      setPlayReady(true);
      backButton.current?.focus({ preventScroll: true });
    } else if (shell instanceof HTMLDialogElement) {
      shell.showModal();
      shell.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
    }
    const trap = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeGalleryMode(); return; }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(shell.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], summary, video[controls], [tabindex="0"]')).filter(item => !item.closest('[inert]') && item.getClientRects().length > 0);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (!first || !last) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || !shell.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !shell.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', trap, true);
    const film = viewerVideo.current;
    const viewerSrc = film?.getAttribute('src');
    let viewerTime = 0;
    const background = () => {
      if (!film || !viewerSrc) return;
      if (document.hidden) {
        viewerTime = film.currentTime;
        film.pause(); film.removeAttribute('src'); film.load();
      } else { film.src = viewerSrc; film.load(); }
    };
    const restoreViewerTime = () => { if (film) film.currentTime = viewerTime; };
    document.addEventListener('visibilitychange', background);
    film?.addEventListener('loadedmetadata', restoreViewerTime);
    return () => {
      document.removeEventListener('visibilitychange', background);
      film?.removeEventListener('loadedmetadata', restoreViewerTime);
      document.removeEventListener('keydown', trap, true);
      film?.pause();
      film?.removeAttribute('src');
      film?.load();
      if (typeof shell.hidePopover === 'function' && shell.matches(':popover-open')) shell.hidePopover();
      if (shell instanceof HTMLDialogElement && shell.open) shell.close();
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = padding;
      siblings.forEach(item => { item.element.inert = item.inert; });
      window.scrollTo({ top: scrollY, behavior: 'instant' });
      if (canvas && galleryState.mode === 'play') canvas.scrollTop = savedGameScroll.current;
      motionControls.current?.refresh();
      if (invokingAction.current?.isConnected) invokingAction.current.focus({ preventScroll: true });
      else catalogHandle?.focusCatalog();
    };
  }, [galleryState.mode, closeGalleryMode]);

  useEffect(() => {
    const element = root.current;
    const section = track.current;
    const film = video.current;
    const viewport = stage.current;
    const picture = sceneImage.current;
    if (!element || !section || !film || !viewport || !picture) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let disposed = false;
    let progress = 0;
    let target = 0;
    let panelPosition = 0;
    let panelReturning = false;
    let lastTime = 0;
    let alignmentDestination: number | null = null;
    let settleTimer: number | null = null;
    let pointerHeld = false;
    let fastTravel = false;
    let directGallery = false;
    const nativeScrollEnd = 'onscrollend' in window;
    const cancelSettle = () => {
      if (settleTimer !== null) window.clearTimeout(settleTimer);
      settleTimer = null;
    };
    let lastFolded = false;
    let lastInteractive = false;
    let sampledFrames = 0;
    let sampledTime = 0;
    let width = viewport.clientWidth;
    let height = viewport.clientHeight;
    let endScale = 0;
    let endX = 0;
    let endY = 0;
    let ready = false;
    let maskLoaded = false;
    const mask = new window.Image();
    const audit = process.env.NODE_ENV === 'development' ? {
      isScrollUnlocked: false, maxScroll: 0, fpsAverage: 0, frameDrops: 0,
      webglDrawCalls: 0, shaderErrors: [],
    } : null;
    if (audit) Object.defineProperty(window, '__CREATIVE_AUDIT__', { value: audit, configurable: true });

    const resume = () => {
      if (galleryLive.current.mode !== 'browse') { film.pause(); return; }
      if (wantsPlayback.current && inView.current && !filmConcealed.current && !document.hidden) {
        void film.play().catch(() => {
          if (!disposed) setMessage('Focus the film and press Space to play.');
        });
      } else film.pause();
    };
    const collectionPosition = (value: number) => Math.max(0, Math.min(Math.max(0, collection.current.length - 1), ((value - 4.3) * (height * 2.7 - window.innerHeight) - height * .75) / (height * PROJECT_STRIDE)));
    const paint = () => {
      const arrival = clamp(progress / 0.25);
      const expansion = clamp((progress - 0.25) / 0.55);
      const takeover = ease(expansion);
      const pullback = ready ? ease(clamp(progress - 1)) : 0;
      element.dataset.tablet = String(pullback > 0);
      if (pullback > 0) {
        // A single registered camera transform keeps the opaque scene and its alpha opening aligned.
        const fullScale = Math.max(width / 188, height / 108);
        const scale = 1 / ((1 - pullback) / fullScale + pullback / endScale);
        const centreX = width / 2 * (1 - pullback) + (endX + 1122 * endScale) * pullback;
        const centreY = height / 2 * (1 - pullback) + (endY + 280 * endScale) * pullback;
        const x = centreX - 1122 * scale;
        const y = centreY - 280 * scale;
        // Release the viewport crop before the bezel comes into view. Cover never stretches the film.
        const crop = ease(clamp(pullback / 0.12));
        element.style.setProperty('--scene-x', `${x}px`);
        element.style.setProperty('--scene-y', `${y}px`);
        element.style.setProperty('--scene-scale', String(scale));
        element.style.setProperty('--pullback-left', `${(x + 1028 * scale) * crop}px`);
        element.style.setProperty('--pullback-top', `${(y + 224 * scale) * crop}px`);
        element.style.setProperty('--pullback-width', `${width * (1 - crop) + 188 * scale * crop}px`);
        element.style.setProperty('--pullback-height', `${height * (1 - crop) + 110 * scale * crop}px`);
      }
      if (!motion.matches) {
        const headlineFirst = ease(clamp((progress - 1.96) / 0.24));
        const headlineSecond = ease(clamp((progress - 2.03) / 0.27));
        const supportingCopy = ease(clamp((progress - 2.16) / 0.24));
        const swipe = ease(clamp((progress - 2.65) / 0.45));
        const reveal = ease(clamp((progress - 3.3) / 0.8));
        const textExit = ease(clamp((progress - 3.31) / 0.48));
        const portraitExit = ease(clamp((progress - 3.36) / 0.69));
        element.style.setProperty('--headline-first', String(headlineFirst));
        element.style.setProperty('--headline-second', String(headlineSecond));
        element.style.setProperty('--supporting-copy', String(supportingCopy));
        element.style.setProperty('--text-exit', String(textExit));
        element.style.setProperty('--swipe', String(swipe));
        element.style.setProperty('--game-reveal', String(reveal));
        element.style.setProperty('--portrait-exit', String(portraitExit));
        element.style.setProperty('--game-mini', String(1 - reveal));
        const screenLeft = endX + 1028 * endScale;
        const screenTop = endY + 224 * endScale;
        const screenWidth = 188 * endScale;
        const screenHeight = 110 * endScale;
        if (progress <= 4.3) {
          const gameWidth = screenWidth * (1 - reveal) + width * reveal;
          const gameHeight = screenHeight * (1 - reveal) + height * reveal;
          const layoutWidth = width * (0.62 + 0.38 * reveal);
          const gameScale = gameWidth / layoutWidth;
          element.style.setProperty('--game-left', `${screenLeft * (1 - reveal)}px`);
          element.style.setProperty('--game-top', `${screenTop * (1 - reveal)}px`);
          element.style.setProperty('--game-width', `${gameWidth}px`);
          element.style.setProperty('--game-height', `${gameHeight}px`);
          element.style.setProperty('--game-scale', String(gameScale));
          element.style.setProperty('--game-layout-width', `${layoutWidth}px`);
          element.style.setProperty('--game-layout-height', `${gameHeight / gameScale}px`);
        }
        const concealed = progress >= 3.1;
        if (concealed !== filmConcealed.current) {
          filmConcealed.current = concealed;
          setFilmAvailable(!concealed);
          if (concealed && document.activeElement === film) film.blur();
          resume();
        }
        // The whole final resting interval is usable; tiny scrolls inside it must not revoke input.
        const interactive = progress >= 4.1 && target >= 4.1 && progress <= 4.3 && target <= 4.3;
        if (interactive !== lastInteractive) {
          lastInteractive = interactive;
          setGameInteractive(interactive);
          if (!interactive && document.activeElement instanceof HTMLElement && gameFrame.current?.contains(document.activeElement)) {
            document.activeElement.blur();
          }
        }
        element.dataset.gameVisible = String(progress > 2.65);
        element.dataset.gameEmerging = String(reveal > 0);
        element.dataset.gameInteractive = String(interactive);
      }
      const distance = height * 2.7 - window.innerHeight;
      const count = collection.current.length;
      const entrance = motion.matches ? 1 : 1 - (1 - clamp((progress - 4.3) * distance / (height * .75))) ** 3;
      const position = motion.matches ? Math.max(0, collection.current.findIndex(project => project.id === galleryLive.current.committedId)) : collectionPosition(progress);
      if (motion.matches) panelPosition = Math.max(0, collection.current.findIndex(project => project.id === (galleryLive.current.focusId ?? galleryLive.current.pointerId ?? galleryLive.current.committedId)));
      else if (progress > 4.3) updateGallery({ committedId: collection.current[Math.round(position)]?.id ?? null });
      const gameIndex = collection.current.findIndex(project => project.presentation.type === 'study-game');
      const sectionRect = section.getBoundingClientRect();
      const visible = motion.matches || entrance > 0;
      const mediaVisible = motion.matches ? false : entrance > .98 && sectionRect.top <= 0 && sectionRect.bottom > height * .8;
      const galleryFrame: GalleryFrame = { entrance, position, panelPosition, settled: progress === target, visible: mediaVisible, width, height, count };
      if (element.dataset.galleryVisible !== String(visible)) {
        element.dataset.galleryVisible = String(visible);
        setGalleryVisible(visible);
      }
      gallery.current?.paint(galleryFrame);
      if (!motion.matches && entrance > 0 && gameFrame.current && galleryLive.current.mode !== 'play') {
        const pose = panelPose(galleryFrame, gameIndex < 0 ? 0 : gameIndex);
        gameFrame.current.dataset.panelDepth = pose.depth.toFixed(4);
        const frameWidth = width - 40 * entrance;
        const frameHeight = width <= 800 ? height * (1 - entrance) + height * .25 / .9 * entrance : height - 145 * entrance;
        element.style.setProperty('--game-mini', '0');
        element.style.setProperty('--game-left', `${pose.x}px`);
        element.style.setProperty('--game-top', `${pose.y}px`);
        element.style.setProperty('--game-width', `${frameWidth * pose.scale}px`);
        element.style.setProperty('--game-height', `${frameHeight * pose.scale}px`);
        element.style.setProperty('--game-scale', String(pose.scale));
        element.style.setProperty('--game-layout-width', `${frameWidth}px`);
        element.style.setProperty('--game-layout-height', `${frameHeight}px`);
        gameFrame.current.style.transform = `rotate(${pose.angle}deg)`;
        gameFrame.current.style.zIndex = String(pose.z);
        const neighbourhood = panelWindow(Math.round(panelPosition), count, gameIndex);
        gameFrame.current.style.visibility = entrance < 1 || neighbourhood.includes(gameIndex) ? 'visible' : 'hidden';
      } else if (galleryLive.current.mode !== 'play') {
        gameFrame.current?.style.removeProperty('transform');
        gameFrame.current?.style.removeProperty('z-index');
        gameFrame.current?.style.removeProperty('visibility');
      }
      const fold = ease(clamp((expansion - 0.4) / 0.4));
      element.style.setProperty('--arrival', String(ease(arrival)));
      element.style.setProperty('--intro-shift', String(-6 * Math.sin(Math.PI * arrival) ** 2));
      element.style.setProperty('--progress', String(takeover));
      element.style.setProperty('--nav-fold', String(fold));
      element.dataset.screening = String(takeover > 0.65);
      element.dataset.settled = String(Math.abs(progress - target) < 0.0001);
      const hidden = fold > 0.999;
      if (hidden !== lastFolded) {
        lastFolded = hidden;
        setNavFolded(hidden);
      }
    };
    const tick = (now: number) => {
      if (galleryLive.current.mode !== 'browse') { frame = 0; lastTime = 0; return; }
      const delta = lastTime ? now - lastTime : 16;
      if (audit && lastTime) {
        sampledFrames++;
        sampledTime += delta;
        audit.fpsAverage = Math.round(sampledFrames * 1000 / sampledTime);
        if (delta > 22) audit.frameDrops++;
      }
      lastTime = now;
      // Time-based follow feels the same at different refresh rates and stops at rest.
      const previous = progress;
      const elapsed = Math.min(delta, 64);
      const galleryMotion = (progress >= 4.1 && target > 4.3) || (progress > 4.3 && target >= 4.1);
      const quick = galleryMotion || fastTravel;
      const follow = (target - progress) * (1 - Math.exp(-elapsed / (quick ? 180 : 1000)));
      progress += Math.sign(follow) * Math.min(Math.abs(follow), elapsed / (quick ? 250 : 900));
      if (Math.abs(target - progress) < 0.0001) { progress = target; fastTravel = false; }
      let panelMoving = false;
      const count = collection.current.length;
      const previewId = galleryLive.current.focusId ?? galleryLive.current.pointerId;
      const previewIndex = collection.current.findIndex(project => project.id === previewId);
      const desiredPanel = previewIndex >= 0 ? previewIndex : collectionPosition(progress);
      if (count > 1 && (progress - 4.3) * (height * 2.7 - window.innerHeight) >= height * .75) {
        const current = ((panelPosition % count) + count) % count;
        let difference = desiredPanel - current;
        if (difference > count / 2) difference -= count;
        if (difference < -count / 2) difference += count;
        if (previewIndex >= 0 || panelReturning) {
          panelMoving = Math.abs(difference) >= .0001;
          panelPosition += panelMoving ? Math.sign(difference) * Math.min(Math.abs(difference) * (1 - Math.exp(-elapsed / 90)), elapsed / 50) : difference;
          panelReturning = previewIndex >= 0 || panelMoving;
        } else panelPosition += difference;
      } else {
        panelPosition = 0;
        panelReturning = false;
      }
      const travel = Math.max(
        Math.abs(ease(clamp(progress / 0.25)) - ease(clamp(previous / 0.25))) * 0.41,
        Math.abs(ease(clamp((progress - 0.25) / 0.55)) - ease(clamp((previous - 0.25) / 0.55))) * 1.05,
      );
      const speed = travel * window.innerWidth / delta;
      // Only fast travel softens the composition, never a gentle scroll or settled frame.
      const blur = progress === target ? 0 : clamp((speed - 1.2) / 2) * 2.5;
      element.style.setProperty('--motion-blur', `${blur}px`);
      paint();
      frame = progress === target && !panelMoving ? 0 : requestAnimationFrame(tick);
    };
    const trackSize = () => {
      const distance = height * 2.7 - window.innerHeight;
      const count = collection.current.length;
      const tail = height * .75 + (count > 1 ? ((count - 1) * PROJECT_STRIDE + .35 + .5) * height : 0);
      if (!motion.matches) section.style.height = `${height + 4.3 * distance + tail + height * .8}px`;
      else section.style.removeProperty('height');
      section.dataset.galleryEntrance = String(motion.matches ? 0 : height * .75);
      section.dataset.galleryBrowsing = String(motion.matches ? 0 : Math.max(0, count - 1) * height * PROJECT_STRIDE);
      section.dataset.galleryStride = String(height * PROJECT_STRIDE);
      section.dataset.galleryRest = String(!motion.matches && count > 1 ? height * .35 : 0);
      section.dataset.galleryExit = String(!motion.matches && count > 1 ? height * .5 : 0);
      section.dataset.browseStart = String(window.scrollY + section.getBoundingClientRect().top + 4.3 * distance + height * .75);
      section.dataset.denominator = String(distance);
      section.dataset.galleryCount = String(count);
      return tail;
    };
    const measure = () => {
      if (galleryLive.current.mode !== 'browse') return;
      if (motion.matches) {
        const galleryBounds = stage.current?.querySelector<HTMLElement>('[data-gallery]')?.getBoundingClientRect();
        setStaticGalleryInView(Boolean(galleryBounds && galleryBounds.top < height * .8));
      }
      // Keep the original 270svh hero's denominator, independent of the added tablet track.
      const distance = height * 2.7 - window.innerHeight;
      const tail = trackSize();
      target = motion.matches ? 0 : Math.max(0, Math.min(ready || directGallery ? 4.3 + tail / distance : 1, -section.getBoundingClientRect().top / distance));
      if (Math.abs(target - progress) > .45) fastTravel = true;
      if (!motion.matches && (target < 4.1 || target > 4.3) && lastInteractive) {
        lastInteractive = false;
        setGameInteractive(false);
        element.dataset.gameInteractive = 'false';
        if (document.activeElement instanceof HTMLElement && gameFrame.current?.contains(document.activeElement)) document.activeElement.blur();
      }
      if (audit) {
        audit.maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        audit.isScrollUnlocked = audit.maxScroll > 0;
      }
      if (motion.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        progress = 0;
        element.style.setProperty('--motion-blur', '0px');
        paint();
      } else if (!frame) {
        lastTime = 0;
        frame = requestAnimationFrame(tick);
      }
    };
    const resize = () => {
      cancelSettle();
      const wasBrowsing = !motion.matches && height !== viewport.clientHeight && target > 4.3;
      width = viewport.clientWidth;
      height = motion.matches ? window.innerHeight : viewport.clientHeight;
      endScale = Math.min(width / 1672, height / 941) * 0.96;
      endX = (width - 1672 * endScale) / 2;
      endY = (height - 941 * endScale) / 2;
      if (motion.matches || progress <= 4.3) {
        element.style.setProperty('--game-layout-width', `${width}px`);
        element.style.setProperty('--game-layout-height', `${height}px`);
      }
      element.style.setProperty('--tablet-left', `${endX + 1028 * endScale}px`);
      element.style.setProperty('--tablet-top', `${endY + 224 * endScale}px`);
      element.style.setProperty('--tablet-width', `${188 * endScale}px`);
      element.style.setProperty('--tablet-height', `${110 * endScale}px`);
      element.style.setProperty('--tablet-scene-x', `${endX}px`);
      element.style.setProperty('--tablet-scene-y', `${endY}px`);
      element.style.setProperty('--tablet-scene-scale', String(endScale));
      if (wasBrowsing) align(Math.max(0, collection.current.findIndex(project => project.id === galleryLive.current.committedId)));
      else measure();
    };
    const align = (index: number, collectionChanged = false) => {
      cancelSettle();
      clearPreviews();
      trackSize();
      if (!motion.matches) {
        const distance = height * 2.7 - window.innerHeight;
        const top = window.scrollY + section.getBoundingClientRect().top + 4.3 * distance + height * .75 + Math.max(0, index) * height * PROJECT_STRIDE;
        alignmentDestination = top;
        window.scrollTo({ top, behavior: 'instant' });
      }
      measure();
      if (!motion.matches && progress >= 4.3) {
        // Align native scroll without rewinding a preview to the old committed panel.
        progress = target;
        panelReturning = !collectionChanged;
        if (collectionChanged) panelPosition = index;
        paint();
      }
    };
    const settleGallery = () => {
      settleTimer = null;
      const state = galleryLive.current;
      if (motion.matches || pointerHeld || document.hidden || state.mode !== 'browse' || state.pointerId || state.focusId) return;
      const count = collection.current.length;
      if (count < 2) return;
      const distance = height * 2.7 - window.innerHeight;
      const browseStart = window.scrollY + section.getBoundingClientRect().top + 4.3 * distance + height * .75;
      const position = (window.scrollY - browseStart) / (height * PROJECT_STRIDE);
      // Do not catch the quiz entrance, the last project's resting interval, or the gallery exit.
      if (position < 0 || position > count - 1) return;
      const index = Math.round(position);
      if (Math.abs(position - index) * height * PROJECT_STRIDE < 1) return;
      updateGallery({ committedId: collection.current[index].id });
      align(index);
    };
    const scheduleSettle = () => {
      cancelSettle();
      if (!motion.matches && galleryLive.current.mode === 'browse') settleTimer = window.setTimeout(settleGallery, 180);
    };
    const pointerDown = () => { pointerHeld = true; cancelSettle(); };
    const pointerUp = () => { pointerHeld = false; scheduleSettle(); };
    const scrollEnd = (event: Event) => {
      if (event.target === document) scheduleSettle();
    };
    const scroll = () => {
      cancelSettle();
      if (galleryLive.current.mode !== 'browse') return;
      if (alignmentDestination !== null && Math.abs(window.scrollY - alignmentDestination) < 1) {
        alignmentDestination = null;
        measure();
        return;
      }
      alignmentDestination = null;
      if (document.activeElement instanceof HTMLElement && document.activeElement.hasAttribute('data-project-id')) gallery.current?.focusCatalog();
      clearPreviews();
      measure();
      if (!nativeScrollEnd) scheduleSettle();
    };
    motionControls.current = {
      align,
      jumpToGallery() {
        if (motion.matches) {
          const galleryElement = stage.current?.querySelector<HTMLElement>('[data-gallery]');
          if (galleryElement) window.scrollTo({ top: window.scrollY + galleryElement.getBoundingClientRect().top, behavior: 'instant' });
          return;
        }
        directGallery = true;
        align(0);
        cancelAnimationFrame(frame);
        frame = 0;
        target = 4.3 + height * .75 / (height * 2.7 - window.innerHeight);
        progress = target;
        panelPosition = 0;
        fastTravel = false;
        paint();
      },
      jumpToOpening() {
        cancelAnimationFrame(frame);
        frame = 0;
        target = 0;
        progress = 0;
        panelPosition = 0;
        fastTravel = false;
        paint();
      },
      refresh() { measure(); paint(); resume(); },
      suspend() { cancelSettle(); cancelAnimationFrame(frame); frame = 0; lastTime = 0; },
    };
    const assetsLoaded = () => {
      if (!disposed && maskLoaded && picture.complete && picture.naturalWidth > 0) {
        ready = true;
        setTabletReady(true);
        measure();
      }
    };
    const assetFailed = () => { if (!disposed) setMessage('Tablet scene unavailable. The film remains available.'); };
    picture.addEventListener('load', assetsLoaded);
    picture.addEventListener('error', assetFailed);
    mask.onload = () => { maskLoaded = true; assetsLoaded(); };
    mask.onerror = assetFailed;
    mask.src = TABLET_MASK;
    const changeMotion = () => {
      cancelSettle();
      setReduced(motion.matches);
      setExpanded(false);
      setTabletExpanded(false);
      setGameExpanded(false);
      setGameInteractive(false);
      lastInteractive = false;
      filmConcealed.current = false;
      setFilmAvailable(true);
      if (motion.matches) wantsPlayback.current = false;
      film.pause();
      measure();
    };
    setReduced(motion.matches);
    if (motion.matches) wantsPlayback.current = false;
    resize();
    const observer = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting;
      setControlsAvailable(entry.isIntersecting);
      resume();
    }, { threshold: 0.01 });
    observer.observe(film.parentElement ?? film);
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('scrollend', scrollEnd);
    window.addEventListener('pointerdown', pointerDown, { passive: true });
    window.addEventListener('pointerup', pointerUp, { passive: true });
    window.addEventListener('pointercancel', pointerUp, { passive: true });
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', resume);
    motion.addEventListener('change', changeMotion);
    return () => {
      disposed = true;
      film.pause();
      observer.disconnect();
      cancelAnimationFrame(frame);
      cancelSettle();
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('scrollend', scrollEnd);
      window.removeEventListener('pointerdown', pointerDown);
      window.removeEventListener('pointerup', pointerUp);
      window.removeEventListener('pointercancel', pointerUp);
      motionControls.current = null;
      window.removeEventListener('resize', resize);
      picture.removeEventListener('load', assetsLoaded);
      picture.removeEventListener('error', assetFailed);
      mask.onload = null;
      mask.onerror = null;
      document.removeEventListener('visibilitychange', resume);
      motion.removeEventListener('change', changeMotion);
      if (audit) Reflect.deleteProperty(window, '__CREATIVE_AUDIT__');
    };
  }, [clearPreviews, updateGallery]);

  useLayoutEffect(() => { motionControls.current?.refresh(); }, [galleryState.pointerId, galleryState.focusId, galleryState.committedId]);

  useEffect(() => {
    if (!reduced) return;
    filmConcealed.current = gameExpanded;
    setFilmAvailable(!gameExpanded);
    if (gameExpanded) {
      if (document.activeElement === video.current) video.current?.blur();
      video.current?.pause();
    }
    else if (wantsPlayback.current && inView.current && !document.hidden) {
      void video.current?.play().catch(() => setMessage('Focus the film and press Space to play.'));
    }
  }, [reduced, gameExpanded]);

  async function togglePlayback() {
    const film = video.current;
    if (!film || filmConcealed.current) return;
    setMessage('');
    if (!film.paused) {
      wantsPlayback.current = false;
      film.pause();
    } else {
      wantsPlayback.current = true;
      try { await film.play(); }
      catch {
        wantsPlayback.current = false;
        setMessage('The film could not play. Press Space to try again.');
      }
    }
  }

  function selectProject(id: string) {
    const index = collection.current.findIndex(project => project.id === id);
    if (index < 0) return;
    updateGallery({ committedId: id, pointerId: null, focusId: null });
    motionControls.current?.align(index);
  }

  function filterProjects(filter: GalleryFilter) {
    const next = projects.filter(project => filter === 'all' || project.kind === filter);
    const id = next.some(project => project.id === galleryLive.current.committedId) ? galleryLive.current.committedId : next[0]?.id ?? null;
    collection.current = next;
    updateGallery({ filter, committedId: id, pointerId: null, focusId: null });
    motionControls.current?.align(Math.max(0, next.findIndex(project => project.id === id)), true);
  }

  function projectAction(id: string) {
    const project = collection.current.find(item => item.id === id);
    if (!project) return;
    invokingAction.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    selectProject(id);
    if (project.presentation.type === 'study-game') updateGallery({ mode: 'play' });
    else if (project.presentation.type === 'film') updateGallery({ mode: 'film' });
  }

  function continueGallery() {
    clearPreviews();
    end.current?.enterFromGallery();
  }

  const gameEnabled = galleryState.mode === 'play' ? playReady : galleryState.mode === 'browse' && (reduced ? gameExpanded && !staticGalleryInView : gameInteractive);
  const viewerProject = collection.current.find(project => project.id === galleryState.committedId);
  const viewerPresentation = viewerProject?.presentation.type === 'film' ? viewerProject.presentation : null;

  function returnToOpening() {
    wantsOpeningFocus.current = true;
    setExpanded(false);
    setTabletExpanded(false);
    setGameExpanded(false);
    if (root.current) window.scrollTo({ top: window.scrollY + root.current.getBoundingClientRect().top, behavior: 'instant' });
    motionControls.current?.jumpToOpening();
    if (!navHidden) {
      wantsOpeningFocus.current = false;
      root.current?.querySelector<HTMLAnchorElement>('header a')?.focus({ preventScroll: true });
    }
  }

  function viewSelectedWork(trigger: HTMLElement) {
    if (!projects.length || workHandoffRunning.current) return;
    const jump = () => {
      flushSync(() => {
        collection.current = projects;
        updateGallery({ filter: 'all', committedId: projects[0].id, pointerId: null, focusId: null });
        motionControls.current?.jumpToGallery();
      });
      gallery.current?.focusCatalog();
    };
    if (reduced || !document.startViewTransition) { jump(); return; }
    workHandoffRunning.current = true;
    trigger.style.viewTransitionName = 'work-heading';
    document.documentElement.dataset.workHandoff = 'source';
    const transition = document.startViewTransition(() => {
      trigger.style.removeProperty('view-transition-name');
      document.documentElement.dataset.workHandoff = 'destination';
      jump();
    });
    const finish = () => {
      trigger.style.removeProperty('view-transition-name');
      delete document.documentElement.dataset.workHandoff;
      workHandoffRunning.current = false;
    };
    void transition.finished.then(finish, finish);
  }

  function viewStudio() {
    if (studioHandoffRunning.current) return;
    const jump = () => end.current?.jumpToIntro();
    if (reduced || !document.startViewTransition) { jump(); return; }
    studioHandoffRunning.current = true;
    const transition = document.startViewTransition(() => {
      document.documentElement.dataset.studioHandoff = 'true';
      jump();
    });
    const finish = () => {
      delete document.documentElement.dataset.studioHandoff;
      studioHandoffRunning.current = false;
    };
    void transition.finished.then(finish, finish);
  }

  function startProject() {
    if (projectRiseRunning.current) return;
    const jump = () => closing.current?.startProject();
    if (reduced || !document.startViewTransition) { jump(); return; }
    projectRiseRunning.current = true;
    document.documentElement.dataset.projectRise = 'true';
    const transition = document.startViewTransition(jump);
    const finish = () => { delete document.documentElement.dataset.projectRise; projectRiseRunning.current = false; };
    void transition.finished.then(finish, finish);
  }

  function changeComposition() {
    if (reduced) {
      setExpanded(!expanded);
      setTabletExpanded(false);
      setGameExpanded(false);
    } else if (track.current && stage.current) {
      const target = window.scrollY + track.current.getBoundingClientRect().top;
      const distance = stage.current.clientHeight * 2.7 - window.innerHeight;
      wantsScreeningFocus.current = true;
      window.scrollTo({ top: target + distance * 0.8, behavior: 'instant' });
      if (controlsVisible) {
        wantsScreeningFocus.current = false;
        soundButton.current?.focus({ preventScroll: true });
      }
    }
  }

  return (
    <div ref={root} className={styles.root} data-static-expanded={reduced && expanded} data-static-tablet={reduced && expanded && tabletExpanded} data-nav-hidden={navHidden} data-static-game={reduced && gameExpanded} data-gallery-mode={galleryState.mode} data-gallery-in-view={reduced ? staticGalleryInView : galleryVisible}
      onKeyDown={(event) => { if (event.key === 'Escape' && !(event.target instanceof Node && end.current?.element?.contains(event.target))) { event.preventDefault(); if (galleryLive.current.mode !== 'browse') closeGalleryMode(); else if (!galleryVisible || (reduced && window.scrollY < window.innerHeight)) returnToOpening(); } }}>
      <a className={styles.skip} href="#film-sound" onClick={(event) => {
        event.preventDefault();
        if (controlsVisible) soundButton.current?.focus({ preventScroll: true });
        else {
          wantsScreeningFocus.current = true;
          changeComposition();
        }
      }}>Skip to film sound</a>
      <header id="studio-navigation" className={styles.header} inert={navHidden || teamCovered} aria-hidden={navHidden || teamCovered}>
        <a href="#studio-navigation" className={styles.brand} onClick={event => { event.preventDefault(); returnToOpening(); }} aria-label="J StaR Films Studios, back to the beginning">J StaR<span>Films Studios</span></a>
        <nav aria-label="Main navigation">
          <a href="#selected-work" onClick={event => { event.preventDefault(); viewSelectedWork(event.currentTarget); }}>Work</a>
          <a href="#meet-the-studio" onClick={event => { event.preventDefault(); viewStudio(); }}>Studio</a>
          <a className={styles.projectLink} href="#project-enquiry" onClick={event => { event.preventDefault(); startProject(); }}>Start a Project <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <section ref={track} className={styles.track} aria-label="Studio introduction, film, tablet and study game">
        <div ref={stage} className={styles.stage} inert={teamCovered && galleryState.mode === 'browse'} onPointerMove={() => wakeSound()}>
          <div className={styles.introduction}>
            <p className={styles.eyebrow}>Two ways to move people.</p>
            <h1 className={styles.wordmark}>
              <span className={styles.srOnly}>{OPENING_LINE} {STUDIOS_LINE}</span>
              <span ref={firstLine} className={styles.firstLine} aria-hidden="true"
                onPointerEnter={event => scrambleLine('first', event.pointerType)} onPointerLeave={() => stopScramble('first')}>
                {OPENING_LINE}<span ref={firstScrambleLayer} className={styles.scrambleLayer} />
              </span>
              <span ref={secondLine} className={styles.secondLine} aria-hidden="true"
                onPointerEnter={event => scrambleLine('second', event.pointerType)} onPointerLeave={() => stopScramble('second')}>
                {STUDIOS_LINE}<span ref={secondScrambleLayer} className={styles.scrambleLayer} />
              </span>
            </h1>
            <p className={styles.description}>
              <span className={styles.srOnly}>{OPENING_COPY}</span>
              <span ref={description} className={styles.hoverCopy} aria-hidden="true"
                onPointerEnter={event => { if (event.pointerType !== 'touch') { prepareAttract(); moveAttract(event.clientX, event.clientY); } }}
                onPointerMove={event => moveAttract(event.clientX, event.clientY)} onPointerLeave={resetAttract}>
                {OPENING_COPY}<span ref={attractLayer} className={styles.hoverLayer} />
              </span>
            </p>
          </div>

          <div className={styles.filmFrame}>
            <video ref={video} className={styles.video} src={FILM} poster={POSTER} muted={muted} loop playsInline preload="metadata"
              inert={!filmAvailable} tabIndex={controlsVisible ? 0 : -1} aria-keyshortcuts="Space Escape" aria-describedby="film-keyboard-help"
              aria-label={playing ? 'Nifemi film, playing' : 'Nifemi film, paused'}
              onKeyDown={(event) => { if (event.code === 'Space') { event.preventDefault(); void togglePlayback(); } }}
              onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
              onError={() => setMessage('Film unavailable. Please reload this local preview.')}
            />
          </div>
          <div className={styles.businessIntro}>
            <h2 aria-label="We build what happens next.">
              <span className={styles.lineMask} aria-hidden="true"><span className={styles.headlineFirst}>We build what</span></span>
              <span className={styles.lineMask} aria-hidden="true"><span className={styles.headlineSecond}>happens next.</span></span>
            </h2>
            <p>Websites, applications, and systems for your business.</p>
          </div>
          <div ref={gameFrame} className={styles.gameFrame} data-study-frame data-play={galleryState.mode === 'play'}
            popover={galleryState.mode === 'play' ? 'manual' : undefined}
            role={galleryState.mode === 'play' ? 'dialog' : undefined} aria-modal={galleryState.mode === 'play' ? true : undefined}
            aria-label={galleryState.mode === 'play' ? 'Play Adaptive Study Game' : undefined} inert={!gameEnabled}
            aria-hidden={!gameEnabled}>
            <div ref={gameCanvas} className={styles.gameCanvas} data-study-canvas onScroll={() => {
              const canvas = gameCanvas.current;
              if (galleryLive.current.mode !== 'browse' || !gameEnabled || !canvas) return;
              // A smaller layout can clamp scrollTop. Retain the bookmark for the larger play view.
              const maximum = canvas.scrollHeight - canvas.clientHeight;
              if (savedGameScroll.current > maximum && canvas.scrollTop >= maximum - 1) return;
              savedGameScroll.current = canvas.scrollTop;
            }}>
              <StudyGame interactive={gameEnabled} />
            </div>
            {galleryState.mode === 'play' && <button ref={backButton} className={styles.backToBrowse} data-back-to-browsing onClick={closeGalleryMode}>← Back to browsing</button>}
          </div>
          <div className={styles.tabletScene}>
            <Image ref={sceneImage} src={TABLET_SCENE} width={1672} height={941} unoptimized loading="eager"
              alt="A Black woman seated on a plinth holding a landscape tablet showing the film." />
          </div>
          {reduced && gameExpanded && (
            <button className={styles.staticGameControl} onClick={() => setGameExpanded(false)}>Return to tablet</button>
          )}
          {reduced && expanded && tabletExpanded && !gameExpanded && (
            <button className={styles.gameControl} onClick={() => setGameExpanded(true)}>View study game</button>
          )}
          {reduced && expanded && tabletReady && !gameExpanded && (
            <button className={styles.tabletControl} onClick={() => setTabletExpanded(!tabletExpanded)}>
              {tabletExpanded ? 'Return to screening' : 'View tablet'}
            </button>
          )}
          <p id="film-keyboard-help" className={styles.srOnly}>Press Space on the film to pause or play. Escape returns to the studio opening.</p>
          <div className={styles.soundControl} data-awake={soundAwake} data-hint={soundHint} inert={!controlsVisible}>
            <button id="film-sound" ref={soundButton} onPointerEnter={() => wakeSound()} onFocus={() => wakeSound()}
              onClick={() => { setMuted(!muted); setSoundHint(false); wakeSound(); }}
              aria-label={muted ? 'Enable sound' : 'Mute sound'} aria-pressed={!muted} title={muted ? 'Enable sound' : 'Mute sound'}>
              <span className={styles.soundLabel}>{muted ? 'Sound on' : 'Sound off'}</span>
              {muted ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
            </button>
          </div>

          <div className={styles.bottomRow} inert={reduced && gameExpanded}>
            <button onClick={event => viewSelectedWork(event.currentTarget)} disabled={!projects.length} className={styles.expandControl}>View selected work <span aria-hidden="true">↘</span></button>
            {reduced && <button onClick={changeComposition} className={styles.expandControl}>
              {expanded ? 'Return to opening' : 'Expand film'} <span aria-hidden="true">↓</span>
            </button>}
          </div>
          <p className={styles.message} role="status">{message}</p>
          <SelectedWorkGallery ref={gallery} projects={filteredProjects} counts={filterCounts} filter={galleryState.filter} committedId={galleryState.committedId}
            pointerId={galleryState.pointerId} focusId={galleryState.focusId} mode={galleryState.mode} visible={reduced || galleryVisible} reduced={reduced}
            onFilter={filterProjects} onPreview={(source, id) => updateGallery(source === 'pointer' ? { pointerId: id } : { focusId: id })}
            onSelect={selectProject} onAction={projectAction} onContinue={continueGallery} onReturnToOpening={returnToOpening} />
        </div>
      </section>
      <TeamSection ref={end} onGalleryCovered={setTeamCovered} />
      <ClosingSequence ref={closing} onBackToTop={returnToOpening} />
      <a className={styles.journeyBrand} href="#studio-navigation" onClick={event => { event.preventDefault(); returnToOpening(); }} aria-label="J StaR Films Studios, back to the beginning">J StaR <span>Films Studios</span></a>
      {galleryState.mode === 'film' && viewerPresentation && <dialog ref={viewer} className={styles.filmViewer} aria-label={`${viewerProject?.title}${viewerPresentation.fullSrc ? ' film' : ' excerpt'}`}
        onCancel={event => { event.preventDefault(); closeGalleryMode(); }}>
        <button data-back-to-browsing onClick={closeGalleryMode}>← Back to browsing</button>
        <h2>{viewerProject?.title}{viewerPresentation.fullSrc ? '' : ' excerpt'}</h2>
        {!viewerPresentation.fullSrc && <p>Preview excerpt. The full film is not available here.</p>}
        <video ref={viewerVideo} src={viewerPresentation.fullSrc ?? viewerPresentation.previewSrc} poster={viewerPresentation.poster} controls playsInline preload="metadata" />
      </dialog>}
    </div>
  );
}
