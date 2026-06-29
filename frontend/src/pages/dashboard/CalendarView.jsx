
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { cn, GlowButton, GlassCard } from "../../utils/helpers";

export default function CalendarView() {
  const [selectedDay, setSelectedDay] = useState(null);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const booked = [4, 7, 11, 14, 15, 18, 22, 25, 28];
  const slots = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"];
  const [bookedSlot, setBookedSlot] = useState(null);
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>Calendar & Booking</h1>
        <p className="text-sm text-white/40 mt-0.5">AI auto-books meetings into your available slots</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">June 2024</h2>
              <div className="flex gap-2">
                <button className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"><ChevronLeft className="w-4 h-4 text-white/50" /></button>
                <button className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"><ChevronRight className="w-4 h-4 text-white/50" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                <div key={d} className="text-center text-xs text-white/30 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map(day => (
                <button key={day} onClick={() => { setSelectedDay(day); setBookedSlot(null); }}
                  className={cn(
                    "aspect-square rounded-xl text-sm flex items-center justify-center transition-all relative",
                    selectedDay === day ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]"
                      : booked.includes(day) ? "bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25"
                      : "text-white/60 hover:bg-white/5"
                  )}>
                  {day}
                  {booked.includes(day) && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-green-400" />}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
        <div className="space-y-4">
          {selectedDay ? (
            <GlassCard className="p-5">
              <h3 className="font-semibold text-white mb-1">June {selectedDay}</h3>
              <p className="text-xs text-white/40 mb-4">Select a time slot</p>
              <div className="space-y-2">
                {slots.map(slot => (
                  <button key={slot} onClick={() => setBookedSlot(slot)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl text-sm border transition-all",
                      bookedSlot === slot
                        ? "bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-[0_0_10px_rgba(124,58,237,0.2)]"
                        : "bg-white/[0.03] border-white/8 text-white/70 hover:border-purple-500/30 hover:bg-purple-500/5"
                    )}>
                    <div className="font-semibold">{slot}</div>
                    <div className="text-xs text-white/40 mt-0.5">30-min Discovery Call</div>
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {bookedSlot && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-xs text-green-400">
                    <CheckCircle className="w-4 h-4 inline mr-1.5" />
                    Booked! June {selectedDay} @ {bookedSlot}. Confirmation sent.
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          ) : (
            <GlassCard className="p-5">
              <p className="text-sm text-white/40 text-center py-8">Select a day to see available slots</p>
            </GlassCard>
          )}
          <GlassCard className="p-5">
            <h3 className="font-semibold text-white mb-3 text-sm">Upcoming Meetings</h3>
            {[
              { name: "FitZone Gym", time: "Jun 4 — 10:30 AM", status: "confirmed" },
              { name: "Marco's Italian", time: "Jun 7 — 2:00 PM", status: "confirmed" },
              { name: "Radiance Spa", time: "Jun 11 — 1:00 PM", status: "pending" },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium truncate">{m.name}</div>
                  <div className="text-xs text-white/40 font-mono">{m.time}</div>
                </div>
                <span className={cn("text-xs px-2 py-0.5 rounded-full",
                  m.status === "confirmed" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400")}>
                  {m.status}
                </span>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
