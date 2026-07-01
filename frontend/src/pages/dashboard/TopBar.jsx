
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Bell, ChevronRight, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getUserInitials } from "../../utils/helpers";

export default function TopBar({ view }) {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifications = [
    { text: "Marco's Kitchen opened your email 4x", time: "2m ago", dot: "bg-purple-400" },
    { text: "New lead found: Harvest Moon Bistro", time: "15m ago", dot: "bg-cyan-400" },
    { text: "Meeting booked: FitZone Gym — 2pm Thu", time: "1h ago", dot: "bg-green-400" },
  ];
  return (
    <div className="h-16 bg-[#080B1F]/80 backdrop-blur-xl border-b border-purple-500/10 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-white/40">Dashboard</span>
        <ChevronRight className="w-3 h-3 text-white/20" />
        <span className="text-white/80 capitalize">{view.replace("-", " ")}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/8">
          <Search className="w-3.5 h-3.5 text-white/30" />
          <input placeholder="Search leads..." className="bg-transparent text-sm text-white/70 placeholder-white/30 outline-none w-32 font-[Inter]" />
        </div>
        <div className="relative">
          <button onClick={() => setNotifOpen(!notifOpen)} className="relative w-8 h-8 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Bell className="w-4 h-4 text-white/50" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-purple-500 text-white text-[9px] font-bold flex items-center justify-center">3</span>
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div initial={{ opacity: 0, y: 5, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: 0.95 }}
                className="absolute right-0 top-10 w-72 bg-[#0D1235] border border-purple-500/20 rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Notifications</span>
                  <button onClick={() => setNotifOpen(false)}><X className="w-3.5 h-3.5 text-white/40" /></button>
                </div>
                {notifications.map((n, i) => (
                  <div key={i} className="px-4 py-3 border-b border-white/5 flex items-start gap-3 hover:bg-white/5 transition-colors">
                    <div className={"w-2 h-2 rounded-full mt-1.5 shrink-0 " + n.dot} />
                    <div>
                      <p className="text-xs text-white/80">{n.text}</p>
                      <p className="text-xs text-white/40 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
          {getUserInitials(user?.name)}
        </div>
      </div>
    </div>
  );
}
