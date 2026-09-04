import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full border-2 border-[#18181B] bg-white px-3 py-2 text-sm font-medium text-[#18181B] shadow-[2px_2px_0px_0px_#000] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:shadow-[4px_4px_0px_0px_#000] disabled:cursor-not-allowed disabled:opacity-50 transition-all',
          error && 'border-[#DC2626] focus:ring-[#DC2626]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
