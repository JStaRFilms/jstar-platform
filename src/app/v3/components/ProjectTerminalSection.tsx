'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';

interface ProjectTerminalSectionProps {
  playFeedback?: () => void;
}

export function ProjectTerminalSection({ playFeedback }: ProjectTerminalSectionProps) {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('film');
  const [selectedTimeline, setSelectedTimeline] = useState<string>('standard');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [brief, setBrief] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const disciplines = [
    { id: 'film', label: '🎬 Cinematic Film & Video', desc: 'Commercials, documentaries, high-retention video production & grading' },
    { id: 'web', label: '💻 Web Platform / Digital Product', desc: 'Next.js applications, WebGL experiences & high-performance UI/UX' },
    { id: 'ai', label: '🤖 Applied AI & Workflow Automation', desc: 'Custom LLM pipelines, knowledge graph systems & desktop utilities' },
    { id: 'partnership', label: '⚡ Integrated Studio Partnership', desc: 'Full-spectrum creative technology, production & engineering' },
  ];

  const timelines = [
    { id: 'rapid', label: '⚡ Rapid Sprint (1–2 Weeks)' },
    { id: 'standard', label: '🎯 Full Production (3–6 Weeks)' },
    { id: 'retainer', label: '🤝 Strategic Retainer / Ongoing' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playFeedback) playFeedback();
    setSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    if (playFeedback) playFeedback();
    const discLabel = disciplines.find((d) => d.id === selectedDiscipline)?.label || 'Creative Project';
    const timeLabel = timelines.find((t) => t.id === selectedTimeline)?.label || 'Standard';
    const text = encodeURIComponent(
      `Hello John! I'm interested in commissioning a project with J StaR Studios.\n\nFocus: ${discLabel}\nTimeline: ${timeLabel}\nName: ${name || 'Prospective Client'}\nBrief: ${brief || 'Looking to collaborate on something ambitious.'}`
    );
    window.open(`https://wa.me/2348000000000?text=${text}`, '_blank');
  };

  return (
    <section id="terminal" className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-8 border-t border-[#AFC2D5]/15 bg-[#001514]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-[#B5E619] font-bold inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B5E619] animate-ping" />
            04 / STUDIO COMMISSION TERMINAL
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#FBFFFE] uppercase tracking-tight">
            Got Something Ambitious? <br />
            <span className="text-[#B5E619]">Let&apos;s Build It.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#AFC2D5]">
            Define your project focus and scope below for a direct, transparent proposal without corporate red tape.
          </p>
        </div>

        {/* Interactive Scope & Inquiry Terminal */}
        <div className="max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl bg-[#001514] border border-[#AFC2D5]/25 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B5E619] via-[#8E592F] to-[#AFC2D5]" />
          
          {submitted ? (
            <div className="py-12 text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-[#B5E619]/20 border border-[#B5E619] flex items-center justify-center mx-auto text-[#B5E619] shadow-[0_0_25px_rgba(181,230,25,0.4)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#FBFFFE]">
                  Project Scope Received
                </h3>
                <p className="text-sm text-[#AFC2D5] max-w-md mx-auto">
                  Thank you for submitting your brief. John will review your requirements and reach out within 24 hours.
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-full bg-[#001514] border border-[#AFC2D5]/30 text-xs font-mono uppercase text-[#FBFFFE] hover:border-[#B5E619] transition-colors"
              >
                Submit Another Brief
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Step 1: Select Discipline */}
              <div className="space-y-3">
                <label className="block text-xs font-mono uppercase tracking-widest text-[#AFC2D5]">
                  Step 01 / Select Project Focus
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {disciplines.map((disc) => {
                    const isSelected = selectedDiscipline === disc.id;
                    return (
                      <button
                        key={disc.id}
                        type="button"
                        onClick={() => {
                          if (playFeedback) playFeedback();
                          setSelectedDiscipline(disc.id);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                          isSelected
                            ? 'bg-[#001514] border-[#B5E619] shadow-[0_0_15px_rgba(181,230,25,0.25)]'
                            : 'bg-[#001514]/60 border-[#AFC2D5]/20 hover:border-[#AFC2D5]/40'
                        }`}
                      >
                        <span className="text-xs font-bold text-[#FBFFFE] block mb-1">
                          {disc.label}
                        </span>
                        <span className="text-[11px] text-[#AFC2D5]/80 block leading-tight">
                          {disc.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Select Timeline */}
              <div className="space-y-3">
                <label className="block text-xs font-mono uppercase tracking-widest text-[#AFC2D5]">
                  Step 02 / Desired Timeline
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {timelines.map((time) => {
                    const isSelected = selectedTimeline === time.id;
                    return (
                      <button
                        key={time.id}
                        type="button"
                        onClick={() => {
                          if (playFeedback) playFeedback();
                          setSelectedTimeline(time.id);
                        }}
                        className={`p-3.5 rounded-xl border text-center text-xs font-mono transition-all duration-200 ${
                          isSelected
                            ? 'bg-[#B5E619] text-[#001514] font-bold border-[#B5E619] shadow-[0_0_10px_rgba(181,230,25,0.3)]'
                            : 'bg-[#001514]/60 border-[#AFC2D5]/20 text-[#AFC2D5] hover:text-[#FBFFFE]'
                        }`}
                      >
                        {time.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Brief & Contact Details */}
              <div className="space-y-4">
                <label className="block text-xs font-mono uppercase tracking-widest text-[#AFC2D5]">
                  Step 03 / Client & Scope Details
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Name or Organization"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#001514] border border-[#AFC2D5]/25 text-sm text-[#FBFFFE] placeholder-[#AFC2D5]/40 focus:outline-none focus:border-[#B5E619] transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Email or Phone / WhatsApp"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#001514] border border-[#AFC2D5]/25 text-sm text-[#FBFFFE] placeholder-[#AFC2D5]/40 focus:outline-none focus:border-[#B5E619] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you want to build, create, or direct..."
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#001514] border border-[#AFC2D5]/25 text-sm text-[#FBFFFE] placeholder-[#AFC2D5]/40 focus:outline-none focus:border-[#B5E619] transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#AFC2D5]/15">
                <div className="flex items-center gap-2 text-xs font-mono text-[#AFC2D5]">
                  <Sparkles className="w-4 h-4 text-[#B5E619]" />
                  <span>Direct founder consultation · Response within 24h</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#001514] border border-[#AFC2D5]/30 text-xs font-mono uppercase text-[#FBFFFE] hover:border-[#B5E619] hover:text-[#B5E619] transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-[#B5E619]" />
                    <span>WhatsApp Direct</span>
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#B5E619] text-[#001514] text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(181,230,25,0.35)] hover:bg-[#B5E619]/90 transition-all hover:scale-105"
                  >
                    <span>Launch Brief</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </form>
          )}
        </div>

      </div>
    </section>
  );
}
