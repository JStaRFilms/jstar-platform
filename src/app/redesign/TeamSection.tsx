'use client';

import Image from 'next/image';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { companyData } from '@/content/about-company';
import styles from './team.module.css';

const cutouts: Record<string, string> = {
  JS001: 'john-oluleke-oke', JS002: 'monjola-aminu', JS003: 'sharon-alalibo',
  JS004: 'justina-ominisan', JS005: 'ifechukwude-odigwe', JS006: 'nengimote-inala',
  JS007: 'michael-osondu', JS008: 'olamide-wunmi-olajide',
};
const people = companyData.teamMembers.map(member => ({
  ...member,
  name: member.employeeId === 'JS005' ? 'Ifechukwude Odigwe' : member.name,
  cutout: `/redesign/team-cutouts/${cutouts[member.employeeId]}-v1.webp`,
}));
const places = [[50, 71.5, 26], [25, 36, 16], [50, 36, 16], [75, 36, 16],
  [10, 74, 16], [30, 74, 16], [70, 74, 16], [90, 74, 16]];
const mobilePlaces = [[38, 72], [20, 37], [50, 37], [80, 37],
  [13, 55], [43, 55], [73, 55], [70, 75]];
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
const finish = 8.3;
const wipeEdge = (wipe: number) => {
  const edge: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const x = wipe === 0 ? 0 : wipe === 1 ? 100 : wipe * 180 - 45 + i * .35 + Math.sin(i * .72) * .65 + Math.sin(i * .26) * 1.8;
    edge.push(`${x}% ${i}%`);
  }
  return `polygon(0 0,${edge.join(',')},0 100%)`;
};

export interface TeamHandle { element: HTMLElement | null; enterFromGallery: () => void; jumpToIntro: () => void }
interface Props { onGalleryCovered: (covered: boolean) => void }

