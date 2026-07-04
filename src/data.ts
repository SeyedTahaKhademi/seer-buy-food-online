/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Meal, SubscriptionPlan, CRMTicket, MonthlyRevenue, PlanDistribution } from './types';

// Baseline Delicious & Clean Diet Meals for Athletes
export const BASELINE_MEALS: Meal[] = [
  {
    id: 'm1',
    name: 'فیله مرغ گریل با برنج قهوه‌ای و کلم بروکلی',
    description: 'سینه مرغ مرینت شده در لیمو و زعفران، گریل شده بدون روغن، به همراه برنج قهوه‌ای دمی و بروکلی بخارپز.',
    calories: 480,
    protein: 45,
    carbs: 55,
    fat: 8,
    category: 'lunch',
    price: 135000,
    tags: ['پروتئین بالا', 'کربوهیدرات پیچیده', 'کم چرب']
  },
  {
    id: 'm2',
    name: 'سالمون تنوری با کینوا و کدو سبز',
    description: 'فیله سالمون نروژی با ادویه‌های گیاهی تنوری شده، کینوای پخته شده با عصاره سبزیجات و کدو سبز گریل.',
    calories: 540,
    protein: 38,
    carbs: 42,
    fat: 18,
    category: 'dinner',
    price: 210000,
    tags: ['امگا ۳', 'کتوژنیک', 'بدون گلوتن']
  },
  {
    id: 'm3',
    name: 'خوراک بوقلمون رژیمی با قارچ و لوبیا سبز',
    description: 'گوشت چرخ‌کرده رژیمی بوقلمون تفت داده شده با قارچ اسلایس شده، لوبیا سبز تازه و ادویه‌جات معطر سیر.',
    calories: 420,
    protein: 40,
    carbs: 25,
    fat: 12,
    category: 'lunch',
    price: 145000,
    tags: ['کربوهیدرات کم', 'پروتئین بالا', 'سیرکننده']
  },
  {
    id: 'm4',
    name: 'پاستا پنه سبوس‌دار با سس ریحان و مرغ',
    description: 'پاستا تهیه شده از گندم کامل، تکه‌های فیله مرغ آبدار، سس پستوی ریحان کم چرب و گوجه گیلاسی.',
    calories: 510,
    protein: 35,
    carbs: 65,
    fat: 11,
    category: 'lunch',
    price: 140000,
    tags: ['افزایش حجم', 'انرژی‌زا']
  },
  {
    id: 'm5',
    name: 'بیف استیک کم‌چرب با پوره سیب‌زمینی شیرین',
    description: 'راسته گوساله گریل شده با سس رزماری، به همراه پوره سیب‌زمینی شیرین نرم شده با شیر بادام و مارچوبه.',
    calories: 590,
    protein: 48,
    carbs: 48,
    fat: 14,
    category: 'dinner',
    price: 225000,
    tags: ['افزایش حجم', 'پروتئین بالا']
  },
  {
    id: 'm6',
    name: 'املت سفیده تخم‌مرغ با اسفناج و قارچ',
    description: 'سفیده تخم‌مرغ همزده با اسفناج تازه کوهی، قارچ اسلایس شده و پنیر فتا کم‌چرب، سرو با نان جو دوسر.',
    calories: 290,
    protein: 28,
    carbs: 18,
    fat: 6,
    category: 'breakfast',
    price: 85000,
    tags: ['کالری کم', 'مناسب رژیم کاهش وزن']
  },
  {
    id: 'm7',
    name: 'اوتمیل پروتئینی توت‌فرنگی و کره بادام‌زمینی',
    description: 'جو دوسر پخته شده با شیر بادام، پودر پروتئین وی اصل، توت‌فرنگی تازه، دانه چیا و کره بادام‌زمینی خالص.',
    calories: 380,
    protein: 24,
    carbs: 45,
    fat: 10,
    category: 'breakfast',
    price: 95000,
    tags: ['آنتی اکسیدان', 'فیبر بالا']
  },
  {
    id: 'm8',
    name: 'توپک‌های خرمایی پروتئینی با کنجد و گردو',
    description: 'سه عدد توپک خرمایی مغذی مخلوط شده با پروتئین ایزوله، گردوی خرد شده و روکش کنجد قهوه‌ای.',
    calories: 220,
    protein: 12,
    carbs: 28,
    fat: 7,
    category: 'snack',
    price: 60000,
    tags: ['میان‌وعده سالم', 'انرژی‌بخش']
  },
  {
    id: 'm9',
    name: 'سالاد کینوآ با آووکادو و نخود فرنگی',
    description: 'کینوا سه رنگ، مکعب‌های آووکادوی تازه، نخود فرنگی، خیار، شوید و سس لیموترش تازه و روغن زیتون بکر.',
    calories: 340,
    protein: 10,
    carbs: 38,
    fat: 14,
    category: 'snack',
    price: 110000,
    tags: ['گیاهی', 'چربی‌های مفید']
  }
];

