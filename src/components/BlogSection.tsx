/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Clock, BookOpen, ArrowLeft, Calendar, Tag, AlertCircle } from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../data/blog';

export default function BlogSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const categories = ['همه', 'رژیم‌های غذایی', 'سوپرفودها', 'مکمل و تمرین'];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'همه' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10" id="blog-section-container" dir="rtl">
      <AnimatePresence mode="wait">
        {selectedPost ? (
          <motion.div
            key="post-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl border border-stone-100 p-6 md:p-10 shadow-lg text-right space-y-6"
          >
            {/* Back to Blog Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-50 hover:text-emerald-700 transition cursor-pointer"
            >
              <ArrowLeft size={14} className="rotate-180" />
              <span>بازگشت به لیست مقالات</span>
            </button>

            {/* Post Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center text-xs text-stone-500 font-bold">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-800 flex items-center gap-1">
                  <Tag size={12} />
                  {selectedPost.category}
                </span>
                <span className="flex items-center gap-1 bg-stone-50 px-3 py-1 rounded-full text-stone-600">
                  <Clock size={12} />
                  {selectedPost.readTime}
                </span>
                <span className="flex items-center gap-1 bg-stone-50 px-3 py-1 rounded-full text-stone-600">
                  <Calendar size={12} />
                  {selectedPost.date}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-stone-900 leading-tight">
                {selectedPost.title}
              </h1>

              {/* Author Widget */}
              <div className="flex items-center gap-3 border-t border-b border-stone-50 py-3 mt-4">
                <div className="h-10 w-10 rounded-full bg-emerald-100/80 text-emerald-800 font-bold flex items-center justify-center text-base shadow-inner">
                  {selectedPost.author.name.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-900 block">{selectedPost.author.name}</span>
                  <span className="text-[10px] text-stone-400 font-bold">{selectedPost.author.role}</span>
                </div>
              </div>
            </div>

            {/* Giant Premium Image Banner with elegant 3D style */}
            <div className="h-56 md:h-96 rounded-3xl overflow-hidden relative border border-stone-200/50 shadow-md">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>

            {/* Post Content */}
            <article className="prose max-w-none text-stone-700 leading-relaxed text-sm space-y-6">
              <p className="font-extrabold text-stone-900 text-base border-r-4 border-emerald-500 pr-3 py-1">
                {selectedPost.excerpt}
              </p>
              <p className="whitespace-pre-line text-stone-600 leading-8">
                {selectedPost.content}
              </p>
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100 text-xs text-stone-500 space-y-2 mt-8">
                <div className="flex items-center gap-1.5 font-bold text-stone-700">
                  <AlertCircle size={14} className="text-emerald-600" />
                  <span>نکته طلایی سیر:</span>
                </div>
                <p className="leading-relaxed">
                  در تغذیه ورزشی، نظم در دریافت زمان‌بندی‌شده مواد مغذی به اندازه کیفیت آنها اهمیت دارد. مشترکین پلتفرم تخصصی «سیر» می‌توانند با هماهنگی کارشناسان تغذیه ما، منوی اشتراکی خود را به گونه‌ای شخصی‌سازی کنند تا منطبق با توصیه‌های این مقاله باشد.
                </p>
              </div>
            </article>
          </motion.div>
        ) : (
          <motion.div
            key="blog-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Header and filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white rounded-3xl border border-stone-100 p-6 shadow-xs">
              <div className="space-y-1 text-right">
                <span className="text-xs font-bold text-emerald-600 uppercase">وبلاگ سیر سلامت</span>
                <h2 className="text-xl font-extrabold text-stone-900">دانشنامه و مقالات علمی تغذیه ورزشی</h2>
                <p className="text-xs text-stone-500">آخرین یافته‌های علمی پزشکان و مربیان تغذیه سیر برای افزایش کارایی و ریکاوری بدن شما.</p>
              </div>

              {/* Search bar */}
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="جستجوی مقالات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 py-3 pr-10 pl-4 text-xs focus:border-emerald-500 focus:bg-white focus:outline-hidden text-right"
                />
                <Search size={16} className="absolute top-3.5 right-3.5 text-stone-400" />
              </div>
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap gap-2 justify-start">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    selectedCategory === cat 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Posts Grid with 3D Card Hover Effects */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="group bg-white rounded-3xl border border-stone-150 overflow-hidden flex flex-col justify-between cursor-pointer shadow-xs hover:shadow-md hover:border-emerald-500/30 transition-all duration-300"
                    id={`blog-card-${post.id}`}
                  >
                    {/* Card Thumbnail Area with Premium Food Image */}
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-1 text-[9px] font-bold text-stone-700 shadow-sm border border-stone-100">
                        {post.category}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 text-right flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-stone-400 font-bold">
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {post.readTime}
                          </span>
                          <span>{post.date}</span>
                        </div>
                        <h3 className="text-sm font-black text-stone-900 group-hover:text-emerald-700 transition leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-xs text-stone-500 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Card Footer Author */}
                      <div className="border-t border-stone-50 pt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold flex items-center justify-center">
                            {post.author.name.charAt(0)}
                          </div>
                          <span className="text-[10px] font-bold text-stone-600">{post.author.name}</span>
                        </div>
                        <span className="text-[10px] font-extrabold text-emerald-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                          مطالعه مقاله ←
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-stone-100 flex flex-col items-center justify-center space-y-3">
                  <Search size={32} className="text-stone-300" />
                  <p className="text-sm font-bold text-stone-500">هیچ مقاله‌ای با این مشخصات یافت نشد.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
