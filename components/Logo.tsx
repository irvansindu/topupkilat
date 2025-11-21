'use client';

import Image from 'next/image';
import { Zap } from 'lucide-react';
import { useState } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const sizePixels = {
    sm: 32,
    md: 48,
    lg: 64
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {imageError ? (
        // Fallback to Zap icon if logo image fails to load
        <Zap className={`${sizeClasses[size]} text-blue-600`} />
      ) : (
        <Image
          src="/logo.png"
          alt="TopUpKilat Logo"
          width={sizePixels[size]}
          height={sizePixels[size]}
          className="object-contain"
          onError={() => setImageError(true)}
          priority
        />
      )}
      {showText && (
        <span className={`${textSizeClasses[size]} font-bold`}>TopUpKilat</span>
      )}
    </div>
  );
}
