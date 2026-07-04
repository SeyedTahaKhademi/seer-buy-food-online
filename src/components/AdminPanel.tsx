/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Users, ShoppingBag, Truck, BarChart3, Plus, Trash2, 
  CheckCircle, MessageSquare, Reply, Tag, DollarSign, Award, Star,
  Lock, Shield, LogOut, UserCheck, Key, ShieldAlert
} from 'lucide-react';
import { Meal, Order, CRMTicket, OrderStatus, StaffMember } from '../types';
import { REVENUE_DATA, PLAN_DISTRIBUTION_DATA } from '../data';
import { secureStorage } from '../lib/security';

interface AdminPanelProps {
  meals: Meal[];
  orders: Order[];
  tickets: CRMTicket[];
  onAddMeal: (newMeal: Omit<Meal, 'id'>) => void;
  onDeleteMeal: (mealId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onReplyTicket: (ticketId: string, replyText: string) => void;
  currentStaff: StaffMember | null;
  onStaffLogin: (staff: StaffMember) => void;
  onStaffLogout: () => void;
}

const DEFAULT_STAFF: StaffMember[] = [
  { id: 's1', name: 'امیرحسین رضایی', username: 'admin', role: 'super_admin', roleName: 'مدیر کل (Super Admin)' },
  { id: 's2', name: 'شف احمد کاظمی', username: 'chef_ahmad', role: 'chef', roleName: 'سرآشپز ارشد (Chef/Cook)' },
  { id: 's3', name: 'خانم سمیرا نوری', username: 'nouri_acc', role: 'accountant', roleName: 'حسابدار ارشد (Accountant)' },
  { id: 's4', name: 'علی کریمی', username: 'karimi_support', role: 'crm_agent', roleName: 'کارشناس پشتیبانی (CRM Support)' }
];

export default function AdminPanel({
  meals,
  orders,
  tickets,
  onAddMeal,
  onDeleteMeal,
  onUpdateOrderStatus,
  onReplyTicket,
  currentStaff,
  onStaffLogin,
  onStaffLogout
}: AdminPanelProps) {
  // Staff list state (persisted in localStorage)
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(DEFAULT_STAFF);

  // New staff form states
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffUser, setNewStaffUser] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'super_admin' | 'chef' | 'accountant' | 'crm_agent'>('chef');

  // Sub tab tracking based on active role
  const [activeSubTab, setActiveSubTab] = useState<string>('analytics');

  // State for new meal form
  const [newMealName, setNewMealName] = useState('');
  const [newMealDesc, setNewMealDesc] = useState('');
  const [newMealCals, setNewMealCals] = useState<number>(450);
  const [newMealProt, setNewMealProt] = useState<number>(40);
  const [newMealCarbs, setNewMealCarbs] = useState<number>(35);
  const [newMealFat, setNewMealFat] = useState<number>(10);
  const [newMealCategory, setNewMealCategory] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [newMealPrice, setNewMealPrice] = useState<number>(120000);
  const [newMealTags, setNewMealTags] = useState('پروتئین بالا، کم چرب');

  // State for CRM replies
  const [activeReplyTicketId, setActiveReplyTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Load and save staff lists
  useEffect(() => {
    const savedStaff = secureStorage.getItem<StaffMember[]>('seer_staff_list');

    if (savedStaff) {
      setStaffMembers(savedStaff);
    } else {
      secureStorage.setItem('seer_staff_list', DEFAULT_STAFF);
    }
  }, []);

  useEffect(() => {
    if (currentStaff) {
      assignDefaultTab(currentStaff);
    }
  }, [currentStaff]);

  const assignDefaultTab = (staff: StaffMember) => {
    if (staff.role === 'chef') {
      setActiveSubTab('orders');
    } else if (staff.role === 'accountant') {
      setActiveSubTab('analytics');
    } else if (staff.role === 'crm_agent') {
      setActiveSubTab('crm');
    } else {
      setActiveSubTab('analytics');
    }
  };

  const handleStaffLogin = (staff: StaffMember) => {
    onStaffLogin(staff);
  };

  const handleStaffLogout = () => {
    onStaffLogout();
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffUser.trim()) return;

    const roleNamesMap = {
      super_admin: 'مدیر کل (Super Admin)',
      chef: 'سرآشپز ارشد (Chef/Cook)',
      accountant: 'حسابدار ارشد (Accountant)',
      crm_agent: 'کارشناس پشتیبانی (CRM Support)'
    };

    const newMember: StaffMember = {
      id: `staff_${Date.now()}`,
      name: newStaffName,
      username: newStaffUser.toLowerCase().replace(/\s+/g, ''),
      role: newStaffRole,
      roleName: roleNamesMap[newStaffRole]
    };

    const updated = [...staffMembers, newMember];
    setStaffMembers(updated);
    secureStorage.setItem('seer_staff_list', updated);

    setNewStaffName('');
    setNewStaffUser('');
    alert(`حساب کاربری جدید برای همکار گرامی "${newMember.name}" با نقش "${newMember.roleName}" با موفقیت ایجاد شد.`);
  };

