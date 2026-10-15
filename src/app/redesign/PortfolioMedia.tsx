'use client';

import { useEffect, useRef, useState } from 'react';
import type { NativeFilm, YouTubeFilm } from '@/content/selected-work';
import styles from './portfolio-viewer.module.css';

interface Playback { playing: boolean; current: number; duration: number; muted: boolean; volume: number }
interface Props {
  title: string;
  expanded: boolean;
  idle: boolean;
  onFullscreen: () => void;
  onPlaying: (playing: boolean) => void;
}
const initialPlayback: Playback = { playing: false, current: 0, duration: 0, muted: false, volume: 100 };
const time = (value: number) => Number.isFinite(value) ? `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}` : '--:--';
function Controls({ state, enabled, playEnabled = enabled, fullscreenEnabled = true, props, onPlay, onSeek, onMute, onVolume }: {
  state: Playback; enabled: boolean; playEnabled?: boolean; fullscreenEnabled?: boolean; props: Props;
  onPlay: () => void; onSeek: (seconds: number) => void; onMute: () => void; onVolume: (volume: number) => void;
}) {
  return <div className={styles.controls} data-viewer-controls inert={props.idle} aria-label="Playback controls">
    <button disabled={!playEnabled} onClick={onPlay} aria-label={state.playing ? 'Pause film' : 'Play film'}>{state.playing ? 'Ⅱ' : '▶'}</button>
    <span className={styles.time}>{time(state.current)} / {time(state.duration)}</span>
    <input aria-label="Seek video" type="range" min={0} max={state.duration || 1} step={.1} value={Math.min(state.current, state.duration || 1)} disabled={!enabled || !state.duration} onChange={event => onSeek(Number(event.target.value))} />
    <button disabled={!enabled} onClick={onMute} aria-label={state.muted ? 'Unmute film' : 'Mute film'}>{state.muted ? 'Unmute' : 'Mute'}</button>
    <input className={styles.volume} aria-label="Volume" type="range" min={0} max={100} value={state.volume} disabled={!enabled} onChange={event => onVolume(Number(event.target.value))} />
    <button data-viewer-fullscreen disabled={!fullscreenEnabled} onClick={props.onFullscreen} aria-label={props.expanded ? 'Exit fullscreen' : 'Open fullscreen cinema'} aria-pressed={props.expanded}>⛶</button>
  </div>;
}

