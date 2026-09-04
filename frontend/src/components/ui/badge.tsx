import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center border-2 border-[#18181B] px-2.5 py-0.5 text-xs font-bold font-heading uppercase tracking-wider transition-colors shadow-[2px_2px_0px_0px_#000000]',
  {
    variants: {
      variant: {
        default: 'bg-[#15803D] text-white',
        secondary: 'bg-[#D97706] text-white',
        outline: 'bg-white text-[#18181B]',
        danger: 'bg-[#DC2626] text-white',
        info: 'bg-[#2563EB] text-white',
        neutral: 'bg-[#F5F1E8] text-[#18181B]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
