'use client';

import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize, Minimize, X } from 'lucide-react';
import { flushSync } from 'react-dom';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import type { GalleryFilter, GalleryProject, ProjectContributor } from '@/content/selected-work';
import { NativeMedia, YouTubeMedia } from './PortfolioMedia';
import styles from './portfolio-viewer.module.css';

type ViewerOrientation = ScreenOrientation & { lock?: (orientation: 'landscape' | 'portrait') => Promise<void> };

interface Props {
  project?: GalleryProject;
  projects: readonly GalleryProject[];
  filter: GalleryFilter;
  shell: RefObject<HTMLDivElement | null>;
  sample: boolean;
  onSample: (sample: boolean) => void;
  onSampleLayout: () => void;
  onDetail: (open: boolean) => void;
  onNavigate: (id: string) => void;
  onClose: () => void;
}
export default function PortfolioViewer({ project, projects, filter, shell, sample, onSample, onSampleLayout, onDetail, onNavigate, onClose }: Props) {
  const core = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const notes = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const drawer = useRef<HTMLElement>(null);
  const detailTrigger = useRef<HTMLElement | null>(null);
  const beforeZoom = useRef<DOMRect | null>(null);
  const zoom = useRef<Animation | null>(null);
  const sampleZoom = useRef<Animation | null>(null);
  const notesSlide = useRef<Animation | null>(null);
  const alignSample = useRef<(() => void) | null>(null);
  const orientationGeneration = useRef(0);
  const orientationOwned = useRef(false);
  const orientationJob = useRef<Promise<void> | null>(null);
  const opening = useRef<Animation | null>(null);
  const [canRotate, setCanRotate] = useState(false);
  const keyboard = useRef(false);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [notesPhase, setNotesPhase] = useState<'shown' | 'leaving' | 'waiting' | 'entering'>('shown');
  const [playing, setPlaying] = useState(false);
  const [idle, setIdle] = useState(false);
  const [wakeCount, setWakeCount] = useState(0);
  const [detail, setDetail] = useState<'brief' | ProjectContributor | null>(null);
  const [railEnds, setRailEnds] = useState({ start: true, end: true });
  const [status, setStatus] = useState('');
  const index = projects.findIndex(item => item.id === project?.id);
  const ordinal = `${String(index + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`;
  const projectId = project?.id;
  const youtube = project?.presentation.type === 'youtube';
  const software = project?.kind === 'software';
  const portrait = project?.presentation.type === 'youtube' && project.presentation.orientation === 'portrait';
  const wake = useCallback(() => { setIdle(false); setWakeCount(count => count + 1); }, []);
  const rotate = useCallback((direction: 'landscape' | 'portrait', manual = false) => {
    const orientation: ViewerOrientation | undefined = screen.orientation;
    if (typeof orientation?.lock !== 'function' || typeof orientation.unlock !== 'function') return;
    const generation = orientationGeneration.current;
    // Serialize locks so a late, cancelled request cannot unlock a newer viewer request.
    orientationJob.current = (orientationJob.current ?? Promise.resolve()).then(async () => {
      const active = document.fullscreenElement;
      if (generation !== orientationGeneration.current || !active || !shell.current?.contains(active)) return;
      try {
        await orientation.lock?.(direction);
        const current = document.fullscreenElement;
        if (generation !== orientationGeneration.current || !current || !shell.current?.contains(current)) orientation.unlock();
        else orientationOwned.current = true;
      } catch {
        if (manual && generation === orientationGeneration.current) setStatus('Display rotation is unavailable.');
      }
    });
  }, [shell]);

  useEffect(() => {
    const orientation: ViewerOrientation | undefined = screen.orientation;
    setCanRotate(typeof orientation?.lock === 'function' && typeof orientation.unlock === 'function' && document.fullscreenEnabled);
    if (!expanded) return;
    const generation = orientationGeneration.current;
    const film = media.current?.querySelector('video');
    const autoRotate = () => {
      const active = document.fullscreenElement;
      if (software || !active || !shell.current?.contains(active)) return;
      if (window.innerWidth > 800 && !window.matchMedia('(pointer: coarse)').matches) return;
      if (film && (!film.videoWidth || !film.videoHeight)) return;
      rotate(portrait || (film && film.videoHeight > film.videoWidth) ? 'portrait' : 'landscape');
    };
    autoRotate();
    film?.addEventListener('loadedmetadata', autoRotate);
    document.addEventListener('fullscreenchange', autoRotate);
    return () => {
      film?.removeEventListener('loadedmetadata', autoRotate);
      document.removeEventListener('fullscreenchange', autoRotate);
      orientationGeneration.current = generation + 1;
      if (orientationOwned.current) { orientation?.unlock(); orientationOwned.current = false; }
    };
  }, [expanded, project?.id, portrait, software, rotate, shell]);

  useEffect(() => {
    if (!playing || detail || keyboard.current) { setIdle(false); return; }
    const timer = setTimeout(() => {
      if (keyboard.current) return;
      setIdle(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, [playing, detail, wakeCount]);

  useLayoutEffect(() => {
    setDetail(null); onDetail(false); setPlaying(false); setIdle(false); setStatus('');
    notesSlide.current?.cancel(); notesSlide.current = null; setNotesPhase('shown');
    keyboard.current = false;
    opening.current?.cancel();
    if (projectId && core.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      opening.current = core.current.animate(youtube ? [{ opacity: .2 }, { opacity: 1 }] : [{ opacity: .2, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 360, easing: 'cubic-bezier(.16,1,.3,1)' });
    }
    return () => opening.current?.cancel();
  }, [projectId, onDetail, youtube]);

  useLayoutEffect(() => {
    if (!project || !shell.current || !core.current) return;
    const frame = shell.current;
    const align = () => {
      if (zoom.current?.playState === 'running') return;
      const base = frame.getBoundingClientRect();
      const layout = core.current?.querySelector<HTMLDivElement>(`.${styles.layout}`);
      const cinema = media.current?.parentElement;
      if (media.current && cinema && layout && !expanded && window.innerWidth > 800) {
        const height = (element: Element) => {
          const css = getComputedStyle(element);
          return element.getBoundingClientRect().height + parseFloat(css.marginTop) + parseFloat(css.marginBottom);
        };
        const title = cinema.querySelector(`.${styles.title}`);
        const extras = Array.from(media.current.children).filter(element => !element.matches(`.${styles.picture}, .${styles.productWindow}`));
        const chrome = media.current.querySelector(`.${styles.chrome}`);
        const css = getComputedStyle(layout);
        const available = layout.clientHeight - parseFloat(css.paddingTop) - parseFloat(css.paddingBottom) - (title ? height(title) : 0) - extras.reduce((sum, element) => sum + height(element), 0) - (chrome ? height(chrome) : 0) - 18;
        const width = Math.max(youtube ? 200 : 0, Math.min(cinema.clientWidth - 18, available * (portrait ? 9 / 16 : 16 / 9)));
        media.current.style.setProperty('--media-width', `${width}px`);
        if (portrait) media.current.style.setProperty('--portrait-height', `${Math.max(200, Math.min(available, width * 16 / 9))}px`);
      } else {
        media.current?.style.removeProperty('--media-width');
        media.current?.style.removeProperty('--portrait-height');
      }
      if (slot.current) {
        const box = slot.current.getBoundingClientRect();
        // The game remains a sibling of this UI. Only its CSS rectangle follows the sample slot.
        frame.style.setProperty('--sample-left', `${box.left + box.width / 2 - slot.current.clientWidth / 2 - base.left}px`);
        frame.style.setProperty('--sample-top', `${box.top + box.height / 2 - slot.current.clientHeight / 2 - base.top}px`);
        frame.style.setProperty('--sample-width', `${slot.current.clientWidth}px`);
        frame.style.setProperty('--sample-height', `${slot.current.clientHeight}px`);
        const viewport = core.current?.querySelector<HTMLDivElement>(`.${styles.layout}`)?.getBoundingClientRect();
        const top = box.top + box.height / 2 - slot.current.clientHeight / 2;
        frame.style.setProperty('--sample-clip-top', `${Math.max(0, (viewport?.top ?? top) - top)}px`);
        frame.style.setProperty('--sample-clip-bottom', `${Math.max(0, top + slot.current.clientHeight - (viewport?.bottom ?? box.bottom))}px`);
        if (sample && project.presentation.type === 'study-game') onSampleLayout();
      }
      if (notes.current) frame.style.setProperty('--drawer-left', window.innerWidth <= 800 ? '0px' : `${notes.current.getBoundingClientRect().left - base.left}px`);
      const people = rail.current;
      setRailEnds({ start: !people || people.scrollLeft < 2, end: !people || people.scrollLeft + people.clientWidth >= people.scrollWidth - 2 });
    };
    alignSample.current = align;
    align();
    const observer = new ResizeObserver(align);
    observer.observe(frame); observer.observe(core.current);
    const heading = core.current.querySelector(`.${styles.title}`);
    if (heading) observer.observe(heading);
    if (slot.current) observer.observe(slot.current);
    const content = core.current;
    content.addEventListener('scroll', align, { passive: true, capture: true });
    window.addEventListener('resize', align);
    return () => { alignSample.current = null; observer.disconnect(); content.removeEventListener('scroll', align, true); window.removeEventListener('resize', align); };
  }, [project, shell, expanded, sample, portrait, youtube, onSampleLayout]);

  useEffect(() => {
    const frame = shell.current;
    if (!frame) return;
    const changed = () => {
      const active = document.fullscreenElement;
      const next = !!active && frame.contains(active);
      const returning = !next && core.current?.parentElement?.dataset.expanded === 'true';
      if (!next && frame.dataset.viewer === 'true') {
        // Browser-initiated exits also need a painted shell before measuring the return.
        frame.dataset.fullscreenHandoff = 'true';
        if (typeof frame.showPopover === 'function' && !frame.matches(':popover-open')) frame.showPopover();
      }
      if (returning && !beforeZoom.current) beforeZoom.current = media.current?.getBoundingClientRect() ?? null;
      flushSync(() => { if (returning) setNotesPhase('waiting'); setExpanded(next); wake(); });
      if (!next && frame.dataset.viewer === 'true') {
        frame.querySelector<HTMLButtonElement>('[data-viewer-fullscreen]')?.focus({ preventScroll: true });
      }
      delete frame.dataset.fullscreenHandoff;
    };
    document.addEventListener('fullscreenchange', changed);
    return () => { document.removeEventListener('fullscreenchange', changed); zoom.current?.cancel(); sampleZoom.current?.cancel(); zoom.current = null; sampleZoom.current = null; };
  }, [shell, wake]);

  useLayoutEffect(() => {
    const node = notes.current;
    if (!node || notesPhase === 'shown' || notesPhase === 'waiting') return;
    const leaving = notesPhase === 'leaving';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setNotesPhase(leaving ? 'waiting' : 'shown');
      return;
    }
    const visible = { opacity: 1, transform: 'translateX(0)' };
    const away = { opacity: 0, transform: 'translateX(calc(100% + 38px))' };
    const animation = node.animate(leaving ? [visible, away] : [away, visible], {
      duration: leaving ? 240 : 300, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards',
    });
    notesSlide.current = animation;
    const finish = () => { if (notesSlide.current === animation) setNotesPhase(leaving ? 'waiting' : 'shown'); };
    void animation.finished.then(finish, finish);
    return () => { animation.cancel(); if (notesSlide.current === animation) notesSlide.current = null; };
  }, [notesPhase]);

  useLayoutEffect(() => {
    const target = media.current;
    const from = beforeZoom.current;
    beforeZoom.current = null;
    zoom.current?.cancel(); sampleZoom.current?.cancel();
    zoom.current = null; sampleZoom.current = null;
    alignSample.current?.();
    if (!target || !from || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (!expanded) setNotesPhase('shown');
      return;
    }
    if (youtube) {
      // Fade the same, fully exposed iframe at its final geometry. No scaling, clipping or overlay.
      const animation = target.animate([{ opacity: .45 }, { opacity: 1 }], { duration: 620, easing: 'ease-out' });
      zoom.current = animation;
      const finish = () => { if (!expanded && zoom.current === animation) setNotesPhase('entering'); };
      void animation.finished.then(finish, finish);
      return;
    }
    const to = target.getBoundingClientRect();
    if (!to.width || !to.height) { if (!expanded) setNotesPhase('shown'); return; }
    const scaleX = from.width / to.width, scaleY = from.height / to.height;
    const canvas = sample && project?.presentation.type === 'study-game' ? shell.current?.querySelector<HTMLDivElement>('[data-study-canvas]') : null;
    if (canvas) {
      const base = shell.current?.getBoundingClientRect();
      const left = (base?.left ?? 0) + parseFloat(shell.current?.style.getPropertyValue('--sample-left') ?? '0');
      const top = (base?.top ?? 0) + parseFloat(shell.current?.style.getPropertyValue('--sample-top') ?? '0');
      sampleZoom.current = canvas.animate([
        { transformOrigin: '0 0', transform: `translate(${from.left - to.left + (scaleX - 1) * (left - to.left)}px, ${from.top - to.top + (scaleY - 1) * (top - to.top)}px) scale(${scaleX}, ${scaleY}) rotate(${expanded ? 1.2 : 0}deg)` },
        { transformOrigin: '0 0', transform: expanded ? 'none' : 'rotate(1.2deg)' },
      ], { duration: 620, easing: 'cubic-bezier(.16,1,.3,1)' });
    }
    const animation = target.animate([
      { transformOrigin: '0 0', transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})` },
      { transformOrigin: '0 0', transform: 'none' },
    ], { duration: 620, easing: 'cubic-bezier(.16,1,.3,1)' });
    zoom.current = animation;
    // Mobile fullscreen/orientation changes can cancel the animation without an onfinish event.
    const finish = () => {
      if (zoom.current !== animation) return;
      alignSample.current?.();
      if (!expanded) setNotesPhase('entering');
    };
    void animation.finished.then(finish, finish);
  }, [expanded, youtube, sample, project?.id, project?.presentation.type, shell]);

  const fullscreen = useCallback(async () => {
    const frame = shell.current;
    if (!frame) return;
    beforeZoom.current = media.current?.getBoundingClientRect() ?? null;
    try {
      const active = document.fullscreenElement;
      if (active && frame.contains(active)) {
        if (active === frame) {
          frame.dataset.fullscreenHandoff = 'true';
          flushSync(() => { setNotesPhase('waiting'); setExpanded(false); });
        }
        await document.exitFullscreen();
      }
      else if (youtube) {
        const iframe = media.current?.querySelector('iframe');
        if (!iframe) return;
        // The iframe owns the whole display; our popover and controls stay behind it.
        await iframe.requestFullscreen();
        iframe.focus({ preventScroll: true });
      }
      else {
        // Paint the final layout and start its same-node growth BEFORE leaving the popover.
        // The handoff rule keeps the shell displayed while neither top-layer state is active.
        const note = notes.current;
        if (note) {
          const box = note.getBoundingClientRect(), base = frame.getBoundingClientRect();
          note.style.setProperty('--notes-left', `${box.left - base.left}px`);
          note.style.setProperty('--notes-top', `${box.top - base.top}px`);
          note.style.setProperty('--notes-width', `${box.width}px`);
          note.style.setProperty('--notes-height', `${box.height}px`);
        }
        frame.dataset.fullscreenHandoff = 'true';
        flushSync(() => { setNotesPhase('leaving'); setExpanded(true); });
        if (typeof frame.hidePopover === 'function' && frame.matches(':popover-open')) frame.hidePopover();
        await frame.requestFullscreen();
      }
    } catch {
      if (typeof frame.showPopover === 'function' && !frame.matches(':popover-open')) frame.showPopover();
      beforeZoom.current = media.current?.getBoundingClientRect() ?? null;
      flushSync(() => { setNotesPhase('waiting'); setExpanded(false); });
      delete frame.dataset.fullscreenHandoff;
      setStatus('Browser fullscreen is unavailable. The current view remains open.');
    }
  }, [shell, youtube]);
  useEffect(() => {
    if (!expanded || !software) return;
    const exit = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault(); event.stopPropagation();
      void fullscreen();
    };
    document.addEventListener('keydown', exit, true);
    return () => document.removeEventListener('keydown', exit, true);
  }, [expanded, software, fullscreen]);
  function closeDetail() {
    setDetail(null); onDetail(false); wake();
    if (detailTrigger.current?.isConnected) detailTrigger.current.focus({ preventScroll: true });
  }
  function openDetail(value: 'brief' | ProjectContributor, trigger: HTMLElement) {
    detailTrigger.current = trigger;
    setDetail(value); onDetail(true); wake();
  }
  useLayoutEffect(() => { if (detail) { drawer.current?.scrollTo({ top: 0 }); drawer.current?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true }); } }, [detail]);

  if (!project) return null;
  const note = project.notes;
  const presentation = project.presentation;
  const rotationControl = expanded && canRotate && <button className={styles.rotate} data-viewer-rotate aria-label="Rotate display" title="Rotate display" onClick={() => rotate(screen.orientation.type.startsWith('landscape') ? 'portrait' : 'landscape', true)}>
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="8" y="5" width="8" height="14" rx="1.5" /><path d="M4 10a8 8 0 0 1 14-5M18 2v3h-3M20 14a8 8 0 0 1-14 5M6 22v-3h3" /></svg>
  </button>;
  const mediaProps = { title: project.title, expanded, idle, onFullscreen: () => { void fullscreen(); }, onPlaying: setPlaying };
  const navigate = (next: number) => {
    const item = projects[next];
    if (!item) return;
    onNavigate(item.id);
    // A bounded endpoint can disable the invoking arrow. Keep focus on a live navigation control.
    requestAnimationFrame(() => core.current?.querySelector<HTMLButtonElement>(next === projects.length - 1 ? '[data-viewer-prev]' : '[data-viewer-next]')?.focus({ preventScroll: true }));
  };
  return <div className={styles.viewer} data-portfolio-viewer data-project={project.id} data-expanded={expanded} data-notes-phase={notesPhase} data-youtube={youtube} data-software={software} data-portrait={portrait} data-playing={playing} data-idle={idle} data-detail={!!detail}
    onPointerDown={event => { keyboard.current = false; pointer.current = { x: event.clientX, y: event.clientY }; wake(); }}
    onPointerMove={event => {
      const previous = pointer.current;
      pointer.current = { x: event.clientX, y: event.clientY };
      if (!previous || Math.abs(event.clientX - previous.x) + Math.abs(event.clientY - previous.y) >= 1) wake();
    }}
    onKeyDownCapture={event => {
      keyboard.current = true; wake();
      if (event.key !== 'Escape') return;
      event.preventDefault(); event.stopPropagation();
      if (detail) closeDetail();
      else if (expanded) void fullscreen();
      else onClose();
    }} onFocusCapture={wake}>
    <div ref={core} className={styles.core} inert={!!detail}>
      <header className={styles.header} inert={expanded && idle}>
        <span className={styles.brand}>J StaR <small>Films Studios</small></span>
        <div className={styles.headerActions}>{!software && !youtube && rotationControl}<button data-back-to-browsing onClick={onClose}><ArrowLeft className="studio-icon" aria-hidden="true" focusable="false" /> Back to browsing</button></div>
      </header>
      <div className={styles.layout}>
        <div className={styles.cinema}>
          <div className={styles.title}><div>{!software && <em>Now showing</em>}<h2>{project.title}</h2></div><span data-viewer-ordinal>{String(index + 1).padStart(2, '0')}</span></div>
          <button className={styles.wake} onFocus={() => { keyboard.current = true; wake(); }} onClick={wake}>Show playback controls</button>
          <div ref={media} className={styles.media}>
            {presentation.type === 'film' ? <NativeMedia key={project.id} presentation={presentation} hidden={!!detail} {...mediaProps} /> : presentation.type === 'youtube' ? <YouTubeMedia key={project.id} presentation={presentation} hidden={!!detail} {...mediaProps} /> : <>
              {presentation.type === 'study-game' && <div className={styles.segment} role="group" aria-label="Product presentation">
                <button data-view-screenshot aria-pressed={!sample} onClick={() => onSample(false)}>Screenshots</button>
                <button data-try-sample aria-pressed={sample} onClick={() => onSample(true)}>Try sample</button>
              </div>}
              <div className={styles.productWindow}>
                <div className={styles.chrome}><span aria-hidden="true">● ● ●</span><span>{project.title} / {sample && presentation.type === 'study-game' ? 'sample' : 'interface'}</span></div>
                <div ref={slot} className={styles.productSlot} data-viewer-sample-slot>
                  {presentation.type === 'study-game' ? <Image hidden={sample} src="/portfolio/thumbnails/adaptive-study-game.png" alt="Adaptive Study Game interface screenshot" fill unoptimized /> : presentation.type === 'static-image' ? <Image src={presentation.src} alt={presentation.alt} fill unoptimized /> : <div className={styles.provisional}><h3>Melo</h3><p>{presentation.note}</p></div>}
                </div>
              </div>
              <div className={styles.productTools}>
                {presentation.type === 'study-game' && <><button data-try-sample onClick={() => onSample(true)}>Try sample</button><button disabled title="The full app is currently unavailable">Try app unavailable</button></>}
                {project.detailsHref && <a href={project.detailsHref} target="_blank" rel="noopener noreferrer">Source <ArrowUpRight className="studio-icon" aria-hidden="true" focusable="false" /></a>}
                {project.websiteHref && <a href={project.websiteHref} target="_blank" rel="noopener noreferrer">Visit website <ArrowUpRight className="studio-icon" aria-hidden="true" focusable="false" /></a>}
                <button data-viewer-fullscreen onClick={() => { void fullscreen(); }} aria-label={expanded ? 'Exit fullscreen' : 'Expand active product view'} aria-pressed={expanded}>{expanded ? <Minimize className="studio-icon" aria-hidden="true" focusable="false" /> : <Maximize className="studio-icon" aria-hidden="true" focusable="false" />}</button>
              </div>
            </>}
          </div>
          {status && <p className={styles.status} role="alert">{status}</p>}
        </div>
        <aside ref={notes} className={styles.notes} aria-label="Studio Notes" tabIndex={0} inert={expanded || notesPhase !== 'shown'}>
          <div className={styles.notePanel}>
          <span className={styles.kicker}>Studio Notes</span>
          <h2>{note?.heading ?? project.title}</h2><p className={styles.subtitle}>{note?.subtitle ?? project.description}</p>
          <section className={styles.brief}><h3>{software || presentation.type === 'film' ? 'The brief' : 'Project note'}</h3><p>{note?.brief ?? project.description}</p><button onClick={event => openDetail('brief', event.currentTarget)}>Read more <ArrowUpRight className="studio-icon" aria-hidden="true" focusable="false" /></button></section>
          {note?.music && <p className={styles.music}>Music: {note.music}</p>}
          {note?.technology && <p className={styles.technology}>{note.technology.join(' / ')}</p>}
          <div className={styles.links}>{note?.links?.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} <ArrowUpRight className="studio-icon" aria-hidden="true" focusable="false" /></a>)}</div>
          {!!note?.contributors?.length && <section className={styles.credits}>
            <div className={styles.railHead}><span>With</span><div>
              <button disabled={railEnds.start} aria-label="Previous contributors" onClick={() => rail.current?.scrollBy({ left: -180, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}><ArrowLeft className="studio-icon" aria-hidden="true" focusable="false" /></button>
              <button disabled={railEnds.end} aria-label="More contributors" onClick={() => rail.current?.scrollBy({ left: 180, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}><ArrowRight className="studio-icon" aria-hidden="true" focusable="false" /></button>
            </div></div>
            <div ref={rail} className={styles.rail} onScroll={event => { const node = event.currentTarget; setRailEnds({ start: node.scrollLeft < 2, end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 2 }); }}>
              {note.contributors.map(person => <button key={person.id} className={styles.person} onClick={event => openDetail(person, event.currentTarget)} aria-label={`View ${person.name} profile`}>
                {person.image ? <Image src={person.image} alt="" width={34} height={34} data-logo={person.imageKind === 'logo'} unoptimized /> : <span className={styles.initial}>{person.name[0]}</span>}<span>{person.name}</span><span aria-hidden="true"><ArrowUpRight className="studio-icon" focusable="false" /></span>
              </button>)}
            </div>
          </section>}
          </div>
        </aside>
      </div>
      <div className={styles.footer} data-viewer-navigation inert={expanded && idle}>
        <span data-viewer-counter>{filter === 'all' ? 'ALL' : filter.toUpperCase()} / {ordinal}</span>
        <nav aria-label="Viewer projects"><button data-viewer-prev disabled={index <= 0} aria-label="Previous project" onClick={() => navigate(index - 1)}><ArrowLeft className="studio-icon" aria-hidden="true" focusable="false" /></button><span>{ordinal}</span><button data-viewer-next disabled={index >= projects.length - 1} aria-label="Next project" onClick={() => navigate(index + 1)}><ArrowRight className="studio-icon" aria-hidden="true" focusable="false" /></button></nav>
      </div>
    </div>
    {software && expanded && <div className={styles.productFullscreenActions}>{rotationControl}<button className={styles.exitProduct} data-product-exit aria-label="Exit fullscreen" onClick={() => { void fullscreen(); }}><Minimize className="studio-icon" aria-hidden="true" focusable="false" /></button></div>}
    {detail && <div className={styles.layer} onClick={event => { if (event.target === event.currentTarget) closeDetail(); }}>
      <section ref={drawer} className={styles.drawer} role="dialog" aria-modal="true" aria-labelledby="portfolio-detail-title" data-viewer-drawer data-profile={detail !== 'brief'}>
        <header><span>{detail === 'brief' ? 'Project notes' : 'Contributor'}</span><button aria-label="Close detail" onClick={closeDetail}><X className="studio-icon" aria-hidden="true" focusable="false" /></button></header>
        {detail === 'brief' ? <><h2 id="portfolio-detail-title">{note?.heading ?? project.title}</h2><p>{note?.brief ?? project.description}</p>{note?.story?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}{note?.music && <p>Music: {note.music}</p>}</> : <>
          {detail.image && <Image className={styles.profileImage} src={detail.image} alt={detail.name} width={600} height={300} data-logo={detail.imageKind === 'logo'} unoptimized />}
          <h2 id="portfolio-detail-title">{detail.name}</h2><p>{detail.role}</p>{detail.context && <p>{detail.context}</p>}
          <div className={styles.links}>{detail.links?.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} <ArrowUpRight className="studio-icon" aria-hidden="true" focusable="false" /></a>)}</div>
        </>}
      </section>
    </div>}
  </div>;
}
