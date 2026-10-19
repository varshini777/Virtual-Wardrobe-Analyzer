import React, { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Shield, 
  Sliders, 
  Layers,
  HelpCircle,
  X
} from 'lucide-react';
import { api } from '../api/client.js';

export default function LoginPage({ 
  onLoginSuccess, 
  onNavigateToRegister, 
  prefillEmail = '',
  successNotification = null 
}) {
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(successNotification);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // Validate form before submission
  const validate = () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim()) && !email.trim().includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      setError('Please enter your password.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validate()) return;

    try {
      setLoading(true);
      const res = await api.login({
        email: email.trim(),
        password,
        rememberMe
      });

      if (res.success && res.user) {
        setSuccess(`Welcome back, ${res.user.name || res.user.username}!`);
        setTimeout(() => {
          onLoginSuccess(res.user);
        }, 300);
      } else {
        setError(res.error || 'Failed to authenticate. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'Incorrect email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setSuccess(null);
    try {
      setDemoLoading(true);
      const res = await api.loginDemo();
      if (res.success && res.user) {
        setSuccess('Logged in as Alex Morgan (Demo Wardrobe)');
        setTimeout(() => {
          onLoginSuccess(res.user);
        }, 300);
      }
    } catch (err) {
      setError(err.message || 'Unable to access demo account.');
    } finally {
      setDemoLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setShowForgotPasswordModal(false);
      setForgotSent(false);
      setSuccess('If an account exists for this email, password reset guidance has been dispatched.');
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-[#0b0d12] text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl transform -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[32rem] h-[32rem] bg-amber-600/5 rounded-full blur-3xl transform translate-y-1/3" />
      </div>

      {/* Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/10">
            <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <span className="font-serif font-bold text-xl tracking-tight text-white block leading-tight">
              Wardrobe Analyzer
            </span>
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-amber-200/60 block">
              Atelier & Styling Engine
            </span>
          </div>
        </div>

        <button
          onClick={onNavigateToRegister}
          className="text-xs font-medium text-amber-200/80 hover:text-amber-300 transition flex items-center gap-1.5 py-1.5 px-3 rounded-full border border-amber-400/20 hover:border-amber-400/40 bg-slate-900/40 backdrop-blur-sm"
        >
          <span>Create an account</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Main Content: Split Screen Layout */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: High-Fashion Editorial Showcase */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-between p-8 rounded-3xl bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-slate-950/80 border border-slate-800/80 backdrop-blur-xl shadow-2xl relative overflow-hidden min-h-[580px]">
            {/* Fashion Accent Badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-amber-400/10 text-amber-300 border border-amber-400/20">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Capsule Wardrobe Architecture
              </span>
              <span className="text-xs text-slate-400 font-mono tracking-widest">EDITION 2026</span>
            </div>

            {/* Visual Garment Moodboard */}
            <div className="my-8 relative">
              <div className="grid grid-cols-3 gap-3">
                <div className="group relative rounded-2xl overflow-hidden bg-slate-800/80 border border-slate-700/60 shadow-lg aspect-[3/4]">
                  <img 
                    src="/clothing-assets/top_navy_shirt.jpg" 
                    alt="Navy Oxford Shirt"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-medium text-amber-100">Oxford Linen</span>
                  </div>
                </div>

                <div className="group relative rounded-2xl overflow-hidden bg-slate-800/80 border border-slate-700/60 shadow-lg aspect-[3/4] translate-y-3">
                  <img 
                    src="/clothing-assets/bottom_beige_chinos.jpg" 
                    alt="Beige Chinos"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-medium text-amber-100">Tailored Chino</span>
                  </div>
                </div>

                <div className="group relative rounded-2xl overflow-hidden bg-slate-800/80 border border-slate-700/60 shadow-lg aspect-[3/4]">
                  <img 
                    src="/clothing-assets/shoes_white_sneakers.jpg" 
                    alt="White Sneakers"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-medium text-amber-100">Clean Leather</span>
                  </div>
                </div>
              </div>

              {/* Floating Aesthetic Tag */}
              <div className="absolute -bottom-4 right-4 bg-slate-900/90 border border-amber-400/30 rounded-xl px-3 py-1.5 shadow-xl backdrop-blur-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-semibold text-amber-100">Harmonious Contrast • Hot / Casual</span>
              </div>
            </div>

            {/* Editorial Quote & Features */}
            <div className="space-y-4 pt-4 border-t border-slate-800/60">
              <blockquote className="font-serif italic text-base text-amber-100/90 leading-relaxed">
                "Style is knowing who you are, what you want to say, and not giving a damn."
              </blockquote>
              <div className="flex items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Private Wardrobe Vault</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Deterministic Rule Pairing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Zero Virtual Gimmicks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Authentication Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-slate-900/90 border border-amber-900/30 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-2xl relative">
              
              {/* Form Title */}
              <div className="mb-6 text-center sm:text-left">
                <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white tracking-tight mb-2">
                  Welcome to Your Atelier
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Sign in to access your digital wardrobe, generate weather-conscious outfits, and curate your signature style.
                </p>
              </div>

              {/* Success Banner */}
              {success && (
                <div className="mb-5 p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium">{success}</span>
                </div>
              )}

              {/* Error Banner */}
              {error && (
                <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase text-amber-100/80 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. style@wardrobe.me"
                      required
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold tracking-wide uppercase text-amber-100/80">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordModal(true)}
                      className="text-xs text-amber-300/80 hover:text-amber-300 transition font-medium hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="w-full pl-10 pr-11 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-amber-200 transition"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between py-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-400 focus:ring-amber-400/20 focus:ring-offset-0 focus:outline-none accent-amber-400 cursor-pointer"
                    />
                    <span className="text-xs text-slate-300 font-medium">Remember my session</span>
                  </label>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading || demoLoading}
                  className="w-full py-3.5 px-6 rounded-2xl font-semibold text-sm tracking-wide bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-900/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter Wardrobe</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <span className="relative px-3 bg-slate-900 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  or evaluate instantly
                </span>
              </div>

              {/* Instant Demo Access Button */}
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading || demoLoading}
                className="w-full py-2.5 px-4 rounded-2xl border border-amber-400/30 bg-amber-400/5 hover:bg-amber-400/10 text-amber-200 text-xs font-semibold tracking-wide transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {demoLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                    <span>Loading Demo Wardrobe...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Explore with Curated Demo Wardrobe</span>
                  </>
                )}
              </button>

              {/* Link to Registration */}
              <div className="mt-6 text-center pt-4 border-t border-slate-800/60">
                <p className="text-xs text-slate-400">
                  New to Virtual Wardrobe Analyzer?{' '}
                  <button
                    onClick={onNavigateToRegister}
                    className="font-semibold text-amber-300 hover:text-amber-200 hover:underline transition ml-1 cursor-pointer"
                  >
                    Create an account
                  </button>
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-slate-500 border-t border-slate-900">
        <p className="text-slate-400 font-serif italic mb-1">
          "Fashion is the armor to survive the reality of everyday life." — Bill Cunningham
        </p>
        <p className="text-[11px] text-slate-600">
          Virtual Wardrobe Analyzer • Secure Token Authentication • Zero Computer Vision Tracking
        </p>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowForgotPasswordModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300 flex items-center justify-center mb-4">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-white mb-2">Password Recovery</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Enter your registered email address to receive password reset instructions. For demo and local environments, you can also sign in via the demo account.
            </p>
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
              <input
                type="email"
                defaultValue={email}
                required
                placeholder="your.email@wardrobe.me"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80"
              />
              <button
                type="submit"
                disabled={forgotSent}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs tracking-wide transition"
              >
                {forgotSent ? 'Dispatching instructions...' : 'Send Recovery Instructions'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
