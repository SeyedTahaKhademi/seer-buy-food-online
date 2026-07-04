/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ChefHat, Truck, PhoneCall, LogIn, LogOut, Wallet, 
  Dna, Flame, ShieldAlert, ArrowRight, Star, Clock, Heart, ClipboardCheck,
  Dumbbell, Award, Apple, Lock, Phone, MapPin, Mail, RefreshCw, BarChart3, Package
} from 'lucide-react';

import GarlicLogo from './components/GarlicLogo';
import MealPlanner from './components/MealPlanner';
import UserDashboard from './components/UserDashboard';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import BlogSection from './components/BlogSection';

// Premium Generated Images for 3D Athlete Food Showcase
const athleteDietMeal = '/src/assets/images/athlete_diet_meal_1783159463298.jpg';
const grilledChickenBowl = '/src/assets/images/grilled_chicken_bowl_1783159475551.jpg';

import { secureStorage } from './lib/security';
import { Meal, Order, CRMTicket, User, OrderStatus, StaffMember } from './types';
import { BASELINE_MEALS, SUBSCRIPTION_PLANS, MOCK_CRM_TICKETS } from './data';

export default function App() {
  // Navigation tabs: 'home' | 'planner' | 'blog' | 'dashboard' | 'admin'
  const [activeTab, setActiveTab] = useState<'home' | 'planner' | 'blog' | 'dashboard' | 'admin'>('home');

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Current active logged in staff member
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);

  // Core Global States (Enables cross-tab data syncing)
  const [meals, setMeals] = useState<Meal[]>(BASELINE_MEALS);
  const [tickets, setTickets] = useState<CRMTicket[]>(MOCK_CRM_TICKETS);
  
  // Pre-login default athlete to let users immediately see the dashboard
  const [user, setUser] = useState<User | null>({
    id: 'user_athlete_1',
    name: 'علیرضا راد',
    email: 'alireza.rad@fit.ir',
    phone: '۰۹۱۲۹۸۷۶۵۴۳',
    fitnessGoal: 'muscleGain',
    mealsPerWeek: 8,
    activePlanId: 'plan_silver',
    registeredDate: '۱۴۰۵/۰۲/۱۵',
    walletBalance: 450000 // Tomans
  });

  // Pre-populate scheduled delivery orders for the active user
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord_101',
      userId: 'user_athlete_1',
      userName: 'علیرضا راد',
      mealId: 'm1',
      mealName: 'فیله مرغ گریل با برنج قهوه‌ای و کلم بروکلی',
      date: '۱۴۰۵/۰۴/۱۴',
      timeSlot: 'lunch',
      status: 'preparing', // Ready to be advanced by Admin
      address: 'تهران، باشگاه ورزشی اکسیژن، جردن',
      phone: '۰۹۱۲۹۸۷۶۵۴۳'
    },
    {
      id: 'ord_102',
      userId: 'user_athlete_1',
      userName: 'علیرضا راد',
      mealId: 'm2',
      mealName: 'سالمون تنوری با کینوا و کدو سبز',
      date: '۱۴۰۵/۰۴/۱۵',
      timeSlot: 'dinner',
      status: 'pending',
      address: 'تهران، باشگاه ورزشی اکسیژن، جردن',
      phone: '۰۹۱۲۹۸۷۶۵۴۳'
    }
  ]);

  // Sync state to secure encrypted storage for persistence
  useEffect(() => {
    const savedMeals = secureStorage.getItem<Meal[]>('seer_meals');
    const savedTickets = secureStorage.getItem<CRMTicket[]>('seer_tickets');
    const savedOrders = secureStorage.getItem<Order[]>('seer_orders');
    const savedUser = secureStorage.getItem<User>('seer_user');
    const savedCurrentStaff = secureStorage.getItem<StaffMember>('seer_current_staff');

    if (savedMeals) setMeals(savedMeals);
    if (savedTickets) setTickets(savedTickets);
    if (savedOrders) setOrders(savedOrders);
    if (savedUser) setUser(savedUser);
    if (savedCurrentStaff) setCurrentStaff(savedCurrentStaff);
  }, []);

  const saveToStorage = (key: string, data: any) => {
    secureStorage.setItem(key, data);
  };

  // 1. Auth Handlers
  const handleAuthenticate = (userData: {
    name: string;
    email: string;
    phone: string;
    fitnessGoal: 'weightLoss' | 'muscleGain' | 'maintain';
  }) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      fitnessGoal: userData.fitnessGoal,
      mealsPerWeek: 0,
      activePlanId: null,
      registeredDate: '۱۴۰۵/۰۴/۱۴',
      walletBalance: 0
    };
    setUser(newUser);
    saveToStorage('seer_user', newUser);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    secureStorage.removeItem('seer_user');
    setActiveTab('home');
  };

  // Staff Login / Logout Handlers
  const handleStaffLogin = (staff: StaffMember) => {
    setCurrentStaff(staff);
    secureStorage.setItem('seer_current_staff', staff);
  };

  const handleStaffLogout = () => {
    setCurrentStaff(null);
    secureStorage.removeItem('seer_current_staff');
    setActiveTab('home');
  };

  // 2. Meal Scheduler & Subscription Handler
  const handleSelectSubscriptionPlan = (planId: string, customDetails: any) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const matchedPlan = SUBSCRIPTION_PLANS.find(p => p.id === planId)!;
    
    // Update active athlete subscription
    const updatedUser: User = {
      ...user,
      activePlanId: planId,
      mealsPerWeek: customDetails.weeklyMeals || matchedPlan.weeklyMeals,
      fitnessGoal: customDetails.goal || user.fitnessGoal
    };
    setUser(updatedUser);
    saveToStorage('seer_user', updatedUser);

    // Create a new set of delivery orders matching their calendar selection
    const slots = customDetails.selectedSlots || {};
    const newOrders: Order[] = Object.keys(slots).map((slotKey, index) => {
      const [dayId, timeSlot] = slotKey.split('-');
      // Pick a suitable meal matching fitness goal
      const suitableMeals = meals.filter(m => m.category === 'lunch' || m.category === 'dinner');
      const chosenMeal = suitableMeals[index % suitableMeals.length] || meals[0];

      return {
        id: `ord_${Date.now()}_${index}`,
        userId: user.id,
        userName: user.name,
        mealId: chosenMeal.id,
        mealName: chosenMeal.name,
        date: `۱۴۰۵/۰۴/${14 + index}`, // simulate calendar dates
        timeSlot: timeSlot as 'lunch' | 'dinner',
        status: 'pending',
        address: 'آدرس ثبت شده ورزشکار',
        phone: user.phone
      };
    });

    const combinedOrders = [...orders.filter(o => o.userId !== user.id), ...newOrders];
    setOrders(combinedOrders);
    saveToStorage('seer_orders', combinedOrders);

    setActiveTab('dashboard');
    alert(`تبریک! اشتراک ${matchedPlan.name} با موفقیت فعال شد. به پنل کاربری خود منتقل شدید.`);
  };

  // 3. User Actions
  const handleSwapMeal = (orderId: string, newMeal: Meal) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, mealId: newMeal.id, mealName: newMeal.name };
      }
      return o;
    });
    setOrders(updated);
    saveToStorage('seer_orders', updated);
  };

  const handleRechargeWallet = (amount: number) => {
    if (!user) return;
    const updated: User = { ...user, walletBalance: user.walletBalance + amount };
    setUser(updated);
    saveToStorage('seer_user', updated);
  };

  const handleCancelSubscription = () => {
    if (!user) return;
    const updated: User = { ...user, activePlanId: null, mealsPerWeek: 0 };
    setUser(updated);
    saveToStorage('seer_user', updated);

    // Clear user's pending orders
    const remainingOrders = orders.filter(o => o.userId !== user.id);
    setOrders(remainingOrders);
    saveToStorage('seer_orders', remainingOrders);
    alert('اشتراک شما با موفقیت لغو شد و سفارشات معلق برداشته شدند.');
  };

  // 4. Admin Panel Handlers
  const handleAddMeal = (newMeal: Omit<Meal, 'id'>) => {
    const mealWithId: Meal = {
      ...newMeal,
      id: `m_${Date.now()}`
    };
    const updated = [mealWithId, ...meals];
    setMeals(updated);
    saveToStorage('seer_meals', updated);
  };

  const handleDeleteMeal = (mealId: string) => {
    const updated = meals.filter(m => m.id !== mealId);
    setMeals(updated);
    saveToStorage('seer_meals', updated);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status };
      }
      return o;
    });
    setOrders(updated);
    saveToStorage('seer_orders', updated);
  };

  const handleReplyTicket = (ticketId: string, replyText: string) => {
    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        return { ...t, status: 'replied' as const, replyText };
      }
      return t;
    });
    setTickets(updated);
    saveToStorage('seer_tickets', updated);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-emerald-200 selection:text-emerald-800" dir="rtl">
      
      {/* 1. STICKY TOP HEADER */}
      <header className="sticky top-0 z-40 border-b border-stone-100 bg-white/85 backdrop-blur-md transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          {/* Logo Brand */}
          <GarlicLogo className="cursor-pointer" onClick={() => setActiveTab('home')} />

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-stone-600">
            <button 
              onClick={() => setActiveTab('home')}
              className={`hover:text-emerald-700 transition ${activeTab === 'home' ? 'text-emerald-700 font-bold' : ''}`}
            >
              صفحه اصلی
            </button>
            <button 
              onClick={() => setActiveTab('planner')}
              className={`hover:text-emerald-700 transition ${activeTab === 'planner' ? 'text-emerald-700 font-bold' : ''}`}
            >
              طراح رژیم هوشمند
            </button>
            <button 
              onClick={() => setActiveTab('blog')}
              className={`hover:text-emerald-700 transition ${activeTab === 'blog' ? 'text-emerald-700 font-bold' : ''}`}
            >
              وبلاگ سیر سلامت
            </button>
            <button 
              onClick={() => {
                if (user) {
                  setActiveTab('dashboard');
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className={`hover:text-emerald-700 transition ${activeTab === 'dashboard' ? 'text-emerald-700 font-bold' : ''}`}
            >
              داشبورد من
            </button>
            {currentStaff && (
              <button 
                onClick={() => setActiveTab('admin')}
                className={`hover:text-emerald-700 transition ${activeTab === 'admin' ? 'text-emerald-700 font-bold' : ''}`}
              >
                پنل کادر سیر
              </button>
            )}
          </nav>

          {/* User CTA buttons / Wallet widget */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Micro Wallet Balances badge */}
                <div 
                  onClick={() => setActiveTab('dashboard')}
                  className="hidden sm:flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800 font-bold border border-emerald-100/50 cursor-pointer hover:bg-emerald-100 transition"
                >
                  <Wallet size={14} />
                  <span>کیف پول: {user.walletBalance.toLocaleString('fa-IR')} تومان</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-stone-600 hover:bg-stone-50 transition"
                  title="خروج از حساب"
                >
                  <LogOut size={13} />
                  <span className="hidden sm:inline">خروج</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-xs"
              >
                <LogIn size={13} />
                <span>ورود / عضویت</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* 2. DYNAMIC CONTENT AREA */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <AnimatePresence mode="wait">
          
          {/* Tab 1: LANDING PAGE */}
          {activeTab === 'home' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-20"
            >
              {/* Hero Section */}
              <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12" id="hero-section">
                
                {/* Hero Texts */}
                <div className="lg:col-span-7 space-y-6 text-right">
                  
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                    <Sparkles size={12} />
                    پلتفرم تخصصی غذاهای رژیمی و ورزشی در ایران
                  </span>

                  <h1 className="text-4xl font-black leading-tight text-stone-950 md:text-5xl lg:text-6xl tracking-tight">
                    انرژی و رژیم ورزشی خود را با <strong className="text-emerald-600 font-extrabold">سیر</strong> کوک کنید!
                  </h1>

                  <p className="text-base text-stone-600 leading-relaxed max-w-2xl">
                    استارتاپ <strong className="text-emerald-800">سیر</strong> با بهره‌گیری از آشپزخانه متمرکز و پزشکان تغذیه ورزشی، غذاهای رژیمی اختصاصی شما را با گرم دقیق درشت‌مغذی‌ها پخته و روزانه داغ به منزل یا باشگاه تحویل می‌دهد. اهدافتان را مشخص کنید و برنامه تحویل را خودتان بچینید.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={() => setActiveTab('planner')}
                      className="rounded-2xl bg-emerald-600 px-7 py-4 font-bold text-white hover:bg-emerald-700 transition shadow-md shadow-emerald-600/10 hover:shadow-lg flex items-center gap-2"
                    >
                      <span>طراحی هوشمند پکیج شما</span>
                      <ArrowRight size={16} className="rotate-180" />
                    </button>
                    
                    <button
                      onClick={() => {
                        const target = document.getElementById('plans-comparison');
                        target?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="rounded-2xl border border-stone-200 bg-white px-6 py-4 font-bold text-stone-700 hover:bg-stone-50 transition"
                    >
                      مشاهده قیمت اشتراک‌ها
                    </button>
                  </div>

                  {/* Trust factors */}
                  <div className="flex items-center gap-6 border-t border-stone-100 pt-6">
                    <div className="flex -space-x-2 space-x-reverse">
                      <div className="h-9 w-9 rounded-full bg-emerald-50 border-2 border-white flex items-center justify-center text-xs shadow-xs"><Dumbbell size={14} className="text-emerald-700" /></div>
                      <div className="h-9 w-9 rounded-full bg-emerald-50 border-2 border-white flex items-center justify-center text-xs shadow-xs"><Apple size={14} className="text-emerald-700" /></div>
                      <div className="h-9 w-9 rounded-full bg-emerald-50 border-2 border-white flex items-center justify-center text-xs shadow-xs"><Award size={14} className="text-emerald-700" /></div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="text-sm font-black text-stone-900">۴.۹ از ۵</span>
                      </div>
                      <span className="text-[10px] text-stone-500 font-bold block">انتخاب اول ورزشکاران حرفه‌ای</span>
                    </div>
                  </div>

                </div>

                {/* Hero Aesthetic Illustration Card (Stunning 3D Overlapping Food Showcase) */}
                <div className="lg:col-span-5 flex justify-center items-center" id="hero-3d-showcase">
                  <div className="relative w-full max-w-[420px] h-[450px] perspective-1000 flex items-center justify-center">
                    
                    {/* Background Radial Glow */}
                    <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full transform -translate-y-6"></div>

                    {/* Card 1: Salmon, Quinoa, and Greens (athleteDietMeal) - Tilted Left & Bottom Layer */}
                    <motion.div 
                      className="absolute w-[260px] h-[340px] rounded-3xl bg-white border border-stone-100 shadow-xl overflow-hidden cursor-pointer"
                      style={{ originX: 0.5, originY: 0.5 }}
                      initial={{ rotateY: -15, rotateX: 10, rotateZ: -6, x: -50, y: 10 }}
                      whileHover={{ rotateY: -5, rotateX: 5, rotateZ: -2, x: -70, y: -10, z: 20, transition: { duration: 0.4 } }}
                      id="hero-3d-card-salmon"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img 
                          src={athleteDietMeal} 
                          alt="رژیم ماهی سالمون و کینوا" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-3 right-3 rounded-full bg-emerald-600/90 backdrop-blur-md px-2.5 py-1 text-[9px] font-bold text-white">
                          منوی سالمون ارگانیک
                        </span>
                      </div>
                      
                      <div className="p-4 text-right space-y-2">
                        <h4 className="text-xs font-extrabold text-stone-900 leading-tight">سالمون کبابی نروژی با کینوا و آووکادو</h4>
                        <p className="text-[10px] text-stone-400 font-medium">مناسب چربی‌سوزی و ریکاوری عضلانی پس از تمرینات قدرتی</p>
                        
                        <div className="grid grid-cols-3 gap-1 pt-2 border-t border-stone-50 text-[9px] text-center font-bold">
                          <div className="bg-emerald-50 text-emerald-800 rounded-md py-1">
                            <span className="block text-stone-400 text-[8px] font-normal">پروتئین</span>
                            ۳۸ گرم
                          </div>
                          <div className="bg-sky-50 text-sky-800 rounded-md py-1">
                            <span className="block text-stone-400 text-[8px] font-normal">کربوهیدرات</span>
                            ۴۲ گرم
                          </div>
                          <div className="bg-amber-50 text-amber-800 rounded-md py-1">
                            <span className="block text-stone-400 text-[8px] font-normal">چربی مفید</span>
                            ۱۲ گرم
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Card 2: Chicken Breast, Broccoli & Brown Rice (grilledChickenBowl) - Tilted Right & Top Overlapping Layer */}
                    <motion.div 
                      className="absolute w-[260px] h-[340px] rounded-3xl bg-white border border-stone-200/80 shadow-2xl overflow-hidden cursor-pointer z-20"
                      style={{ originX: 0.5, originY: 0.5 }}
                      initial={{ rotateY: 15, rotateX: 10, rotateZ: 6, x: 50, y: -20 }}
                      whileHover={{ rotateY: 5, rotateX: 5, rotateZ: 2, x: 70, y: -40, z: 40, transition: { duration: 0.4 } }}
                      id="hero-3d-card-chicken"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img 
                          src={grilledChickenBowl} 
                          alt="فیله مرغ گریل با کلم بروکلی" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-3 right-3 rounded-full bg-amber-600/90 backdrop-blur-md px-2.5 py-1 text-[9px] font-bold text-white">
                          منوی فیله گریل
                        </span>
                      </div>
                      
                      <div className="p-4 text-right space-y-2">
                        <h4 className="text-xs font-extrabold text-stone-900 leading-tight">فیله مرغ زغالی، برنج قهوه‌ای و کلم بروکلی</h4>
                        <p className="text-[10px] text-stone-400 font-medium">فرمول کلاسیک بدنسازان جهت افزایش حجم باکیفیت و ترشح هورمون رشد</p>
                        
                        <div className="grid grid-cols-3 gap-1 pt-2 border-t border-stone-50 text-[9px] text-center font-bold">
                          <div className="bg-emerald-50 text-emerald-800 rounded-md py-1">
                            <span className="block text-stone-400 text-[8px] font-normal">پروتئین</span>
                            ۴۸ گرم
                          </div>
                          <div className="bg-sky-50 text-sky-800 rounded-md py-1">
                            <span className="block text-stone-400 text-[8px] font-normal">کربوهیدرات</span>
                            ۵۰ گرم
                          </div>
                          <div className="bg-amber-50 text-amber-800 rounded-md py-1">
                            <span className="block text-stone-400 text-[8px] font-normal">چربی مفید</span>
                            ۵ گرم
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Floating Tech 3D Badge 1 */}
                    <motion.div 
                      className="absolute right-[-20px] top-[140px] bg-stone-900 text-white rounded-2xl p-3 shadow-xl z-30 border border-stone-800 text-[10px] text-right space-y-1"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                        <span className="font-extrabold text-emerald-400">فناوری آنالیز تغذیه</span>
                      </div>
                      <p className="text-stone-300 font-bold">طبخ روزانه با مواد ۱۰۰٪ ارگانیک</p>
                    </motion.div>

                    {/* Floating Tech 3D Badge 2 */}
                    <motion.div 
                      className="absolute left-[-25px] bottom-[40px] bg-white text-stone-900 rounded-2xl p-3 shadow-xl z-30 border border-stone-100 text-[10px] text-right space-y-1"
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    >
                      <div className="flex items-center gap-1 font-extrabold text-amber-600">
                        <Star size={12} className="fill-amber-500 text-amber-500" />
                        <span>تاییدیه مربیان بدنسازی</span>
                      </div>
                      <p className="text-stone-500 font-bold">محاسبه کالری دقیق هر وعده</p>
                    </motion.div>

                  </div>
                </div>

              </div>

              {/* Steps / How It Works */}
              <div className="space-y-12 py-6 text-center" id="how-it-works">
                <div className="space-y-3">
                  <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest block">روال کار در پلتفرم سیر</span>
                  <h2 className="text-2xl font-black text-stone-950 md:text-3xl">سیر تحول تغذیه شما در ۴ گام ساده</h2>
                  <p className="text-xs text-stone-500 max-w-xl mx-auto">چگونه اشتراک ورزشی خود را در کمتر از ۳ دقیقه تنظیم و دریافت کنید.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { step: '۰۱', title: 'شخصی‌سازی رژیم', desc: 'هدف ورزشی خود را مشخص کنید و کالری و درشت‌مغذی‌ها را بسنجید.', icon: <BarChart3 size={24} className="text-emerald-600" /> },
                    { step: '۰۲', title: 'انتخاب پکیج', desc: 'تعداد وعده در هفته را متناسب با زمان‌های تمرینی خود تعیین فرمایید.', icon: <Package size={24} className="text-emerald-600" /> },
                    { step: '۰۳', title: 'طبخ ارگانیک و داغ', desc: 'غذاها روزانه توسط سرآشپز سیر با بهترین مواد اولیه تازه طبخ می‌شود.', icon: <ChefHat size={24} className="text-emerald-600" /> },
                    { step: '۰۴', title: 'تحویل در باشگاه یا منزل', desc: 'پیک سریع سیر مرسوله‌ها را در ظروف ویژه راس ساعت تحویل می‌دهد.', icon: <Truck size={24} className="text-emerald-600" /> },
                  ].map(item => (
                    <div key={item.step} className="rounded-2xl border border-stone-100 bg-white p-6 shadow-2xs text-right space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-emerald-50 rounded-xl">{item.icon}</div>
                        <span className="text-lg font-black text-emerald-100 font-mono">{item.step}</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-stone-900">{item.title}</h4>
                      <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bento Grid Features / Why Seer */}
              <div className="space-y-12" id="why-seer-section">
                <div className="text-center space-y-3">
                  <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest block font-bold">وجه تمایز ما</span>
                  <h2 className="text-2xl font-black text-stone-950 md:text-3xl">چرا قهرمانان ورزشی اشتراک سیر را انتخاب می‌کنند؟</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Feature 1 */}
                  <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-2xs text-right md:col-span-1 space-y-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Heart size={18} /></span>
                    <h3 className="text-base font-bold text-stone-900">تحت نظارت پزشک تغذیه ورزشی</h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      تمام منوها و نسبت‌های کربوهیدرات و پروتئین در آزمایشگاه سیر ارزیابی و استانداردسازی شده‌اند تا بیشترین راندمان عضلانی حاصل شود.
                    </p>
                  </div>

                  {/* Feature 2 (Bento Expansion) */}
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/20 p-6 shadow-2xs text-right md:col-span-2 space-y-4 relative overflow-hidden">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800"><Truck size={18} /></span>
                    <h3 className="text-base font-bold text-stone-900">ارسال هوشمند و منظم لجستیک</h3>
                    <p className="text-xs text-stone-500 leading-relaxed max-w-lg">
                      با سیستم دیسپچ پلتفرم سیر، پیک‌ها قبل از خروج وضعیت غذا را بررسی می‌کنند. ظروف مایکروویوی با عایق حرارتی تضمین می‌کنند که غذا بدون افت کیفیت، کاملاً گرم به رختکن باشگاه شما خواهد رسید.
                    </p>
                    <div className="absolute bottom-4 left-4 opacity-10 text-9xl font-extrabold font-mono pointer-events-none select-none">
                      HOT
                    </div>
                  </div>

                  {/* Feature 3 (Bento Expansion) */}
                  <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-2xs text-right md:col-span-2 space-y-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-700"><RefreshCw size={18} /></span>
                    <h3 className="text-base font-bold text-stone-900">انعطاف بی‌نظیر: تعویض غذا تا ۲۴ ساعت قبل</h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      از رژیم تکراری خسته شده‌اید؟ در داشبورد تعاملی ورزشی خود، به راحتی ناهار یا شام فردای خود را با دیگر آیتم‌های متنوع جایگزین کنید یا اشتراک را برای روزهایی که مسافرت هستید، موقتاً متوقف کنید.
                    </p>
                  </div>

                  {/* Feature 4 */}
                  <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-2xs text-right md:col-span-1 space-y-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Dna size={18} /></span>
                    <h3 className="text-base font-bold text-stone-900">بدون روغن ترانس و قند مصنوعی</h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      طبخ استیک بوقلمون و ماهی سالمون فقط با اسپری روغن کنجد قهوه‌ای و زیتون فرابکر انجام می‌شود. سلامتی عروق شما اولویت اول سیر است.
                    </p>
                  </div>

                </div>
              </div>

              {/* Packages Comparison List */}
              <div className="space-y-12 py-6 scroll-mt-24" id="plans-comparison">
                <div className="text-center space-y-3">
                  <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest block font-bold">عضویت ماهانه</span>
                  <h2 className="text-2xl font-black text-stone-950 md:text-3xl">انتخاب اشتراک ورزشی سیر</h2>
                  <p className="text-xs text-stone-500 max-w-xl mx-auto">پلن‌های منعطف برای سطوح مختلف تمرینی. همین امروز تغذیه علمی را آغاز کنید.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {SUBSCRIPTION_PLANS.map(plan => (
                    <div 
                      key={plan.id} 
                      className={`rounded-3xl border p-8 shadow-xs flex flex-col justify-between transition-all duration-300 relative ${plan.color}`}
                    >
                      {plan.badge && (
                        <span className="absolute -top-3.5 right-6 rounded-full bg-emerald-600 px-3.5 py-1 text-[10px] font-extrabold text-white tracking-wide shadow-xs">
                          {plan.badge}
                        </span>
                      )}

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-extrabold text-stone-900">{plan.name}</h3>
                          <p className="text-xs text-stone-500 mt-2">{plan.description}</p>
                        </div>

                        {/* Price */}
                        <div className="border-t border-b border-stone-100/60 py-4 flex items-baseline gap-1 justify-center">
                          <span className="text-3xl font-black text-emerald-700 font-mono tracking-tight">
                            {plan.pricePerMonth.toLocaleString('fa-IR')}
                          </span>
                          <span className="text-xs text-stone-500 font-bold mr-1">تومان / ماهانه</span>
                        </div>

                        {/* Features checklist */}
                        <ul className="space-y-3 text-xs text-stone-600 text-right">
                          {plan.features.map((feat, idx) => (
                            <li key={idx} className="flex gap-2 items-start">
                              <span className="text-emerald-500 font-bold shrink-0">✓</span>
                              <span className="leading-relaxed">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab('planner');
                        }}
                        className="w-full rounded-xl bg-stone-900 py-3.5 font-bold text-white hover:bg-stone-800 transition text-xs mt-8 shadow-2xs"
                      >
                        سفارش و تنظیم پکیج
                      </button>

                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* Tab 2: INTERACTIVE PLANNER */}
          {activeTab === 'planner' && (
            <motion.div
              key="planner"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 text-right">
                <span className="text-xs font-bold text-emerald-600 uppercase">پیکربندی هوشمند</span>
                <h2 className="text-2xl font-black text-stone-900 mt-1">طراح هوشمند پکیج تغذیه ورزشی</h2>
                <p className="text-xs text-stone-500 mt-1">وعده‌ها، روزها و اهداف فیزیکی خود را تعیین کنید تا هوش تغذیه‌ای سیر بلافاصله کالری‌ها را بسنجد.</p>
              </div>

              <MealPlanner 
                onPlanSelected={handleSelectSubscriptionPlan} 
                isAuthenticated={!!user}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            </motion.div>
          )}

          {/* Tab 5: BLOG SECTION */}
          {activeTab === 'blog' && (
            <motion.div
              key="blog"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <BlogSection />
            </motion.div>
          )}

          {/* Tab 3: USER DASHBOARD */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {user ? (
                <UserDashboard 
                  user={user}
                  orders={orders}
                  onSwapMeal={handleSwapMeal}
                  onRechargeWallet={handleRechargeWallet}
                  onCancelSubscription={handleCancelSubscription}
                />
              ) : (
                <div className="text-center p-12 bg-white rounded-3xl border border-stone-100 max-w-md mx-auto space-y-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <Lock size={20} />
                  </div>
                  <h3 className="text-base font-bold text-stone-900">لطفاً ابتدا وارد حساب کاربری خود شوید</h3>
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="rounded-xl bg-emerald-600 px-6 py-2.5 font-bold text-white text-xs hover:bg-emerald-700 transition"
                  >
                    ورود / ثبت‌نام ورزشکاران
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Tab 4: ADMIN / CRM PORTAL */}
          {activeTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <AdminPanel 
                meals={meals}
                orders={orders}
                tickets={tickets}
                onAddMeal={handleAddMeal}
                onDeleteMeal={handleDeleteMeal}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onReplyTicket={handleReplyTicket}
                currentStaff={currentStaff}
                onStaffLogin={handleStaffLogin}
                onStaffLogout={handleStaffLogout}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 3. MODERN MINIMAL FOOTER */}
      <footer className="border-t border-stone-100 bg-white py-12 mt-20" dir="rtl" id="app-footer">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <GarlicLogo showText={true} />
            <p className="text-xs text-stone-500 leading-relaxed">
              اولین پلتفرم اشتراکی تغذیه و طبخ رژیمی ورزشکاران در ایران. تلفیق دانش پزشکی ورزشی و هنر سرآشپز سیر.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black text-stone-900 uppercase">دسترسی سریع</h4>
            <ul className="space-y-2 text-xs text-stone-500">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-emerald-700">صفحه نخست</button></li>
              <li><button onClick={() => setActiveTab('planner')} className="hover:text-emerald-700">طراح هوشمند رژیم</button></li>
              <li><button onClick={() => { if(user) { setActiveTab('dashboard') } else { setIsAuthModalOpen(true) } }} className="hover:text-emerald-700">پنل ورزشکاران</button></li>
              <li><button onClick={() => setActiveTab('admin')} className="hover:text-emerald-700">{currentStaff ? 'پنل کادر سیر' : 'ورود همکاران (دیسپچ و CRM)'}</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black text-stone-900 uppercase">اهداف تغذیه‌ای</h4>
            <ul className="space-y-2 text-xs text-stone-500">
              <li>منوی کاهش وزن کتوژنیک</li>
              <li>برنامه مرغ گریل و حجم خالص</li>
              <li>شام سبک کم‌کالری مدیترانه‌ای</li>
              <li>شیک‌های پروتئینی ارگانیک سیر</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black text-stone-900 uppercase">تماس با مطبخ سیر</h4>
            <ul className="space-y-2.5 text-xs text-stone-500 leading-relaxed">
              <li className="flex items-center gap-1.5"><Phone size={12} className="text-emerald-600 shrink-0" /> <span>پشتیبانی مشترکین: ۰۲۱-۸۸۸۸۹۹۹۹</span></li>
              <li className="flex items-start gap-1.5"><MapPin size={12} className="text-emerald-600 shrink-0 mt-0.5" /> <span>آشپزخانه مرکزی: تهران، بزرگراه کردستان، خیابان بیست و هفتم</span></li>
              <li className="flex items-center gap-1.5"><Mail size={12} className="text-emerald-600 shrink-0" /> <span>ایمیل امور ورزشی: support@seer.diet</span></li>
            </ul>
          </div>

        </div>

        <div className="mx-auto max-w-7xl px-6 border-t border-stone-50 pt-6 mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between text-[11px] text-stone-400 gap-4">
          <span>© ۱۴۰۵ تمامی حقوق برای استارتاپ اشتراک رژیمی سیر محفوظ است.</span>
          <span className="font-mono text-emerald-600/80">DESIGNED WITH ORGANIC GREEN AESTHETICS</span>
        </div>
      </footer>

      {/* 4. FLOATING AUTH MODAL */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal 
            onClose={() => setIsAuthModalOpen(false)}
            onAuthenticate={handleAuthenticate}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