// Subscription Plans Styled with Soft Greens and Minimal Aesthetics
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_bronze',
    name: 'پلن رژیمی برنزی',
    description: 'مناسب برای شروع یا افرادی که می‌خواهند وعده‌های رژیمی سیر را تست کنند.',
    weeklyMeals: 4,
    pricePerMonth: 2200000, // Tomans
    features: [
      '۴ وعده ناهار یا شام در هفته به انتخاب شما',
      'دسترسی به تقویم هفتگی تعویض غذا',
      'محاسبه دقیق کالری و درشت‌مغذی‌ها',
      'ارسال رایگان ۲ بار در هفته',
      'پشتیبانی استاندارد آنلاین'
    ],
    color: 'border-stone-200 bg-white hover:border-emerald-300'
  },
  {
    id: 'plan_silver',
    name: 'پلن ورزشی نقره‌ای (محبوب‌ترین)',
    description: 'برنامه غذایی ایده‌آل برای ورزشکاران مصمم جهت دستیابی سریع به اهداف تناسب اندام.',
    weeklyMeals: 8,
    pricePerMonth: 4100000, // Tomans
    features: [
      '۸ وعده غذایی در هفته (۴ ناهار + ۴ شام)',
      'امکان شخصی‌سازی کامل منو و تعویض نامحدود غذا',
      'تخفیف ویژه سفارش میان‌وعده و صبحانه',
      'ارسال رایگان روزانه در ظروف گرم و بهداشتی',
      'پشتیبانی VIP و مشاوره تغذیه تلفنی',
      'امکان تعلیق موقت اشتراک در زمان سفر'
    ],
    badge: 'پیشنهاد سرآشپز سیر',
    color: 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-400 ring-2 ring-emerald-500/10'
  },
  {
    id: 'plan_gold',
    name: 'پلن قهرمانی طلایی',
    description: 'بسته تغذیه تمام‌عیار برای کسانی که ورزش و رژیم بخش جدایی‌ناپذیر زندگی‌شان است.',
    weeklyMeals: 14,
    pricePerMonth: 7200000, // Tomans
    features: [
      '۱۴ وعده غذایی در هفته (ناهار و شام برای تمام روزها)',
      'سفارشی‌سازی بر اساس گرم دقیق درشت‌مغذی‌ها',
      'ارسال همزمان یا جداگانه ناهار و شام روزانه در زمان مقرر',
      'یک جلسه مشاوره ماهانه حضوری با متخصص تغذیه ورزشی',
      'دسترسی زودهنگام به آیتم‌های جدید منو',
      'امکان کنسلی روزانه و انتقال هزینه به کیف پول'
    ],
    color: 'border-stone-300 bg-white hover:border-emerald-400'
  }
];

