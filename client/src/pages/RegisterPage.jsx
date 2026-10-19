import React, { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Check, 
  Layers, 
  Palette, 
  Compass 
} from 'lucide-react';
import { api } from '../api/client.js';

export default function RegisterPage({ 
  onRegisterSuccess, 
  onNavigateToLogin 
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [seedSample, setSeedSample] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form validation before hitting backend
  const validate = () => {
    if (!name.trim()) {
      setError('Please enter your full name.');
      return false;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please provide a valid email address (e.g., name@domain.com).');
      return false;
    }
    if (!password) {
      setError('Please enter a secure password.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both entries.');
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
      const res = await api.register({
        email: email.trim(),
        name: name.trim(),
        password,
        seedSample,
        autoLogin: true
      });

      if (res.success && res.user) {
        setSuccess(`Welcome to Virtual Wardrobe, ${res.user.name || res.user.username}! Setting up your atelier...`);
        setTimeout(() => {
          onRegisterSuccess(res.user);
        }, 800);
      } else {
        setError(res.error || 'Registration could not be completed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Account registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  // Password match indicator
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordTooShort = password.length > 0 && password.length < 6;

  return (
    <div className="min-h-screen bg-[#0b0d12] text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl transform -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/4 w-[32rem] h-[32rem] bg-amber-600/5 rounded-full blur-3xl transform translate-y-1/3" />
      </div>

      {/* Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div 
          onClick={onNavigateToLogin}
          className="flex items-center gap-3 group cursor-pointer"
        >
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
          onClick={onNavigateToLogin}
          className="text-xs font-medium text-amber-200/80 hover:text-amber-300 transition flex items-center gap-1.5 py-1.5 px-3 rounded-full border border-amber-400/20 hover:border-amber-400/40 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
        >
          <span>Already have an account? Sign in</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Main Content: Split Screen Layout */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: High-Fashion Visual Editorial */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-between p-8 rounded-3xl bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-slate-950/80 border border-slate-800/80 backdrop-blur-xl shadow-2xl relative overflow-hidden min-h-[620px]">
            {/* Top Badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-amber-400/10 text-amber-300 border border-amber-400/20">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Personal Digital Wardrobe
              </span>
              <span className="text-xs text-slate-400 font-mono tracking-widest">PRIVATE VAULT</span>
            </div>

            {/* Visual Garment Collage */}
            <div className="my-8 relative">
              <div className="grid grid-cols-3 gap-3">
                <div className="group relative rounded-2xl overflow-hidden bg-slate-800/80 border border-slate-700/60 shadow-lg aspect-[3/4]">
                  <img 
                    src="/clothing-assets/top_grey_sweater.jpg" 
                    alt="Grey Cashmere Sweater"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-medium text-amber-100">Cashmere Knit</span>
                  </div>
                </div>

                <div className="group relative rounded-2xl overflow-hidden bg-slate-800/80 border border-slate-700/60 shadow-lg aspect-[3/4] translate-y-3">
                  <img 
                    src="/clothing-assets/bottom_grey_trousers.jpg" 
                    alt="Charcoal Dress Trousers"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-medium text-amber-100">Wool Trousers</span>
                  </div>
                </div>

                <div className="group relative rounded-2xl overflow-hidden bg-slate-800/80 border border-slate-700/60 shadow-lg aspect-[3/4]">
                  <img 
                    src="/clothing-assets/shoes_brown_loafers.jpg" 
                    alt="Brown Loafers"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-medium text-amber-100">Cognac Leather</span>
                  </div>
                </div>
              </div>

              {/* Floating Aesthetic Tag */}
              <div className="absolute -bottom-4 left-4 bg-slate-900/90 border border-amber-400/30 rounded-xl px-3 py-1.5 shadow-xl backdrop-blur-md flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[11px] font-semibold text-amber-100">Cold Weather • Work & Smart Casual</span>
              </div>
            </div>

            {/* Editorial Quote & Benefits */}
            <div className="space-y-4 pt-4 border-t border-slate-800/60">
              <blockquote className="font-serif italic text-base text-amber-100/90 leading-relaxed">
                "Buy less, choose well, make it last. Quality, not quantity."
              </blockquote>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-300">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Realistic Catalog Assets</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-300">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Weather-Specific Footwear</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-300">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Zero Computer Vision</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-300">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Isolated Data Privacy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Form Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-slate-900/90 border border-amber-900/30 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-2xl relative">
              
              {/* Form Title */}
              <div className="mb-6 text-center sm:text-left">
                <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white tracking-tight mb-2">
                  Create Your Wardrobe
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Join Virtual Wardrobe Analyzer to build your private closet, track clothing pieces, and generate intentional outfits.
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

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name Field */}
                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase text-amber-100/80 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      required
                      autoComplete="name"
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                  </div>
                </div>

                {/* Email Address Field */}
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
                      placeholder="e.g. elena@couture.com"
                      required
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase text-amber-100/80 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      autoComplete="new-password"
                      className={`w-full pl-10 pr-11 py-3 bg-slate-950/80 border rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                        passwordTooShort
                          ? 'border-amber-500/60 focus:ring-amber-500/20'
                          : 'border-slate-800 focus:border-amber-400/80 focus:ring-amber-400/20'
                      }`}
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
                  {passwordTooShort && (
                    <p className="mt-1 text-[11px] text-amber-300/80">Must be at least 6 characters</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold tracking-wide uppercase text-amber-100/80">
                      Confirm Password
                    </label>
                    {passwordsMatch && (
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                        <Check className="w-3 h-3" /> Passwords match
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      required
                      autoComplete="new-password"
                      className={`w-full pl-10 pr-11 py-3 bg-slate-950/80 border rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                        confirmPassword.length > 0 && !passwordsMatch
                          ? 'border-rose-500/60 focus:ring-rose-500/20'
                          : 'border-slate-800 focus:border-amber-400/80 focus:ring-amber-400/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-amber-200 transition"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Optional Seed Sample Wardrobe Checkbox */}
                <div className="py-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={seedSample}
                      onChange={(e) => setSeedSample(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-400 focus:ring-amber-400/20 focus:ring-offset-0 focus:outline-none accent-amber-400 cursor-pointer"
                    />
                    <span className="text-xs text-slate-300 font-medium">
                      Pre-populate with starter capsule wardrobe (16 catalog pieces)
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl font-semibold text-sm tracking-wide bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-900/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Creating Atelier Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Link to Login */}
              <div className="mt-6 text-center pt-4 border-t border-slate-800/60">
                <p className="text-xs text-slate-400">
                  Already registered?{' '}
                  <button
                    onClick={onNavigateToLogin}
                    className="font-semibold text-amber-300 hover:text-amber-200 hover:underline transition ml-1 cursor-pointer"
                  >
                    Sign in to your account
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
          "Elegance is refusal." — Diana Vreeland
        </p>
        <p className="text-[11px] text-slate-600">
          Virtual Wardrobe Analyzer • Secure Signed Token Authentication • Private User Isolation
        </p>
      </footer>
    </div>
  );
}
