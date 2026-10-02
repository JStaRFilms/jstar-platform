'use client';

import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import type { GalleryFilter, GalleryMode, GalleryProject } from '@/content/selected-work';
import styles from './selected-work.module.css';

export interface GalleryFrame {
  entrance: number;
  position: number;
  panelPosition: number;
  settled: boolean;
  visible: boolean;
  width: number;
  height: number;
  count: number;
}
export interface GalleryHandle {
  paint: (frame: GalleryFrame) => void;
  disarm: () => void;
  focusCatalog: () => void;
}
interface Props {
  projects: readonly GalleryProject[];
  filter: GalleryFilter;
  counts: Record<GalleryFilter, number>;
  committedId: string | null;
  pointerId: string | null;
  focusId: string | null;
  mode: GalleryMode;
  visible: boolean;
  reduced: boolean;
  onFilter: (filter: GalleryFilter) => void;
  onPreview: (source: 'pointer' | 'focus', id: string | null) => void;
  onSelect: (id: string) => void;
  onAction: (id: string) => void;
  onContinue: () => void;
}
const limit = (value: number, max: number) => Math.max(0, Math.min(max, value));

export function panelWindow(index: number, count: number, studyIndex: number) {
  const indices: number[] = [];
  let ordinary = 0;
  for (let offset = 0; offset < Math.min(count, 4); offset++) {
    const next = ((index + offset) % count + count) % count;
    if (next === studyIndex || ordinary < 3) {
      indices.push(next);
      if (next !== studyIndex) ordinary++;
    }
  }
  return indices;
}

// Fixed circular order: each step moves the entire fan, not just the selected pair.
export function panelPose(frame: GalleryFrame, index: number) {
  const { width, height, entrance, panelPosition } = frame;
  const mobile = width <= 800;
  const count = Math.max(1, frame.count);
  const from = Math.floor(panelPosition), to = Math.ceil(panelPosition);
  const rank = (active: number) => Math.min(3, ((index - active) % count + count) % count);
  const fraction = panelPosition - from;
  const depth = rank(from) * (1 - fraction) + rank(to) * fraction;
  const scale = (mobile ? .9 : .53) - depth * .032;
  return {
    x: (width * (mobile ? .05 : .44) + depth * width * .013) * entrance,
    y: (height * (mobile ? .58 : .32) - depth * height * (mobile ? .012 : .046)) * entrance,
    scale: 1 + (scale - 1) * entrance,
    angle: -depth * (mobile ? 1.2 : 2.2) * entrance,
    z: 10 - Math.round(depth),
    depth,
    opacity: limit((entrance - depth * .12) / (1 - depth * .12), 1),
  };
}

