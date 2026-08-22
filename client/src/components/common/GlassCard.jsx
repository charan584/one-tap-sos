import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const GlassCard = ({ children, className = '', hover = false, glowing = false, ...props }) => {
  return (
    <div
      className={twMerge(
        'relative rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl p-5 text-slate-100 shadow-xl transition-all duration-300',
        hover && 'hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-2xl hover:-translate-y-0.5',
        glowing && 'border-red-500/40 shadow-red-500/10 shadow-2xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