  const handleDeleteStaff = (id: string) => {
    if (id === 's1') {
      alert('حساب مدیر کل اصلی پلتفرم قابل حذف نیست.');
      return;
    }
    const updated = staffMembers.filter(s => s.id !== id);
    setStaffMembers(updated);
    secureStorage.setItem('seer_staff_list', updated);
  };

  // Preset replies for CRM
  const PRESET_REPLIES = [
    'درخواست شما بررسی شد و تایید گردید. تغییرات در تحویل‌های آینده شما اعمال خواهد شد. با تشکر، تیم پشتیبانی سیر.',
    'سلام ورزشکار گرامی، هماهنگی‌های لازم با آشپزخانه سیر انجام گرفت تا در وعده‌های بعدی درخواست شما دقیقاً رعایت شود.',
    'بابت تاخیر به وجود آمده صمیمانه عذرخواهی می‌کنیم. یک هدیه نقدی به عنوان جبران به کیف پول سیر شما افزوده شد.'
  ];

  const handleCreateMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMealName || !newMealDesc) return;
    
    onAddMeal({
      name: newMealName,
      description: newMealDesc,
      calories: Number(newMealCals),
      protein: Number(newMealProt),
      carbs: Number(newMealCarbs),
      fat: Number(newMealFat),
      category: newMealCategory,
      price: Number(newMealPrice),
      tags: newMealTags.split('،').map(t => t.trim()).filter(Boolean)
    });

    // Reset fields
    setNewMealName('');
    setNewMealDesc('');
    setNewMealCals(450);
    setNewMealProt(40);
    setNewMealCarbs(35);
    setNewMealFat(10);
    setNewMealPrice(120000);
    alert('غذای رژیمی جدید با موفقیت به منوی سراسری سیر اضافه شد.');
  };

  const handleSendReply = (ticketId: string) => {
    if (!replyText.trim()) return;
    onReplyTicket(ticketId, replyText);
    setReplyText('');
    setActiveReplyTicketId(null);
    alert('پاسخ تیکت با موفقیت ثبت و برای مشتری ارسال شد.');
  };

  // Derived metrics
  const totalRevenue = 296000000; // Simulating combined active contracts
  const activeAthletesCount = 142;
  const pendingOrdersToday = orders.filter(o => o.status !== 'delivered').length;
  const openCRMCount = tickets.filter(t => t.status === 'open').length;

  // Gate page when not logged in to a staff account
  if (!currentStaff) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 text-right" id="staff-gate-container">
        
        {/* Decorative Alert Badge */}
        <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-10 -mt-10"></div>
          <div className="space-y-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800">
              <Lock size={12} className="text-emerald-700" />
              دروازه امنیتی کادر اجرایی پلتفرم سیر
            </span>
            <h2 className="text-2xl font-black text-stone-900 leading-tight">کنترل دسترسی و تفکیک وظایف کارکنان</h2>
            <p className="text-xs text-stone-500 leading-relaxed max-w-2xl">
              خوش آمدید. برای رعایت محرمانگی و نظم سازمانی، هر یک از بخش‌های پلتفرم سیر (مانند آشپزخانه، حسابداری، پشتیبانی و مدیریت) دارای حساب کاربری مجزا با دسترسی‌های کاملاً تفکیک‌شده هستند. 
              جهت آزمایش سیستم، می‌توانید فوراً با یکی از پرسنل پیش‌فرض زیر وارد شوید یا یک اکانت کادر جدید در بخش مدیریت بسازید!
            </p>
          </div>
          <div className="shrink-0 text-7xl select-none animate-pulse">
            🧑‍💼
          </div>
        </div>

        {/* Dynamic Staff Selector Grid */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-stone-700">انتخاب شبیه‌ساز ورود کادر پلتفرم سیر:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staffMembers.map(staff => {
              // Icon representation
              let icon = '👨‍💼';
              let badgeColor = 'bg-stone-100 text-stone-700';
              let scopeText = '';
              if (staff.role === 'super_admin') {
                icon = '👑';
                badgeColor = 'bg-red-50 text-red-700 border border-red-200';
                scopeText = 'دسترسی کامل و غیرمحدود به کل پورتال، گزارشات، منوها و مدیریت کارکنان';
              } else if (staff.role === 'chef') {
                icon = '👨‍🍳';
                badgeColor = 'bg-amber-50 text-amber-700 border border-amber-200';
                scopeText = 'دسترسی انحصاری به پورتال آشپزخانه، مدیریت سفارشات، آماده‌سازی و ارسال لجستیک';
              } else if (staff.role === 'accountant') {
                icon = '📊';
                badgeColor = 'bg-sky-50 text-sky-700 border border-sky-200';
                scopeText = 'دسترسی انحصاری به داشبورد مالی، تراکنش‌ها، سودآوری و چارت‌های فروش';
              } else if (staff.role === 'crm_agent') {
                icon = '🎧';
                badgeColor = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
                scopeText = 'دسترسی انحصاری به بخش ارتباط با مشتری (CRM)، پاسخ به تیکت‌ها و مشکلات ورزشکاران';
              }

              return (
                <div 
                  key={staff.id}
                  onClick={() => handleStaffLogin(staff)}
                  className="rounded-2xl border border-stone-200 bg-white p-5 hover:border-emerald-500 hover:shadow-md transition duration-300 cursor-pointer flex justify-between items-start gap-4"
                  id={`staff-login-card-${staff.id}`}
                >
                  <div className="space-y-2 text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{icon}</span>
                      <h4 className="text-sm font-extrabold text-stone-900">{staff.name}</h4>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${badgeColor}`}>
                        {staff.roleName}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
                      {scopeText}
                    </p>
                    <span className="text-[10px] text-stone-400 font-mono block">نام کاربری: @{staff.username}</span>
                  </div>

                  <button className="rounded-xl bg-emerald-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-emerald-700 transition shrink-0">
                    ورود به پنل
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom helper tip */}
        <div className="rounded-2xl bg-amber-50/50 border border-amber-100 p-4 text-xs text-stone-600 flex items-start gap-2">
          <span className="text-sm">💡</span>
          <p className="leading-relaxed">
            <strong>راهنمای تست:</strong> ابتدا به عنوان <strong>مدیر کل (امیرحسین رضایی)</strong> وارد شوید. از تب جدید <strong>«مدیریت حساب کارکنان»</strong> یک حساب جدید (مثلاً برای یک آشپز یا حسابدار دیگر) بسازید. سپس از سیستم خارج شده و با حساب جدید وارد شوید تا محدودیت‌های دسترسی بی‌نظیر و امنیت پلتفرم را آزمایش کنید.
          </p>
        </div>

      </div>
    );
  }

  // Define tabs available for the active staff role
  const getAvailableTabs = () => {
    switch(currentStaff.role) {
      case 'chef':
        return [{ id: 'orders', label: 'مدیریت سفارشات و ارسال (آشپزخانه)', icon: <Truck size={15} /> }];
      case 'accountant':
        return [{ id: 'analytics', label: 'نمودارها و آمار مالی (حسابداری)', icon: <BarChart3 size={15} /> }];
      case 'crm_agent':
        return [{ id: 'crm', label: 'ارتباط با مشتری (CRM)', icon: <MessageSquare size={15} /> }];
      case 'super_admin':
      default:
        return [
          { id: 'analytics', label: 'نمودارها و آمار مالی', icon: <BarChart3 size={15} /> },
          { id: 'orders', label: 'مدیریت سفارشات و ارسال', icon: <Truck size={15} /> },
          { id: 'crm', label: 'ارتباط با مشتری (CRM)', icon: <MessageSquare size={15} /> },
          { id: 'menu', label: 'مدیریت منوی غذا', icon: <ShoppingBag size={15} /> },
          { id: 'staff', label: 'مدیریت حساب کارکنان', icon: <Users size={15} /> }
        ];
    }
  };

  const availableTabs = getAvailableTabs();

  return (
    <div className="space-y-6" id="admin-panel-container" dir="rtl">
      
      {/* Staff Logged in Banner */}
      <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="staff-header-banner">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-2xl shadow-xs border border-emerald-100">
            {currentStaff.role === 'super_admin' ? '👑' : currentStaff.role === 'chef' ? '👨‍🍳' : currentStaff.role === 'accountant' ? '📊' : '🎧'}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400">پنل همکاران فعال است:</span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[9px] font-extrabold text-emerald-800">
                {currentStaff.roleName}
              </span>
            </div>
            <h3 className="text-sm font-black text-stone-900 mt-1">
              {currentStaff.name} <span className="text-xs font-mono text-stone-400 font-normal">(@{currentStaff.username})</span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Change Role / Switch Quick Shortcut */}
          <button
            onClick={handleStaffLogout}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 transition cursor-pointer"
          >
            <LogOut size={13} />
            <span>خروج و تغییر بخش</span>
          </button>
        </div>
      </div>

      {/* Main Stats Summary (Filtered based on roles) */}
      <div className="rounded-3xl border border-stone-100 bg-white p-6 shadow-xs" id="admin-header-stats">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-stone-50 pb-4 mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-stone-900">میز مدیریت و تفکیک هوشمند پلتفرم سیر</h2>
            <p className="text-xs text-stone-500 mt-1">مشاهده و دسترسی کنترل‌شده متناسب با نقش شما در پلتفرم.</p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <span className="flex items-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              پایگاه داده: متصل و همگام
            </span>
          </div>
        </div>

        {/* Bento Grid Metrics (Filtered based on role) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="admin-bento-metrics">
          
          {/* Financial details - Only for super admin and accountant */}
          {(currentStaff.role === 'super_admin' || currentStaff.role === 'accountant') ? (
            <div className="rounded-2xl border border-stone-100 bg-stone-50/40 p-4">
              <span className="text-[10px] font-bold text-stone-400 block">ارزش قراردادهای فعال</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-stone-900 font-mono">۲۹۶,۰۰۰,۰۰۰</span>
                <span className="text-[10px] text-stone-500 mr-1">تومان</span>
              </div>
              <span className="text-[9px] font-bold text-emerald-600 mt-1 block">↑ ۱۲% در این ماه</span>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/10 p-4 flex flex-col justify-center items-center text-center">
              <Shield size={16} className="text-stone-300" />
              <span className="text-[9px] text-stone-400 mt-1">دسترسی مالی مسدود است</span>
            </div>
          )}

          {/* User count - Only for super admin and accountant/CRM */}
          {(currentStaff.role === 'super_admin' || currentStaff.role === 'accountant' || currentStaff.role === 'crm_agent') ? (
            <div className="rounded-2xl border border-stone-100 bg-stone-50/40 p-4">
              <span className="text-[10px] font-bold text-stone-400 block">ورزشکاران مشترک فعال</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-stone-900 font-mono">۱۴۲</span>
                <span className="text-[10px] text-stone-500 mr-1">نفر</span>
              </div>
              <span className="text-[9px] font-bold text-emerald-600 mt-1 block">نرخ بازگشت ۹۵٪</span>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/10 p-4 flex flex-col justify-center items-center text-center">
              <Shield size={16} className="text-stone-300" />
              <span className="text-[9px] text-stone-400 mt-1">دسترسی پرسنل مسدود است</span>
            </div>
          )}

          {/* Orders - Only for super admin and chef */}
          {(currentStaff.role === 'super_admin' || currentStaff.role === 'chef') ? (
            <div className="rounded-2xl border border-stone-100 bg-stone-50/40 p-4">
              <span className="text-[10px] font-bold text-stone-400 block">سفارشات ارسال امروز</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-stone-900 font-mono">{orders.length}</span>
                <span className="text-[10px] text-stone-500 mr-1">مرسوله</span>
              </div>
              <span className="text-[9px] font-bold text-amber-600 mt-1 block">{pendingOrdersToday} در حال پردازش/ارسال</span>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/10 p-4 flex flex-col justify-center items-center text-center">
              <Shield size={16} className="text-stone-300" />
              <span className="text-[9px] text-stone-400 mt-1">دسترسی آشپزخانه مسدود است</span>
            </div>
          )}

          {/* CRM Tickets - Only for super admin and crm support */}
          {(currentStaff.role === 'super_admin' || currentStaff.role === 'crm_agent') ? (
            <div className="rounded-2xl border border-stone-100 bg-stone-50/40 p-4">
              <span className="text-[10px] font-bold text-stone-400 block">تیکت‌های باز CRM</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-stone-900 font-mono">{openCRMCount}</span>
                <span className="text-[10px] text-stone-500 mr-1">تیکت</span>
              </div>
              <span className="text-[9px] font-bold text-red-500 mt-1 block">پاسخ سریع لازم است</span>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/10 p-4 flex flex-col justify-center items-center text-center">
              <Shield size={16} className="text-stone-300" />
              <span className="text-[9px] text-stone-400 mt-1">دسترسی CRM مسدود است</span>
            </div>
          )}

        </div>
      </div>

      {/* Dynamic Sub-Tabs Navigation based on allowed access */}
      <div className="flex flex-wrap border-b border-stone-200 gap-4 md:gap-6" id="admin-tabs">
        {availableTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`pb-3 text-xs md:text-sm font-bold transition-all relative flex items-center gap-2 ${
              activeSubTab === tab.id ? 'text-emerald-700' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.id === 'orders' && pendingOrdersToday > 0 && (
              <span className="h-4 w-4 rounded-full bg-amber-500 text-[10px] text-white flex items-center justify-center font-extrabold">
                {pendingOrdersToday}
              </span>
            )}
            {tab.id === 'crm' && openCRMCount > 0 && (
              <span className="h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-extrabold">
                {openCRMCount}
              </span>
            )}
            {activeSubTab === tab.id && (
              <motion.div layoutId="active_admin_tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
            )}
          </button>
        ))}
      </div>

      {/* Admin Active Tab Content Panel */}
      <div className="min-h-[400px]" id="admin-active-content">
        <AnimatePresence mode="wait">
          
          {/* Sub-Tab 1: Analytics charts */}
          {activeSubTab === 'analytics' && (
            <motion.div
              key="admin-analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6"
            >
              {/* Left Chart: Monthly Revenue */}
              <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-xs md:col-span-8">
                <h3 className="text-sm font-extrabold text-stone-800 mb-4 flex items-center gap-2">
                  <span>نمودار رشد درآمد ماهانه سیر (تومان)</span>
                </h3>
                
                <div className="h-[280px] w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={REVENUE_DATA}
                      margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip formatter={(value: any) => [`${value.toLocaleString()} تومان`, 'درآمد']} />
                      <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#059669" 
                      strokeWidth={2.5}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Chart: Subscription distribution pie chart */}
              <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-xs md:col-span-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-stone-800 mb-4">توزیع انتخابی پلن‌ها</h3>
                  
                  <div className="h-[180px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={PLAN_DISTRIBUTION_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {PLAN_DISTRIBUTION_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'سهم پکیج']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-2 border-t border-stone-50 pt-3 text-[11px]">
                  {PLAN_DISTRIBUTION_DATA.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                        <span className="font-bold text-stone-700">{entry.name}</span>
                      </div>
                      <span className="font-mono text-stone-900 font-extrabold">{entry.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Sub-Tab 2: CRM & Tickets list */}
          {activeSubTab === 'crm' && (
            <motion.div
              key="admin-crm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-xs">
                <h3 className="text-base font-extrabold text-stone-900 mb-4">پیام‌های پشتیبانی و بازخورد مشتریان (CRM)</h3>

                <div className="divide-y divide-stone-100 space-y-4">
                  {tickets.map(ticket => (
                    <div key={ticket.id} className="pt-4 first:pt-0 space-y-2 text-right">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600 text-sm font-extrabold">
                            {ticket.customerName.charAt(0)}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-stone-900">{ticket.customerName}</span>
                              {ticket.planName && (
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                                  {ticket.planName}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-stone-400">تلفن: {ticket.phone} | ایمیل: {ticket.email}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-stone-400 font-mono">{ticket.date}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            ticket.status === 'open' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}>
                            {ticket.status === 'open' ? 'در انتظار پاسخ ✕' : 'پاسخ داده شده ✓'}
                          </span>
                        </div>
                      </div>

                      <div className="bg-stone-50/50 p-4 rounded-xl border border-stone-100 text-xs">
                        <span className="font-extrabold text-stone-800 block mb-1">موضوع: {ticket.subject}</span>
                        <p className="text-stone-600 leading-relaxed">{ticket.message}</p>
                      </div>

                      {/* Replied content if exists */}
                      {ticket.status === 'replied' && ticket.replyText && (
                        <div className="mr-6 bg-emerald-50/30 border-r-2 border-emerald-500 p-3.5 rounded-l-xl text-xs space-y-1">
                          <span className="font-bold text-emerald-800 block">پاسخ رسمی پشتیبانی سیر:</span>
                          <p className="text-stone-600 leading-relaxed">{ticket.replyText}</p>
                        </div>
                      )}

                      {/* Reply form action */}
                      {ticket.status === 'open' && (
                        <div className="mr-6 pt-2">
                          {activeReplyTicketId === ticket.id ? (
                            <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                              <label className="text-[11px] font-bold text-stone-600 block">متن پاسخ تیکت:</label>
                              
                              {/* Presets shortcut buttons */}
                              <div className="flex flex-wrap gap-2 mb-2">
                                {PRESET_REPLIES.map((pText, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => setReplyText(pText)}
                                    className="rounded-lg bg-white border border-stone-200 px-2.5 py-1 text-[10px] font-bold text-stone-600 hover:border-emerald-500 hover:text-emerald-700 transition"
                                  >
                                    پاسخ سریع {i+1}
                                  </button>
                                ))}
                              </div>

                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="پاسخ به این مشتری ورزشی..."
                                rows={3}
                                className="w-full rounded-xl border border-stone-200 bg-white p-3 text-xs text-stone-800 focus:border-emerald-500 focus:outline-hidden"
                              />

                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSendReply(ticket.id)}
                                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
                                >
                                  ارسال پاسخ رسمی
                                </button>
                                <button
                                  onClick={() => setActiveReplyTicketId(null)}
                                  className="rounded-lg bg-stone-200 px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-300 transition"
                                >
                                  انصراف
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setActiveReplyTicketId(ticket.id);
                                setReplyText('');
                              }}
                              className="rounded-xl border border-emerald-500 bg-white px-3.5 py-2 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 transition flex items-center gap-1.5"
                            >
                              <Reply size={12} />
                              پاسخ به تیکت مشتری
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Sub-Tab 3: Menu Management (Meals) */}
          {activeSubTab === 'menu' && (
            <motion.div
              key="admin-menu"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left Form: Add New Meal */}
              <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-xs lg:col-span-4 h-fit">
                <h3 className="text-sm font-extrabold text-stone-900 border-b border-stone-50 pb-2 mb-4 flex items-center gap-1">
                  <Plus size={16} className="text-emerald-600" />
                  افزودن غذای رژیمی جدید
                </h3>

                <form onSubmit={handleCreateMeal} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">نام غذا:</label>
                    <input
                      type="text"
                      value={newMealName}
                      onChange={(e) => setNewMealName(e.target.value)}
                      placeholder="مثلاً: فیله بوقلمون با مارچوبه"
                      className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-emerald-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">توضیحات و ترکیبات:</label>
                    <textarea
                      value={newMealDesc}
                      onChange={(e) => setNewMealDesc(e.target.value)}
                      placeholder="سینه بوقلمون بخارپز، مارچوبه تازه و سس لیمو ترش ارگانیک..."
                      rows={2}
                      className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-emerald-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">میزان کالری (Kcal):</label>
                      <input
                        type="number"
                        value={newMealCals}
                        onChange={(e) => setNewMealCals(Number(e.target.value))}
                        className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-emerald-500 focus:outline-hidden"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">پروتئین (گرم):</label>
                      <input
                        type="number"
                        value={newMealProt}
                        onChange={(e) => setNewMealProt(Number(e.target.value))}
                        className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-emerald-500 focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">کربوهیدرات (گرم):</label>
                      <input
                        type="number"
                        value={newMealCarbs}
                        onChange={(e) => setNewMealCarbs(Number(e.target.value))}
                        className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-emerald-500 focus:outline-hidden"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">چربی (گرم):</label>
                      <input
                        type="number"
                        value={newMealFat}
                        onChange={(e) => setNewMealFat(Number(e.target.value))}
                        className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-emerald-500 focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">طبقه‌بندی:</label>
                      <select
                        value={newMealCategory}
                        onChange={(e: any) => setNewMealCategory(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-emerald-500 focus:outline-hidden"
                      >
                        <option value="lunch">ناهار</option>
                        <option value="dinner">شام</option>
                        <option value="breakfast">صبحانه</option>
                        <option value="snack">میان‌وعده</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">هزینه تک وعده (تومان):</label>
                      <input
                        type="number"
                        value={newMealPrice}
                        onChange={(e) => setNewMealPrice(Number(e.target.value))}
                        className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-emerald-500 focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">برچسب‌ها (با «،» جدا کنید):</label>
                    <input
                      type="text"
                      value={newMealTags}
                      onChange={(e) => setNewMealTags(e.target.value)}
                      placeholder="پروتئین بالا، کم چرب"
                      className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700 shadow-xs"
                  >
                    ثبت و انتشار غذا در پلتفرم
                  </button>
                </form>
              </div>

              {/* Right List: Global Food Menu database */}
              <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-xs lg:col-span-8 overflow-hidden">
                <h3 className="text-sm font-extrabold text-stone-900 mb-4">آرشیو جامع منوهای فعال سیر</h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-stone-100 text-stone-400 font-bold">
                        <th className="pb-3 text-right">عنوان غذا</th>
                        <th className="pb-3 text-center">انرژی (کالری)</th>
                        <th className="pb-3 text-center">پروتئین</th>
                        <th className="pb-3 text-center">کربوهیدرات/چربی</th>
                        <th className="pb-3 text-left">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {meals.map(meal => (
                        <tr key={meal.id} className="hover:bg-stone-50/50">
                          <td className="py-3">
                            <div className="font-bold text-stone-800">{meal.name}</div>
                            <div className="text-[10px] text-stone-400 truncate max-w-[250px]">{meal.description}</div>
                          </td>
                          <td className="py-3 text-center font-mono text-stone-900">{meal.calories} Kcal</td>
                          <td className="py-3 text-center text-emerald-700 font-bold">{meal.protein}g</td>
                          <td className="py-3 text-center text-stone-500 font-mono">
                            {meal.carbs}g / {meal.fat}g
                          </td>
                          <td className="py-3 text-left">
                            <button
                              onClick={() => {
                                if (confirm(`آیا از حذف غذای "${meal.name}" مطمئن هستید؟`)) {
                                  onDeleteMeal(meal.id);
                                }
                              }}
                              className="rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-600 transition"
                              title="حذف غذا"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Sub-Tab 4: Dispatch & Active Orders status advancement */}
          {activeSubTab === 'orders' && (
            <motion.div
              key="admin-orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-xs">
                <div className="mb-4">
                  <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                    <span>سامانه دیسپچ و آماده‌سازی آشپزخانه سیر</span>
                    {currentStaff.role === 'chef' && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold text-amber-800 animate-pulse">
                        پنل آشپزخانه فعال است
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    در این صفحه وضعیت آماده‌سازی و ارسال لجستیک سفارشات روزانه مشترکین را کنترل و مدیریت کنید. تغییر وضعیت‌ها بلافاصله روی داشبورد ورزشکاران نمایان می‌شود.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-stone-100 text-stone-400 font-bold">
                        <th className="pb-3 text-right">مشترک / گیرنده</th>
                        <th className="pb-3 text-right">غذای سفارشی</th>
                        <th className="pb-3 text-center">زمان ارسال</th>
                        <th className="pb-3 text-center">وضعیت لجستیک</th>
                        <th className="pb-3 text-left">اقدام تغییر وضعیت زنده</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-stone-50/50">
                          <td className="py-4">
                            <div className="font-bold text-stone-900">{order.userName}</div>
                            <div className="text-[10px] text-stone-400">آدرس: {order.address}</div>
                          </td>
                          <td className="py-4">
                            <div className="font-bold text-stone-800">{order.mealName}</div>
                            <div className="text-[10px] text-stone-400 font-mono">شناسه: {order.id}</div>
                          </td>
                          <td className="py-4 text-center">
                            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-600">
                              {order.date} | {order.timeSlot === 'lunch' ? 'ناهار (۱۲)' : 'شام (۱۹)'}
                            </span>
                          </td>
                          <td className="py-4 text-center">
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              order.status === 'pending' ? 'bg-stone-100 text-stone-700' :
                              order.status === 'preparing' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                              order.status === 'shipped' ? 'bg-sky-50 text-sky-800 border border-sky-200 animate-pulse' :
                              'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}>
                              {order.status === 'pending' ? '📝 در انتظار تایید' :
                               order.status === 'preparing' ? '🍳 آماده‌سازی آشپزخانه' :
                               order.status === 'shipped' ? '🛵 در حال ارسال پیک' :
                               '💚 تحویل موفق به مشتری'}
                            </span>
                          </td>
                          <td className="py-4 text-left">
                            <div className="flex gap-1.5 justify-end">
                              {order.status === 'pending' && (
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                                  className="rounded-lg bg-amber-600 px-2.5 py-1.5 text-[10px] font-bold text-white hover:bg-amber-700 transition"
                                >
                                  شروع آماده‌سازی 🍳
                                </button>
                              )}
                              {order.status === 'preparing' && (
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'shipped')}
                                  className="rounded-lg bg-sky-600 px-2.5 py-1.5 text-[10px] font-bold text-white hover:bg-sky-700 transition"
                                >
                                  تحویل به پیک موتوری 🛵
                                </button>
                              )}
                              {order.status === 'shipped' && (
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                                  className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[10px] font-bold text-white hover:bg-emerald-700 transition"
                                >
                                  ثبت تحویل نهایی 💚
                                </button>
                              )}
                              {order.status === 'delivered' && (
                                <span className="text-[10px] text-stone-400 font-bold py-1 flex items-center gap-1">
                                  <CheckCircle size={12} className="text-emerald-500" />
                                  لجستیک تکمیل شد
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Sub-Tab 5: Staff Accounts Management (Only for Super Admin) */}
          {activeSubTab === 'staff' && currentStaff.role === 'super_admin' && (
            <motion.div
              key="admin-staff"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Add New Staff Account Form */}
              <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-xs lg:col-span-4 h-fit text-right space-y-4">
                <h3 className="text-sm font-extrabold text-stone-900 border-b border-stone-50 pb-2 mb-4 flex items-center gap-1.5">
                  <Plus size={16} className="text-emerald-600" />
                  ساخت اکانت همکار جدید
                </h3>

                <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">نام و نام خانوادگی همکار:</label>
                    <input
                      type="text"
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      placeholder="مثلاً: شف رضا اصغری"
                      className="w-full rounded-lg border border-stone-200 p-2.5 text-xs focus:border-emerald-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">نام کاربری اختصاصی (جهت ورود):</label>
                    <input
                      type="text"
                      value={newStaffUser}
                      onChange={(e) => setNewStaffUser(e.target.value)}
                      placeholder="مثلاً: reza_chef"
                      className="w-full rounded-lg border border-stone-200 p-2.5 text-xs text-left font-mono focus:border-emerald-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">تعیین نقش و بخش کاری (سطح دسترسی):</label>
                    <select
                      value={newStaffRole}
                      onChange={(e: any) => setNewStaffRole(e.target.value)}
                      className="w-full rounded-lg border border-stone-200 p-2.5 text-xs focus:border-emerald-500 focus:outline-hidden"
                    >
                      <option value="chef">سرآشپز ارشد (فقط دسترسی به سفارشات و آماده‌سازی آشپزخانه)</option>
                      <option value="accountant">حسابدار ارشد (فقط دسترسی به گزارشات مالی و درآمد)</option>
                      <option value="crm_agent">کارشناس پشتیبانی (فقط دسترسی به پیام‌ها و تیکت‌های CRM)</option>
                      <option value="super_admin">مدیر کل (دسترسی کامل به کل سیستم و کارکنان)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700 shadow-xs flex items-center justify-center gap-2"
                  >
                    <UserCheck size={14} />
                    <span>ایجاد حساب و تخصیص دسترسی</span>
                  </button>
                </form>
              </div>

              {/* Staff Accounts List */}
              <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-xs lg:col-span-8 overflow-hidden text-right">
                <h3 className="text-sm font-extrabold text-stone-900 mb-4">لیست پرسنل فعال و ساختار دسترسی پلتفرم</h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-stone-100 text-stone-400 font-bold">
                        <th className="pb-3 text-right">عنوان همکار / نام</th>
                        <th className="pb-3 text-right">نام کاربری ورود</th>
                        <th className="pb-3 text-center">نقش سازمانی</th>
                        <th className="pb-3 text-center">محدوده مجاز دید</th>
                        <th className="pb-3 text-left">حذف</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {staffMembers.map(staff => (
                        <tr key={staff.id} className="hover:bg-stone-50/50">
                          <td className="py-4">
                            <div className="font-bold text-stone-900">{staff.name}</div>
                            <span className="text-[10px] text-stone-400">شناسه سیستمی: {staff.id}</span>
                          </td>
                          <td className="py-4 font-mono text-stone-600 text-[11px]">
                            @{staff.username}
                          </td>
                          <td className="py-4 text-center">
                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              staff.role === 'super_admin' ? 'bg-red-50 text-red-700' :
                              staff.role === 'chef' ? 'bg-amber-50 text-amber-700' :
                              staff.role === 'accountant' ? 'bg-sky-50 text-sky-700' :
                              'bg-emerald-50 text-emerald-700'
                            }`}>
                              {staff.roleName}
                            </span>
                          </td>
                          <td className="py-4 text-center text-stone-500 font-medium">
                            {staff.role === 'super_admin' ? 'کل پلتفرم 👑' :
                             staff.role === 'chef' ? 'سفارشات آشپزخانه 🍳' :
                             staff.role === 'accountant' ? 'گزارش مالی 📊' :
                             'ارتباط با مشتری 🎧'}
                          </td>
                          <td className="py-4 text-left">
                            <button
                              onClick={() => {
                                if (confirm(`آیا از حذف حساب پرسنلی "${staff.name}" اطمینان دارید؟`)) {
                                  handleDeleteStaff(staff.id);
                                }
                              }}
                              disabled={staff.id === 's1'}
                              className={`rounded-lg p-2 transition ${
                                staff.id === 's1' ? 'text-stone-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50 hover:text-red-600'
                              }`}
                              title="حذف حساب کادر"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
