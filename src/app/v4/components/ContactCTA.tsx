'use client';

import React, { useState } from 'react';
import { Send, ArrowUpRight, MessageSquare, Mail, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ContactCTA() {
  const [selectedType, setSelectedType] = useState<string>('film');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const projectTypes = [
    { id: 'film', label: '01 / Cinematic Film & Media' },
    { id: 'labs', label: '02 / Custom Web & Labs' },
    { id: 'ai', label: '03 / AI & Workflow Engine' },
    { id: 'custom', label: '04 / Multidisciplinary Project' },
  ];

  return (
    <section id="contact" className="py-24 px-6 sm:px-8 border-t border-[#AFC2D5]/10 relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#8E592F]/20 via-[#B5E619]/10 to-transparent blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Big Pitch */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono uppercase tracking-widest text-[#B5E619]">
                  // 06 Initiate Collaboration
                </span>
                <span className="h-[1px] w-12 bg-[#B5E619]/40" />
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#FBFFFE] leading-[0.95] mb-8">
                Got something <br />
                <span className="text-[#B5E619]">ambitious</span> in mind? <br />
                Let&apos;s build it.
              </h2>

              <p className="text-base text-[#AFC2D5] leading-relaxed max-w-md mb-8">
                We accept a limited number of commissions per quarter to ensure obsessive attention to detail on every single project.
              </p>
            </div>

            {/* Direct Connect Quick Links */}
            <div className="space-y-4 pt-8 border-t border-[#AFC2D5]/15">
              <a
                href="mailto:contact@jstarstudios.com"
                className="flex items-center justify-between p-4 rounded-2xl bg-[#001514] border border-[#AFC2D5]/15 hover:border-[#B5E619] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#8E592F]/20 text-[#B5E619] flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-[#AFC2D5]/60 uppercase">Direct Email</div>
                    <div className="text-sm font-bold text-[#FBFFFE]">contact@jstarstudios.com</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#AFC2D5]/40 group-hover:text-[#B5E619] transition-colors" />
              </a>

              <a
                href="https://wa.me/2348123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl bg-[#001514] border border-[#AFC2D5]/15 hover:border-[#B5E619] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#B5E619]/15 text-[#B5E619] flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-[#AFC2D5]/60 uppercase">Instant Message</div>
                    <div className="text-sm font-bold text-[#FBFFFE]">WhatsApp Consultation</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#AFC2D5]/40 group-hover:text-[#B5E619] transition-colors" />
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Project Brief Form */}
          <div className="lg:col-span-6">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#001514] border border-[#AFC2D5]/20 shadow-2xl relative">
              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-[#B5E619]/20 text-[#B5E619] flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase text-[#FBFFFE] mb-2">Message Received</h3>
                  <p className="text-sm text-[#AFC2D5] max-w-sm mb-6">
                    Thank you, {name || 'there'}! John will review your project brief and get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-mono text-[#B5E619] underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Discipline Selection */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#AFC2D5] mb-3">
                      Select Project Discipline
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {projectTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSelectedType(type.id)}
                          className={`p-3 rounded-xl text-left text-xs font-mono border transition-all ${
                            selectedType === type.id
                              ? 'bg-[#B5E619]/15 border-[#B5E619] text-[#FBFFFE] font-bold'
                              : 'bg-[#001514] border-[#AFC2D5]/15 text-[#AFC2D5] hover:border-[#AFC2D5]/40'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Email Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#AFC2D5] mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full bg-[#001514] border border-[#AFC2D5]/20 rounded-xl px-4 py-3 text-sm text-[#FBFFFE] placeholder-[#AFC2D5]/40 focus:outline-none focus:border-[#B5E619] transition-colors font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#AFC2D5] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full bg-[#001514] border border-[#AFC2D5]/20 rounded-xl px-4 py-3 text-sm text-[#FBFFFE] placeholder-[#AFC2D5]/40 focus:outline-none focus:border-[#B5E619] transition-colors font-sans"
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#AFC2D5] mb-2">
                      Project Goals & Scope
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what you want to build, key timelines, and desired outcomes..."
                      className="w-full bg-[#001514] border border-[#AFC2D5]/20 rounded-xl px-4 py-3 text-sm text-[#FBFFFE] placeholder-[#AFC2D5]/40 focus:outline-none focus:border-[#B5E619] transition-colors font-sans resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-[#B5E619] hover:bg-[#c2f325] text-[#001514] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_25px_rgba(181,230,25,0.35)]"
                  >
                    <span>Submit Project Brief</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
