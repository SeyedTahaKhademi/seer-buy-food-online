/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Flame, Dna, Activity, Apple, Check, ArrowRight } from 'lucide-react';
import { BASELINE_MEALS, SUBSCRIPTION_PLANS } from '../data';
import { Meal } from '../types';

interface MealPlannerProps {
  onPlanSelected: (planId: string, customDetails: any) => void;
  isAuthenticated: boolean;
  onOpenAuth: () => void;
}

const DAYS_OF_WEEK = [
  { id: 'sat', name: 'شنبه' },
  { id: 'sun', name: 'یکشنبه' },
  { id: 'mon', name: 'دوشنبه' },
  { id: 'tue', name: 'سه‌شنبه' },
  { id: 'wed', name: 'چهارشنبه' },
  { id: 'thu', name: 'پنج‌شنبه' },
];

export default function MealPlanner({ onPlanSelected, isAuthenticated, onOpenAuth }: MealPlannerProps) {
  // Goal: weightLoss, muscleGain, maintain
  const [goal, setGoal] = useState<'weightLoss' | 'muscleGain' | 'maintain'>('muscleGain');
  // Plan level (meals count per week)
  const [weeklyCount, setWeeklyCount] = useState<number>(8);
  
  // Custom scheduled slots
  // Format: { 'sat-lunch': true, 'mon-lunch': true, ... }
  const [selectedSlots, setSelectedSlots] = useState<Record<string, boolean>>({
    'sat-lunch': true,
    'sat-dinner': true,
    'mon-lunch': true,
    'mon-dinner': true,
    'wed-lunch': true,
    'wed-dinner': true,
    'thu-lunch': true,
    'thu-dinner': true,
  });

  // Toggle meal slot
  const handleToggleSlot = (dayId: string, slotId: 'lunch' | 'dinner') => {
    const key = `${dayId}-${slotId}`;
    const currentSlots = { ...selectedSlots };
    
    if (currentSlots[key]) {
      delete currentSlots[key];
    } else {
      // Limit to max count or let it dynamically adjust the closest plan
      const currentCount = Object.keys(currentSlots).length;
      if (currentCount >= 14) return; // Hard limit for gold
      currentSlots[key] = true;
    }
    
    setSelectedSlots(currentSlots);
    
    // Automatically select nearest plan level
    const count = Object.keys(currentSlots).length;
    if (count <= 4) {
      setWeeklyCount(4);
    } else if (count <= 8) {
      setWeeklyCount(8);
    } else {
      setWeeklyCount(14);
    }
  };

  // Preset plans selector
  const handleSelectPreset = (mealsCount: number) => {
    setWeeklyCount(mealsCount);
    // Populate slots to match the number
    const newSlots: Record<string, boolean> = {};
    let count = 0;
    
    // We populate in order: sat, mon, wed, thu
    const order = ['sat', 'mon', 'wed', 'thu', 'sun', 'tue'];
    for (const day of order) {
      if (count < mealsCount) {
        newSlots[`${day}-lunch`] = true;
        count++;
      }
      if (count < mealsCount) {
        newSlots[`${day}-dinner`] = true;
        count++;
      }
    }
    setSelectedSlots(newSlots);
  };

  const actualSelectedCount = Object.keys(selectedSlots).length;

  // Find the closest subscription plan
  const matchedPlan = useMemo(() => {
    if (actualSelectedCount <= 4) return SUBSCRIPTION_PLANS.find(p => p.id === 'plan_bronze')!;
    if (actualSelectedCount <= 8) return SUBSCRIPTION_PLANS.find(p => p.id === 'plan_silver')!;
    return SUBSCRIPTION_PLANS.find(p => p.id === 'plan_gold')!;
  }, [actualSelectedCount]);

  // Adjust calorie and macronutrient multipliers based on fitness goal
  const multipliers = {
    weightLoss: { cal: 0.8, prot: 1.1, carb: 0.6, fat: 0.8 },
    muscleGain: { cal: 1.25, prot: 1.3, carb: 1.3, fat: 1.1 },
    maintain: { cal: 1.0, prot: 1.0, carb: 1.0, fat: 1.0 },
  };

  // Generate dynamic nutritional averages
  const macros = useMemo(() => {
    const mult = multipliers[goal];
    // Base values represent a balanced athletic meal
    const baseCalories = 480 * mult.cal;
    const baseProtein = 38 * mult.prot;
    const baseCarbs = 45 * mult.carb;
    const baseFat = 11 * mult.fat;

    return {
      calories: Math.round(baseCalories),
      protein: Math.round(baseProtein),
      carbs: Math.round(baseCarbs),
      fat: Math.round(baseFat),
    };
  }, [goal]);

  // Filter meals that match the goal category
  const suggestedMeals = useMemo(() => {
    return BASELINE_MEALS.filter(meal => {
      if (goal === 'weightLoss') {
        return meal.calories <= 480 || meal.tags.includes('کم چرب') || meal.tags.includes('کالری کم');
      }
      if (goal === 'muscleGain') {
        return meal.calories >= 480 || meal.tags.includes('پروتئین بالا') || meal.tags.includes('افزایش حجم');
      }
      return true; // maintain
    }).slice(0, Math.min(3, actualSelectedCount || 3));
  }, [goal, actualSelectedCount]);

  const handleCheckout = () => {
    onPlanSelected(matchedPlan.id, {
      goal,
      selectedSlots,
      weeklyMeals: actualSelectedCount,
      macros
    });
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12" id="meal-planner-container" dir="rtl">
      
      {/* Right Column: Settings & Calendar Configurator */}
      <div className="space-y-6 lg:col-span-7" id="planner-config-section">
        
        {/* Step 1: Fitness Goal */}
        <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm" id="planner-goal-card">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Sparkles size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold text-stone-900">۱. هدف فیزیکی خود را انتخاب کنید</h3>
              <p className="text-xs text-stone-500">منو و درشت‌مغذی‌ها بر اساس این هدف تنظیم می‌شوند.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setGoal('weightLoss')}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-200 ${
                goal === 'weightLoss'
                  ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 ring-2 ring-emerald-500/10'
                  : 'border-stone-200 bg-stone-50/30 text-stone-600 hover:border-stone-300'
              }`}
              id="goal-weight-loss-btn"
            >
              <span className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><Flame size={18} /></span>
              <span className="text-xs font-bold">کاهش وزن و چربی</span>
              <span className="text-[10px] font-medium opacity-80">کم‌کربوهیدرات</span>
            </button>

            <button
              onClick={() => setGoal('muscleGain')}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-200 ${
                goal === 'muscleGain'
                  ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 ring-2 ring-emerald-500/10'
                  : 'border-stone-200 bg-stone-50/30 text-stone-600 hover:border-stone-300'
              }`}
              id="goal-muscle-gain-btn"
            >
              <span className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><Activity size={18} /></span>
              <span className="text-xs font-bold">افزایش حجم و قدرت</span>
              <span className="text-[10px] font-medium opacity-80">پروتئین فوق‌العاده بالا</span>
            </button>

            <button
              onClick={() => setGoal('maintain')}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-200 ${
                goal === 'maintain'
                  ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 ring-2 ring-emerald-500/10'
                  : 'border-stone-200 bg-stone-50/30 text-stone-600 hover:border-stone-300'
              }`}
              id="goal-maintain-btn"
            >
              <span className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><Apple size={18} /></span>
              <span className="text-xs font-bold">تثبیت وزن و سلامت</span>
              <span className="text-[10px] font-medium opacity-80">کامل و متوازن</span>
            </button>
          </div>
        </div>

        {/* Step 2: Plan Preset Quick Select */}
        <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm" id="planner-preset-card">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Apple size={18} />
              </span>
              <div>
                <h3 className="text-base font-bold text-stone-900">۲. پکیج مدنظر یا تعداد وعده‌ها</h3>
                <p className="text-xs text-stone-500">انتخاب سریع اشتراک یا شخصی‌سازی تک‌تک روزها در تقویم زیر.</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
              {actualSelectedCount} وعده تنظیم شده
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'برنزی (۴ وعده)', count: 4 },
              { label: 'نقره‌ای (۸ وعده)', count: 8 },
              { label: 'طلایی (۱۴ وعده)', count: 14 },
            ].map(preset => (
              <button
                key={preset.count}
                onClick={() => handleSelectPreset(preset.count)}
                className={`rounded-xl border py-3 text-xs font-bold transition-all duration-200 ${
                  weeklyCount === preset.count
                    ? 'border-emerald-500 bg-emerald-600 text-white shadow-sm'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Interactive Calendar Grid */}
        <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm" id="planner-calendar-grid">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Calendar size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold text-stone-900">۳. تقویم هفتگی توزیع وعده‌ها</h3>
              <p className="text-xs text-stone-500">روزها و نوبت‌هایی که می‌خواهید غذا ارسال شود را کلیک کنید.</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-stone-100 bg-stone-50/50">
            {/* Header */}
            <div className="grid grid-cols-3 border-b border-stone-100 bg-stone-100/60 p-3 text-center text-xs font-extrabold text-stone-700">
              <div>روزهای هفته</div>
              <div>ناهار (ساعت ۱۲ تا ۱۴)</div>
              <div>شام (ساعت ۱۹ تا ۲۱)</div>
            </div>

            {/* Days list */}
            <div className="divide-y divide-stone-100">
              {DAYS_OF_WEEK.map(day => {
                const hasLunch = selectedSlots[`${day.id}-lunch`];
                const hasDinner = selectedSlots[`${day.id}-dinner`];

                return (
                  <div key={day.id} className="grid grid-cols-3 items-center p-2 text-center text-xs">
                    <div className="font-bold text-stone-800">{day.name}</div>
                    
                    {/* Lunch slot toggle */}
                    <div className="p-1">
                      <button
                        onClick={() => handleToggleSlot(day.id, 'lunch')}
                        className={`mx-auto flex h-9 w-full max-w-[120px] items-center justify-center gap-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                          hasLunch
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold shadow-2xs'
                            : 'border-dashed border-stone-300 bg-transparent text-stone-400 hover:border-stone-400 hover:text-stone-500'
                        }`}
                      >
                        {hasLunch ? (
                          <>
                            <Check size={12} className="stroke-[3px]" />
                            <span>ناهار رژیمی</span>
                          </>
                        ) : (
                          <span>بدون ارسال</span>
                        )}
                      </button>
                    </div>

                    {/* Dinner slot toggle */}
                    <div className="p-1">
                      <button
                        onClick={() => handleToggleSlot(day.id, 'dinner')}
                        className={`mx-auto flex h-9 w-full max-w-[120px] items-center justify-center gap-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                          hasDinner
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold shadow-2xs'
                            : 'border-dashed border-stone-300 bg-transparent text-stone-400 hover:border-stone-400 hover:text-stone-500'
                        }`}
                      >
                        {hasDinner ? (
                          <>
                            <Check size={12} className="stroke-[3px]" />
                            <span>شام رژیمی</span>
                          </>
                        ) : (
                          <span>بدون ارسال</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Left Column: Dynamic Receipt & Nutrition Dashboard */}
      <div className="lg:col-span-5" id="planner-summary-section">
        <div className="sticky top-6 space-y-6 rounded-2xl border border-emerald-100 bg-emerald-50/10 p-6 shadow-xs backdrop-blur-md">
          
          <h3 className="text-lg font-extrabold text-stone-900 border-b border-emerald-100/50 pb-3 flex items-center justify-between">
            <span>جزئیات برنامه شخصی شما</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-extrabold text-emerald-800">
              سیر فیت
            </span>
          </h3>

          {/* Dynamic Calories and Macro breakdown */}
          <div className="space-y-4 rounded-xl bg-white p-5 border border-stone-100" id="planner-nutrition-card">
            <h4 className="text-xs font-extrabold text-stone-500 tracking-wider">
              میانگین ارزش غذایی هر وعده ارسالی
            </h4>
            
            <div className="flex items-baseline justify-between border-b border-stone-50 pb-3">
              <span className="text-xs text-stone-600 flex items-center gap-1.5">
                <Flame size={14} className="text-amber-500 fill-amber-500/10" />
                میزان انرژی:
              </span>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-stone-900 font-mono tracking-tight">{macros.calories}</span>
                <span className="text-[11px] font-bold text-stone-500 mr-1">کیلوکالری</span>
              </div>
            </div>

            {/* Macros bar charts */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {/* Protein */}
              <div className="flex flex-col gap-1 text-center">
                <span className="text-[10px] text-stone-500 flex items-center justify-center gap-1">
                  <Dna size={11} className="text-emerald-600" />
                  پروتئین
                </span>
                <span className="text-base font-extrabold text-emerald-700 font-mono">{macros.protein}g</span>
                <div className="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500" 
                    style={{ width: `${Math.min(100, (macros.protein / 50) * 100)}%` }}
                  />
                </div>
                <span className="text-[9px] font-medium text-stone-400">عضله‌ساز</span>
              </div>

              {/* Carbs */}
              <div className="flex flex-col gap-1 text-center">
                <span className="text-[10px] text-stone-500 flex items-center justify-center gap-1">
                  <Activity size={11} className="text-sky-600" />
                  کربوهیدرات
                </span>
                <span className="text-base font-extrabold text-sky-700 font-mono">{macros.carbs}g</span>
                <div className="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div 
                    className="h-full bg-sky-500 transition-all duration-500" 
                    style={{ width: `${Math.min(100, (macros.carbs / 70) * 100)}%` }}
                  />
                </div>
                <span className="text-[9px] font-medium text-stone-400">انرژی پیچیده</span>
              </div>

              {/* Fats */}
              <div className="flex flex-col gap-1 text-center">
                <span className="text-[10px] text-stone-500 flex items-center justify-center gap-1">
                  <Check size={11} className="text-amber-600" />
                  چربی سالم
                </span>
                <span className="text-base font-extrabold text-amber-700 font-mono">{macros.fat}g</span>
                <div className="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-500" 
                    style={{ width: `${Math.min(100, (macros.fat / 25) * 100)}%` }}
                  />
                </div>
                <span className="text-[9px] font-medium text-stone-400">تنظیم هورمونی</span>
              </div>
            </div>
          </div>

          {/* Pricing & Matched Plan details */}
          <div className="rounded-xl border border-stone-100 bg-white p-5 space-y-4" id="planner-matched-plan-card">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-stone-400">پلن اختصاصی شما:</span>
                <h4 className="text-sm font-extrabold text-stone-900">{matchedPlan.name}</h4>
              </div>
              <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800">
                {actualSelectedCount} وعده در هفته
              </span>
            </div>

            <div className="flex items-baseline justify-between border-t border-b border-stone-50 py-3">
              <span className="text-xs text-stone-600">هزینه اشتراک ماهانه:</span>
              <div>
                <span className="text-xl font-extrabold text-emerald-700 font-mono">
                  {matchedPlan.pricePerMonth.toLocaleString('fa-IR')}
                </span>
                <span className="text-[11px] font-bold text-stone-500 mr-1">تومان</span>
              </div>
            </div>

            {/* Simulated Delivery features */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-stone-400 block">مزایای تحویل اشتراک سیر:</span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600">
                <div className="flex items-center gap-1">
                  <span className="text-emerald-500">✓</span>
                  <span>ظروف گیاهی و مایکروویوی</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-emerald-500">✓</span>
                  <span>تحویل راس ساعت مقرر</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-emerald-500">✓</span>
                  <span>تضمین تازگی و مواد اولیه ارگانیک</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-emerald-500">✓</span>
                  <span>امکان تغییر آدرس تحویل</span>
                </div>
              </div>
            </div>
          </div>

          {/* Previews of suggested meals */}
          <div className="space-y-2" id="planner-previews">
            <span className="text-xs font-bold text-stone-500 block">پیش‌نمایش غذاهای رژیمی نمونه شما:</span>
            <div className="space-y-2">
              {suggestedMeals.map((meal, index) => (
                <div key={meal.id} className="flex gap-3 rounded-xl bg-white/70 p-2 border border-stone-100 items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-lg">
                    {index === 0 ? '🍗' : index === 1 ? '🐟' : '🥩'}
                  </div>
                  <div className="overflow-hidden">
                    <h5 className="truncate text-xs font-bold text-stone-800">{meal.name}</h5>
                    <div className="flex gap-2 text-[10px] text-stone-400 font-mono">
                      <span>{meal.calories} کالری</span>
                      <span>•</span>
                      <span>{meal.protein}g پروتئین</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout/Select Action */}
          <button
            onClick={handleCheckout}
            className="w-full rounded-xl bg-emerald-600 py-4 font-bold text-white transition-all hover:bg-emerald-700 shadow-sm shadow-emerald-600/15 hover:shadow-md flex items-center justify-center gap-2 text-sm"
            id="planner-order-btn"
          >
            <span>شروع اشتراک هوشمند سیر</span>
            <ArrowRight size={16} className="rotate-180" />
          </button>

          {!isAuthenticated && (
            <p className="text-center text-[11px] text-stone-400">
              با کلیک روی دکمه بالا، به صفحه ثبت‌نام هدایت خواهید شد تا آدرس ارسال را تعیین کنید.
            </p>
          )}

        </div>
      </div>

    </div>
  );
}
