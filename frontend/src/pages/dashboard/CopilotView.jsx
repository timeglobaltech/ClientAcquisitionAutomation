
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, Send, Plus, MessageSquare, Trash2, Menu, X } from "lucide-react";
import { cn, GlowButton, GlassCard } from "../../utils/helpers";
import { CHAT_MESSAGES_INIT } from "../../data/constants";
import { aiAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";

// --- Frontend (localStorage) chat persistence helpers ---
const storageKey = (user) => (user ? `aisa_chats_${user.id || user._id}` : null);

const loadCachedChats = (user) => {
  const key = storageKey(user);
  if (!key) return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCachedChats = (user, chats) => {
  const key = storageKey(user);
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify(chats));
  } catch {
    // ignore quota / serialization errors
  }
};

export default function CopilotView() {
  const { user } = useAuth();
  // Hydrate instantly from localStorage so chats appear without waiting on the DB
  const [chats, setChats] = useState(() => loadCachedChats(user));
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  // Persist every chat change to the frontend (localStorage) as well as the DB
  useEffect(() => {
    if (user && chats.length > 0) {
      saveCachedChats(user, chats);
    }
  }, [user, chats]);

  const createNewChat = useCallback(async () => {
    const newChatData = {
      title: "New Chat",
      messages: [...CHAT_MESSAGES_INIT],
      createdAt: new Date()
    };
    
    try {
      const response = await aiAPI.createChat(newChatData);
      return response.data.chat;
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create new chat");
      return {
        id: Date.now().toString(),
        ...newChatData
      };
    }
  }, []);

  useEffect(() => {
    const loadChats = async () => {
      if (!user) return;

      // Show cached (frontend) chats instantly — no waiting on the network
      const cached = loadCachedChats(user);
      if (cached.length > 0) {
        setChats(cached);
        setCurrentChatId((prev) => prev || cached[0]._id || cached[0].id);
        setLoading(false);
      }

      try {
        // Database is the source of truth — reconcile once it responds
        const response = await aiAPI.getChats();
        let loadedChats = response.data.chats;

        if (loadedChats.length === 0) {
          const newChat = await createNewChat();
          loadedChats = [newChat];
        }

        setChats(loadedChats);
        setCurrentChatId((prev) => {
          const stillExists = loadedChats.some((c) => (c._id || c.id) === prev);
          return stillExists ? prev : loadedChats[0]._id || loadedChats[0].id;
        });
        saveCachedChats(user, loadedChats);
      } catch (error) {
        console.error("Error loading chats:", error);
        // If we already have cached chats, keep using them silently (offline-friendly)
        if (cached.length === 0) {
          toast.error("Failed to load chats");
          const fallbackChat = {
            id: Date.now().toString(),
            title: "New Chat",
            messages: [...CHAT_MESSAGES_INIT],
            createdAt: new Date()
          };
          setChats([fallbackChat]);
          setCurrentChatId(fallbackChat.id);
        }
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [user, createNewChat]);

  const currentChat = chats.find(c => (c._id || c.id) === currentChatId) || chats[0];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages, typing]);

  const saveChatToBackend = useCallback(async (chatToSave) => {
    if (!chatToSave._id) return;
    
    try {
      await aiAPI.updateChat(chatToSave._id, {
        title: chatToSave.title,
        messages: chatToSave.messages
      });
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || !currentChat) return;

    const userMsg = { role: "user", text: input };
    
    const newTitle = currentChat.title === "New Chat" 
      ? input.length > 30 ? input.slice(0, 30) + "..." : input 
      : currentChat.title;
    
    const updatedChat = {
      ...currentChat,
      title: newTitle,
      messages: [...currentChat.messages, userMsg]
    };
    
    setChats(prev => prev.map(c => {
      if ((c._id || c.id) === currentChatId) {
        return updatedChat;
      }
      return c;
    }));
    setInput("");
    setTyping(true);

    try {
      const response = await aiAPI.chatWithAI(updatedChat.messages);
      
      const aiMsg = { role: "ai", text: response.data.text };
      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, aiMsg]
      };
      
      setChats(prev => prev.map(c => {
        if ((c._id || c.id) === currentChatId) {
          return finalChat;
        }
        return c;
      }));
      
      await saveChatToBackend(finalChat);
      
    } catch (error) {
      console.error("AI Chat Error:", error);
      const errorMsg = { 
        role: "ai", 
        text: "Sorry, I couldn't connect to the AI service. Please check your backend connection and try again!" 
      };
      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, errorMsg]
      };
      setChats(prev => prev.map(c => {
        if ((c._id || c.id) === currentChatId) {
          return finalChat;
        }
        return c;
      }));
      await saveChatToBackend(finalChat);
    } finally {
      setTyping(false);
    }
  }, [input, currentChatId, currentChat, saveChatToBackend]);

  const handleNewChat = useCallback(async () => {
    const newChat = await createNewChat();
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat._id || newChat.id);
  }, [createNewChat]);

  const handleDeleteChat = useCallback(async (e, chatId) => {
    e.stopPropagation();
    
    try {
      const chatToDelete = chats.find(c => (c._id || c.id) === chatId);
      if (chatToDelete?._id) {
        await aiAPI.deleteChat(chatToDelete._id);
      }
      
      const filtered = chats.filter(c => (c._id || c.id) !== chatId);
      
      if (filtered.length === 0) {
        const newChat = await createNewChat();
        setChats([newChat]);
        setCurrentChatId(newChat._id || newChat.id);
      } else {
        setChats(filtered);
        if (currentChatId === chatId) {
          setCurrentChatId(filtered[0]._id || filtered[0].id);
        }
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat");
    }
  }, [chats, currentChatId, createNewChat]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-[#080B1F] border-r border-purple-500/20 flex flex-col h-full overflow-hidden"
          >
            <div className="p-4 border-b border-purple-500/20">
              <GlowButton 
                onClick={handleNewChat}
                className="w-full justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </GlowButton>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {chats.map(chat => (
                <div
                  key={chat._id || chat.id}
                  onClick={() => setCurrentChatId(chat._id || chat.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all group cursor-pointer",
                    (chat._id || chat.id) === currentChatId 
                      ? "bg-purple-500/20 text-purple-200 border border-purple-500/30" 
                      : "text-white/60 hover:bg-white/5 border border-transparent hover:border-white/10"
                  )}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-sm truncate">
                    {chat.title}
                  </span>
                  {chats.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(e, chat._id || chat.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:bg-red-500/20 px-2 py-1 rounded transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b border-purple-500/15 bg-[#080B1F]/50 backdrop-blur-sm flex items-center px-4 gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: "blink 2s ease infinite" }} />
            <h2 className="font-semibold text-white">
              AISA Copilot {user && `- ${user.name}`}
            </h2>
          </div>
        </div>
        <GlassCard className="flex-1 flex flex-col overflow-hidden p-0 border-0 bg-transparent rounded-none">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {currentChat?.messages.map((msg, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
              >
                {msg.role === "ai" && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-purple-500/20">
                    <Bot className="w-4.5 h-4.5 text-white" />
                  </div>
                )}
                <div className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line",
                  msg.role === "ai"
                    ? "bg-purple-500/10 border border-purple-500/20 text-white/85 rounded-tl-none"
                    : "bg-gradient-to-br from-purple-600 to-violet-600 text-white rounded-tr-none shadow-lg shadow-purple-500/20"
                )}>
                  {msg.text}
                </div>
                {msg.role === "user" && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-blue-500/20">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
            {typing && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
                  <Bot className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1.5">
                  {[0, 0.15, 0.3].map((d, i) => (
                    <motion.div 
                      key={i} 
                      className="w-2 h-2 rounded-full bg-purple-400" 
                      animate={{ y: [0, -6, 0] }} 
                      transition={{ duration: 1, repeat: Infinity, delay: d }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="p-4 border-t border-purple-500/10 bg-[#0A0E27]">
            <div className="max-w-4xl mx-auto flex gap-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about leads, get reply drafts, predict close probability..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition-all"
              />
              <GlowButton 
                onClick={handleSend} 
                disabled={!input.trim() || typing}
                className="px-5"
              >
                <Send className="w-4 h-4" />
              </GlowButton>
            </div>
            <div className="flex gap-2 mt-3 justify-center flex-wrap">
              {["Prioritize my leads", "Draft a follow-up", "Predict close %"].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-purple-500/30 hover:bg-purple-500/5 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
