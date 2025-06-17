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
        {/* Outer ring with gradient and pulse effect */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-25 animate-pulse"></div>
        
        {/* Spinning gradient ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-spin"></div>
        
        {/* Inner dot with gradient */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/4 h-1/4 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse"></div>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 blur-md animate-pulse"></div>
      </div>
    </div>
  );
} 