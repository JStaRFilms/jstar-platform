'use client';

import React, { useState } from 'react';

interface RadialSpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  radius?: number;
}

export const RadialSpotlightCard: React.FC<RadialSpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(181, 230, 25, 0.16)',
  radius = 360,
}) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-3xl bg-card border border-powder-blue/20 p-7 flex flex-col justify-between overflow-hidden shadow-2xl transition-colors hover:border-chartreuse/50 ${className}`}
    >
      {/* Radial Spotlight Overlay */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            background: `radial-gradient(${radius}px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 80%)`,
          }}
        />
      )}

      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};

export default RadialSpotlightCard;
