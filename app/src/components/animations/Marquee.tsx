import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  children: ReactNode;
  direction?: 'left' | 'right';
  speed?: 'slow' | 'normal' | 'fast';
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({
  children,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
  className = '',
}: MarqueeProps) {
  const speedClass = {
    slow: '[animation-duration:60s]',
    normal: '[animation-duration:40s]',
    fast: '[animation-duration:20s]',
  };

  const directionClass = direction === 'left' 
    ? 'animate-marquee' 
    : 'animate-marquee-reverse';

  return (
    <div 
      className={cn(
        'overflow-hidden',
        pauseOnHover && 'marquee-container',
        className
      )}
    >
      <div 
        className={cn(
          'flex w-max',
          directionClass,
          speedClass[speed]
        )}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
