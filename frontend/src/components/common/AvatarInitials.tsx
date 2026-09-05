import React from 'react';
import { getAvatarColor, getInitials, cn } from '../../lib/utils';

interface AvatarInitialsProps {
  name?: string | null;
  email?: string | null;
  id?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  shape?: 'square' | 'circle';
}

export const AvatarInitials: React.FC<AvatarInitialsProps> = ({
  name,
  email,
  id,
  size = 'md',
  className,
  shape = 'square',
}) => {
  const initials = getInitials(name, email);
  const color = getAvatarColor(id || email || name);

  const sizeClasses = {
    sm: 'h-7 w-7 text-xs border-2',
    md: 'h-9 w-9 text-sm border-2 shadow-[2px_2px_0px_0px_#000]',
    lg: 'h-12 w-12 text-base border-2 shadow-[3px_3px_0px_0px_#000]',
  };

  const shapeClasses = {
    square: 'rounded-none',
    circle: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center font-heading font-bold border-[#18181B] select-none uppercase tracking-wider',
        sizeClasses[size],
        shapeClasses[shape],
        className
      )}
      style={{ backgroundColor: color.bg, color: color.text }}
      title={name || email || 'User'}
    >
      {initials}
    </div>
  );
};
