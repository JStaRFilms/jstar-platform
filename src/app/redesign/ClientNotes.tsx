'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { testimonials } from '@/content/testimonials';
import styles from './closing.module.css';

const notes = testimonials.filter(note => ['Sharon', 'Rev. Dr. Emmanuel Oke', 'John'].includes(note.authorName));

export default function ClientNotes({ reduced, formFocused }: { reduced: boolean; formFocused: boolean }) {
  const proof = useRef<HTMLElement>(null);
  const card = useRef<HTMLElement>(null);
  const nextCard = useRef<HTMLElement>(null);
  const animation = useRef<Animation | null>(null);
  const backAnimation = useRef<Animation | null>(null);
  const moving = useRef(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(true);
  const note = notes[index];
  const behind = notes[(index + direction + notes.length) % notes.length];

  useEffect(() => {
    const element = proof.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .35 });
    observer.observe(element);
    const visibility = () => setForeground(!document.hidden);
    visibility();
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); moving.current = false; animation.current?.cancel(); backAnimation.current?.cancel(); };
  }, []);

  const advance = useCallback((step: number) => {
    const sheet = card.current, under = nextCard.current;
    if (!sheet || !under || moving.current) return;
    if (reduced) {
      setIndex((index + step + notes.length) % notes.length);
      setDirection(1);
      return;
    }
    moving.current = true;
    setDirection(step);
    requestAnimationFrame(() => {
      if (!moving.current) return;
      const target = (index + step + notes.length) % notes.length;
      const outgoing = sheet.animate([
        { transform: 'translate(0, 0) rotate(2deg) scale(1)', opacity: 1 },
        { transform: `translate(${step * 12}px, -5%) rotate(${2 + step * 2}deg) scale(.995)`, opacity: 1, offset: .45 },
        { transform: `translate(${step * 24}px, -13%) rotate(${2 + step * 4}deg) scale(.98)`, opacity: 0 },
      ], { duration: 550, easing: 'cubic-bezier(.22,.64,.28,1)', fill: 'forwards' });
      const rising = under.animate([
        { transform: 'translate(8px, -5px) rotate(-5deg) scale(.98)' },
        { transform: 'translate(0, 0) rotate(2deg) scale(1)' },
      ], { duration: 550, easing: 'cubic-bezier(.22,.64,.28,1)', fill: 'forwards' });
      animation.current = outgoing;
      backAnimation.current = rising;
      outgoing.finished.then(() => {
        if (animation.current !== outgoing) return;
        setIndex(target);
        setDirection(1);
        requestAnimationFrame(() => {
          if (animation.current !== outgoing) return;
          outgoing.cancel();
          rising.cancel();
          animation.current = null;
          backAnimation.current = null;
          moving.current = false;
        });
      }, () => {});
    });
  }, [index, reduced]);

  useEffect(() => {
    if (reduced) { animation.current?.cancel(); backAnimation.current?.cancel(); animation.current = null; backAnimation.current = null; moving.current = false; }
    if (paused || hovered || focused || formFocused || reduced || !visible || !foreground) return;
    const timer = window.setTimeout(() => advance(1), 10000);
    return () => window.clearTimeout(timer);
  }, [index, paused, hovered, focused, formFocused, reduced, visible, foreground, advance]);

  return <aside ref={proof} className={styles.proof} aria-label="Client notes"
    onPointerEnter={event => { if (event.pointerType !== 'touch') setHovered(true); }} onPointerLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div className={styles.proofTop}><span className={styles.eyebrow}>WORDS FROM THE OTHER SIDE</span><span>{String(index + 1).padStart(2, '0')} / 03</span></div>
    <div className={styles.noteStack}>
      <div className={`${styles.backNote} ${styles.backTwo}`} aria-hidden="true" />
      <figure ref={nextCard} className={`${styles.clientNote} ${styles.nextNote}`} aria-hidden="true" inert>
        <span className={styles.quoteMark} aria-hidden="true">“</span><div className={styles.quoteBody}><blockquote>{behind.quote}</blockquote></div>
        <figcaption><Image src={behind.authorImage} alt="" width={62} height={62} unoptimized />
          <div><strong>{behind.authorName}</strong><span>{behind.authorRole}</span></div></figcaption>
        <span className={styles.noteService}>{behind.tags.join(' / ').toUpperCase()}</span>
      </figure>
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
  </aside>;
}
