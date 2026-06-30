
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Send, RefreshCw, CheckCircle, Mail, Clock, FileText, AlertCircle, Users, Check } from "lucide-react";
import { cn, GlowButton, GlassCard } from "../../utils/helpers";

export default function OutreachView() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [emailBody, setEmailBody] = useState(
    `Hi Marco,\n\nI was checking out Marco's Italian Kitchen online and noticed your website is loading in 6.8 seconds on mobile — that's likely costing you 40–60% of your potential customers before they even see your menu.\n\nI put together a quick 12-point audit showing exactly what's hurting your online presence:\n\n❌ Mobile load time: 6.8s (industry average: 2.1s)\n❌ 7 broken links losing Google ranking\n❌ No Google My Business posts in 47 days\n❌ Missing review response strategy\n\nI help restaurants like yours fix these issues and typically see a 30–60% increase in online reservations within 60 days.\n\nWould you have 15 minutes this week to go over the findings?\n\nBest,\nJames Draper\nClient Acquisition Automation`
  );
  const handleSend = () => {
    setSending(true);
    setSent(false);
    setTimeout(() => { setSending(false); setSent(true); }, 2000);
  };
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>Email Outreach</h1>
        <p className="text-sm text-white/40 mt-0.5">AI-crafted personalized emails that convert</p>
      </div>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <GlassCard className="p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> AI Email Composer
            </h3>
            <div className="space-y-3 mb-4">
              {[["To:", "marco@marcoskitchen.com"], ["Subject:", "I found 7 issues costing Marco's Italian 40% more customers"]].map(([label, val]) => (
                <div key={label} className="flex items-center gap-3 border-b border-white/8 pb-2">
                  <span className="text-xs text-white/40 w-14 shrink-0">{label}</span>
                  <span className="text-sm text-white">{val}</span>
                </div>
              ))}
            </div>
            <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)}
              className="w-full h-72 bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 text-sm text-white/80 outline-none resize-none focus:border-purple-500/40 font-[Inter] leading-relaxed"
              style={{ fontFamily: "Inter, sans-serif" }} />
            <div className="flex gap-3 mt-4">
              <GlowButton onClick={handleSend} disabled={sending || sent} className="flex-1 justify-center">
                {sending ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: "spin 0.8s linear infinite" }} /> Sending...</>
                  : sent ? <><CheckCircle className="w-4 h-4 text-green-400" /> Sent!</>
                  : <><Send className="w-4 h-4" /> Send Email</>}
              </GlowButton>
              <GlowButton variant="secondary" className="px-4"><RefreshCw className="w-4 h-4" /></GlowButton>
            </div>
            <AnimatePresence>
              {sent && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-3 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-xs text-green-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Email delivered! Open tracking enabled. AI follow-up scheduled for Day 3.
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <GlassCard className="p-5">
            <h3 className="font-semibold text-white mb-4">Follow-Up Sequence</h3>
            <div className="space-y-3">
              {[
                { day: "Day 1", label: "Initial Outreach", status: "sent", icon: Mail },
                { day: "Day 3", label: "Soft Follow-Up", status: "scheduled", icon: Clock },
                { day: "Day 6", label: "Value Add (Case Study)", status: "scheduled", icon: FileText },
                { day: "Day 10", label: "Last Chance Email", status: "scheduled", icon: AlertCircle },
                { day: "Day 14", label: "LinkedIn Connection", status: "scheduled", icon: Users },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                    step.status === "sent" ? "bg-green-500/20 text-green-400" : "bg-white/5 text-white/30")}>
                    {step.status === "sent" ? <Check className="w-3.5 h-3.5" /> : <step.icon className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div className="text-xs text-white/80 font-semibold">{step.label}</div>
                    <div className="text-xs text-white/40 font-mono">{step.day}</div>
                  </div>
                  <div className="ml-auto">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full",
                      step.status === "sent" ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/30")}>
                      {step.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="font-semibold text-white mb-3 text-sm">Campaign Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              {[["Sent", "247"], ["Opened", "151 (61%)"], ["Replied", "34 (14%)"], ["Meetings", "23"]].map(([l, v]) => (
                <div key={l} className="bg-white/[0.03] rounded-xl p-3">
                  <div className="text-lg font-bold text-white font-mono">{v}</div>
                  <div className="text-xs text-white/40">{l}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
