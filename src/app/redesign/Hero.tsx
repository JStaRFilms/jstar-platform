'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Volume2, VolumeX } from 'lucide-react';
import styles from './hero.module.css';

const FILM = '/redesign/nifemi.mp4';
const POSTER = '/redesign/nifemi-poster.jpg';
const TABLET_SCENE = '/redesign/tablet-scene-v1.png';
const TABLET_MASK = '/redesign/tablet-screen-mask.svg';
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const sceneImage = useRef<HTMLImageElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const soundButton = useRef<HTMLButtonElement>(null);
  const soundTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wantsOpeningFocus = useRef(false);
  const wantsPlayback = useRef(true);
  const wantsScreeningFocus = useRef(false);
  const inView = useRef(false);
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
  const controlsVisible = controlsAvailable || (reduced && expanded);
  const navHidden = navFolded || (reduced && expanded);

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
    let lastTime = 0;
    let lastFolded = false;
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
      if (wantsPlayback.current && inView.current && !document.hidden) {
        void film.play().catch(() => {
          if (!disposed) setMessage('Focus the film and press Space to play.');
        });
      } else film.pause();
    };
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
      const follow = (target - progress) * (1 - Math.exp(-elapsed / 1000));
      // Cap travel too: a jump to the bottom must not compress the takeover into a snap.
      progress += Math.sign(follow) * Math.min(Math.abs(follow), elapsed / 900);
      if (Math.abs(target - progress) < 0.0001) progress = target;
      const travel = Math.max(
        Math.abs(ease(clamp(progress / 0.25)) - ease(clamp(previous / 0.25))) * 0.41,
        Math.abs(ease(clamp((progress - 0.25) / 0.55)) - ease(clamp((previous - 0.25) / 0.55))) * 1.05,
      );
      const speed = travel * window.innerWidth / delta;
      // Only fast travel softens the composition, never a gentle scroll or settled frame.
      const blur = progress === target ? 0 : clamp((speed - 1.2) / 2) * 2.5;
      element.style.setProperty('--motion-blur', `${blur}px`);
      paint();
      frame = progress === target ? 0 : requestAnimationFrame(tick);
    };
    const measure = () => {
      // Keep the original 270svh hero's denominator, independent of the added tablet track.
      const distance = height * 2.7 - window.innerHeight;
      target = motion.matches ? 0 : Math.max(0, Math.min(ready ? 2.2 : 1, -section.getBoundingClientRect().top / distance));
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
      width = viewport.clientWidth;
      height = viewport.clientHeight;
      endScale = Math.min(width / 1672, height / 941) * 0.96;
      endX = (width - 1672 * endScale) / 2;
      endY = (height - 941 * endScale) / 2;
      element.style.setProperty('--tablet-left', `${endX + 1028 * endScale}px`);
      element.style.setProperty('--tablet-top', `${endY + 224 * endScale}px`);
      element.style.setProperty('--tablet-width', `${188 * endScale}px`);
      element.style.setProperty('--tablet-height', `${110 * endScale}px`);
      element.style.setProperty('--tablet-scene-x', `${endX}px`);
      element.style.setProperty('--tablet-scene-y', `${endY}px`);
      element.style.setProperty('--tablet-scene-scale', String(endScale));
      measure();
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
      setReduced(motion.matches);
      setExpanded(false);
      setTabletExpanded(false);
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
    observer.observe(film);
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', resume);
    motion.addEventListener('change', changeMotion);
    return () => {
      disposed = true;
      film.pause();
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', resize);
      picture.removeEventListener('load', assetsLoaded);
      picture.removeEventListener('error', assetFailed);
      mask.onload = null;
      mask.onerror = null;
      document.removeEventListener('visibilitychange', resume);
      motion.removeEventListener('change', changeMotion);
      if (audit) Reflect.deleteProperty(window, '__CREATIVE_AUDIT__');
    };
  }, []);

  async function togglePlayback() {
    const film = video.current;
    if (!film) return;
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

  function returnToOpening() {
    wantsOpeningFocus.current = true;
    setExpanded(false);
    setTabletExpanded(false);
    if (track.current) window.scrollTo({ top: window.scrollY + track.current.getBoundingClientRect().top, behavior: 'instant' });
    if (!navHidden) {
      wantsOpeningFocus.current = false;
      root.current?.querySelector<HTMLAnchorElement>('header a')?.focus({ preventScroll: true });
    }
  }

  function changeComposition() {
    if (reduced) {
      setExpanded(!expanded);
      setTabletExpanded(false);
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
    <div ref={root} className={styles.root} data-static-expanded={reduced && expanded} data-static-tablet={reduced && expanded && tabletExpanded} data-nav-hidden={navHidden}
      onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); returnToOpening(); } }}>
      <a className={styles.skip} href="#film-sound" onClick={(event) => {
        event.preventDefault();
        if (controlsVisible) soundButton.current?.focus({ preventScroll: true });
        else {
          wantsScreeningFocus.current = true;
          changeComposition();
        }
      }}>Skip to film sound</a>
      <header id="studio-navigation" className={styles.header} inert={navHidden} aria-hidden={navHidden}>
        <Link href="/redesign" className={styles.brand} aria-label="J StaR Films Studios, hero review">J StaR<span>Films Studios</span></Link>
        <nav aria-label="Main navigation">
          <Link href="/portfolio">Work</Link>
          <Link href="/about">Studio</Link>
          <Link className={styles.projectLink} href="/contact">Start a Project <span aria-hidden="true">↗</span></Link>
        </nav>
      </header>

      <section ref={track} className={styles.track} aria-label="Studio introduction, film and tablet pullback">
        <div ref={stage} className={styles.stage} onPointerMove={() => wakeSound()}>
          <div className={styles.introduction}>
            <p className={styles.eyebrow}>Two ways to move people.</p>
            <h1 className={styles.wordmark}>
              <span className={styles.firstLine}>J StaR Films</span>
              <span className={styles.secondLine}>Studios</span>
            </h1>
            <p className={styles.description}>Films, websites and software. One creative team.</p>
          </div>

          <div className={styles.filmFrame}>
            <video ref={video} className={styles.video} src={FILM} poster={POSTER} muted={muted} loop playsInline preload="metadata"
              tabIndex={controlsVisible ? 0 : -1} aria-keyshortcuts="Space Escape" aria-describedby="film-keyboard-help"
              aria-label={playing ? 'Nifemi film, playing' : 'Nifemi film, paused'}
              onKeyDown={(event) => { if (event.code === 'Space') { event.preventDefault(); void togglePlayback(); } }}
              onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
              onError={() => setMessage('Film unavailable. Please reload this local preview.')}
            />
          </div>
          <div className={styles.tabletScene}>
            <Image ref={sceneImage} src={TABLET_SCENE} width={1672} height={941} unoptimized loading="eager"
              alt="A Black woman seated on a plinth holding a landscape tablet showing the film." />
          </div>
          {reduced && expanded && tabletReady && (
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

          <div className={styles.bottomRow}>
            <button onClick={changeComposition} className={styles.expandControl}>
              {reduced ? (expanded ? 'Return to opening' : 'Expand film') : 'Go to screening'} <span aria-hidden="true">↓</span>
            </button>
          </div>
          <p className={styles.message} role="status">{message}</p>
        </div>
      </section>

    </div>
  );
}
