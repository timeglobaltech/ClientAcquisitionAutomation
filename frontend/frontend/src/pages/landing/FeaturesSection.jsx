
import { motion } from "motion/react";
import { FEATURES } from "../../data/constants";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[#0D1030] px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>
            Everything You Need to <span className="text-cyan-400">Dominate Sales</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="group rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(124,58,237,0.15)]">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/30 to-violet-600/20 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all">
                <feat.icon className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-sm text-white/50">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
