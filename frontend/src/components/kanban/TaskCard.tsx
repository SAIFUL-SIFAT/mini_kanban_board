'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskPriority } from '../../types';
import { Badge } from '../ui/badge';
import { AvatarInitials } from '../common/AvatarInitials';
import { GripVertical, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
  isOverlay?: boolean;
}

/**
 * Extracts optional priority tag [HIGH], [MED], [LOW] from task title/description if available
 */
function parsePriority(task: Task): TaskPriority | null {
  if (task.priority) return task.priority;
  const content = `${task.title} ${task.description || ''}`.toUpperCase();
  if (content.includes('[HIGH]') || content.includes('URGENT')) return 'HIGH';
  if (content.includes('[MED]') || content.includes('[MEDIUM]')) return 'MEDIUM';
  if (content.includes('[LOW]')) return 'LOW';
  return null;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskClick, isOverlay = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: 'Task', task },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const priority = parsePriority(task);

  const priorityBadgeVariants: Record<TaskPriority, 'danger' | 'secondary' | 'info'> = {
    HIGH: 'danger',
    MEDIUM: 'secondary',
    LOW: 'info',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative border-2 border-[#18181B] bg-white p-3.5 shadow-[3px_3px_0px_0px_#000000] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000000]',
        isDragging && 'opacity-30 border-dashed border-[#18181B] bg-[#FAF6F0] shadow-none',
        isOverlay && 'rotate-2 scale-105 shadow-[6px_6px_0px_0px_#000000] cursor-grabbing border-[#15803D] z-50'
      )}
    >
      {/* Top Card Bar: Drag handle & Priority Badge */}
      <div className="flex items-center justify-between mb-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-zinc-400 hover:text-[#18181B] hover:bg-[#FAF6F0] border border-transparent hover:border-[#18181B] transition-colors"
          title="Drag to reorder or move column"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {priority && (
          <Badge variant={priorityBadgeVariants[priority]}>
            {priority}
          </Badge>
        )}
      </div>

      {/* Task Content */}
      <div
        onClick={() => onTaskClick(task)}
        className="cursor-pointer"
      >
        <h4 className="font-heading font-bold text-sm text-[#18181B] group-hover:text-[#15803D] transition-colors line-clamp-2 mb-1">
          {task.title}
        </h4>

        {task.description && (
          <p className="text-xs text-zinc-600 line-clamp-2 font-medium mb-3">
            {task.description.replace(/\[(HIGH|MED|MEDIUM|LOW)\]/gi, '').trim()}
          </p>
        )}
      </div>

      {/* Card Footer: Assignee & Timestamp */}
      <div className="flex items-center justify-between pt-2 mt-2 border-t border-zinc-200 text-[11px] font-bold text-zinc-500">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-zinc-400" />
          <span>{new Date(task.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </div>

        {task.assignee ? (
          <AvatarInitials
            name={task.assignee.name}
            email={task.assignee.email}
            id={task.assignee.id}
            size="sm"
            shape="circle"
          />
        ) : (
          <AvatarInitials name="Unassigned" size="sm" shape="circle" className="bg-zinc-200 text-zinc-600 border-zinc-400" />
        )}
      </div>
    </div>
  );
};
