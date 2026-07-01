
import { Bot, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { cn, getUserInitials } from "../../utils/helpers";
import { NAV_ITEMS } from "../../data/constants";
import { useAuth } from "../../contexts/AuthContext";

export default function Sidebar({ view, setView, collapsed, setCollapsed }) {
  const { logout, user } = useAuth();
  return (
    <div className={cn(
      "flex flex-col bg-[#080B1F] border-r border-purple-500/15 transition-all duration-300 h-screen sticky top-0",
      collapsed ? "w-16" : "w-56"
    )}>
      <div className={cn("flex items-center h-16 px-4 border-b border-purple-500/15", collapsed ? "justify-center" : "gap-2 justify-between")}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-[0_0_10px_rgba(124,58,237,0.5)]">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white text-sm" style={{ fontFamily: "Orbitron, sans-serif" }}>Client Acquistion Automation</span>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-white" />
          </div>
        )}
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} className="text-white/30 hover:text-white/70 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>
      {collapsed && (
        <button onClick={() => setCollapsed(false)} className="flex justify-center py-2 text-white/30 hover:text-white/70 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => setView(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150",
              collapsed ? "justify-center" : "",
              view === item.id
                ? "bg-purple-500/15 text-purple-300 border-r-2 border-purple-500"
                : "text-white/50 hover:text-white/80 hover:bg-white/5"
            )}
            title={collapsed ? item.label : undefined}>
            <item.icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && item.id === "copilot" && (
              <span className="ml-auto px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs">AI</span>
            )}
          </button>
        ))}
      </nav>
      <div className={cn("p-4 border-t border-purple-500/15", collapsed && "flex justify-center")}>
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
              {getUserInitials(user?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">{user?.name || "User"}</div>
              <div className="text-xs text-white/40 truncate">{user?.email || ""}</div>
            </div>
            <button onClick={logout} className="text-white/30 hover:text-white/60 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
            {getUserInitials(user?.name)}
          </div>
        )}
      </div>
    </div>
  );
}
