
import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";
import { cn } from "../../utils/helpers";
import { PRICING_TIERS } from "../../data/constants";
import { GlowButton } from "../../utils/helpers";

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-[#0A0E27] px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>
            Simple, <span className="text-purple-400">Transparent Pricing</span>
          </h2>
          <p className="text-white/50">Cancel anytime. No contracts. No surprises.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING_TIERS.map((tier, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={cn("relative rounded-2xl border bg-gradient-to-br p-6", tier.color, tier.border,
                tier.badge && "shadow-[0_0_40px_rgba(124,58,237,0.25)] scale-105")}>
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 text-white text-xs font-bold shadow-lg">
                  {tier.badge}
                </div>
              )}
              <h3 className="font-bold text-lg text-white mb-1">{tier.name}</h3>
              <div className="text-4xl font-black text-white mb-1 font-mono">${tier.price}<span className="text-sm font-normal text-white/50">/mo</span></div>
              <ul className="space-y-2.5 mt-6 mb-8">
                {tier.features.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-2 text-sm text-white/70">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <GlowButton variant={tier.badge ? "primary" : "secondary"} className="w-full justify-center">
                Get Started
              </GlowButton>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
