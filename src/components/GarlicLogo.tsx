/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface GarlicLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  onClick?: () => void;
}

export default function GarlicLogo({ className = '', size = 36, showText = true, onClick }: GarlicLogoProps) {
  return (
    <div 
      className={`flex items-center gap-2 select-none ${className}`} 
      id="garlic-logo-container"
      onClick={onClick}
    >
      <div 
        className="relative flex items-center justify-center rounded-2xl bg-emerald-100/60 p-2 text-emerald-700 transition-all duration-300 hover:rotate-6 hover:scale-105"
        style={{ width: size + 12, height: size + 12 }}
        id="garlic-logo-icon-bg"
      >
        {/* Minimalist modern garlic bulb representation */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-emerald-700"
        >
          {/* Garlic bulb core */}
          <path d="M12 2v4M12 6c-3.5 0-5.5 2.5-5.5 5.5s1.5 5.5 5.5 6.5c4-1 5.5-3.5 5.5-6.5S15.5 6 12 6z" fill="currentColor" fillOpacity="0.12" />
          {/* Garlic cloves details */}
          <path d="M9 7.5c-1.5 1.5-2 3.5-1.5 5.5M15 7.5c1.5 1.5 2 3.5 1.5 5.5M12 6v11.5" />
          {/* Garlic base root brush */}
          <path d="M10 18.5a2 2 0 0 0 4 0" />
          {/* Small organic sprout/leaf on top symbolizing athletic energy and garlic plant */}
          <path d="M12 2c1 0 2.5 1 2.5 2.5s-1.5 2-2.5 1" strokeWidth="1.2" />
        </svg>

        {/* Small decorative dot */}
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>

      {showText && (
        <div className="flex flex-col text-right leading-none" id="garlic-logo-text">
          <span className="text-xl font-extrabold tracking-tight text-stone-900 font-sans">
            سیر
          </span>
          <span className="text-[10px] font-medium text-emerald-600/90 uppercase tracking-widest font-mono">
            SEER DIET
          </span>
        </div>
      )}
    </div>
  );
}
