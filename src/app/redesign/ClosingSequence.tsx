'use client';

import Image from 'next/image';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { businessInfo } from '@/content/contact';
import EnquiryForm from './EnquiryForm';
import ClientNotes from './ClientNotes';
import styles from './closing.module.css';

export interface ClosingHandle { startProject: () => void }

const ClosingSequence = forwardRef<ClosingHandle, { onBackToTop: () => void }>(function ClosingSequence({ onBackToTop }, ref) {
  const track = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const footer = useRef<HTMLElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const update = useRef<(() => void) | null>(null);
  const [reduced, setReduced] = useState(false);
  const [formFocused, setFormFocused] = useState(false);

  useImperativeHandle(ref, () => ({
    startProject() {
      const section = track.current;
      if (!section) return;
      const distance = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : window.innerHeight * .9;
      window.scrollTo({ top: window.scrollY + section.getBoundingClientRect().top + distance, behavior: 'instant' });
      update.current?.();
      panel.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true });
    },
  }), []);

  useEffect(() => {
    const section = track.current, sheet = panel.current;
    if (!section || !sheet) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const paint = () => {
      frame = 0;
      const height = window.innerHeight;
      const distance = motion.matches ? 0 : height * .9;
      section.style.marginTop = motion.matches ? '0px' : `${-height - distance}px`;
      section.style.setProperty('--reveal-distance', `${distance}px`);
      const top = section.getBoundingClientRect().top;
      const progress = motion.matches ? 1 : Math.max(0, Math.min(1, -top / distance));
      const cover = progress * progress * (3 - 2 * progress);
      sheet.style.transform = `translateY(${height * 1.05 * (1 - cover)}px)`;
      sheet.style.borderRadius = `${50 * (1 - cover)}% ${50 * (1 - cover)}% 0 0 / ${10 * (1 - cover)}% ${10 * (1 - cover)}% 0 0`;
      sheet.inert = progress < .999 || top >= height || section.getBoundingClientRect().bottom <= 0;
      section.dataset.cover = progress.toFixed(3);
      if (footer.current && mark.current) {
        const reveal = Math.max(0, Math.min(1, (height - footer.current.getBoundingClientRect().top) / (height * 1.45)));
        mark.current.style.transform = motion.matches ? 'none' : `scaleY(${.025 + .975 * reveal * reveal * (3 - 2 * reveal)})`;
      }
    };
    update.current = paint;
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const preference = () => { setReduced(motion.matches); schedule(); };
    setReduced(motion.matches);
    paint();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    motion.addEventListener('change', preference);
    return () => {
      cancelAnimationFrame(frame);
      update.current = null;
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      motion.removeEventListener('change', preference);
    };
  }, []);

  return <>
    <section ref={track} id="closing-sequence" className={styles.revealTrack} aria-labelledby="enquiry-title">
      <div ref={panel} className={styles.enquiry} inert>
        <div className={styles.enquiryGrid}>
          <div className={styles.formSide}><h2 id="enquiry-title">What are<br />we making<span>?</span></h2>
            <p className={styles.enquiryIntro}>Tell us about your project. Choose how you would like to start the conversation.</p>
            <div onFocusCapture={() => setFormFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFormFocused(false); }}><EnquiryForm /></div>
          </div>
          <ClientNotes reduced={reduced} formFocused={formFocused} />
        </div>
      </div>
      <div className={styles.revealSpace} aria-hidden="true" />
    </section>
    <footer ref={footer} className={styles.footerTrack}>
      <div className={styles.footerStage}>
        <div className={styles.footerTop}><div><span className={styles.eyebrow}>THE NEXT CHAPTER STARTS WITH YOU.</span>
          <a className={styles.email} href={`mailto:${businessInfo.email}`}>{businessInfo.email} ↗</a></div>
          <div className={styles.socials}><a href={businessInfo.socialLinks.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>
            <a href={businessInfo.socialLinks.youtube} target="_blank" rel="noreferrer">YouTube ↗</a><button type="button" onClick={onBackToTop}>Back to top ↑</button></div>
        </div>
        <div className={styles.footerExtra}><a href={`tel:${businessInfo.phone[0]}`}>{businessInfo.phone[0]} ↗</a><span>{businessInfo.address}</span>
          <a href={`https://wa.me/${businessInfo.whatsapp[0].replace(/\D/g, '')}`} target="_blank" rel="noreferrer">WhatsApp ↗</a></div>
        <Image className={styles.footerLogo} src="/redesign/studio-logo-white.png" alt="J StaR Films Studios logo" width={200} height={200} unoptimized />
        <div ref={mark} className={styles.wordmark} role="img" aria-label="J StaR Films"><svg viewBox="0 0 1400 300" preserveAspectRatio="none" aria-hidden="true"><text x="0" y="270" textLength="1400" lengthAdjust="spacingAndGlyphs">J StaR Films</text></svg></div>
        <div className={styles.footerBottom}><span>© {new Date().getFullYear()} J StaR Films Studios</span><span>Film. Software. People.</span></div>
      </div>
    </footer>
  </>;
});

export default ClosingSequence;
