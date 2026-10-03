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
  const footerContacts = useRef<HTMLDivElement>(null);
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
    let topDistance = 0;
    let measuredWidth = 0, measuredHeight = 0;
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
      const sheetTop = sheet.getBoundingClientRect().top;
      const visible = section.getBoundingClientRect().bottom > 0;
      if (content.current) content.current.inert = sheetTop > height * .15 || !visible;
      section.dataset.cover = progress.toFixed(3);
      section.dataset.brandVisible = String(visible && sheetTop <= (window.innerWidth <= 800 ? 70 : 85));
      section.dataset.brandOnGreen = section.dataset.brandVisible;
      if (footer.current && mark.current) {
        const footerBounds = footer.current.getBoundingClientRect();
        if (motion.matches) {
          mark.current.style.visibility = footerBounds.top < height && footerBounds.bottom > 0 ? 'visible' : 'hidden';
          mark.current.style.transform = 'none';
        } else {
          if (!topDistance || measuredWidth !== window.innerWidth || measuredHeight !== height) {
            const text = mark.current.querySelector<SVGTextElement>('text');
            const svgHeight = mark.current.querySelector('svg')?.viewBox.baseVal.height ?? 300;
            const canvas = document.createElement('canvas').getContext('2d');
            if (text && canvas) canvas.font = getComputedStyle(text).font;
            // SVG getBBox includes font padding; the painted ascent sets the contact clearance.
            const inkTop = text && canvas
              ? text.y.baseVal.getItem(0).value - canvas.measureText(text.textContent ?? '').actualBoundingBoxAscent
              : text?.getBBox().y ?? svgHeight * .02;
            topDistance = (svgHeight - inkTop) * mark.current.clientHeight / svgHeight;
            measuredWidth = window.innerWidth;
            measuredHeight = height;
          }
          const progress = Math.max(0, Math.min(1, (height * .48 - footerBounds.top) / (height * .42)));
          const topPin = (footerContacts.current?.getBoundingClientRect().bottom ?? height) + 24;
          const bottomPin = height - 96;
          const available = Math.max(0, bottomPin - topPin);
          const stretch = Math.min(progress * progress * (3 - 2 * progress), available / topDistance);
          mark.current.style.visibility = stretch > 0 ? 'visible' : 'hidden';
          mark.current.style.transform = `scaleY(${stretch})`;
        }
      }
    };
    update.current = paint;
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const preference = () => { setReduced(motion.matches); schedule(); };
    let mounted = true;
    void document.fonts.ready.then(() => { if (mounted) { topDistance = 0; schedule(); } });
    setReduced(motion.matches);
    paint();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    motion.addEventListener('change', preference);
    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
      update.current = null;
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
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
      <div className={styles.footerStage}>
        <div className={styles.footerTop}><div><span className={styles.eyebrow}>THE NEXT CHAPTER STARTS WITH YOU.</span>
          <a className={styles.email} href={`mailto:${businessInfo.email}`}>{businessInfo.email} ↗</a></div>
          <div className={styles.socials}><a href={businessInfo.socialLinks.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>
            <a href={businessInfo.socialLinks.youtube} target="_blank" rel="noreferrer">YouTube ↗</a><button type="button" onClick={onBackToTop}>Back to top ↑</button></div>
        </div>
        <div ref={footerContacts} className={styles.footerExtra}><a href={`tel:${businessInfo.phone[0]}`}>{businessInfo.phone[0]} ↗</a><span>{businessInfo.address}</span>
          <a href={`https://wa.me/${businessInfo.whatsapp[0].replace(/\D/g, '')}`} target="_blank" rel="noreferrer">WhatsApp ↗</a></div>
        <Image className={styles.footerLogo} src="/redesign/studio-logo-white.png" alt="J StaR Films Studios logo" width={200} height={200} unoptimized />
        <div className={styles.footerBottom}><span>© {new Date().getFullYear()} J StaR Films Studios</span><span>Film. Software. People.</span></div>
      </div>
      <div ref={mark} className={styles.wordmark} role="img" aria-label="J StaR Films Studios"><svg viewBox="0 0 1400 300" preserveAspectRatio="none" aria-hidden="true"><text x="0" y="295" textLength="1400" lengthAdjust="spacingAndGlyphs">J StaR Films</text><text className={styles.wordmarkStudios} x="1400" y="140" textAnchor="end" textLength="330" lengthAdjust="spacingAndGlyphs">STUDIOS</text></svg></div>
    </footer>
  </>;
});

export default ClosingSequence;
