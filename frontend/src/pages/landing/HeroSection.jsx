
import { motion } from "motion/react";
import { Users, DollarSign, Calendar, Mail, Rocket, Play, Sparkles } from "lucide-react";
import { ParticleField, GlowButton } from "../../utils/helpers";

export default function HeroSection({ onEnterApp }) {
  const stats = [
    { label: "Leads Generated", value: "247", icon: Users, suffix: "/wk" },
    { label: "Revenue Added", value: "$8.4K", icon: DollarSign, suffix: "" },
    { label: "Meetings Booked", value: "23", icon: Calendar, suffix: "/mo" },
    { label: "Email Open Rate", value: "61%", icon: Mail, suffix: "" },
  ];
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0E27]">
      <ParticleField />
      <div className="absolute inset-0" style={{
        backgroundImage: "linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Powered by GPT-4 + Autonomous AI Agents
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-white leading-tight mb-6"
          style={{ fontFamily: "Orbitron, sans-serif" }}>
          Turn Your Business Into a{" "}
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            24/7 Automatic Sales Machine
          </span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="text-xl text-white/60 max-w-3xl mx-auto mb-10">
          AISA finds qualified leads, sends personalized outreach, books meetings, and closes deals — completely on autopilot while you sleep.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <GlowButton onClick={() => { console.log("✅ HeroSection: Start Free Trial clicked!"); onEnterApp(); }} className="text-base px-8 py-4">
            <Rocket className="w-5 h-5" /> Start Free Trial — 14 Days Free
          </GlowButton>
          <GlowButton variant="secondary" onClick={() => { console.log("✅ HeroSection: Watch Demo clicked!"); onEnterApp(); }} className="text-base px-8 py-4">
            <Play className="w-5 h-5" /> Watch Demo
          </GlowButton>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }}
              className="rounded-2xl border border-purple-500/20 bg-white/[0.04] backdrop-blur-sm p-4 hover:border-purple-500/40 transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.2)]">
              <stat.icon className="w-5 h-5 text-purple-400 mb-2" />
              <div className="text-2xl font-bold text-white font-mono">{stat.value}<span className="text-sm text-white/50">{stat.suffix}</span></div>
              <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="flex flex-wrap gap-6 justify-center mt-12 text-sm text-white/40">
          {["✓ No credit card required", "✓ Cancel anytime", "✓ Setup in 5 minutes", "✓ 24/7 AI support"].map(t => (
            <span key={t}>{t}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