const TeamSection = forwardRef<TeamHandle, Props>(function TeamSection({ onGalleryCovered }, forwardedRef) {
  const section = useRef<HTMLElement | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const members = useRef<(HTMLButtonElement | null)[]>([]);
  const intro = useRef<HTMLDivElement>(null);
  const spotlight = useRef<HTMLDivElement>(null);
  const groupHeading = useRef<HTMLDivElement>(null);
  const scrollDestination = useRef<number | null>(null);
  const skipAnimation = useRef<Animation | null>(null);
  const entryAnimation = useRef<Animation | null>(null);
  const touchSelection = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [final, setFinal] = useState(false);
  const activeRef = useRef(0);
  const finalRef = useRef(false);
  const [revealed, setRevealed] = useState<number | null>(null);
  const cancelSkip = useCallback(() => {
    skipAnimation.current?.cancel();
    skipAnimation.current = null;
    section.current?.removeAttribute('data-skipping');
  }, []);
  const cancelEntry = useCallback(() => {
    entryAnimation.current?.cancel();
    entryAnimation.current = null;
    section.current?.removeAttribute('data-quick-entry');
  }, []);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let rendered: number | null = null;
    let frame = 0;
    let previousTime = 0;
    let galleryCovered = false;
    const paint = (now: number) => {
      frame = 0;
      const width = window.innerWidth, height = window.innerHeight, mobile = width <= 800;
      const entry = motion.matches ? 0 : height * .8;
      const exit = motion.matches ? 0 : height * .9;
      element.style.height = motion.matches ? '' : `${height * 5.1 + entry + exit}px`;
      element.style.marginTop = motion.matches ? '0px' : `${-height - entry}px`;
      const travel = motion.matches ? 0 : height * 4.1;
      const bounds = element.getBoundingClientRect();
      const wipe = motion.matches ? 1 : clamp(-bounds.top / entry);
      const cover = motion.matches ? 0 : clamp((-bounds.top - entry - travel) / exit);
      if (stage.current) {
        // The fixed irregular edge translates with native scroll, including on reversal.
        if (!entryAnimation.current) stage.current.style.clipPath = wipe === 1 ? 'none' : wipe === 0 ? 'inset(0 100% 0 0)' : wipeEdge(wipe);
        stage.current.inert = entryAnimation.current !== null || wipe < 1 || cover >= .999 || bounds.bottom <= 0 || bounds.top >= height;
      }
      const covered = !motion.matches && bounds.top <= 0;
      if (covered !== galleryCovered) { galleryCovered = covered; onGalleryCovered(covered); }
      const target = motion.matches ? finish : clamp((-bounds.top - entry) / travel) * finish;
      const gap = target - (rendered ?? target);
      if (rendered === null || motion.matches || Math.abs(gap) > .9) rendered = target;
      else {
        const dt = Math.min(50, now - previousTime || 16);
        rendered += gap * (1 - Math.exp(-dt / 70));
        rendered = Math.max(target - .18, Math.min(target + .18, rendered));
        if (Math.abs(target - rendered) < .002) rendered = target;
      }
      previousTime = now;
      const progress = rendered;
      const group = ease((progress - 7.35) / .8);
      const current = Math.min(7, Math.floor(progress));
      const complete = motion.matches || group >= .99;
      element.dataset.teamProgress = progress.toFixed(3);
      element.dataset.teamMember = String(current);
      element.dataset.teamFinal = String(complete);
      element.dataset.teamVisible = String(bounds.top < height && bounds.bottom > 0);
      element.dataset.teamBrand = String(wipe >= 1 && bounds.top <= 0 && bounds.bottom > 0);
      if (activeRef.current !== current) { activeRef.current = current; setActive(current); }
      if (finalRef.current !== complete) { finalRef.current = complete; setFinal(complete); }
      if (!complete && touchSelection.current !== null) { touchSelection.current = null; setRevealed(null); }
      if (scrollDestination.current !== null && Math.abs(window.scrollY - scrollDestination.current) < 2) scrollDestination.current = null;

      const opening = 1 - ease((progress - .55) / .5);
      if (intro.current) {
        intro.current.style.opacity = String(opening);
        intro.current.style.transform = `translateY(${-30 * (1 - opening)}px)`;
        intro.current.inert = opening < .1;
      }
      if (spotlight.current) {
        spotlight.current.style.opacity = String(1 - group);
        const lift = ease((progress - .35) / 1.25);
        spotlight.current.style.transform = `translateY(${mobile || height <= 750 ? 0 : (1 - lift) * height * .27}px)`;
      }
      if (groupHeading.current) groupHeading.current.style.opacity = String(group);

      members.current.forEach((node, index) => {
        if (!node) return;
        const age = progress - index;
        const entered = index === 0 ? ease((progress + .12) / .62) : ease((age + .3) / .75);
        const settled = index === 0 ? ease((progress - .45) / .7) : ease((age - .52) / .78);
        let x = places[index][0] / 100 * width;
        let y = places[index][1] / 100 * height;
        let small = Math.min(places[index][2] / 100 * width, index === 0 ? 430 : 285, height * (index === 0 ? (height <= 750 ? .31 : .375) : .31));
        if (mobile) {
          x = mobilePlaces[index][0] / 100 * width;
          y = mobilePlaces[index][1] / 100 * height;
          small = width * (index === 0 ? .27 : .23);
        } else {
          x = mix(width * (.08 + index * .12), x, group);
          y = mix(height * .78, y, group);
          small = mix(width * (index === 0 ? .13 : .10), small, group);
        }
        const large = Math.min(width * (mobile ? .7 : .47), mobile ? 360 : 700, height * (mobile ? .6 : .72));
        const size = mix(large, small, settled);
        const cx = mix(width * (mobile ? .60 : .66), x, settled);
        const cy = mix(mix(height * (index === 0 ? 1.1 : 1.35), height * (mobile ? .43 : .51), entered), y, settled);
        node.style.width = `${size}px`;
        node.style.transform = `translate(${cx - size / 2}px, ${cy - size / 2}px)`;
        node.style.opacity = String(index === 0 ? entered : mix(entered, 1, group));
        node.style.visibility = age < (index === 0 ? 0 : -.3) ? 'hidden' : 'visible';
        node.style.zIndex = String(index === 0 && group >= .99 ? 30 : index === current && group < .8 ? 20 : index === 0 ? 10 : 5);
        node.style.pointerEvents = complete ? 'auto' : 'none';
        node.querySelector<HTMLElement>('[data-team-name]')?.style.setProperty('opacity', String(settled));
      });
      if (Math.abs(target - progress) > .002) frame = window.requestAnimationFrame(paint);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(paint); };
    const interrupt = () => {
      cancelEntry();
      cancelSkip();
      if (scrollDestination.current === null) return;
      scrollDestination.current = null;
      window.scrollTo({ top: window.scrollY, behavior: 'instant' });
    };
    const keyInterrupt = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) interrupt();
    };
    paint(performance.now());
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('wheel', interrupt, { passive: true });
    window.addEventListener('touchstart', interrupt, { passive: true });
    window.addEventListener('keydown', keyInterrupt);
    motion.addEventListener('change', schedule);
    return () => {
      cancelEntry();
      cancelSkip();
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('wheel', interrupt);
      window.removeEventListener('touchstart', interrupt);
      window.removeEventListener('keydown', keyInterrupt);
      motion.removeEventListener('change', schedule);
    };
  }, [onGalleryCovered, cancelSkip, cancelEntry]);

  function go(progress: number) {
    cancelSkip();
    const element = section.current;
    if (!element) return;
    const height = window.innerHeight;
    const top = window.scrollY + element.getBoundingClientRect().top + (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : height * .8 + progress / finish * height * 4.1);
    scrollDestination.current = top;
    window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }

  function skipTo(progress: number) {
    const element = section.current, pane = stage.current;
    if (!element || !pane) return;
    cancelSkip();
    touchSelection.current = null;
    setRevealed(null);
    if (scrollDestination.current !== null) {
      scrollDestination.current = null;
      window.scrollTo({ top: window.scrollY, behavior: 'instant' });
    }
    const height = window.innerHeight;
    const top = window.scrollY + element.getBoundingClientRect().top + (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : height * .8 + progress / finish * height * 4.1);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({ top, behavior: 'instant' });
      return;
    }
    element.dataset.skipping = 'true';
    const out = pane.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: 'ease-in', fill: 'forwards' });
    skipAnimation.current = out;
    out.finished.then(() => {
      if (skipAnimation.current !== out) return;
      window.scrollTo({ top, behavior: 'instant' });
      requestAnimationFrame(() => {
        if (skipAnimation.current !== out) return;
        const incoming = pane.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: 'ease-out', fill: 'forwards' });
        skipAnimation.current = incoming;
        out.cancel();
        incoming.finished.then(() => {
          if (skipAnimation.current === incoming) cancelSkip();
        }, () => {});
      });
    }, () => {});
  }

  function enterFromGallery() {
    const element = section.current, pane = stage.current;
    if (!element || !pane || entryAnimation.current) return;
    cancelSkip();
    scrollDestination.current = null;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const destination = window.scrollY + element.getBoundingClientRect().top + (reduced ? 0 : window.innerHeight * .8);
    if (reduced) {
      window.scrollTo({ top: destination, behavior: 'instant' });
      element.focus({ preventScroll: true });
      return;
    }
    element.dataset.quickEntry = 'true';
    pane.inert = true;
    pane.style.clipPath = wipeEdge(0);
    const incoming = pane.animate(Array.from({ length: 13 }, (_, i) => ({ clipPath: wipeEdge(i / 12) })),
      { duration: 650, easing: 'ease-in-out', fill: 'forwards' });
    entryAnimation.current = incoming;
    incoming.finished.then(() => {
      if (entryAnimation.current !== incoming) return;
      window.scrollTo({ top: destination, behavior: 'instant' });
      pane.style.clipPath = 'none';
      pane.inert = false;
      cancelEntry();
      element.focus({ preventScroll: true });
    }, () => {});
  }
  function jumpToIntro() {
    const element = section.current;
    if (!element) return;
    cancelSkip();
    cancelEntry();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const entry = reduced ? 0 : window.innerHeight * (.8 + .4 / finish * 4.1);
    window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top + entry, behavior: 'instant' });
    element.focus({ preventScroll: true });
  }
  useImperativeHandle(forwardedRef, () => ({ element: section.current, enterFromGallery, jumpToIntro }));

  return <section ref={section} id="meet-the-studio"
    className={styles.journey} data-team data-team-member="0" data-team-final="false" tabIndex={-1} aria-label="Meet the studio">
    <div ref={stage} className={styles.stage}>
      <header className={styles.header}>
        <button className={styles.skip} onClick={() => skipTo(finish)}>Meet everyone ↘</button>
      </header>
      <div ref={intro} className={styles.intro}><span className={styles.eyebrow}>THE PEOPLE BEHIND THE WORK</span><h2>A studio.<br /><em>With character.</em></h2></div>
      <div className={styles.portraits}>
        {people.map((person, index) => <button key={person.employeeId} ref={node => { members.current[index] = node; }}
          className={styles.person} data-team-person={index} aria-label={`${person.name}, ${person.role}`} aria-hidden={!final} tabIndex={final ? 0 : -1}
          inert={!final} onPointerEnter={event => { if (event.pointerType !== 'touch' && final) setRevealed(index); }}
          onPointerLeave={event => { if (event.pointerType !== 'touch') setRevealed(touchSelection.current); }}
          onPointerUp={event => { if (event.pointerType === 'touch' && final) { touchSelection.current = touchSelection.current === index ? null : index; setRevealed(touchSelection.current); } }}
          onFocus={() => setRevealed(index)} onBlur={() => setRevealed(touchSelection.current)}>
          <Image src={person.cutout} alt="" width={780} height={780} unoptimized loading={index === 0 ? 'eager' : 'lazy'} sizes="(max-width: 800px) 65vw, 37vw" />
          <span className={styles.name} data-team-name>{person.name}</span>
          <span className={styles.role} data-team-role data-visible={final && revealed === index} aria-hidden="true">{person.role}</span>
        </button>)}
      </div>
      <div ref={spotlight} className={styles.spotlight} aria-hidden={final}>
        <span>{active === 0 ? 'FOUNDER / CREATIVE DIRECTION' : `MEET THE STUDIO / ${String(active + 1).padStart(2, '0')}`}</span>
        <h3>{people[active].name}</h3><p>{people[active].role}</p>
      </div>
      <div ref={groupHeading} className={styles.groupHeading} aria-hidden={!final}>
        <span className={styles.eyebrow}>J STAR FILMS STUDIOS</span>
        <h2>Different talents. <em>One studio.</em></h2>
      </div>
      <footer className={styles.footer}>
        <span className={styles.counter}>{String(active + 1).padStart(2, '0')} / 08</span>
        <nav className={styles.steps} aria-label="Meet a team member">{people.map((person, index) => <button key={person.employeeId}
          aria-label={`Meet ${person.name}, ${person.role}`} aria-current={active === index ? 'step' : undefined}
          onClick={() => { touchSelection.current = null; setRevealed(null); if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setRevealed(index); return; } go(index + .4); }} />)}</nav>
        <button className={styles.replay} onClick={() => skipTo(0)}>From the beginning ↑</button>
      </footer>
    </div>
  </section>;
});

export default TeamSection;
