import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, CheckCircle, Trash2, Loader2, Plus } from "lucide-react";
import { cn, GlowButton, GlassCard } from "../../utils/helpers";
import { meetingsAPI } from "../../services/api";

const SLOT_TIMES = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30"];

const fmt12 = (t) => {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
};

const pad = (n) => String(n).padStart(2, "0");

const toDateStr = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

const MONTH_NAMES = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];

const DAY_LABELS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

export default function CalendarView() {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());   // 0-indexed
  const [selectedDay, setSelectedDay] = useState(null);

  const [meetings,  setMeetings]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [booking,   setBooking]   = useState(false);
  const [bookedSlot, setBookedSlot] = useState(null);
  const [error,     setError]     = useState(null);

  // New booking form
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [pendingSlot, setPendingSlot] = useState(null);

  // ── Fetch all meetings ──────────────────────────────────────────
  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await meetingsAPI.getMeetings();
      setMeetings(res.data.meetings || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMeetings(); }, []);

  // ── Calendar grid ───────────────────────────────────────────────
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
    setBookedSlot(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
    setBookedSlot(null);
  };

  // Days that have meetings
  const bookedDays = new Set(
    meetings
      .filter(m => {
        const [y, mo] = m.date.split("-").map(Number);
        return y === year && mo === month + 1 && m.status !== "cancelled";
      })
      .map(m => Number(m.date.split("-")[2]))
  );

  // Meetings on selected day
  const selectedDateStr = selectedDay ? toDateStr(year, month, selectedDay) : null;
  const dayMeetings = meetings.filter(m => m.date === selectedDateStr && m.status !== "cancelled");

  // Booked slots on selected day
  const bookedSlots = new Set(dayMeetings.map(m => m.time));

  // ── Book slot ───────────────────────────────────────────────────
  const handleSlotClick = (slot) => {
    if (bookedSlots.has(slot)) return; // already taken
    setPendingSlot(slot);
    setTitle("");
    setNotes("");
    setShowForm(true);
    setBookedSlot(null);
  };

  const handleBook = async () => {
    if (!title.trim()) { setError("Please add a meeting title."); return; }
    try {
      setBooking(true);
      setError(null);
      const res = await meetingsAPI.createMeeting({
        title: title.trim(),
        date:  selectedDateStr,
        time:  pendingSlot,
        notes: notes.trim(),
        duration: 30,
      });
      setMeetings(prev => [...prev, res.data.meeting]);
      setBookedSlot(pendingSlot);
      setShowForm(false);
      setTitle("");
      setNotes("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBooking(false);
    }
  };

  // ── Delete meeting ──────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await meetingsAPI.deleteMeeting(id);
      setMeetings(prev => prev.filter(m => m._id !== id));
      if (bookedSlot) setBookedSlot(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // ── Upcoming meetings (future, sorted) ─────────────────────────
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  const upcoming = meetings
    .filter(m => m.date >= todayStr && m.status !== "cancelled")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 8);

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-purple-500/50 transition-colors";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
          Calendar & Booking
        </h1>
        <p className="text-sm text-white/40 mt-0.5">
          Book and manage your meetings
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
          ⚠️ {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Calendar ─────────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <GlassCard className="p-5">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">
                {MONTH_NAMES[month]} {year}
              </h2>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <ChevronLeft className="w-4 h-4 text-white/50" />
                </button>
                <button onClick={nextMonth} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <ChevronRight className="w-4 h-4 text-white/50" />
                </button>
              </div>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAY_LABELS.map(d => (
                <div key={d} className="text-center text-xs text-white/30 py-1">{d}</div>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells before first day */}
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}

              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const hasBooking = bookedDays.has(day);
                const isSelected = selectedDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => { setSelectedDay(day); setBookedSlot(null); setShowForm(false); }}
                    className={cn(
                      "aspect-square rounded-xl text-sm flex items-center justify-center transition-all relative",
                      isSelected
                        ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]"
                        : isToday
                        ? "border border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                        : hasBooking
                        ? "bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25"
                        : "text-white/60 hover:bg-white/5"
                    )}
                  >
                    {day}
                    {hasBooking && !isSelected && (
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-green-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-4 text-xs text-white/30">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />Has meeting</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" />Selected</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border border-purple-500/50" />Today</span>
            </div>
          </GlassCard>
        </div>

        {/* ── Right Panel ──────────────────────────────────────── */}
        <div className="space-y-4">
          {selectedDay ? (
            <GlassCard className="p-5">
              <h3 className="font-semibold text-white mb-1">
                {MONTH_NAMES[month]} {selectedDay}, {year}
              </h3>
              <p className="text-xs text-white/40 mb-4">Click a slot to book</p>

              <div className="space-y-2">
                {SLOT_TIMES.map(slot => {
                  const taken   = bookedSlots.has(slot);
                  const meeting = dayMeetings.find(m => m.time === slot);
                  return (
                    <div key={slot}
                      onClick={() => !taken && handleSlotClick(slot)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl text-sm border transition-all",
                        taken
                          ? "bg-green-500/10 border-green-500/30 cursor-default"
                          : "bg-white/[0.03] border-white/8 text-white/70 hover:border-purple-500/30 hover:bg-purple-500/5 cursor-pointer"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">{fmt12(slot)}</div>
                          <div className="text-xs text-white/40 mt-0.5">
                            {taken ? meeting?.title : "Available — 30 min"}
                          </div>
                        </div>
                        {taken ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(meeting._id); }}
                              className="text-red-400/60 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <Plus className="w-4 h-4 text-white/20" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Booking form */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-3"
                  >
                    <p className="text-xs text-purple-300 font-semibold">
                      Booking {fmt12(pendingSlot)}
                    </p>
                    <div>
                      <label className="text-xs text-white/50 block mb-1">Meeting Title *</label>
                      <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g. Discovery Call with FitZone"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 block mb-1">Notes (optional)</label>
                      <input
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Any notes..."
                        className={inputClass}
                      />
                    </div>
                    <div className="flex gap-2">
                      <GlowButton onClick={handleBook} disabled={booking} className="flex-1 justify-center text-xs py-2">
                        {booking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        {booking ? "Booking…" : "Confirm"}
                      </GlowButton>
                      <GlowButton variant="secondary" onClick={() => setShowForm(false)} className="flex-1 justify-center text-xs py-2">
                        Cancel
                      </GlowButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success confirmation */}
              <AnimatePresence>
                {bookedSlot && !showForm && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-xs text-green-400 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    Booked! {MONTH_NAMES[month]} {selectedDay} @ {fmt12(bookedSlot)}
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          ) : (
            <GlassCard className="p-5">
              <p className="text-sm text-white/40 text-center py-8">
                Select a day to view & book slots
              </p>
            </GlassCard>
          )}

          {/* Upcoming meetings */}
          <GlassCard className="p-5">
            <h3 className="font-semibold text-white mb-3 text-sm">
              Upcoming Meetings ({upcoming.length})
            </h3>
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
              </div>
            ) : upcoming.length === 0 ? (
              <p className="text-xs text-white/30 text-center py-4">No upcoming meetings</p>
            ) : (
              <div className="space-y-1">
                {upcoming.map(m => {
                  const [y, mo, d] = m.date.split("-").map(Number);
                  const dateLabel = `${MONTH_NAMES[mo - 1].slice(0, 3)} ${d}`;
                  return (
                    <div key={m._id} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                      <div className={cn("w-2 h-2 rounded-full shrink-0",
                        m.status === "confirmed" ? "bg-green-400" : "bg-yellow-400")} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white font-medium truncate">{m.title}</div>
                        <div className="text-xs text-white/40 font-mono">{dateLabel} — {fmt12(m.time)}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={cn("text-xs px-2 py-0.5 rounded-full",
                          m.status === "confirmed"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-yellow-500/10 text-yellow-400")}>
                          {m.status}
                        </span>
                        <button
                          onClick={() => handleDelete(m._id)}
                          className="text-red-400/40 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
