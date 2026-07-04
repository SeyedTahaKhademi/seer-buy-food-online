/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Mail, Lock, User, Phone, X, Sparkles } from 'lucide-react';
import GarlicLogo from './GarlicLogo';

interface AuthModalProps {
  onClose: () => void;
  onAuthenticate: (userData: {
    name: string;
    email: string;
    phone: string;
    fitnessGoal: 'weightLoss' | 'muscleGain' | 'maintain';
  }) => void;
}

export default function AuthModal({ onClose, onAuthenticate }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState<'weightLoss' | 'muscleGain' | 'maintain'>('muscleGain');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (isLogin) {
      // Mock login - auto-creates an elegant session
      onAuthenticate({
        name: name || 'امیرحسین رضایی',
        email,
        phone: phone || '۰۹۱۲۹۸۷۶۵۴۳',
        fitnessGoal: 'muscleGain',
      });
    } else {
      // Mock signup with exact custom details
      onAuthenticate({
        name: name || 'ورزشکار جدید سیر',
        email,
        phone: phone || '۰۹۱۲۰۰۰۰۰۰۰',
        fitnessGoal,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs" id="auth-modal-overlay">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-stone-100 bg-white p-8 shadow-xl text-right"
        id="auth-modal-content"
        dir="rtl"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 rounded-full p-1.5 text-stone-400 hover:bg-stone-50 hover:text-stone-700 transition"
        >
          <X size={18} />
        </button>

        {/* Logo and Brand Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <GarlicLogo size={42} showText={false} />
          <h3 className="text-lg font-extrabold text-stone-900 mt-3">
            {isLogin ? 'ورود به پلتفرم هوشمند سیر' : 'عضویت در باشگاه تغذیه سیر'}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {isLogin ? 'برای دسترسی به رژیم ورزشی خود وارد شوید.' : 'مشخصات خود را وارد کنید تا برنامه آغاز شود.'}
          </p>
        </div>

        {/* Main Tab Switches */}
        <div className="grid grid-cols-2 gap-2 bg-stone-100 p-1.5 rounded-2xl mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`rounded-xl py-2 text-xs font-bold transition-all ${
              isLogin ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            ورود کاربران
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`rounded-xl py-2 text-xs font-bold transition-all ${
              !isLogin ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            ثبت‌نام ورزشکار جدید
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name (Sign Up only) */}
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">نام و نام خانوادگی:</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: امیرحسین عباسی"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-2.5 pr-10 text-xs focus:border-emerald-500 focus:bg-white focus:outline-hidden text-right"
                  required
                />
                <User size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-600">آدرس ایمیل:</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-2.5 pr-10 text-xs focus:border-emerald-500 focus:bg-white focus:outline-hidden text-left font-mono"
                required
              />
              <Mail size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            </div>
          </div>

          {/* Phone (Sign Up only) */}
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">شماره موبایل (جهت هماهنگی پیک):</label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-2.5 pr-10 text-xs focus:border-emerald-500 focus:bg-white focus:outline-hidden text-left font-mono"
                  required
                />
                <Phone size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              </div>
            </div>
          )}

          {/* Fitness Goal (Sign Up only) */}
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600 block mb-1">دوره و هدف تناسب اندام شما:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'weightLoss', label: 'کاهش چربی' },
                  { id: 'muscleGain', label: 'افزایش حجم' },
                  { id: 'maintain', label: 'سلامت عمومی' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFitnessGoal(item.id as any)}
                    className={`rounded-lg border text-[11px] py-1.5 font-bold transition ${
                      fitnessGoal === item.id
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Password */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-stone-600">رمز عبور:</label>
              {isLogin && (
                <button type="button" className="text-[10px] text-emerald-600 hover:underline">رمز عبور را فراموش کردم؟</button>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-2.5 pr-10 text-xs focus:border-emerald-500 focus:bg-white focus:outline-hidden text-left font-mono"
                required
              />
              <Lock size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700 shadow-sm shadow-emerald-500/10 text-xs"
          >
            {isLogin ? 'ورود به حساب کاربری' : 'ثبت نام و ایجاد برنامه رژیمی سیر'}
          </button>

        </form>

        {/* Simulated credentials hint */}
        <div className="mt-4 rounded-xl bg-stone-50 p-3 text-center border border-stone-100">
          <p className="text-[10px] text-stone-500">
            🔒 شبیه‌ساز امنیتی: می‌توانید از هر ایمیل و رمز دلخواهی استفاده کنید. دکمه بالا بلافاصله نشست شما را فعال خواهد کرد.
          </p>
        </div>

      </motion.div>
    </div>
  );
}
