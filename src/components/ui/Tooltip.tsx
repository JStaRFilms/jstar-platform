// src/components/ui/Tooltip.tsx
import React from 'react';

type TooltipProps = {
  isVisible: boolean;
  text: string;
};

const Tooltip: React.FC<TooltipProps> = ({ isVisible, text }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-4 py-2 bg-black/80 text-white text-sm font-medium rounded-lg shadow-lg backdrop-blur-sm animate-fade-in-up flex items-center justify-center text-center">
      {text}
    </div>
  );
};

export default Tooltip;
