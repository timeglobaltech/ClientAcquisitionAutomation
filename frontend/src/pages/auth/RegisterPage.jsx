import { useState } from "react";
import { motion } from "motion/react";
import { Bot, ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react";
import { GlowButton, GlassCard } from "../../utils/helpers";
import { useAuth } from "../../contexts/AuthContext";

export default function RegisterPage({ onBack, onSwitchToLogin }) {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientError,  setClientError]  = useState("");
  const { register } = useAuth();

  // Client-side Gmail check before hitting backend
  const validateEmail = (val) => {
    if (!val) return "";
    if (!val.toLowerCase().endsWith("@gmail.com")) {
      return "Only Gmail addresses (@gmail.com) are allowed.";
    }
    return "";
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setClientError(validateEmail(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) { setClientError(err); return; }
    if (password.length < 6) {
      setClientError("Password must be at least 6 characters.");
      return;
    }
    setClientError("");
    setIsSubmitting(true);
    const result = await register({ name, email: email.toLowerCase().trim(), password });
    setIsSubmitting(false);
    if (result.success) onBack();
    // Error toast is shown by AuthContext via sonner
  };

  const isGmailOk = email.toLowerCase().endsWith("@gmail.com");

  return (
    <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        <GlassCard className="p-8" glow>
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.5)] mb-4">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>Create Account</h1>
            <p className="text-sm text-white/40 mt-2">Start your 7-day free trial</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="text-xs text-white/50 mb-2 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:border-purple-500/50 focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

            {/* Email — Gmail only */}
            <div>
              <label className="text-xs text-white/50 mb-2 block">
                Gmail Address
                <span className="ml-2 text-purple-400/70">(@gmail.com only)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none transition-colors ${
                  email && !isGmailOk
                    ? "border-red-500/60 focus:border-red-500/80"
                    : isGmailOk
                    ? "border-green-500/40 focus:border-green-500/60"
                    : "border-white/10 focus:border-purple-500/50"
                }`}
                placeholder="yourname@gmail.com"
              />
              {/* Inline hint */}
              {email && !isGmailOk && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  Only @gmail.com addresses are accepted
                </p>
              )}
              {isGmailOk && (
                <p className="mt-1.5 text-xs text-green-400">✓ Valid Gmail address</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-white/50 mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:border-purple-500/50 focus:outline-none transition-colors pr-10"
                  placeholder="Min 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Client error */}
            {clientError && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {clientError}
              </div>
            )}

            <GlowButton
              type="submit"
              disabled={isSubmitting || (email.length > 0 && !isGmailOk)}
              className="w-full justify-center mt-2"
            >
              {isSubmitting ? "Creating account…" : "Create Account"}
            </GlowButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/40">
              Already have an account?{" "}
              <button onClick={onSwitchToLogin} className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign In
              </button>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
