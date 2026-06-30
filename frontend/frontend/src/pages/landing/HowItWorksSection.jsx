
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../utils/helpers";
import { PIPELINE_STEPS } from "../../data/constants";

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(null);
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-[#0A0E27] to-[#0D1030] px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>
            The 8-Step <span className="text-purple-400">Sales Pipeline</span>
          </h2>
          <p className="text-white/50">Click any step to see how it works</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PIPELINE_STEPS.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              onClick={() => setActiveStep(activeStep === i ? null : i)}
              className={cn(
                "rounded-2xl border p-5 cursor-pointer transition-all duration-300",
                activeStep === i
                  ? "border-purple-500/60 bg-purple-500/15 shadow-[0_0_25px_rgba(124,58,237,0.3)]"
                  : "border-white/8 bg-white/[0.03] hover:border-purple-500/30 hover:bg-purple-500/5"
              )}>
              <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3", step.color)}>
                <step.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs text-purple-400 font-mono mb-1">STEP {i + 1}</div>
              <h3 className="font-bold text-white text-sm mb-1">{step.label}</h3>
              <AnimatePresence>
                {activeStep === i && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-white/60 mt-2 leading-relaxed">{step.desc}</motion.p>
                )}
              </AnimatePresence>
              {activeStep !== i && <p className="text-xs text-white/40 mt-1 line-clamp-2">{step.desc.substring(0, 60)}...</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
