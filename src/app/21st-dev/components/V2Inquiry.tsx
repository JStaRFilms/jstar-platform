'use client';

import React, { useState } from 'react';
import ScrambleText from './ScrambleText';
import V2MagneticButton from './V2MagneticButton';
import KineticBorderCard from './KineticBorderCard';
import { Film, Terminal, Bot, Zap, ArrowUpRight, Send, CheckCircle2 } from 'lucide-react';

const DISCIPLINES = [
  { id: 'film', label: '01 // Films & Media', icon: Film, desc: 'Commercials, documentaries, DaVinci color grading' },
  { id: 'software', label: '02 // Web & Desktop App', icon: Terminal, desc: 'Next.js 15, Electron, local-first tools & SaaS' },
  { id: 'ai', label: '03 // AI Workflows', icon: Bot, desc: 'Custom neural models, automated creator tools' },
  { id: 'full', label: '04 // Full Ecosystem', icon: Zap, desc: 'End-to-end media production + software deployment' },
];

export const V2Inquiry: React.FC = () => {
  const [selectedDiscipline, setSelectedDiscipline] = useState('film');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject: `V2 Scope: ${selectedDiscipline.toUpperCase()}`,
          service: selectedDiscipline,
          message: details,
        }),
      });
      setIsSubmitted(true);
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="inquiry" className="py-28 px-6 bg-ink-black relative">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono text-chartreuse uppercase tracking-widest block">
            <ScrambleText text="05 // INITIATE STUDIO INQUIRY" />
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-ghost-white tracking-tight">
            Have a project in mind? <br />
            <span className="text-chartreuse">Let's build it right.</span>
          </h2>
          <p className="text-base text-powder-blue/80 font-light leading-relaxed">
            Submit your scope parameters below or start an instant consultation directly on WhatsApp with the Founder.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Direct Consultation Link (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-card border border-powder-blue/15 space-y-6">
              <div>
                <span className="text-xs font-mono text-powder-blue/60 uppercase block mb-1">
                  Direct Founder Access
                </span>
                <h4 className="text-xl font-bold text-ghost-white">
                  Immediate Consultation
                </h4>
                <p className="text-xs text-powder-blue/80 font-light mt-2 leading-relaxed">
                  For urgent production schedules or direct architectural reviews, reach John Oluleke-Oke on WhatsApp.
                </p>
              </div>

              <a
                href="https://wa.me/2348152657887"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-ink-black border border-chartreuse/60 text-chartreuse font-mono text-xs font-bold hover:bg-chartreuse hover:text-ink-black transition-colors"
              >
                <span>OPEN WHATSAPP CONSULTATION</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-card/60 border border-powder-blue/10 space-y-2 text-xs font-mono text-powder-blue/70">
              <div className="flex justify-between">
                <span>Response SLA</span>
                <span className="text-ghost-white font-bold">&lt; 24 Hours</span>
              </div>
              <div className="flex justify-between">
                <span>Timezone</span>
                <span className="text-ghost-white font-bold">WAT (UTC+1) / Global Remote</span>
              </div>
              <div className="flex justify-between">
                <span>Production Window</span>
                <span className="text-chartreuse font-bold">Open for Q3/Q4</span>
              </div>
            </div>
          </div>

          {/* Structured Scope Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-card border border-powder-blue/15 shadow-2xl">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-chartreuse/20 text-chartreuse flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-ghost-white">Scope Received</h3>
                  <p className="text-xs font-mono text-powder-blue/80 max-w-sm mx-auto">
                    We will review your technical and production requirements and reply within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 text-xs font-mono text-chartreuse hover:underline"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-mono uppercase text-powder-blue/80 mb-3">
                      Select Project Discipline
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {DISCIPLINES.map((d) => {
                        const isSelected = selectedDiscipline === d.id;
                        return (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setSelectedDiscipline(d.id)}
                            className={`text-left p-3 rounded-2xl border transition-all ${
                              isSelected
                                ? 'bg-ink-black border-chartreuse text-ghost-white ring-1 ring-chartreuse'
                                : 'bg-ink-black/40 border-powder-blue/10 text-powder-blue hover:border-powder-blue/30'
                            }`}
                          >
                            <span className="text-xs font-mono font-bold block text-ghost-white">{d.label}</span>
                            <span className="text-[10px] text-powder-blue/60 line-clamp-1">{d.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-powder-blue/80 mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Rivera"
                        className="w-full px-4 py-3 rounded-xl bg-ink-black border border-powder-blue/15 text-ghost-white placeholder-powder-blue/30 text-sm focus:outline-none focus:border-chartreuse font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-powder-blue/80 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-ink-black border border-powder-blue/15 text-ghost-white placeholder-powder-blue/30 text-sm focus:outline-none focus:border-chartreuse font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-powder-blue/80 mb-1.5">
                      Project Parameters & Goals
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Describe target deliverable, timeline, tech stack, or cinematic style..."
                      className="w-full px-4 py-3 rounded-xl bg-ink-black border border-powder-blue/15 text-ghost-white placeholder-powder-blue/30 text-sm focus:outline-none focus:border-chartreuse resize-none font-mono"
                    />
                  </div>

                  <V2MagneticButton
                    variant="primary"
                    className="w-full"
                  >
                    <span className="flex items-center justify-center gap-2 w-full">
                      <span>{isSubmitting ? 'Transmitting Scope...' : 'Transmit Project Scope'}</span>
                      <Send className="w-4 h-4" />
                    </span>
                  </V2MagneticButton>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default V2Inquiry;
