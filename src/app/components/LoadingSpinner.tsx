import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer ring with pulse effect */}
        <div className="absolute inset-0 rounded-full border-4 border-[var(--color-primary-light)] opacity-25 animate-pulse"></div>
        
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-t-[var(--color-primary)] border-r-[var(--color-primary)] border-b-transparent border-l-transparent animate-spin"></div>
        
        {/* Inner dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/4 h-1/4 rounded-full bg-[var(--color-primary)] animate-pulse"></div>
        </div>
      </div>
    </div>
  );
} 