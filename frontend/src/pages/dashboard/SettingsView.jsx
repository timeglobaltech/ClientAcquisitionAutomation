import { useState } from "react";
import { User, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { GlassCard, GlowButton } from "../../utils/helpers";
import { useAuth } from "../../contexts/AuthContext";
import { authAPI } from "../../services/api";

export default function SettingsView() {
  const { user, updateUser } = useAuth();

  // ── Profile form ────────────────────────────────────────────────
  const [name,  setName]  = useState(user?.name  || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null); // { type: 'success'|'error', text }

  const handleSaveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      setProfileMsg({ type: "error", text: "Name and email are required." });
      return;
    }
    try {
      setProfileLoading(true);
      setProfileMsg(null);
      const res = await authAPI.updateProfile({ name: name.trim(), email: email.trim() });
      updateUser(res.data.user); // update sidebar name instantly
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.message || "Failed to update profile." });
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Password form ────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState(null);

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassMsg({ type: "error", text: "All password fields are required." });
      return;
    }
    if (newPassword.length < 6) {
      setPassMsg({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    try {
      setPassLoading(true);
      setPassMsg(null);
      await authAPI.updatePassword({ currentPassword, newPassword });
      setPassMsg({ type: "success", text: "Password updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPassMsg({ type: "error", text: err.message || "Failed to update password." });
    } finally {
      setPassLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-purple-500/50 transition-colors";

  const Msg = ({ msg }) => {
    if (!msg) return null;
    return (
      <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${
        msg.type === "success"
          ? "bg-green-500/10 border-green-500/30 text-green-400"
          : "bg-red-500/10 border-red-500/30 text-red-400"
      }`}>
        {msg.type === "success"
          ? <CheckCircle className="w-3.5 h-3.5 shrink-0" />
          : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
        {msg.text}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>Settings</h1>
        <p className="text-sm text-white/40 mt-0.5">Manage your account details</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* ── Profile ─────────────────────────────────────────────── */}
        <GlassCard className="p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-purple-400" /> Profile
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/50 block mb-1">Full Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-white/50 block mb-1">Email</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                type="email"
                className={inputClass}
              />
            </div>
            <Msg msg={profileMsg} />
            <GlowButton
              className="w-full justify-center"
              onClick={handleSaveProfile}
              disabled={profileLoading}
            >
              {profileLoading ? "Saving…" : "Save Changes"}
            </GlowButton>
          </div>
        </GlassCard>

        {/* ── Password ─────────────────────────────────────────────── */}
        <GlassCard className="p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" /> Security
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/50 block mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-white/50 block mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-white/50 block mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className={inputClass}
              />
            </div>
            <Msg msg={passMsg} />
            <GlowButton
              variant="cyan"
              className="w-full justify-center"
              onClick={handleUpdatePassword}
              disabled={passLoading}
            >
              {passLoading ? "Updating…" : "Update Password"}
            </GlowButton>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
