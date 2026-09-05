import React from 'react';
import { Button } from '../ui/button';
import { LayoutGrid, Plus, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: 'boards' | 'tasks' | 'general';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = 'general',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-[#18181B] bg-white shadow-[4px_4px_0px_0px_#000]',
        className
      )}
    >
      <div className="mb-4 inline-flex items-center justify-center p-4 bg-[#F5F1E8] border-2 border-[#18181B] shadow-[3px_3px_0px_0px_#000]">
        {icon === 'boards' && <LayoutGrid className="h-8 w-8 text-[#15803D]" />}
        {icon === 'tasks' && <Layers className="h-8 w-8 text-[#D97706]" />}
        {icon === 'general' && <Plus className="h-8 w-8 text-[#18181B]" />}
      </div>

      <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-[#18181B] mb-2">
        {title}
      </h3>
      <p className="text-sm text-zinc-600 max-w-sm mb-6 font-medium">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button onClick={onAction} variant="default">
          <Plus className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
