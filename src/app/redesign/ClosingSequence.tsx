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
  const content = useRef<HTMLDivElement>(null);
  const footer = useRef<HTMLElement>(null);
  const footerStage = useRef<HTMLDivElement>(null);
  const footerContacts = useRef<HTMLDivElement>(null);
  const footerBottom = useRef<HTMLDivElement>(null);
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
    let inkTop: number | null = null;
    let measuredWidth = 0, measuredHeight = 0;
    let resizedField: HTMLElement | null = null;
    const paint = () => {
      frame = 0;
      const height = window.innerHeight;
      const distance = motion.matches ? 0 : height * .9;
      section.style.marginTop = motion.matches ? '0px' : `${-height - distance}px`;
      section.style.setProperty('--reveal-distance', `${distance}px`);
      // Upstream tracks shrink with the viewport. Keep an active draft in the completed reveal.
      if (resizedField) window.scrollTo({ top: window.scrollY + section.getBoundingClientRect().top + distance, behavior: 'instant' });
      const top = section.getBoundingClientRect().top;
      const progress = motion.matches ? 1 : Math.max(0, Math.min(1, -top / distance));
      const cover = progress * progress * (3 - 2 * progress);
      sheet.style.transform = `translateY(${height * 1.05 * (1 - cover)}px)`;
      sheet.style.borderRadius = `${50 * (1 - cover)}% ${50 * (1 - cover)}% 0 0 / ${10 * (1 - cover)}% ${10 * (1 - cover)}% 0 0`;
      const sheetTop = sheet.getBoundingClientRect().top;
      const visible = section.getBoundingClientRect().bottom > 0;
      if (content.current) content.current.inert = sheetTop > height * .15 || !visible;
      if (resizedField) {
        resizedField.scrollIntoView({ block: 'nearest', behavior: 'instant' });
        resizedField = null;
      }
      section.dataset.cover = progress.toFixed(3);
      section.dataset.brandVisible = String(visible && sheetTop <= (window.innerWidth <= 800 ? 70 : 85));
      section.dataset.brandOnGreen = section.dataset.brandVisible;
      if (footer.current && footerStage.current && footerContacts.current && footerBottom.current && mark.current) {
        const footerBounds = footer.current.getBoundingClientRect();
        if (inkTop === null || measuredWidth !== window.innerWidth || measuredHeight !== height) {
          const texts = mark.current.querySelectorAll<SVGTextElement>(window.innerWidth <= 800 ? '[data-wordmark-mobile] text' : '[data-wordmark-desktop] text');
          const canvas = document.createElement('canvas').getContext('2d');
          // Crop font padding so both lines fill the measured space without clipping.
          inkTop = 300;
          for (const text of texts) {
            if (canvas) canvas.font = getComputedStyle(text).font;
            inkTop = Math.min(inkTop, canvas
              ? text.y.baseVal.getItem(0).value - canvas.measureText(text.textContent ?? '').actualBoundingBoxAscent
              : text.getBBox().y);
          }
          mark.current.querySelector('svg')?.setAttribute('viewBox', `0 ${inkTop} 1400 ${300 - inkTop}`);
          measuredWidth = window.innerWidth;
          measuredHeight = height;
        }
        const frameHeight = footerStage.current.clientHeight;
        const topPin = (motion.matches
          ? footerContacts.current.offsetTop + footerContacts.current.offsetHeight
          : footerContacts.current.getBoundingClientRect().bottom) + 24;
        const bottomPin = footerBottom.current.offsetTop - 24;
        const available = Math.max(0, bottomPin - topPin);
        // The contact edge rises during entry; the bottom edge stays in place.
        mark.current.style.bottom = `${(motion.matches ? frameHeight : height) - bottomPin}px`;
        mark.current.style.height = `${motion.matches ? available : frameHeight}px`;
        mark.current.style.visibility = available > 0 && footerBounds.top < height && footerBounds.bottom > 0 ? 'visible' : 'hidden';
        mark.current.style.transform = motion.matches ? 'none' : `scaleY(${available / frameHeight})`;
      }
    };
    update.current = paint;
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const resize = () => {
      const focused = document.activeElement;
      resizedField = focused instanceof HTMLElement && content.current?.contains(focused) ? focused : null;
      schedule();
    };
    const preference = () => { setReduced(motion.matches); schedule(); };
    let mounted = true;
    void document.fonts.ready.then(() => { if (mounted) { inkTop = null; schedule(); } });
    setReduced(motion.matches);
    paint();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize);
    motion.addEventListener('change', preference);
    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
      update.current = null;
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      motion.removeEventListener('change', preference);
    };
  }, []);

  return <>
    <section ref={track} id="closing-sequence" className={styles.revealTrack} aria-labelledby="enquiry-title">
      <div ref={panel} className={styles.enquiry}>
        <div ref={content} className={styles.enquiryGrid} inert>
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
      <div ref={footerStage} className={styles.footerStage}>
        <div className={styles.footerTop}><div><span className={styles.eyebrow}>THE NEXT CHAPTER STARTS WITH YOU.</span>
          <a className={styles.email} href={`mailto:${businessInfo.email}`}>{businessInfo.email} ↗</a></div>
          <div className={styles.socials}><a href={businessInfo.socialLinks.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>
            <a href={businessInfo.socialLinks.youtube} target="_blank" rel="noreferrer">YouTube ↗</a><button type="button" onClick={onBackToTop}>Back to top ↑</button></div>
        </div>
        <div ref={footerContacts} className={styles.footerExtra}>
          <div className={styles.footerDetails}><a href={`tel:${businessInfo.phone[0]}`}>{businessInfo.phone[0]} ↗</a><span>{businessInfo.address}</span>
            <a href={`https://wa.me/${businessInfo.whatsapp[0].replace(/\D/g, '')}`} target="_blank" rel="noreferrer">WhatsApp ↗</a></div>
          <button type="button" className={styles.footerLogo} onClick={onBackToTop} aria-label="J StaR Films Studios, back to the beginning">
            <Image src="/redesign/studio-logo-white.png" alt="" width={200} height={200} unoptimized />
          </button>
        </div>
        <div ref={footerBottom} className={styles.footerBottom}><span>© {new Date().getFullYear()} J StaR Films Studios</span><span>Film. Software. People.</span></div>
      </div>
      <div ref={mark} className={styles.wordmark} role="img" aria-label="J StaR Films Studios"><svg viewBox="0 0 1400 300" preserveAspectRatio="none" aria-hidden="true">
        <g className={styles.wordmarkDesktop} data-wordmark-desktop><text x="0" y="295" textLength="1400" lengthAdjust="spacingAndGlyphs">J StaR Films</text><text className={styles.wordmarkStudios} x="1400" y="140" textAnchor="end" textLength="330" lengthAdjust="spacingAndGlyphs">STUDIOS</text></g>
        <g className={styles.wordmarkMobile} data-wordmark-mobile><text className={styles.mobileName} x="0" y="210" textLength="1400" lengthAdjust="spacingAndGlyphs">J StaR</text><text className={styles.mobileStudio} x="0" y="295" textLength="1400" lengthAdjust="spacingAndGlyphs">FILMS STUDIOS</text></g>
      </svg></div>
    </footer>
  </>;
});

export default ClosingSequence;
