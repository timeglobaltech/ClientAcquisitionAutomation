
import { motion } from "motion/react";
import { TECH_STACK } from "../../data/constants";
import { cn } from "../../utils/helpers";

export default function TechStackSection() {
  return (
    <section id="tech-stack" className="py-24 bg-[#0D1030] px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>
            Enterprise-Grade <span className="text-cyan-400">Tech Stack</span>
          </h2>
          <p className="text-white/50">Built on the most trusted infrastructure in the world</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TECH_STACK.map((tech, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="rounded-xl border border-white/8 bg-white/[0.03] p-4 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all text-center">
              <tech.icon className={cn("w-8 h-8 mx-auto mb-2", tech.color)} />
              <div className="font-semibold text-white text-sm">{tech.name}</div>
              <div className="text-xs text-white/40 mt-0.5">{tech.category}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