function FilmPreview({ project, eligible }: { project: GalleryProject; eligible: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const presentation = project.presentation;
  const src = presentation.type === 'film' ? presentation.previewSrc : '';
  useEffect(() => {
    const film = video.current;
    if (!film || !eligible) return;
    film.src = src;
    void film.play().catch(() => {});
    return () => { film.pause(); film.removeAttribute('src'); film.load(); };
  }, [eligible, src]);
  if (presentation.type !== 'film') return null;
  return <video ref={video} poster={presentation.poster} muted loop playsInline preload="none" aria-label={`${project.title} preview`} />;
}

const SelectedWorkGallery = forwardRef<GalleryHandle, Props>(function SelectedWorkGallery(props, ref) {
  const { projects, filter, counts, committedId, pointerId, focusId, mode, visible, reduced, onFilter, onPreview, onSelect, onAction, onContinue } = props;
  const element = useRef<HTMLElement>(null);
  const catalog = useRef<HTMLElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const rows = useRef<HTMLDivElement>(null);
  const frame = useRef<GalleryFrame>({ entrance: 0, position: 0, panelPosition: 0, settled: true, visible: false, width: 1440, height: 900, count: projects.length });
  const pointer = useRef({ x: 0, y: 0, baseX: 0, baseY: 0, known: false, armed: true, settled: true });
  const keyboard = useRef(false);
  const pendingFocus = useRef<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [foreground, setForeground] = useState(true);
  const [paintVisible, setPaintVisible] = useState(false);
  const [panelIndex, setPanelIndex] = useState(0);
  const displayId = focusId ?? pointerId ?? committedId;
  const displayIndex = projects.findIndex(project => project.id === displayId);
  const committedIndex = Math.max(0, projects.findIndex(project => project.id === committedId));
  const displayed = projects[displayIndex];
  const neighbours = panelWindow(panelIndex, projects.length, projects.findIndex(project => project.presentation.type === 'study-game')).map(index => projects[index]);

  function paint(next: GalleryFrame) {
    const previous = frame.current;
    frame.current = next;
    const latch = pointer.current;
    if (!next.settled) latch.armed = false;
    if (next.settled && !latch.settled) { latch.baseX = latch.x; latch.baseY = latch.y; }
    latch.settled = next.settled;
    if (previous.visible !== next.visible) setPaintVisible(next.visible);
    const nextIndex = ((Math.round(next.panelPosition) % next.count + next.count) % next.count) || 0;
    if (nextIndex !== panelIndex) setPanelIndex(nextIndex);
    const gallery = element.current;
    if (!gallery) return;
    gallery.style.setProperty('--entrance', String(next.entrance));
    gallery.dataset.settled = String(next.settled);
    gallery.dataset.position = next.position.toFixed(4);
    gallery.dataset.panelPosition = next.panelPosition.toFixed(4);
    gallery.dataset.pointerArmed = String(latch.armed);
    const rowHeight = rows.current?.firstElementChild?.getBoundingClientRect().height ?? 64;
    const position = focusedIndex ?? next.position;
    const start = limit(position - 2, Math.max(0, projects.length - 6));
    rows.current?.style.setProperty('transform', `translateY(${-start * rowHeight}px)`);
    gallery.querySelectorAll<HTMLElement>('[data-panel-index]').forEach(panel => {
      const pose = panelPose(next, Number(panel.dataset.panelIndex));
      panel.dataset.panelDepth = pose.depth.toFixed(4);
      panel.style.transform = `translate(${pose.x}px, ${pose.y}px) scale(${pose.scale}) rotate(${pose.angle}deg)`;
      panel.style.zIndex = String(pose.z);
      panel.style.opacity = String(pose.opacity);
      panel.style.width = `${next.width - 40 * next.entrance}px`;
      panel.style.height = `${next.width <= 800 ? next.height * .25 / .9 : next.height - 145 * next.entrance}px`;
    });
  }
  useImperativeHandle(ref, () => ({
    paint,
    disarm() {
      const latch = pointer.current;
      latch.armed = false;
      latch.settled = false;
      setFocusedIndex(null);
      element.current?.setAttribute('data-pointer-armed', 'false');
    },
    focusCatalog() { catalog.current?.focus({ preventScroll: true }); },
  }));
  useLayoutEffect(() => {
    paint(frame.current);
    if (pendingFocus.current !== null) {
      list.current?.querySelector<HTMLButtonElement>(`[data-project-index="${pendingFocus.current}"]`)?.focus({ preventScroll: true });
      pendingFocus.current = null;
    }
  });
  useEffect(() => {
    const change = () => setForeground(!document.hidden);
    const recordPointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      pointer.current.x = event.clientX; pointer.current.y = event.clientY; pointer.current.known = true;
    };
    document.addEventListener('visibilitychange', change);
    window.addEventListener('pointermove', recordPointer, { passive: true });
    return () => {
      document.removeEventListener('visibilitychange', change);
      window.removeEventListener('pointermove', recordPointer);
    };
  }, []);

  function pointerPreview(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType === 'touch') return;
    const latch = pointer.current;
    const wasKnown = latch.known;
    latch.x = event.clientX; latch.y = event.clientY; latch.known = true;
    if (!latch.armed && latch.settled) {
      if (!wasKnown) { latch.baseX = latch.x; latch.baseY = latch.y; }
      if (Math.hypot(latch.x - latch.baseX, latch.y - latch.baseY) >= 4) latch.armed = true;
    }
    element.current?.setAttribute('data-pointer-armed', String(latch.armed));
    if (!latch.armed || !latch.settled) return;
    const target = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('[data-project-id]') : null;
    if (target) onPreview('pointer', target.dataset.projectId ?? null);
  }

  const windowStart = limit((focusedIndex ?? committedIndex) - 2, Math.max(0, projects.length - 6));
  return (
    <section ref={element} className={styles.gallery} data-gallery data-filter={filter} data-mode={mode}
      data-committed-id={committedId ?? ''} data-displayed-id={displayId ?? ''} data-pointer-id={pointerId ?? ''} data-focus-id={focusId ?? ''}
      data-count={projects.length} data-reduced={reduced} data-visible={visible} inert={!visible || mode !== 'browse'} aria-hidden={!visible}>
      <div className={styles.wash} style={{ background: displayed?.color ?? '#001514' }} />
      <header className={styles.header} data-gallery-header>
        <a className={styles.brand} href="#studio-navigation">J StaR<span>Films Studios</span></a>
        <span className={styles.edition}>SELECTED WORK / {projects.length ? '01' : '00'}–{String(projects.length).padStart(2, '0')}</span>
        <button onClick={() => {
          list.current?.querySelector<HTMLButtonElement>('[aria-current="true"]')?.focus({ preventScroll: true });
        }}>Explore the work ↘</button>
      </header>
      <nav ref={catalog} className={styles.catalog} aria-label="Selected work" tabIndex={-1}>
        <div className={styles.sectionLabel}><span>SELECTED WORK</span><span>FILM + SOFTWARE</span></div>
        <h2>Made to<br /><em>move you.</em></h2>
        <div className={styles.filters} role="group" aria-label="Filter projects">
          {(['all', 'software', 'film'] as const).map(value => <button key={value} data-filter-button={value} aria-pressed={filter === value} onClick={() => onFilter(value)}>{value === 'all' ? 'All' : value === 'software' ? 'Software' : 'Film'} <sup>{String(counts[value]).padStart(2, '0')}</sup></button>)}
        </div>
        <div ref={list} className={styles.window} style={{ '--rows': Math.min(6, projects.length) } as CSSProperties}
          onPointerMove={pointerPreview} onPointerEnter={pointerPreview} onPointerLeave={() => onPreview('pointer', null)}
          onPointerDown={() => { keyboard.current = false; }}
          onKeyDown={event => {
            keyboard.current = true;
            const button = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-project-index]') : null;
            const current = Number(button?.dataset.projectIndex ?? committedIndex);
            let index = current;
            if (event.key === 'ArrowDown') index = Math.min(projects.length - 1, current + 1);
            else if (event.key === 'ArrowUp') index = Math.max(0, current - 1);
            else if (event.key === 'Home') index = 0;
            else if (event.key === 'End') index = projects.length - 1;
            else return;
            event.preventDefault();
            if (!projects[index]) return;
            pendingFocus.current = index;
            setFocusedIndex(index);
            onPreview('focus', projects[index].id);
          }}
          onFocusCapture={event => {
            const target = event.target;
            if (target instanceof HTMLButtonElement && (keyboard.current || target.matches(':focus-visible'))) {
              const index = Number(target.dataset.projectIndex);
              setFocusedIndex(index);
              onPreview('focus', target.dataset.projectId ?? null);
            }
          }}
          onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) { setFocusedIndex(null); onPreview('focus', null); } }}>
          <div ref={rows} className={styles.rows}>
            {projects.map((project, index) => <button key={project.id} className={styles.row} data-project-id={project.id} data-project-index={index}
              data-displayed={project.id === displayId} aria-current={project.id === committedId ? 'true' : undefined}
              tabIndex={index >= windowStart && index < windowStart + 6 ? 0 : -1}
              onClick={() => { setFocusedIndex(null); onSelect(project.id); }}>
              <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span><span><strong>{project.title}</strong><small>{project.label}</small></span><span aria-hidden="true">↗</span>
            </button>)}
          </div>
        </div>
        {!projects.length && <p>No projects in this selection.</p>}
        <p className={styles.listNote}>Films you feel. Software you use.</p>
      </nav>
      <div className={styles.stack} aria-hidden={displayed?.presentation.type !== 'static-image'}>
        {neighbours.filter(project => project.presentation.type !== 'study-game').map(project => (
          <article key={project.id} className={styles.panel} data-panel-id={project.id} data-panel-index={projects.indexOf(project)} aria-hidden={project.id !== displayId}>
            {project.presentation.type === 'film' ? <>
              <FilmPreview project={project} eligible={!reduced && foreground && paintVisible && visible && mode === 'browse' && project.id === displayId} />
              <div className={styles.filmTitle}><span>{project.label}</span><h3>{project.title}.</h3></div>
            </> : project.presentation.type === 'provisional-cover' ? <div className={styles.school}>
              <span>SOFTWARE / BUSINESS SYSTEMS</span><div className={styles.symbol}>S<span>↗</span></div><h3>School<br />management.</h3><p>{project.presentation.note}</p>
            </div> : project.presentation.type === 'static-image' ? <Image className={styles.staticImage}
              src={project.presentation.src} alt={project.presentation.alt} fill unoptimized sizes="(max-width: 800px) 90vw, 53vw" /> : null}
          </article>
        ))}
        {reduced && displayed?.presentation.type === 'study-game' && <div className={styles.staticStudy}>Adaptive Study Game<p>Your game is ready. Use Try it to play.</p></div>}
      </div>
      <div className={styles.caption}>
        {displayed && <><div><span>{displayed.label}</span><p>{displayed.description}</p></div><div className={styles.actions}>
          {displayed.presentation.type === 'study-game' && <button data-project-action onClick={() => onAction(displayed.id)}>Try it ↗</button>}
          {displayed.presentation.type === 'film' && <button data-project-action onClick={() => onAction(displayed.id)}>{displayed.presentation.fullSrc ? 'Watch film' : 'Watch excerpt'} ↗</button>}
          {displayed.detailsHref && <a href={displayed.detailsHref} target="_blank" rel="noreferrer">Source ↗</a>}
        </div></>}
      </div>
      <footer className={styles.footer}><span data-gallery-counter>{displayIndex < 0 ? '0' : String(displayIndex + 1).padStart(2, '0')} / {projects.length ? String(projects.length).padStart(2, '0') : '0'}</span><span>A selection of film &amp; software</span><button data-gallery-continue onClick={onContinue}>Continue ↓</button></footer>
    </section>
  );
});

export default SelectedWorkGallery;
