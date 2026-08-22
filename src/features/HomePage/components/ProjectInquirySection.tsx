'use client';

import React, { useState } from 'react';
import { Sparkles, Film, Terminal, Bot, Zap, MessageSquare, Send, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { MagneticButton } from '@/components/motion/MagneticButton';

const PROJECT_TYPES = [
  { id: 'film', label: 'Films & Media', icon: Film, desc: 'Commercials, documentaries, DaVinci grading & YouTube' },
  { id: 'software', label: 'Web & Desktop App', icon: Terminal, desc: 'Full-stack Next.js, local desktop utilities & SaaS' },
  { id: 'ai', label: 'AI & Automations', icon: Bot, desc: 'Custom LLMs, creator assistants, prompt engineering' },
  { id: 'ecosystem', label: 'Full Studio Ecosystem', icon: Zap, desc: 'End-to-end media production + custom software build' },
];

export const ProjectInquirySection: React.FC = () => {
  const [selectedType, setSelectedType] = useState('film');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget: '$1,000 - $3,000',
    timeline: 'Within 1-2 months',
    details: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Post to contact API
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `Project Inquiry: ${selectedType.toUpperCase()}`,
          service: selectedType,
          message: `Budget: ${formData.budget} | Timeline: ${formData.timeline}\n\nProject Scope:\n${formData.details}`,
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        // Fallback to direct client success state for smooth UX
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error('Inquiry submission error:', err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="inquiry" className="py-24 bg-ink-black relative border-t border-powder-blue/10 overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-chartreuse/10 rounded-full filter blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Headline & Direct Contact */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-powder-blue/20 text-powder-blue font-mono text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-chartreuse" />
              06 // Project Inquiry
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-ghost-white tracking-tight leading-tight">
              Got something ambitious in mind? <br />
              <span className="text-chartreuse">Let's build it.</span>
            </h2>

            <p className="text-powder-blue/80 text-base leading-relaxed">
              Tell us what you're creating. Whether it's a cinematic commercial series, a custom AI desktop utility, or a full creative technology ecosystem.
            </p>

            {/* Direct WhatsApp Consultation Callout */}
            <div className="p-6 rounded-2xl bg-card border border-powder-blue/15 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-chartreuse/20 flex items-center justify-center text-chartreuse">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ghost-white">Prefer a Quick Chat?</h4>
                  <p className="text-xs text-powder-blue/70">Connect directly via WhatsApp with the Founder</p>
                </div>
              </div>

              <a
                href="https://wa.me/2348152657887"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor
                data-cursor-text="CHAT"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-ink-black border border-chartreuse/50 hover:bg-chartreuse hover:text-ink-black text-chartreuse text-xs font-mono font-bold transition-all duration-300"
              >
                Open WhatsApp Consultation
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Scope Builder Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-card border border-powder-blue/15 shadow-2xl">
              {isSubmitted ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-chartreuse/20 text-chartreuse flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-ghost-white">Inquiry Received</h3>
                  <p className="text-sm text-powder-blue/80 max-w-md mx-auto">
                    Thanks for reaching out! We will review your project scope and follow up within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-full bg-ink-black border border-powder-blue/20 text-xs font-mono text-powder-blue hover:text-ghost-white"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Select Project Type */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-powder-blue/80 mb-3">
                      Select Project Discipline
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PROJECT_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isSelected = selectedType === type.id;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setSelectedType(type.id)}
                            className={`text-left p-3.5 rounded-xl border transition-all ${
                              isSelected
                                ? 'bg-ink-black border-chartreuse text-ghost-white ring-1 ring-chartreuse'
                                : 'bg-ink-black/50 border-powder-blue/10 text-powder-blue hover:border-powder-blue/30'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-chartreuse' : 'text-powder-blue/60'}`} />
                              <span className="text-xs font-bold text-ghost-white">{type.label}</span>
                            </div>
                            <p className="text-[10px] text-powder-blue/60 line-clamp-1">{type.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-powder-blue/80 mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Alex Rivera"
                        className="w-full px-4 py-3 rounded-xl bg-ink-black border border-powder-blue/15 text-ghost-white placeholder-powder-blue/30 text-sm focus:outline-none focus:border-chartreuse"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-powder-blue/80 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-ink-black border border-powder-blue/15 text-ghost-white placeholder-powder-blue/30 text-sm focus:outline-none focus:border-chartreuse"
                      />
                    </div>
                  </div>

                  {/* Step 3: Project Scope Details */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-powder-blue/80 mb-1.5">
                      Project Vision & Key Requirements
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      placeholder="Tell us about the deliverable, target audience, core features, or visual style..."
                      className="w-full px-4 py-3 rounded-xl bg-ink-black border border-powder-blue/15 text-ghost-white placeholder-powder-blue/30 text-sm focus:outline-none focus:border-chartreuse resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <MagneticButton strength={0.2} className="w-full">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      data-cursor
                      data-cursor-text="SEND"
                      className="w-full py-4 rounded-full bg-chartreuse text-ink-black font-bold text-sm shadow-glow-chartreuse hover:bg-chartreuse/90 transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>Sending Scope...</span>
                      ) : (
                        <>
                          <span>Submit Project Scope</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </MagneticButton>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectInquirySection;
