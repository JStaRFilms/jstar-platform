'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX } from 'lucide-react';
import styles from './hero.module.css';

const FILM = '/redesign/nifemi.mp4';
const POSTER = '/redesign/nifemi-poster.jpg';
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLElement>(null);
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
    if (!element || !section || !film) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let disposed = false;
    let progress = 0;
    let target = 0;
    let lastTime = 0;
    let lastFolded = false;
    let sampledFrames = 0;
    let sampledTime = 0;
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
      const distance = section.offsetHeight - window.innerHeight;
      target = motion.matches ? 0 : clamp(-section.getBoundingClientRect().top / distance);
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
    const changeMotion = () => {
      setReduced(motion.matches);
      setExpanded(false);
      if (motion.matches) wantsPlayback.current = false;
      film.pause();
      measure();
    };
    setReduced(motion.matches);
    if (motion.matches) wantsPlayback.current = false;
    measure();
    const observer = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting;
      setControlsAvailable(entry.isIntersecting);
      resume();
    }, { threshold: 0.01 });
    observer.observe(film);
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    document.addEventListener('visibilitychange', resume);
    motion.addEventListener('change', changeMotion);
    return () => {
      disposed = true;
      film.pause();
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
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
    if (track.current) window.scrollTo({ top: window.scrollY + track.current.getBoundingClientRect().top, behavior: 'instant' });
    if (!navHidden) {
      wantsOpeningFocus.current = false;
      root.current?.querySelector<HTMLAnchorElement>('header a')?.focus({ preventScroll: true });
    }
  }

  function changeComposition() {
    if (reduced) {
      setExpanded(!expanded);
    } else if (track.current) {
      const target = window.scrollY + track.current.getBoundingClientRect().top;
      const distance = track.current.offsetHeight - window.innerHeight;
      wantsScreeningFocus.current = true;
      window.scrollTo({ top: target + distance * 0.8, behavior: 'instant' });
      if (controlsVisible) {
        wantsScreeningFocus.current = false;
        soundButton.current?.focus({ preventScroll: true });
      }
    }
  }

  return (
    <div ref={root} className={styles.root} data-static-expanded={reduced && expanded} data-nav-hidden={navHidden}
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

      <section ref={track} className={styles.track} aria-label="Studio introduction and film">
        <div className={styles.stage} onPointerMove={() => wakeSound()}>
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