// Initial CRM Support and Feedback Tickets from Athletes
export const MOCK_CRM_TICKETS: CRMTicket[] = [
  {
    id: 't1',
    customerName: 'علیرضا کریمی',
    email: 'alireza@fitness.com',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    subject: 'درخواست افزایش گرم مرغ در پلن طلایی',
    message: 'سلام، من الان پلن طلایی دارم و روزانه دو وعده از شما دریافت می‌کنم. با توجه به دوره حجمم، آیا این امکان وجود دارد که مقدار سینه مرغ در وعده‌های ناهارم ۵۰ گرم افزایش پیدا کنه؟ مابه‌التفاوت هزینه رو پرداخت می‌کنم.',
    date: '۱۴۰۵/۰۴/۱۲',
    status: 'open',
    planName: 'پلن قهرمانی طلایی'
  },
  {
    id: 't2',
    customerName: 'سارا احمدی',
    email: 'sara.ah@gym.ir',
    phone: '۰۹۱۹۸۷۶۵۴۳۲',
    subject: 'تغییر زمان ارسال ناهار',
    message: 'بسته‌های ناهار من معمولاً ساعت ۱۳ می‌رسه ولی کلاس من از فردا ساعت ۱۲:۳۰ شروع میشه. امکانش هست پیک ناهار بنده رو قبل از ساعت ۱۲ تحویل بده؟ ممنون از پلتفرم خوب سیر.',
    date: '۱۴۰۵/۰۴/۱۳',
    status: 'open',
    planName: 'پلن ورزشی نقره‌ای'
  },
  {
    id: 't3',
    customerName: 'محمد رضایی',
    email: 'm.rezaei@yahoo.com',
    phone: '۰۹۳۵۱۱۱۲۲۳۳',
    subject: 'تشکر بابت طعم عالی سالمون تنوری',
    message: 'فقط خواستم تشکر کنم بابت کیفیت فوق‌العاده سالمون تنوری دیشب. واقعاً لذیذ بود و برعکس بقیه مطبخ‌های رژیمی اصلاً بوی زهم نمی‌داد. کارتون درسته!',
    date: '۱۴۰۵/۰۴/۱۱',
    status: 'replied',
    replyText: 'سلام جناب رضایی عزیز، رضایت شما انگیزه اصلی تیم آشپزخانه سیر هست. خوشحالیم که سالمون تنوری مورد پسندتون قرار گرفته. نوش جان!',
    planName: 'پلن ورزشی نقره‌ای'
  },
  {
    id: 't4',
    customerName: 'یاسمن علیزاده',
    email: 'yasi.fit@gmail.com',
    phone: '۰۹۱۲۹۹۹۸۸۷۷',
    subject: 'حساسیت به ادویه کاری',
    message: 'سلام وقت بخیر، من به ادویه کاری حساسیت شدیدی دارم. توی غذاهاتون از کاری استفاده می‌کنید؟ می‌خوام پلن نقره‌ای رو سفارش بدم.',
    date: '۱۴۰۵/۰۴/۱۰',
    status: 'replied',
    replyText: 'سلام سرکار خانم علیزاده، خیر در اکثر غذاها از ادویه‌های مدیترانه‌ای، رزماری و زعفران استفاده می‌شود. با این حال هنگام ثبت سفارش می‌توانید در بخش یادداشت رژیمی حساسیت خود را ثبت کنید تا آشپزخانه غذای شما را کاملاً مجزا آماده کند.',
    planName: 'مشتری جدید'
  }
];

// Financial & Activity Mock Data for CRM/Admin Charts
export const REVENUE_DATA: MonthlyRevenue[] = [
  { month: 'فروردین', revenue: 42000000, ordersCount: 120 },
  { month: 'اردیبهشت', revenue: 58000000, ordersCount: 165 },
  { month: 'خرداد', revenue: 84000000, ordersCount: 210 },
  { month: 'تیر (تاکنون)', revenue: 112000000, ordersCount: 290 }
];

export const PLAN_DISTRIBUTION_DATA: PlanDistribution[] = [
  { name: 'پلن نقره‌ای (محبوب)', value: 52, color: '#10b981' }, // emerald-500
  { name: 'پلن طلایی (قهرمانی)', value: 28, color: '#047857' }, // emerald-700
  { name: 'پلن برنزی (پایه)', value: 20, color: '#a7f3d0' }  // emerald-200
];
