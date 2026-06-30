
import { TrendingUp, Sparkles } from "lucide-react";

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function ScoreBadge({ score }) {
  const color = score >= 80 ? "bg-green-500/20 text-green-400 border-green-500/30"
    : score >= 60 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    : "bg-red-500/20 text-red-400 border-red-500/30";
  const label = score >= 80 ? "Hot" : score >= 60 ? "Warm" : "Cold";
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold border font-mono", color)}>
      {label} {score}
    </span>
  );
}

export function GlowButton({ children, onClick, variant = "primary", className = "", disabled = false }) {
  const base = "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer select-none";
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-500 hover:to-violet-500 shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)]",
    secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20",
    ghost: "text-white/70 hover:text-white hover:bg-white/5",
    cyan: "bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:from-cyan-500 hover:to-teal-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(base, variants[variant], disabled && "opacity-50 cursor-not-allowed", className)}
    >
      {children}
    </button>
  );
}

export function GlassCard({ children, className = "", glow = false }) {
  return (
    <div className={cn(
      "rounded-2xl border bg-white/[0.03] backdrop-blur-sm",
      glow ? "border-purple-500/30 shadow-[0_0_30px_rgba(124,58,237,0.15)]" : "border-white/8",
      className
    )}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, change, color = "purple" }) {
  const colors = {
    purple: "from-purple-500/20 to-violet-600/10 border-purple-500/30",
    cyan: "from-cyan-500/20 to-blue-600/10 border-cyan-500/30",
    green: "from-green-500/20 to-teal-600/10 border-green-500/30",
    orange: "from-orange-500/20 to-red-600/10 border-orange-500/30",
  };
  const iconColors = {
    purple: "text-purple-400", cyan: "text-cyan-400", green: "text-green-400", orange: "text-orange-400",
  };
  return (
    <div className={cn("rounded-2xl border bg-gradient-to-br p-5", colors[color])}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-white/60">{label}</span>
        <div className={cn("p-2 rounded-lg bg-white/5", iconColors[color])}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl font-bold text-white font-mono">{value}</div>
      <div className="mt-1 text-xs text-green-400 flex items-center gap-1">
        <TrendingUp className="w-3 h-3" /> {change}
      </div>
    </div>
  );
}

export function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1 + "px",
            height: Math.random() * 3 + 1 + "px",
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            background: i % 3 === 0 ? "rgba(124,58,237,0.6)" : i % 3 === 1 ? "rgba(6,182,212,0.5)" : "rgba(168,85,247,0.4)",
            animation: `float ${5 + Math.random() * 10}s ease-in-out ${Math.random() * 5}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes float { 0% { transform: translateY(0px) translateX(0px); opacity: 0.3; } 100% { transform: translateY(-40px) translateX(20px); opacity: 0.8; } }
        @keyframes gridPulse { 0%,100% { opacity: 0.03; } 50% { opacity: 0.06; } }
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        @keyframes countUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 20px rgba(124,58,237,0.3); } 50% { box-shadow: 0 0 40px rgba(124,58,237,0.6); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(300px) rotate(720deg); opacity: 0; } }
      `}</style>
    </div>
  );
}
