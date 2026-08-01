"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring, Variants } from "framer-motion";
import {
  Mail,
  Sparkles,
  Languages,
  CheckCircle2,
  RefreshCw,
  Wand2,
  MessageSquareReply,
  LayoutTemplate,
  History,
  Shield,
  ArrowRight,
  Star,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import React, { useRef, useEffect, useState } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative z-10 transition-transform duration-200 ease-linear ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`py-24 sm:py-32 relative ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">{children}</div>
    </section>
  );
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-galaxy overflow-hidden">
      <Navbar />

      {/* Floating Particles Background */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-primary/40 blur-[1px]"
              initial={{
                x: Math.random() * 100 + "vw",
                y: Math.random() * 100 + "vh",
                opacity: Math.random() * 0.5 + 0.3,
              }}
              animate={{
                y: [null, Math.random() * -200 + -100],
                opacity: [null, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* HERO */}
      <section className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial="hidden" animate="show" variants={fadeUp} className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-[0_0_15px_rgba(124,58,237,0.3)] backdrop-blur-md mb-8">
              <Sparkles className="h-4 w-4" />
              Powered by OpenRouter AI
            </div>
          </motion.div>
          
          <motion.h1
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="text-5xl sm:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-xl"
          >
            Craft Perfect Emails in <br className="hidden sm:block" />
            <span className="text-gradient-galaxy">A Split Second.</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="text-lg sm:text-xl text-ink-600 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            MailCraft AI leverages state-of-the-art models to generate, rewrite, and perfect your professional communications with absolute precision.
          </motion.p>

          <motion.div initial="hidden" animate="show" variants={fadeUp} className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(124,58,237,0.5)] border border-primary/50 transition-all hover:scale-105">
                Start Writing Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-ink-600 text-ink-700 hover:bg-ink-300 hover:text-white transition-all glass">
                Sign In
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 perspective-[2000px]"
          >
            <TiltCard>
              <div className="glass rounded-3xl p-3 sm:p-4 border border-white/10 shadow-[0_30px_60px_-15px_rgba(124,58,237,0.3)]">
                <div className="rounded-2xl bg-[#0a0a16]/80 p-6 sm:p-10 border border-white/5 backdrop-blur-xl flex flex-col md:flex-row gap-8">
                   <div className="flex-1 space-y-4 text-left">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-primary/20 text-primary">
                          <Wand2 className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-white">AI Configuration</h3>
                     </div>
                     <div>
                       <label className="text-xs font-medium text-ink-600 uppercase tracking-wider">Topic</label>
                       <div className="mt-1.5 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white font-medium">Q3 Product Launch Update</div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="text-xs font-medium text-ink-600 uppercase tracking-wider">Tone</label>
                         <div className="mt-1.5 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white font-medium">Visionary</div>
                       </div>
                       <div>
                         <label className="text-xs font-medium text-ink-600 uppercase tracking-wider">Length</label>
                         <div className="mt-1.5 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white font-medium">Medium</div>
                       </div>
                     </div>
                   </div>
                   
                   <div className="flex-1 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6 text-left relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                       <Mail className="h-24 w-24 text-primary/20 -rotate-12 transform scale-150" />
                     </div>
                     <div className="relative z-10">
                      <div className="text-primary font-medium mb-4 pb-4 border-b border-white/10">Subject: Unveiling Our Next Chapter: Q3 Launch</div>
                      <div className="space-y-4 text-ink-700 text-sm leading-relaxed">
                        <p>Team,</p>
                        <p>We are standing at the precipice of our most significant update yet. The Q3 product launch isn't just a release; it's a redefinition of what our platform can achieve.</p>
                        <p>Expect profound enhancements in speed, a completely revamped user interface, and intelligent workflows that anticipate needs before they arise.</p>
                        <p>Let's make history.</p>
                      </div>
                     </div>
                   </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <Section id="features" className="border-t border-white/5 relative bg-[#050511]/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">Unrivaled capabilities</h2>
          <p className="text-ink-600 max-w-2xl mx-auto">Everything you need to orchestrate perfect communication, unified in one beautiful interface.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 relative z-10 perspective-[1000px]">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <TiltCard className="h-full">
                <div className="h-full glass rounded-2xl p-6 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] transition-shadow">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 border border-white/10">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
                  <p className="text-ink-600 leading-relaxed">{f.desc}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section id="how-it-works" className="border-t border-white/5">
        <div className="text-center mb-16">
           <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">Fluid Workflow</h2>
           <p className="text-ink-600 max-w-2xl mx-auto">Three seamless steps to absolute clarity.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { n: "01", t: "Contextualize", d: "Provide brief bullet points, keywords, or a rough thought. The AI grasps the essence immediately." },
            { n: "02", t: "Synthesize", d: "OpenRouter powers through multiple models to synthesize a perfectly toned, grammatically flawless draft." },
            { n: "03", t: "Finalize", d: "Export, copy, or iterate with one click. Your communication is ready to make an impact." },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative group"
            >
               <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
               <div className="relative glass rounded-3xl p-8 border border-white/10 h-full">
                 <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white/10 to-white/5 mb-6">{s.n}</div>
                 <h3 className="text-xl font-bold text-white mb-3">{s.t}</h3>
                 <p className="text-ink-600">{s.d}</p>
               </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="pb-32 border-t border-white/5">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden glass border border-white/10 p-12 md:p-20 text-center"
        >
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"/>
           <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 relative z-10">Elevate your inbox.</h2>
           <p className="text-xl text-ink-700 max-w-2xl mx-auto mb-10 relative z-10">Join the professionals who have already reclaimed hours of their week with MailCraft AI.</p>
           <div className="flex justify-center relative z-10">
             <Link href="/register">
                <Button size="lg" className="h-14 px-10 text-lg bg-white text-[#050511] hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all hover:scale-105 font-semibold">
                  Get Started Now
                </Button>
              </Link>
           </div>
        </motion.div>
      </Section>

      <Footer />
    </div>
  );
}

const features = [
  { icon: Mail, title: "Intelligent Generation", desc: "Craft entire email chains from a single prompt, maintaining perfect context." },
  { icon: CheckCircle2, title: "Flawless Grammar", desc: "Advanced neural networks ensure your syntax is impenetrable and professional." },
  { icon: RefreshCw, title: "Dynamic Rewriting", desc: "Pivot from casual to strictly formal with a single click." },
  { icon: Wand2, title: "Subject Wizardry", desc: "Generate open-rate-optimized subject lines guaranteed to catch the eye." },
  { icon: MessageSquareReply, title: "Contextual Replies", desc: "Feed it a thread, and get a tailored, intelligent response instantly." },
  { icon: Languages, title: "Global Translation", desc: "Break barriers seamlessly with culturally-aware native translation." }
];