export function NativeMedia({ presentation, hidden, ...props }: Props & { presentation: NativeFilm; hidden: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState(initialPlayback);
  const [error, setError] = useState('');
  const onPlaying = useRef(props.onPlaying);
  onPlaying.current = props.onPlaying;
  useEffect(() => {
    const film = video.current;
    if (!film) return;
    const src = presentation.fullSrc ?? presentation.previewSrc;
    let bookmark = 0;
    const sync = () => {
      setState({ playing: !film.paused && !film.ended, current: film.currentTime, duration: Number.isFinite(film.duration) ? film.duration : 0, muted: film.muted, volume: Math.round(film.volume * 100) });
      onPlaying.current(!film.paused && !film.ended);
    };
    const restore = () => { if (bookmark) film.currentTime = bookmark; sync(); };
    const background = () => {
      if (document.hidden) { bookmark = film.currentTime; film.pause(); film.removeAttribute('src'); film.load(); }
      else { film.src = src; film.load(); }
    };
    const failed = () => setError('Film unavailable. Close the viewer and try again.');
    film.src = src;
    film.load();
    const events = ['play', 'pause', 'ended', 'timeupdate', 'durationchange', 'volumechange'];
    events.forEach(event => film.addEventListener(event, sync));
    film.addEventListener('loadedmetadata', restore);
    film.addEventListener('error', failed);
    document.addEventListener('visibilitychange', background);
    return () => {
      events.forEach(event => film.removeEventListener(event, sync));
      film.removeEventListener('loadedmetadata', restore);
      film.removeEventListener('error', failed);
      document.removeEventListener('visibilitychange', background);
      film.pause(); film.removeAttribute('src'); film.load();
      onPlaying.current(false);
    };
  }, [presentation.fullSrc, presentation.previewSrc]);
  useEffect(() => { if (hidden) video.current?.pause(); }, [hidden]);
  useEffect(() => {
    const film = video.current;
    const viewer = film?.closest<HTMLElement>('[data-portfolio-viewer]');
    if (!film || !viewer || !props.expanded || hidden) return;
    const canvas = document.createElement('canvas');
    canvas.width = 24; canvas.height = 12;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setInterval> | undefined;
    let unavailable = false;
    const reset = () => {
      viewer.style.removeProperty('--ambient-top');
      viewer.style.removeProperty('--ambient-bottom');
    };
    const stop = () => { clearInterval(timer); timer = undefined; };
    const sample = () => {
      if (unavailable || document.hidden || reduced.matches || film.seeking || film.readyState < 2) return;
      try {
        context.drawImage(film, 0, 0, 24, 12);
        const pixels = context.getImageData(0, 0, 24, 12).data;
        for (const [name, firstRow] of [['top', 0], ['bottom', 6]] as const) {
          let red = 0, green = 0, blue = 0;
          for (let i = firstRow * 24 * 4; i < (firstRow + 6) * 24 * 4; i += 4) {
            red += pixels[i]; green += pixels[i + 1]; blue += pixels[i + 2];
          }
          // Keep even bright frames dark enough for the fixed light controls.
          const colour = [red, green, blue].map(channel => Math.round(16 + channel / 144 * .24));
          viewer.style.setProperty(`--ambient-${name}`, colour.join(' '));
        }
      } catch {
        // An unreadable frame leaves neutral glass, without retrying pixel access.
        unavailable = true; stop(); reset();
      }
    };
    const start = () => {
      stop(); sample();
      if (!film.paused && !document.hidden && !reduced.matches && !unavailable) timer = setInterval(sample, 500);
    };
    const paused = () => { stop(); sample(); };
    const failedAmbient = () => { stop(); reset(); };
    const visibility = () => { if (document.hidden) stop(); else start(); };
    const preference = () => { if (reduced.matches) { stop(); reset(); } else start(); };
    film.addEventListener('play', start);
    film.addEventListener('pause', paused);
    film.addEventListener('loadeddata', sample);
    film.addEventListener('seeked', sample);
    film.addEventListener('error', failedAmbient);
    document.addEventListener('visibilitychange', visibility);
    reduced.addEventListener('change', preference);
    start();
    return () => {
      stop(); reset();
      film.removeEventListener('play', start);
      film.removeEventListener('pause', paused);
      film.removeEventListener('loadeddata', sample);
      film.removeEventListener('seeked', sample);
      film.removeEventListener('error', failedAmbient);
      document.removeEventListener('visibilitychange', visibility);
      reduced.removeEventListener('change', preference);
    };
  }, [props.expanded, hidden, presentation.fullSrc, presentation.previewSrc]);
  const play = () => {
    if (hidden || document.hidden) return;
    const film = video.current;
    if (!film) return;
    if (!film.paused) film.pause();
    else void film.play().then(() => setError('')).catch(() => setError('Playback could not start. Try again.'));
  };
  return <>
    <div className={styles.picture} data-viewer-picture>
      <video ref={video} poster={presentation.poster} playsInline loop preload="metadata" tabIndex={0} aria-label={`${props.title} ${presentation.fullSrc ? 'film' : 'excerpt'}`}
        onClick={play} onKeyDown={event => { if (event.code === 'Space' || event.code === 'Enter') { event.preventDefault(); play(); } }} />
      {!state.playing && <button className={styles.nativePlay} aria-label={`Play ${props.title}`} onClick={play}>▶</button>}
    </div>
    <Controls state={state} enabled props={props} onPlay={play} onSeek={seconds => { if (video.current) video.current.currentTime = seconds; }}
      onMute={() => { if (video.current) video.current.muted = !video.current.muted; }} onVolume={volume => { if (video.current) video.current.volume = volume / 100; }} />
    {error && <p className={styles.status} role="alert">{error}</p>}
  </>;
}

interface YouTubePlayer {
  getIframe: () => HTMLIFrameElement;
  getCurrentTime: () => number;
  getDuration: () => number;
  getVolume: () => number;
  isMuted: () => boolean;
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  destroy: () => void;
}
interface YouTubeAPI {
  Player: new (host: HTMLElement, options: {
    videoId: string;
    playerVars: { autoplay: 0; controls: 1; playsinline: 1; rel: 0; fs: 1; loop: 1; playlist: string; origin: string };
    events: { onReady: (event: { target: YouTubePlayer }) => void; onStateChange: (event: { data: number }) => void; onError: (event: { data: number }) => void };
  }) => YouTubePlayer;
}
// The older homepage hook declares an untyped SDK global. Keep this adapter precisely typed.
function sdkWindow(): { YT?: YouTubeAPI; onYouTubeIframeAPIReady?: () => void } {
  return window;
}
let apiPromise: Promise<YouTubeAPI> | undefined;
function loadAPI(): Promise<YouTubeAPI> {
  const sdk = sdkWindow();
  if (sdk.YT?.Player) return Promise.resolve(sdk.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const previous = sdk.onYouTubeIframeAPIReady;
    const script = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]') ?? document.createElement('script');
    const finish = (error?: Error) => {
      clearTimeout(timeout);
      script.removeEventListener('error', failed);
      if (sdk.onYouTubeIframeAPIReady === ready) sdk.onYouTubeIframeAPIReady = previous;
      if (error) reject(error);
      else if (sdk.YT?.Player) resolve(sdk.YT);
      else reject(new Error('YouTube API is unavailable.'));
    };
    const failed = () => finish(new Error('YouTube API could not load.'));
    const ready = () => { try { previous?.(); } finally { finish(); } };
    const timeout = window.setTimeout(() => finish(new Error('YouTube API did not load.')), 12000);
    sdk.onYouTubeIframeAPIReady = ready;
    script.addEventListener('error', failed, { once: true });
    if (!script.isConnected) { script.src = 'https://www.youtube.com/iframe_api'; document.head.append(script); }
  });
  apiPromise = apiPromise.catch(reason => { apiPromise = undefined; throw reason; });
  return apiPromise;
}

