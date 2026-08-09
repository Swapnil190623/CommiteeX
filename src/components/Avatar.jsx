import React from 'react';

const colorMap = {
  ink: 'bg-ink-200 text-ink-700',
  royal: 'bg-royal-100 text-royal-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  rose: 'bg-rose-100 text-rose-700',
  cyan: 'bg-cyan-100 text-cyan-700',
};

const sizeMap = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
};

export function Avatar({ name = '', color = 'ink', size = 'md', className = '' }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'CH';

  return (
    <div
      className={`${sizeMap[size] || sizeMap.md} ${colorMap[color] || colorMap.ink} rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${className}`}
    >
      {initials}
    </div>
  );
}

export default Avatar;
