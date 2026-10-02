'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { testimonials } from '@/content/testimonials';
import styles from './closing.module.css';

const notes = testimonials.filter(note => ['Sharon', 'Rev. Dr. Emmanuel Oke', 'John'].includes(note.authorName));

export default function ClientNotes({ reduced, formFocused }: { reduced: boolean; formFocused: boolean }) {
  const proof = useRef<HTMLElement>(null);
  const card = useRef<HTMLElement>(null);
  const animation = useRef<Animation | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(true);
  const note = notes[index];

  useEffect(() => {
    const element = proof.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .35 });
    observer.observe(element);
    const visibility = () => setForeground(!document.hidden);
    visibility();
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); animation.current?.cancel(); };
  }, []);

  function advance(direction: number) {
    setIndex(previous => (previous + direction + notes.length) % notes.length);
    animation.current?.cancel();
    if (!reduced) animation.current = card.current?.animate([
      { transform: `translateX(${direction * 40}px) rotate(${direction * 6}deg)`, opacity: 0 },
      { transform: 'translateX(0) rotate(2deg)', opacity: 1 },
    ], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' }) ?? null;
  }

  useEffect(() => {
    if (reduced) animation.current?.cancel();
    if (paused || hovered || focused || formFocused || reduced || !visible || !foreground) return;
    const timer = window.setTimeout(() => {
      setIndex(previous => (previous + 1) % notes.length);
      animation.current?.cancel();
      animation.current = card.current?.animate([
        { transform: 'translateX(40px) rotate(6deg)', opacity: 0 },
        { transform: 'translateX(0) rotate(2deg)', opacity: 1 },
      ], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' }) ?? null;
    }, 10000);
    return () => window.clearTimeout(timer);
  }, [index, paused, hovered, focused, formFocused, reduced, visible, foreground]);

  return <aside ref={proof} className={styles.proof} aria-label="Client notes"
    onPointerEnter={event => { if (event.pointerType !== 'touch') setHovered(true); }} onPointerLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div className={styles.proofTop}><span className={styles.eyebrow}>WORDS FROM THE OTHER SIDE</span><span>{String(index + 1).padStart(2, '0')} / 03</span></div>
    <div className={styles.noteStack}>
      <div className={`${styles.backNote} ${styles.backTwo}`} aria-hidden="true" /><div className={`${styles.backNote} ${styles.backOne}`} aria-hidden="true" />
      <figure ref={card} className={styles.clientNote} aria-live={focused || paused ? 'polite' : 'off'}>
        <span className={styles.quoteMark} aria-hidden="true">“</span><div className={styles.quoteBody}>{notes.map((item, position) => <blockquote key={item.authorName} className={position === index ? undefined : styles.inactiveQuote} aria-hidden={position !== index}>{item.quote}</blockquote>)}</div>
        <figcaption><Image src={note.authorImage} alt={note.authorName} width={62} height={62} unoptimized />
          <div><strong>{note.authorName}</strong><span>{note.authorRole}</span></div></figcaption>
        <span className={styles.noteService}>{note.tags.join(' / ').toUpperCase()}</span>
      </figure>
    </div>
    <div className={styles.noteControls}><button type="button" aria-label="Previous client note" onClick={() => advance(-1)}>←</button>
      <button type="button" className={styles.pauseNotes} aria-label={`${paused ? 'Resume' : 'Pause'} automatic client notes`} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? 'Play' : 'Pause'}</button>
      <button type="button" aria-label="Next client note" onClick={() => advance(1)}>→</button></div>
    <div className={styles.clientLogos} aria-label="Selected clients"><Image src="/logos/winning-worship-way-logo.png" alt="Winning Worship Way" width={85} height={80} unoptimized />
      <Image src="/logos/sharons-chronicles.png" alt="Sharon's Chronicles" width={145} height={80} unoptimized /></div>
  </aside>;
}
