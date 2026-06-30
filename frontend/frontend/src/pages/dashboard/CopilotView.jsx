
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, Send } from "lucide-react";
import { cn, GlowButton, GlassCard } from "../../utils/helpers";
import { CHAT_MESSAGES_INIT, AI_RESPONSES } from "../../data/constants";

export default function CopilotView() {
  const [messages, setMessages] = useState(CHAT_MESSAGES_INIT);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [responseIdx, setResponseIdx] = useState(0);
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);
  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { role: "ai", text: AI_RESPONSES[responseIdx % AI_RESPONSES.length] }]);
      setResponseIdx(ri => ri + 1);
    }, 1600);
  }, [input, responseIdx]);
  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>AI Sales Copilot</h1>
        <p className="text-sm text-white/40 mt-0.5">GPT-4 powered sales intelligence — always on, always ready</p>
      </div>
      <GlassCard className="flex-1 flex flex-col overflow-hidden p-0" glow>
        <div className="px-5 py-3 border-b border-purple-500/15 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: "blink 2s ease infinite" }} />
          <span className="text-sm font-semibold text-white">AISA Copilot</span>
          <span className="text-xs text-white/30 ml-auto font-mono">Close probability: 68%</span>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
              {msg.role === "ai" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center mr-2 shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line",
                msg.role === "ai"
                  ? "bg-purple-500/10 border border-purple-500/20 text-white/85"
                  : "bg-gradient-to-br from-purple-600 to-violet-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]"
              )}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {typing && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl px-4 py-3 flex gap-1">
                {[0, 0.2, 0.4].map((d, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400" style={{ animation: `blink 1s ease ${d}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="p-4 border-t border-purple-500/10">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Ask about leads, get reply drafts, predict close probability..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-purple-500/50 transition-colors"
            />
            <GlowButton onClick={handleSend} disabled={!input.trim() || typing}>
              <Send className="w-4 h-4" />
            </GlowButton>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {["Prioritize my leads", "Draft a follow-up", "Predict close %"].map(q => (
              <button key={q} onClick={() => { setInput(q); }} className="text-xs px-3 py-1 rounded-full border border-white/10 text-white/40 hover:text-white/70 hover:border-purple-500/30 transition-all">
                {q}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
