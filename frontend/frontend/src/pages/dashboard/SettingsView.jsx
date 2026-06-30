
import { User, Settings as SettingsIcon, Shield, Bell, CreditCard } from "lucide-react";
import { GlassCard, GlowButton } from "../../utils/helpers";

export default function SettingsView() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>Settings</h1>
        <p className="text-sm text-white/40 mt-0.5">Manage your account and preferences</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard className="p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-purple-400" /> Profile
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/50 block mb-1">Name</label>
              <input defaultValue="James Draper" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-purple-500/50" />
            </div>
            <div>
              <label className="text-xs text-white/50 block mb-1">Email</label>
              <input defaultValue="james@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-purple-500/50" />
            </div>
            <GlowButton className="w-full justify-center">Save Changes</GlowButton>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" /> Security
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/50 block mb-1">Current Password</label>
              <input type="password" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-purple-500/50" />
            </div>
            <div>
              <label className="text-xs text-white/50 block mb-1">New Password</label>
              <input type="password" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-purple-500/50" />
            </div>
            <GlowButton variant="cyan" className="w-full justify-center">Update Password</GlowButton>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-orange-400" /> Notifications
          </h3>
          <div className="space-y-3">
            {["Email Notifications", "SMS Alerts", "Push Notifications"].map((item, i) => (
              <label key={i} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-white/70">{item}</span>
                <div className="w-10 h-5 bg-purple-500/30 rounded-full relative">
                  <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-purple-500 rounded-full" />
                </div>
              </label>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-green-400" /> Billing
          </h3>
          <div className="space-y-4">
            <div className="text-sm text-white/70">Current Plan: <span className="text-purple-400 font-semibold">Growth</span></div>
            <GlowButton variant="secondary" className="w-full justify-center">Manage Subscription</GlowButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
