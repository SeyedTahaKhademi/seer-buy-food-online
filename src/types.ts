/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  price: number; // simulated cost per meal
  tags: string[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  weeklyMeals: number;
  pricePerMonth: number; // in Tomans
  features: string[];
  badge?: string;
  color: string; // Tailwind border/bg colors
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  fitnessGoal: 'weightLoss' | 'muscleGain' | 'maintain';
  mealsPerWeek: number;
  activePlanId: string | null;
  registeredDate: string;
  walletBalance: number; // in Tomans
}

export type OrderStatus = 'pending' | 'preparing' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  mealId: string;
  mealName: string;
  date: string; // YYYY-MM-DD
  timeSlot: 'lunch' | 'dinner';
  status: OrderStatus;
  address: string;
  phone: string;
  deliveryTime?: string;
}

export interface CRMTicket {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'open' | 'replied';
  replyText?: string;
  planName?: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  ordersCount: number;
}

export interface PlanDistribution {
  name: string;
  value: number;
  color: string;
}

export interface StaffMember {
  id: string;
  name: string;
  username: string;
  role: 'super_admin' | 'chef' | 'accountant' | 'crm_agent';
  roleName: string;
}

