
import { motion } from "motion/react";
import { cn } from "../../utils/helpers";

export default function BeforeAfterSection() {
  return (
    <section className="py-24 bg-[#0A0E27] px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>
            The Old Way vs. <span className="text-purple-400">The AISA Way</span>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              label: "❌ Before AISA", bg: "bg-red-500/5", border: "border-red-500/20", items: [
                "40+ hours/week on manual prospecting", "Generic copy-paste cold emails", "Leads fall through the cracks",
                "No follow-up system", "Inconsistent revenue", "Burned out sales team", "Missed deals while sleeping",
              ]
            },
            {
              label: "✅ With AISA", bg: "bg-green-500/5", border: "border-green-500/20", items: [
                "200+ qualified leads found automatically", "Hyper-personalized AI emails", "CRM tracks every touchpoint",
                "5-touch automated follow-up", "Predictable, scalable revenue", "Team focuses on closing only", "Deals booked 24/7 while you sleep",
              ]
            },
          ].map((col, ci) => (
            <motion.div key={ci} initial={{ opacity: 0, x: ci === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className={cn("rounded-2xl border p-6", col.bg, col.border)}>
              <h3 className="font-bold text-lg text-white mb-4">{col.label}</h3>
              <ul className="space-y-3">
                {col.items.map((item, i) => (
                  <li key={i} className={cn("flex items-start gap-2 text-sm", ci === 0 ? "text-red-300/80" : "text-green-300/80")}>
                    <span className="mt-0.5">{ci === 0 ? "—" : "→"}</span> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
