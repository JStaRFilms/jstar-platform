'use client';

import React from 'react';

interface KineticBorderCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  active?: boolean;
}

export const KineticBorderCard: React.FC<KineticBorderCardProps> = ({
  children,
  className = '',
  glowColor = '#B5E619',
  active = true,
}) => {
  return (
    <div className={`relative p-[1px] rounded-3xl overflow-hidden group ${className}`}>
      {/* 60fps moving conic gradient border */}
      {active && (
        <div
          className="absolute inset-[-150%] animate-[spin_6s_linear_infinite] pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"
          style={{
            background: `conic-gradient(from 0deg, transparent 0 320deg, ${glowColor} 360deg)`,
          }}
        />
      )}

      {/* Card Body */}
      <div className="relative h-full w-full rounded-[23px] bg-card p-6 sm:p-8 z-10">
        {children}
      </div>
    </div>
  );
};

export default KineticBorderCard;
