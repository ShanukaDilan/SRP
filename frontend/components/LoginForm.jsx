import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Server, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { login } from '../src/lib/api';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  // Extra state
  const [error, setError] = useState('');

  // Gemini State
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [systemStatus, setSystemStatus] = useState('');
  const [isStatusLoading, setIsStatusLoading] = useState(false);

  // Helper for Gemini API calls (optional)
  const callGemini = async (prompt) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""; // optional
      if (!apiKey) {
        // Fallback message if no key configured
        return "Session established. Clearance: TEMP-ALPHA. Welcome.";
      }
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}` , {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      }
      return "Session established. Clearance: BETA. Welcome.";
    } catch (error) {
      console.error('Gemini API Error:', error);
      return "System communication error. Please retry.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      // Authenticate against backend
      await login({ email, password });
      // Small interstitial delay (configurable)
      const delayMs = parseInt(process.env.NEXT_PUBLIC_LOGIN_DELAY_MS || '400', 10);
      if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
      // Optional welcome message via Gemini
      const username = email.split('@')[0] || 'operator';
      const prompt = `Generate a short (max 2 sentences), highly official and slightly bureaucratic welcome message for a user named "${username}" accessing the "Service Routing Portal". Mention their newly assigned (fictional) clearance level. Tone: Professional, secure, automated.`;
      const message = await callGemini(prompt);
      setWelcomeMessage(message);
    } catch (err) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchSystemStatus = async () => {
    setIsStatusLoading(true);
    const prompt = "Generate a short, realistic-sounding but fictional 'System Status Report' for a high-tech routing portal. Use mild technobabble. It should sound stable but complex. Max 1 sentence.";
    const status = await callGemini(prompt);
    setSystemStatus(status);
    setIsStatusLoading(false);
  };

  // Success Screen
  if (welcomeMessage) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 relative selection:bg-blue-500/30 font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        <div className="relative z-10 w-full max-w-[450px] px-6">
          <div className="relative px-8 py-10 bg-slate-900/60 backdrop-blur-md border border-blue-500/20 rounded-2xl shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/30">
              <ShieldCheck className="text-blue-400 w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-xl font-semibold text-blue-100 mb-2 tracking-tight">Authentication Successful</h2>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent my-6"></div>
            <p className="text-slate-300 leading-relaxed font-mono text-sm">{">"} {welcomeMessage}</p>
            <button onClick={() => router.push('/dashboard')} className="mt-8 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-blue-100 text-sm rounded-md transition-colors border border-slate-700">
              Access Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 relative selection:bg-blue-500/30 font-sans">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-[400px] px-4">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-500/10 to-slate-800/30 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>

          <div className="relative px-8 py-10 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Server className="text-blue-400 w-6 h-6" />
                </div>
                <h1 className="text-lg font-semibold text-slate-100 tracking-wide">Service Routing Portal</h1>
              </div>
              <p className="text-slate-400 text-sm">Please enter your authorized credentials to continue to the secure dashboard.</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 text-sm text-red-400 bg-red-900/20 border border-red-900/40 rounded p-2">{error}</div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 uppercase tracking-wider ml-1">System ID / Email</label>
                <div className={`relative flex items-center group transition-all duration-300 ${focusedInput === 'email' ? 'ring-1 ring-blue-500/50' : ''} bg-slate-950/50 rounded-lg border border-slate-800 overflow-hidden`}>
                  <div className="pl-3 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    className="w-full bg-transparent text-slate-100 py-3 px-3 focus:outline-none placeholder-slate-600 text-sm font-mono"
                    placeholder="user@domain.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-slate-300 uppercase tracking-wider ml-1 flex-1">Secure Key phrase</label>
                  <a href="#" className="text-xs text-blue-500 hover:text-blue-400 transition-colors">Forgot Key?</a>
                </div>
                <div className={`relative flex items-center group transition-all duration-300 ${focusedInput === 'password' ? 'ring-1 ring-blue-500/50' : ''} bg-slate-950/50 rounded-lg border border-slate-800 overflow-hidden`}>
                  <div className="pl-3 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    className="w-full bg-transparent text-slate-100 py-3 px-3 focus:outline-none placeholder-slate-600 text-sm font-mono"
                    placeholder="••••••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-3 text-slate-600 hover:text-slate-400 transition-colors focus:outline-none">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-3 font-medium text-sm transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-900/20 flex items-center justify-center gap-2">
                {isLoading ? (<><Sparkles className="animate-spin h-4 w-4" /><span>Authenticating...</span></>) : (<><span>Initialize Session</span><ArrowRight className="w-4 h-4" /></>)}
              </button>
            </form>

            {/* Footer & System Status */}
            <div className="mt-8 pt-6 border-t border-slate-800/50 flex flex-col space-y-4">
              {systemStatus && (
                <div className="w-full p-3 bg-slate-950 rounded border border-blue-900/30 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Live Status</span>
                  </div>
                  <p className="text-blue-300/90 text-xs font-mono leading-tight">{">"} {systemStatus}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-slate-700 text-blue-600 bg-slate-950 focus:ring-0 focus:ring-offset-0 w-4 h-4" />
                  <span className="text-slate-500 text-xs group-hover:text-slate-400 transition-colors">Remember This Device</span>
                </label>

                <button onClick={handleFetchSystemStatus} disabled={isStatusLoading} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-400 transition-colors disabled:opacity-50" title="Check System Status">
                  {isStatusLoading ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">System Check</span>
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 text-slate-600 text-xs">&copy; {new Date().getFullYear()} Service Routing Portal. Authorized personnel only.</div>
        </div>
      </div>
    </div>
  );
}
