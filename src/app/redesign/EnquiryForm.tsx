'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { businessInfo } from '@/content/contact';
import styles from './closing.module.css';

const services = ['Film', 'Software', 'Both'] as const;
type Status = 'idle' | 'invalid' | 'pending' | 'failed' | 'limited' | 'partial' | 'success';

export default function EnquiryForm() {
  const [values, setValues] = useState({ service: '', name: '', email: '', phone: '', brief: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const submitting = useRef(false);
  const receipt = useRef<HTMLParagraphElement>(null);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const pending = status === 'pending';
  const received = status === 'success';
  const cooling = cooldownUntil > 0;
  useEffect(() => {
    if (!cooldownUntil) return;
    const timer = window.setTimeout(() => setCooldownUntil(0), Math.max(0, cooldownUntil - Date.now()));
    return () => window.clearTimeout(timer);
  }, [cooldownUntil]);
  useEffect(() => { if (received) receipt.current?.focus({ preventScroll: true }); }, [received]);
  const draft = ['Hello J StaR Films, I would like to discuss a project.', ...([
    ['Project', values.service], ['Name', values.name], ['Email', values.email],
    ['Phone / WhatsApp', values.phone], ['Brief', values.brief],
  ]).filter(([, value]) => value.trim()).map(([label, value]) => `${label}: ${value.trim()}`)].join('\n\n');
  const whatsapp = `https://wa.me/${businessInfo.whatsapp[0].replace(/\D/g, '')}?text=${encodeURIComponent(draft)}`;

  function change(key: keyof typeof values, value: string) {
    setValues(previous => ({ ...previous, [key]: value }));
    if (status !== 'pending') { setStatus('idle'); setMessage(''); }
  }

  function focusInvalid(control: HTMLInputElement | HTMLTextAreaElement | null) {
    if (!control) return;
    control.focus({ preventScroll: true });
    const bounds = control.getBoundingClientRect();
    const section = control.closest<HTMLElement>('#closing-sequence');
    if (section && (bounds.top < 24 || bounds.bottom > window.innerHeight - 24)) {
      const restingTop = window.scrollY + section.getBoundingClientRect().top + parseFloat(section.style.getPropertyValue('--reveal-distance'));
      window.scrollTo({ top: Math.max(restingTop, window.scrollY + bounds.top - 24), behavior: 'instant' });
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || status === 'partial' || received || cooling) return;
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      const invalid = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(':invalid');
      setStatus('invalid');
      setMessage(invalid?.validationMessage || 'Please check the highlighted field.');
      // Native validation scrolling can rewind a sticky reveal and cover the form.
      focusInvalid(invalid);
      return;
    }
    const trimmed = { service: values.service, name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim(), brief: values.brief.trim() };
    const invalidField = trimmed.name.length < 2 ? 'name' : trimmed.brief.length < 10 ? 'brief' : trimmed.phone && !/^[+0-9(). -]*[0-9][+0-9(). -]*$/.test(trimmed.phone) ? 'phone' : null;
    if (invalidField) {
      setStatus('invalid');
      setMessage(invalidField === 'name' ? 'Please enter at least 2 characters for your name.' : invalidField === 'phone' ? 'Please enter a valid phone number or leave it blank.' : 'Please write at least 10 characters about your project.');
      focusInvalid(form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${invalidField}"]`));
      return;
    }
    submitting.current = true;
    setStatus('pending');
    setMessage('Sending your enquiry…');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmed.name, email: trimmed.email, service: trimmed.service,
          subject: `${trimmed.service} project enquiry`, message: trimmed.brief,
          ...(trimmed.phone ? { phone: trimmed.phone } : {}), newsletter: false,
        }),
      });
      const result: unknown = await response.json();
      if (result && typeof result === 'object' && 'retryAfter' in result && typeof result.retryAfter === 'number' && result.retryAfter > 0) {
        setCooldownUntil(Date.now() + result.retryAfter * 1000);
      }
      if (response.ok && result && typeof result === 'object' && 'status' in result && result.status === 'partial') {
        setStatus('partial');
        setMessage('message' in result && typeof result.message === 'string' ? result.message : 'Your enquiry is saved, but email acceptance is incomplete. Please do not resubmit.');
      } else if (!response.ok || !result || typeof result !== 'object' || !('status' in result) || (result.status !== 'success' && result.status !== 'duplicate')) {
        const reason = result && typeof result === 'object' && 'message' in result && typeof result.message === 'string' ? result.message : 'Could not save your enquiry. Please try again.';
        setStatus(response.status === 429 ? 'limited' : 'failed');
        setMessage(`${reason} Your details are still here.`);
      } else {
        setStatus('success');
        setMessage(result.status === 'duplicate' && 'message' in result && typeof result.message === 'string'
          ? result.message : `Your enquiry has been received. We'll reply to ${trimmed.email}. You don't need to send it again.`);
      }
    } catch {
      setStatus('failed');
      setMessage('Could not send your enquiry. Your details are still here. Please try again or continue on WhatsApp.');
    } finally { submitting.current = false; }
  }

  return <form id="project-enquiry" className={styles.form} noValidate onSubmit={submit} aria-busy={pending}>
    <fieldset className={styles.services} disabled={pending || received}>
      <legend>I&apos;m here for</legend>
      {services.map(service => <label key={service}><input type="radio" name="service" value={service} required
        checked={values.service === service} onChange={() => change('service', service)} /><span>{service} ↗</span></label>)}
    </fieldset>
    <div className={styles.fields}>
      <label>Your name<input name="name" autoComplete="name" required minLength={2} placeholder="Name" disabled={pending || received}
        value={values.name} onChange={event => change('name', event.target.value)} /></label>
      <label>Your email<input name="email" type="email" autoComplete="email" required placeholder="you@company.com" disabled={pending || received}
        value={values.email} onChange={event => change('email', event.target.value)} /></label>
      <label className={styles.phone}>Phone / WhatsApp <small>optional</small><input name="phone" type="tel" autoComplete="tel" maxLength={40}
        placeholder="Phone number" disabled={pending || received}
        value={values.phone} onChange={event => change('phone', event.target.value)} /></label>
    </div>
    <label className={styles.brief}>Tell us what you have in mind<textarea name="brief" rows={2} required minLength={10}
      placeholder="The idea, the ambition, the thing you need." disabled={pending || received} value={values.brief} onChange={event => change('brief', event.target.value)} /></label>
    <div className={styles.sendRow}><button type="submit" data-received={received || undefined} aria-describedby="enquiry-status" disabled={pending || status === 'partial' || received || cooling}>{pending ? 'Sending…' : received ? 'Enquiry received' : cooling ? 'Please wait' : 'Send enquiry'} <span aria-hidden="true">{received ? '✓' : '↗'}</span></button>
      <a href={whatsapp} target="_blank" rel="noreferrer">Continue on WhatsApp ↗</a></div>
    <p ref={receipt} id="enquiry-status" tabIndex={received ? -1 : undefined} className={styles.formNote} role="status" aria-live="polite" data-status={status}>{status === 'limited' && !cooling ? 'You can now send your enquiry. Your details are still here.' : message || 'WhatsApp opens a draft. It does not submit this form.'}</p>
    {received && <button className={styles.newEnquiry} type="button" onClick={() => {
      setValues({ service: '', name: '', email: '', phone: '', brief: '' }); setStatus('idle'); setMessage('');
      requestAnimationFrame(() => document.querySelector<HTMLInputElement>('#project-enquiry input[name="name"]')?.focus({ preventScroll: true }));
    }}>Write another enquiry</button>}
  </form>;
}
