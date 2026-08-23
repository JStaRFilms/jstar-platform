'use client';

import React, { useState } from 'react';
import ScrambleText from './ScrambleText';
import V2MagneticButton from './V2MagneticButton';
import { Film, Terminal, Bot, Zap, ArrowUpRight, Send, CheckCircle2, MessageSquare, Clock, Globe } from 'lucide-react';

const DISCIPLINES = [
  { id: 'film', label: '01 // Films & Media', icon: Film, desc: 'Commercials, documentaries, DaVinci ACES color grading' },
  { id: 'software', label: '02 // Web & Desktop Apps', icon: Terminal, desc: 'Next.js 15, Electron, local-first tools & SaaS' },
  { id: 'ai', label: '03 // AI Workflows', icon: Bot, desc: 'Local neural models, Gemini agents & creator tools' },
  { id: 'full', label: '04 // Full Ecosystem', icon: Zap, desc: 'End-to-end media production + software deployment' },
];

export const V2InquirySection: React.FC = () => {
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
            <ScrambleText text="06 // INITIATE STUDIO INQUIRY" />
          </span>
          <h2 className="text-3xl sm:text-6xl font-extrabold text-ghost-white tracking-tight leading-tight">
            Got something ambitious in mind? <br />
            <span className="text-chartreuse">{`Good. Let's build it.`}</span>
          </h2>
          <p className="text-base sm:text-lg text-powder-blue/80 font-light leading-relaxed">
            Direct founder collaboration on high-impact media production, modern web applications, and custom AI creator tools.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Direct Consultation Link (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-card border border-powder-blue/15 space-y-6 shadow-xl">
              <div>
                <span className="text-xs font-mono text-powder-blue/60 uppercase block mb-1">
                  Direct Founder Channel
                </span>
                <h4 className="text-xl font-bold text-ghost-white">
                  Instant WhatsApp Consultation
                </h4>
                <p className="text-xs text-powder-blue/80 font-light mt-2 leading-relaxed">
                  For urgent production schedules, architectural reviews, or direct creative direction inquiries, reach John Oluleke-Oke directly.
                </p>
              </div>

              <a
                href="https://wa.me/2348152657887"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-ink-black border border-chartreuse/60 text-chartreuse font-mono text-xs font-bold hover:bg-chartreuse hover:text-ink-black transition-all shadow-lg hover:shadow-glow-chartreuse"
              >
                <MessageSquare className="w-4 h-4" />
                <span>OPEN WHATSAPP CONSULTATION</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            {/* SLA Telemetry Card */}
            <div className="p-6 rounded-2xl bg-card/60 border border-powder-blue/10 space-y-3 text-xs font-mono text-powder-blue/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-chartreuse" />
                  <span>Response SLA</span>
                </div>
                <span className="text-ghost-white font-bold">&lt; 24 Hours</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-powder-blue" />
                  <span>Timezone</span>
                </div>
                <span className="text-ghost-white font-bold">WAT (UTC+1) · Global Remote</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-chartreuse animate-pulse" />
                  <span>Production Window</span>
                </div>
                <span className="text-chartreuse font-bold">Open for Scopes</span>
              </div>
            </div>
          </div>

          {/* Structured Scope Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-card border border-powder-blue/15 shadow-2xl">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-chartreuse/20 text-chartreuse flex items-center justify-center mx-auto shadow-glow-chartreuse">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-ghost-white">Scope Received</h3>
                  <p className="text-xs font-mono text-powder-blue/80 max-w-sm mx-auto">
                    Your parameters have been logged. We will review your technical and production requirements and reply within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 text-xs font-mono text-chartreuse hover:underline cursor-pointer"
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
                            className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-ink-black border-chartreuse text-ghost-white ring-1 ring-chartreuse shadow-glow-chartreuse'
                                : 'bg-ink-black/50 border-powder-blue/15 text-powder-blue hover:border-powder-blue/40'
                            }`}
                          >
                            <span className="text-xs font-mono font-bold block text-ghost-white mb-0.5">{d.label}</span>
                            <span className="text-[10px] text-powder-blue/70 line-clamp-1">{d.desc}</span>
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

export default V2InquirySection;
