
import { Bot } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="bg-[#080B1F] border-t border-white/5 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>Client Acquistion Automation</span>
            <span className="text-white/30 text-sm ml-2">© 2026 Client Acquistion Automation</span>
          </div>
          <div className="flex gap-6 text-sm text-white/40">
            {["Privacy", "Terms", "Security", "Support"].map(l => <a key={l} href="#" className="hover:text-white/70 transition-colors">{l}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
