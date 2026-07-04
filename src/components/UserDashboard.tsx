/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Clock, User as UserIcon, Wallet, ArrowUpRight, 
  MapPin, CheckCircle, RotateCcw, Package, HelpCircle, ArrowLeft, ArrowRight, ShieldCheck, ChevronDown
} from 'lucide-react';
import { User, Order, Meal, OrderStatus } from '../types';
import { BASELINE_MEALS, SUBSCRIPTION_PLANS } from '../data';

interface UserDashboardProps {
  user: User;
  orders: Order[];
  onSwapMeal: (orderId: string, newMeal: Meal) => void;
  onRechargeWallet: (amount: number) => void;
  onCancelSubscription: () => void;
}

export default function UserDashboard({ 
  user, 
  orders, 
  onSwapMeal, 
  onRechargeWallet, 
  onCancelSubscription 
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'plan' | 'calendar' | 'wallet'>('plan');
  const [rechargeAmount, setRechargeAmount] = useState<string>('500000');
  const [swappingOrderId, setSwappingOrderId] = useState<string | null>(null);
  
  // Find user's active plan
  const activePlan = SUBSCRIPTION_PLANS.find(p => p.id === user.activePlanId) || null;

  // Active orders (simulating upcoming or today's deliveries)
  const activeOrders = orders.filter(o => o.userId === user.id);

  // Filter today's order for the real-time visual tracker (get the last order or active pending/shipped)
  const todaysOrder = activeOrders.length > 0 
    ? activeOrders.find(o => o.status !== 'delivered') || activeOrders[activeOrders.length - 1]
    : null;

  // Order status map in Persian
  const statusLabels: Record<OrderStatus, { text: string; desc: string; icon: string; color: string }> = {
    pending: { 
      text: 'در انتظار ثبت', 
      desc: 'سفارش ثبت شده و منتظر تایید آشپزخانه سیر است.', 
      icon: '📝', 
      color: 'bg-stone-100 text-stone-600 border-stone-200' 
    },
    preparing: { 
      text: 'در حال آماده‌سازی', 
      desc: 'سفارش در آشپزخانه مرکزی سیر توسط شف رژیمی با گرم دقیق مواد پخته می‌شود.', 
      icon: '🍳', 
      color: 'bg-amber-50 text-amber-700 border-amber-200' 
    },
    shipped: { 
      text: 'تحویل به پیک سیر', 
      desc: 'غذا در ظروف عایق حرارتی چیده شده و با پیک سریع سیر در راه باشگاه/منزل شماست.', 
      icon: '🛵', 
      color: 'bg-sky-50 text-sky-700 border-sky-200 animate-pulse' 
    },
    delivered: { 
      text: 'تحویل داده شد', 
      desc: 'غذا با موفقیت تحویل شد. نوش جان و ورزش مستمر!', 
      icon: '💚', 
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200' 
    },
  };

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(rechargeAmount);
    if (!isNaN(amount) && amount > 0) {
      onRechargeWallet(amount);
      setRechargeAmount('');
      alert(`مبلغ ${amount.toLocaleString('fa-IR')} تومان با موفقیت به کیف پول شارژ شد. (پرداخت شبیه‌سازی شد)`);
    }
  };

  return (
    <div className="space-y-6" id="dashboard-wrapper" dir="rtl">
      
      {/* 1. Dashboard User Greeting & Metrics Header */}
      <div className="rounded-3xl border border-stone-100 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6" id="dashboard-header">
        <div className="flex items-center gap-4" id="dashboard-profile-info">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-stone-950">{user.name} عزیز؛ خوش‌آمدید</h2>
              <span className="rounded-full bg-emerald-100/60 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                {user.fitnessGoal === 'muscleGain' ? 'دوره حجم و قدرت 💪' : user.fitnessGoal === 'weightLoss' ? 'دوره چربی‌سوزی 🔥' : 'تناسب و سلامتی 🥗'}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">عضویت از تاریخ {user.registeredDate} | تلفن: {user.phone}</p>
          </div>
        </div>

        {/* Dynamic balances */}
        <div className="flex items-center gap-3 divide-x divide-stone-100 divide-x-reverse" id="dashboard-balances">
          {/* Wallet Balance */}
          <div className="px-4 text-right">
            <span className="text-[10px] font-bold text-stone-400 flex items-center gap-1 justify-end">
              <Wallet size={12} className="text-emerald-500" />
              موجودی کیف پول
            </span>
            <div className="mt-1">
              <span className="text-xl font-extrabold text-stone-900 font-mono">
                {user.walletBalance.toLocaleString('fa-IR')}
              </span>
              <span className="text-xs text-stone-500 mr-1">تومان</span>
            </div>
          </div>

          {/* Meals counter */}
          <div className="px-4 text-right">
            <span className="text-[10px] font-bold text-stone-400 flex items-center gap-1 justify-end">
              <Calendar size={12} className="text-emerald-500" />
              وعده هفتگی فعال
            </span>
            <div className="mt-1">
              <span className="text-xl font-extrabold text-stone-900 font-mono">
                {activePlan ? user.mealsPerWeek : 0}
              </span>
              <span className="text-xs text-stone-500 mr-1">وعده در هفته</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-navigation tabs */}
      <div className="flex border-b border-stone-200 gap-6" id="dashboard-tabs">
        <button
          onClick={() => setActiveTab('plan')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'plan' ? 'text-emerald-700' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          اشتراک من و تحویل امروز
          {activeTab === 'plan' && (
            <motion.div layoutId="active_dash_tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'calendar' ? 'text-emerald-700' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          برنامه هفتگی و تعویض غذا
          {activeTab === 'calendar' && (
            <motion.div layoutId="active_dash_tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'wallet' ? 'text-emerald-700' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          افزایش اعتبار کیف پول
          {activeTab === 'wallet' && (
            <motion.div layoutId="active_dash_tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
          )}
        </button>
      </div>

      {/* 3. Dynamic Tab Panes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12" id="dashboard-content-grid">
        
        {/* Main Panel Content Area (Tabs switcher) */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* Tab 1: Subscriptions details & Delivery tracker */}
            {activeTab === 'plan' && (
              <motion.div
                key="tab-plan"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Subscription Card */}
                {activePlan ? (
                  <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-xs relative overflow-hidden">
                    <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-emerald-500/5"></div>
                    
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-50 pb-4">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">اشتراک فعال شما</span>
                        <h3 className="text-lg font-extrabold text-stone-900 mt-1">{activePlan.name}</h3>
                        <p className="text-xs text-stone-500 mt-1">{activePlan.description}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-stone-400">تاریخ تمدید بعدی:</span>
                        <div className="text-sm font-bold text-stone-800 mt-1">۱۴۰۵/۰۵/۰۴ (۳۰ روز آینده)</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 text-xs">
                      <div>
                        <span className="text-stone-400 block">وعده‌های ارسالی در هفته:</span>
                        <span className="font-bold text-stone-900 mt-1 block">{user.mealsPerWeek} وعده رژیمی ورزشی</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">کل وعده‌های ماهانه:</span>
                        <span className="font-bold text-stone-900 mt-1 block">{(user.mealsPerWeek * 4)} وعده کامل</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">وضعیت حساب:</span>
                        <span className="font-bold text-emerald-600 mt-1 block flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
                          پرداخت و فعال شده
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button 
                        onClick={onCancelSubscription}
                        className="rounded-xl border border-red-200 bg-red-50/50 px-4 py-2.5 text-xs font-bold text-red-700 transition hover:bg-red-50"
                      >
                        لغو و غیرفعال‌سازی اشتراک سیر
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-8 text-center space-y-4">
                    <span className="text-4xl">🥗</span>
                    <h3 className="text-base font-bold text-stone-900">شما در حال حاضر هیچ اشتراک فعالی ندارید!</h3>
                    <p className="text-xs text-stone-500 max-w-md mx-auto">
                      برای دریافت وعده‌های غذایی گرم و رژیمی به صورت منظم و روزانه، ابتدا از بخش طراح هوشمند بالا برنامه تغذیه‌ای خود را بسازید.
                    </p>
                  </div>
                )}

                {/* Live Order Tracker (Simulating Delivery Status) */}
                {todaysOrder && (
                  <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm" id="live-delivery-tracker">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-stone-50 pb-4">
                      <div>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-800">
                          ارسال زنده امروز
                        </span>
                        <h4 className="text-sm font-extrabold text-stone-900 mt-2">
                          رهگیری وعده {todaysOrder.timeSlot === 'lunch' ? 'ناهار' : 'شام'}: {todaysOrder.mealName}
                        </h4>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-stone-400">کد رهگیری مرسوله:</span>
                        <span className="font-mono text-xs font-bold text-stone-800 block mt-1">SEER-{todaysOrder.id}</span>
                      </div>
                    </div>

                    {/* Progress visual steps */}
                    <div className="relative mb-8 pt-4">
                      {/* Connection Line */}
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-100 -translate-y-1/2 z-0">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-700"
                          style={{
                            width: 
                              todaysOrder.status === 'pending' ? '0%' :
                              todaysOrder.status === 'preparing' ? '33.3%' :
                              todaysOrder.status === 'shipped' ? '66.6%' : '100%'
                          }}
                        />
                      </div>

                      {/* Steps items */}
                      <div className="relative z-10 grid grid-cols-4 text-center">
                        {[
                          { key: 'pending', label: 'ثبت سفارش', icon: '📝' },
                          { key: 'preparing', label: 'آشپزخانه سیر', icon: '🍳' },
                          { key: 'shipped', label: 'تحویل به پیک', icon: '🛵' },
                          { key: 'delivered', label: 'تحویل ورزشکار', icon: '💚' },
                        ].map((step, idx) => {
                          const orderStatusOrder = ['pending', 'preparing', 'shipped', 'delivered'];
                          const currentIdx = orderStatusOrder.indexOf(todaysOrder.status);
                          const isCompleted = idx <= currentIdx;
                          const isActive = idx === currentIdx;

                          return (
                            <div key={step.key} className="flex flex-col items-center">
                              <div 
                                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                  isActive
                                    ? 'border-emerald-600 bg-emerald-600 text-white scale-110 shadow-sm shadow-emerald-500/20'
                                    : isCompleted
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                    : 'border-stone-200 bg-white text-stone-400'
                                }`}
                              >
                                <span className="text-sm">{step.icon}</span>
                              </div>
                              <span className={`text-[11px] font-extrabold mt-2.5 ${isActive ? 'text-emerald-700 font-bold' : isCompleted ? 'text-stone-800' : 'text-stone-400'}`}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active Status Info Details */}
                    <div className="rounded-xl border border-stone-100 bg-stone-50/50 p-4 flex gap-4 items-center">
                      <span className="text-3xl">{statusLabels[todaysOrder.status].icon}</span>
                      <div>
                        <h5 className="text-xs font-extrabold text-stone-800">
                          وضعیت فعلی: {statusLabels[todaysOrder.status].text}
                        </h5>
                        <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                          {statusLabels[todaysOrder.status].desc}
                        </p>
                        {todaysOrder.status === 'shipped' && (
                          <div className="mt-2 text-[10px] font-bold text-emerald-700">
                            🛵 پیک سیر در محدوده شماست. لطفاً تلفن همراه خود را در دسترس نگه دارید.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sync hint */}
                    <div className="mt-4 text-center">
                      <p className="text-[10px] font-medium text-stone-400">
                        💡 این استارتاپ شبیه‌سازی شده است. از تب <strong className="text-emerald-600">داشبورد مدیریت / CRM</strong> در بالا می‌توانید وضعیت همین سفارش را جلو ببرید تا بازخوردش را بلافاصله در این بخش مشاهده کنید!
                      </p>
                    </div>

                  </div>
                )}
              </motion.div>
            )}

            {/* Tab 2: Calendar & Swap Meal */}
            {activeTab === 'calendar' && (
              <motion.div
                key="tab-calendar"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-xs">
                  <div className="mb-4">
                    <h3 className="text-base font-extrabold text-stone-900">برنامه غذایی هفته جاری شما</h3>
                    <p className="text-xs text-stone-500 mt-1">
                      به عنوان یک ورزشکار، همیشه مجاز هستید تا ۲۴ ساعت قبل از ارسال، وعده غذایی آینده خود را بر اساس سلیقه و تنوع با دیگر وعده‌های سیر جایگزین کنید.
                    </p>
                  </div>

                  {activeOrders.length > 0 ? (
                    <div className="space-y-3">
                      {activeOrders.map(order => (
                        <div 
                          key={order.id} 
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-stone-100 bg-stone-50/20 p-4 hover:border-emerald-200 transition-all"
                        >
                          <div className="flex gap-4 items-center">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-xs">
                              {order.date.split('-')[2]} تیر
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-600">
                                  {order.timeSlot === 'lunch' ? 'ناهار (۱۲:۰۰)' : 'شام (۱۹:۰۰)'}
                                </span>
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                  order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {order.status === 'delivered' ? 'تحویل شد' : 'برنامه‌ریزی شده'}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-stone-900 mt-1">{order.mealName}</h4>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            {order.status === 'pending' || order.status === 'preparing' ? (
                              <button
                                onClick={() => setSwappingOrderId(order.id)}
                                className="rounded-xl border border-emerald-500 bg-white px-4 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50"
                              >
                                تعویض غذا 🔄
                              </button>
                            ) : (
                              <span className="text-[11px] font-bold text-stone-400">قابل تعویض نیست</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-xs text-stone-400 p-6">هیچ وعده‌ای ثبت نشده است.</p>
                  )}
                </div>

                {/* Swap Dialog Modal/Section */}
                {swappingOrderId && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/10 p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                      <h4 className="text-sm font-extrabold text-emerald-900">انتخاب غذای جدید برای جایگزینی:</h4>
                      <button 
                        onClick={() => setSwappingOrderId(null)}
                        className="text-xs text-stone-400 hover:text-stone-700"
                      >
                        بستن انصراف ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-1">
                      {BASELINE_MEALS.map(meal => (
                        <div 
                          key={meal.id}
                          className="rounded-xl border border-stone-100 bg-white p-3 hover:border-emerald-500 hover:shadow-2xs transition-all cursor-pointer flex gap-3 items-center"
                          onClick={() => {
                            onSwapMeal(swappingOrderId, meal);
                            setSwappingOrderId(null);
                          }}
                        >
                          <span className="text-2xl">🥗</span>
                          <div className="text-right">
                            <h5 className="text-xs font-bold text-stone-900">{meal.name}</h5>
                            <div className="flex gap-2 text-[10px] text-stone-400 font-mono mt-1">
                              <span>{meal.calories} کالری</span>
                              <span>•</span>
                              <span>{meal.protein}g پروتئین</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Tab 3: Wallet Recharge */}
            {activeTab === 'wallet' && (
              <motion.div
                key="tab-wallet"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-xs">
                  <h3 className="text-base font-extrabold text-stone-900">کیف پول ورزشی سیر</h3>
                  <p className="text-xs text-stone-500 mt-1">
                    با افزایش موجودی کیف پول خود، فاکتورهای آینده و خرید میان‌وعده‌ها را بسیار سریع‌تر پرداخت کنید. همچنین لغو اضطراری وعده‌ها به این حساب واریز می‌شود.
                  </p>

                  <form onSubmit={handleRecharge} className="mt-6 space-y-4 max-w-md">
                    <div>
                      <label className="text-xs font-extrabold text-stone-700 block mb-2">مبلغ شارژ (تومان):</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={rechargeAmount}
                          onChange={(e) => setRechargeAmount(e.target.value)}
                          placeholder="مثلاً ۵۰۰,۰۰۰"
                          className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-3 text-sm font-bold text-stone-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                          required
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400">تومان</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {['100000', '200000', '500000', '1000000'].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setRechargeAmount(val)}
                          className="rounded-lg border border-stone-200 bg-stone-50 text-[11px] font-bold py-2 text-stone-600 hover:border-emerald-500 hover:bg-emerald-50/20 hover:text-emerald-700 transition"
                        >
                          {parseInt(val).toLocaleString('fa-IR')}
                        </button>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700 shadow-xs flex items-center justify-center gap-2 text-xs"
                    >
                      <span>اتصال شبیه‌ساز درگاه بانکی سیر</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Sidebar Info Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Workout / Health stats widget */}
          <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-xs text-right">
            <h4 className="text-xs font-extrabold text-stone-400 uppercase tracking-wider mb-4">آمار سلامتی ورزشکار</h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-stone-500">پایبندی به رژیم در هفته اخیر:</span>
                  <span className="font-bold text-emerald-600">۹۲%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-stone-500">کالری مصرف شده در این ماه:</span>
                  <span className="font-bold text-stone-800">۱۴,۴۰۰ کیلوکالری</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-emerald-700" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="rounded-xl bg-stone-50/50 p-3 border border-stone-100 text-xs text-stone-600 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-stone-800">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>توصیه ورزشی شف رژیمی سیر:</span>
                </div>
                <p className="leading-relaxed text-[11px] text-stone-500">
                  با توجه به هدف شما (افزایش حجم عضلانی)، حتماً نوشیدن آب کافی (حداقل ۳ لیتر روزانه) را رعایت کرده و فیبرهای بروکلی ارسالی را قبل تمرین به همراه نیمی از سینه مرغ گریل میل فرمایید.
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Location static info card */}
          <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-xs space-y-3 text-right">
            <h4 className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">نشانی تحویل پیش‌فرض</h4>
            
            <div className="flex gap-2 text-xs text-stone-700 items-start">
              <MapPin size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-800 block">تهران، باشگاه ورزشی اکسیژن</span>
                <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                  بلوار نلسون ماندلا (جردن)، خیابان طاهری، پلاک ۴، طبقه منفی ۱ (محل رختکن ورزشکاران)
                </p>
              </div>
            </div>

            <button className="w-full text-center text-[10px] font-bold text-emerald-600 hover:text-emerald-700 pt-2 border-t border-stone-50">
              ویرایش آدرس و نقشه تحویل
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