export function YouTubeMedia({ presentation, hidden, ...props }: Props & { presentation: YouTubeFilm; hidden: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YouTubePlayer | null>(null);
  const queued = useRef(false);
  const concealed = useRef(hidden);
  concealed.current = hidden;
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [state, setState] = useState(initialPlayback);

  const onPlaying = useRef(props.onPlaying);
  onPlaying.current = props.onPlaying;
  useEffect(() => {
    if (!host.current) return;
    const mount = host.current;
    let disposed = false, sdkReady = false, playing = false, broken = false;
    let instance: YouTubePlayer | null = null;
    let clock: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      if (!sdkReady || !instance || disposed || broken) return;
      setState({ playing, current: instance.getCurrentTime(), duration: instance.getDuration(), muted: instance.isMuted(), volume: instance.getVolume() });
    };
    const error = (message: string) => {
      if (disposed) return;
      broken = true; playing = false; queued.current = false;
      try { instance?.pauseVideo(); } catch { /* The failed iframe may no longer accept commands. */ }
      clearInterval(clock); clearTimeout(timeout);
      setFailed(true); setState(previous => ({ ...previous, playing: false }));
      onPlaying.current(false);
      console.warn(message);
    };
    const timeout = window.setTimeout(() => error('YouTube player did not become ready.'), 20000);
    void loadAPI().then(api => {
      if (disposed || broken) return;
      const target = document.createElement('div');
      mount.replaceChildren(target);
      instance = new api.Player(target, {
        videoId: presentation.youtubeId,
        playerVars: { autoplay: 0, controls: 1, playsinline: 1, rel: 0, fs: 1, loop: 1, playlist: presentation.youtubeId, origin: window.location.origin },
        events: {
          onReady: event => {
            if (disposed || broken) return;
            clearTimeout(timeout);
            instance = event.target; player.current = instance; sdkReady = true;
            const iframe = instance.getIframe();
            iframe.title = `${props.title} on YouTube`;
            iframe.allowFullscreen = true;
            setReady(true);
            clock = setInterval(sync, 500); sync();
            if (queued.current && !concealed.current && !document.hidden) instance.playVideo();
            queued.current = false;
          },
          onStateChange: event => {
            if (disposed || broken) return;
            playing = event.data === 1;
            if (playing && (concealed.current || document.hidden)) { queued.current = false; instance?.pauseVideo(); return; }
            onPlaying.current(playing); sync();
          },
          onError: event => error(`YouTube playback is unavailable here, error ${event.data}.`),
        },
      });
      player.current = instance;
    }).catch(reason => error(reason instanceof Error ? reason.message : 'YouTube could not load.'));
    const background = () => {
      if (!document.hidden) return;
      queued.current = false;
      if (sdkReady && !broken) instance?.pauseVideo();
    };
    document.addEventListener('visibilitychange', background);
    return () => {
      disposed = true; queued.current = false;
      clearTimeout(timeout); clearInterval(clock);
      document.removeEventListener('visibilitychange', background);
      try { instance?.destroy(); } catch { /* An unavailable iframe may already have been removed by the SDK. */ }
      player.current = null; mount.replaceChildren();
      onPlaying.current(false);
    };
  }, [presentation.youtubeId, props.title]);
  useEffect(() => {
    if (!hidden) return;
    queued.current = false;
    if (ready && !failed) player.current?.pauseVideo();
  }, [hidden, ready, failed]);
  const enabled = ready && !failed;
  return <>
    <div className={styles.picture} data-viewer-picture data-youtube-picture>
      <div ref={host} className={styles.youtubeHost} />
    </div>
    <Controls state={state} enabled={enabled} playEnabled={!failed} fullscreenEnabled={enabled} props={props}
      onPlay={() => {
        if (hidden || document.hidden) return;
        if (!ready) { queued.current = true; return; }
        if (state.playing) player.current?.pauseVideo(); else player.current?.playVideo();
      }}
      onSeek={seconds => player.current?.seekTo(seconds, true)} onMute={() => { if (state.muted) player.current?.unMute(); else player.current?.mute(); }}
      onVolume={volume => player.current?.setVolume(volume)} />
    {failed && <p className={styles.status} role="alert">Video unavailable. <a href={`https://www.youtube.com/watch?v=${presentation.youtubeId}`} target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></p>}
  </>;
}
