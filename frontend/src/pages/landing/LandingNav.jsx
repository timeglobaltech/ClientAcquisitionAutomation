
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, X, Menu } from "lucide-react";
import { cn } from "../../utils/helpers";
import { GlowButton } from "../../utils/helpers";

export default function LandingNav({ onEnterApp, onSignIn, onSignUp }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-[#0A0E27]/90 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg" style={{ fontFamily: "Orbitron, sans-serif" }}>Client Acquistion Automation</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["How It Works", "Features", "Pricing", "Tech Stack"].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="text-sm text-white/60 hover:text-white transition-colors">{item}</a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <GlowButton variant="ghost" onClick={() => { console.log("✅ LandingNav: Sign In clicked!"); onSignIn(); }}>Sign In</GlowButton>
          <GlowButton onClick={() => { console.log("✅ LandingNav: Start Free Trial clicked!"); onSignUp(); }}>Start Free Trial</GlowButton>
        </div>
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#0D1235]/95 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex flex-col gap-4">
            {["How It Works", "Features", "Pricing"].map(item => (
              <a key={item} href="#" className="text-white/70" onClick={() => setMenuOpen(false)}>{item}</a>
            ))}
            <GlowButton onClick={onEnterApp} className="w-full justify-center">Start Free Trial</GlowButton>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
